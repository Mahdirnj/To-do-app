import { useState } from "react"

interface CategoryListProps {
  categories: string[]
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
  onAddCategory: (category: string) => void
}

export default function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
}: CategoryListProps) {
  const [newCategory, setNewCategory] = useState("")

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim())
      setNewCategory("")
    }
  }

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Categories</h2>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full text-left p-2 rounded ${
              selectedCategory === null ? "bg-blue-500 text-white" : "hover:bg-gray-100"
            }`}
          >
            All
          </button>
        </li>
        {categories.map((category) => (
          <li key={category}>
            <button
              onClick={() => onSelectCategory(category)}
              className={`w-full text-left p-2 rounded ${
                selectedCategory === category ? "bg-blue-500 text-white" : "hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddCategory} className="mt-4">
        <input
          type="text"
          placeholder="New category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="w-full mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600">
          Add Category
        </button>
      </form>
    </div>
  )
}

