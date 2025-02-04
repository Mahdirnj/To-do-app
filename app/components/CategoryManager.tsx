"use client"

import { useState, type React } from "react"
import { Plus, Edit2, Trash2, Check, X } from "lucide-react"
import { translations, type Language } from "../lib/translations"

export const PRESET_COLORS = {
  red: "#FF6B6B",
  green: "#4ECB71",
  blue: "#4A9FFF",
  purple: "#9B6DFF",
  orange: "#FFB84D",
  teal: "#4FD1C5",
}

interface Category {
  id: string
  name: string
  color: keyof typeof PRESET_COLORS
}

interface CategoryManagerProps {
  categories: Category[]
  onAddCategory: (category: Omit<Category, "id">) => void
  selectedCategory: string | null
  onSelectCategory: (categoryId: string | null) => void
  onUpdateCategory?: (id: string, updates: Partial<Category>) => void
  onDeleteCategory?: (id: string) => void
  language: Language
}

export default function CategoryManager({
  categories = [],
  onAddCategory,
  selectedCategory,
  onSelectCategory,
  onUpdateCategory,
  onDeleteCategory,
  language,
}: CategoryManagerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [selectedColor, setSelectedColor] = useState<keyof typeof PRESET_COLORS>("red")
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingColor, setEditingColor] = useState<keyof typeof PRESET_COLORS>("red")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newCategoryName.trim()) {
      onAddCategory({
        name: newCategoryName.trim(),
        color: selectedColor,
      })
      setNewCategoryName("")
      setIsAdding(false)
    }
  }

  const handleEditSubmit = (id: string) => {
    if (onUpdateCategory) {
      onUpdateCategory(id, { color: editingColor })
    }
    setEditingCategory(null)
  }

  const startEditing = (category: Category) => {
    setEditingCategory(category.id)
    setEditingColor(category.color)
  }

  return (
    <div className="space-y-4 rounded-lg bg-white p-4 shadow-md dark:bg-dark-card">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#3A6D8C] dark:text-dark-text">
          {translations[language].categories}
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full p-1 text-[#3A6D8C] hover:bg-gray-100 dark:text-dark-text dark:hover:bg-gray-700"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder={translations[language].categoryName}
            className="w-full rounded-md border-2 border-[#3A6D8C] p-2 text-gray-900 focus:border-[#2C5269] focus:outline-none dark:border-gray-600 dark:bg-dark-bg dark:text-dark-text"
          />
          <div className="flex flex-wrap gap-2">
            {(Object.keys(PRESET_COLORS) as Array<keyof typeof PRESET_COLORS>).map((colorName) => (
              <button
                key={colorName}
                type="button"
                onClick={() => setSelectedColor(colorName)}
                className={`h-6 w-6 rounded-full ${
                  selectedColor === colorName ? "ring-2 ring-offset-2 ring-[#3A6D8C]" : ""
                }`}
                style={{ backgroundColor: PRESET_COLORS[colorName] }}
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-[#3A6D8C] p-2 text-white transition-colors hover:bg-[#2C5269]"
          >
            {translations[language].addCategory}
          </button>
        </form>
      )}

      <div className="space-y-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full rounded-lg p-2 text-left transition-colors ${
            selectedCategory === null
              ? "bg-[#2C5269] text-white"
              : "text-gray-700 hover:bg-gray-100 dark:text-dark-text dark:hover:bg-gray-700"
          }`}
        >
          {translations[language].allCategories}
        </button>
        {categories.map((category) => (
          <div key={category.id} className="group relative flex items-center">
            <button
              onClick={() => onSelectCategory(category.id)}
              className={`flex w-full items-center gap-2 rounded-lg p-2 text-left transition-colors ${
                selectedCategory === category.id
                  ? "bg-[#2C5269] text-white"
                  : "text-gray-700 hover:bg-gray-100 dark:text-dark-text dark:hover:bg-gray-700"
              }`}
            >
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: PRESET_COLORS[category.color] }} />
              <span>{category.name}</span>
            </button>
            {editingCategory === category.id ? (
              <div className="absolute right-2 flex items-center gap-2">
                <div className="flex gap-1">
                  {(Object.keys(PRESET_COLORS) as Array<keyof typeof PRESET_COLORS>).map((colorName) => (
                    <button
                      key={colorName}
                      type="button"
                      onClick={() => setEditingColor(colorName)}
                      className={`h-4 w-4 rounded-full ${
                        editingColor === colorName ? "ring-2 ring-offset-1 ring-[#3A6D8C]" : ""
                      }`}
                      style={{ backgroundColor: PRESET_COLORS[colorName] }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => handleEditSubmit(category.id)}
                  className="rounded p-1 text-green-600 hover:bg-green-50"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button onClick={() => setEditingCategory(null)} className="rounded p-1 text-red-600 hover:bg-red-50">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="absolute right-2 hidden gap-1 group-hover:flex">
                <button onClick={() => startEditing(category)} className="rounded p-1 text-[#3A6D8C] hover:bg-gray-100">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteCategory?.(category.id)}
                  className="rounded p-1 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

