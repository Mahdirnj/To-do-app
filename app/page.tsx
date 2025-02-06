"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import TaskItem from "./components/TaskItem"
import AddTaskModal from "./components/AddTaskModal"
import CategoryManager from "./components/CategoryManager"
import SearchBar from "./components/SearchBar"
import ThemeToggle from "./components/ThemeToggle"
import LanguageToggle from "./components/LanguageToggle"
import DataManagement from "./components/DataManagement"
import { translations, type Language } from "./lib/translations"
import {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "./lib/db"
import type { PRESET_COLORS } from "./components/CategoryManager"
import { parseISO, isValid, differenceInDays } from "date-fns"

interface Task {
  id: string
  title: string
  description: string
  category: string
  dueDate: string
  completed: boolean
}

interface Category {
  id: string
  name: string
  color: keyof typeof PRESET_COLORS
}

type SortOption = "none" | "daysAsc" | "daysDesc" | "alphaAsc" | "alphaDesc"

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [filter, setFilter] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("none")
  const [language, setLanguage] = useState<Language>("en")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [tasksData, categoriesData] = await Promise.all([getAllTasks(), getAllCategories()])
        setTasks(tasksData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    let filtered = [...tasks]

    // Filter by status
    if (filter === "active") filtered = filtered.filter((task) => !task.completed)
    if (filter === "completed") filtered = filtered.filter((task) => task.completed)

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((task) => task.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((task) => task.title.toLowerCase().includes(query))
    }

    // Apply sorting
    switch (sortOption) {
      case "daysAsc":
        filtered.sort((a, b) => {
          const daysA = getDaysRemaining(a.dueDate)
          const daysB = getDaysRemaining(b.dueDate)
          return (
            (daysA === null ? Number.POSITIVE_INFINITY : daysA) - (daysB === null ? Number.POSITIVE_INFINITY : daysB)
          )
        })
        break
      case "daysDesc":
        filtered.sort((a, b) => {
          const daysA = getDaysRemaining(a.dueDate)
          const daysB = getDaysRemaining(b.dueDate)
          return (
            (daysB === null ? Number.POSITIVE_INFINITY : daysB) - (daysA === null ? Number.POSITIVE_INFINITY : daysA)
          )
        })
        break
      case "alphaAsc":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "alphaDesc":
        filtered.sort((a, b) => b.title.localeCompare(a.title))
        break
    }

    setFilteredTasks(filtered)
  }, [tasks, filter, selectedCategory, searchQuery, sortOption])

  const getDaysRemaining = (dateStr: string) => {
    if (!dateStr) return null
    const date = parseISO(dateStr)
    if (!isValid(date)) return null
    return differenceInDays(date, new Date())
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleAddTask = async (newTask: Omit<Task, "id">) => {
    try {
      const addedTask = await addTask(newTask)
      setTasks((prevTasks) => [...prevTasks, addedTask])
    } catch (error) {
      console.error("Error adding task:", error)
    }
  }

  const handleAddCategory = async (newCategory: Omit<Category, "id">) => {
    try {
      const addedCategory = await addCategory(newCategory)
      setCategories((prevCategories) => [...prevCategories, addedCategory])
    } catch (error) {
      console.error("Error adding category:", error)
    }
  }

  const handleEditTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await updateTask(id, updates)
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? updatedTask : task)))
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id)
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const handleUpdateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const category = categories.find((c) => c.id === id)
      if (!category) return

      const updatedCategory = { ...category, ...updates }
      await updateCategory(id, updatedCategory)
      setCategories((prevCategories) => prevCategories.map((cat) => (cat.id === id ? updatedCategory : cat)))
    } catch (error) {
      console.error("Error updating category:", error)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id)
      setCategories((prevCategories) => prevCategories.filter((cat) => cat.id !== id))
      if (selectedCategory === id) {
        setSelectedCategory(null)
      }
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  const handleLanguageToggle = (lang: Language) => {
    setLanguage(lang)
  }

  const displayedTasks = searchQuery.trim() || selectedCategory || filter !== "all" ? filteredTasks : tasks

  return (
    <div
      className={`min-h-screen bg-[#EAD8B1] transition-colors dark:bg-dark-bg ${language === "fa" ? "font-persian" : ""}`}
    >
      <main className="container mx-auto p-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-[#3A6D8C] dark:text-dark-text">{translations[language].tasks}</h1>
          <div className="flex items-center gap-4">
            <LanguageToggle onToggle={handleLanguageToggle} />
            <ThemeToggle />
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-full bg-[#3A6D8C] p-3 text-white shadow-lg transition-transform hover:scale-110 hover:bg-[#2C5269] dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} placeholder={translations[language].searchTasks} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            {isLoading ? (
              <div>Loading categories...</div>
            ) : (
              <CategoryManager
                categories={categories}
                onAddCategory={handleAddCategory}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
                language={language}
              />
            )}
          </div>

          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border-2 border-[#3A6D8C] bg-white p-2 text-[#3A6D8C] focus:border-[#2C5269] focus:outline-none dark:border-gray-600 dark:bg-dark-bg dark:text-dark-text"
              >
                <option value="all">{translations[language].allTasks}</option>
                <option value="active">{translations[language].activeTasks}</option>
                <option value="completed">{translations[language].completedTasks}</option>
              </select>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="rounded-lg border-2 border-[#3A6D8C] bg-white p-2 text-[#3A6D8C] focus:border-[#2C5269] focus:outline-none dark:border-gray-600 dark:bg-dark-bg dark:text-dark-text"
              >
                <option value="none">{translations[language].sortBy}</option>
                <option value="daysAsc">{translations[language].daysLeftAsc}</option>
                <option value="daysDesc">{translations[language].daysLeftDesc}</option>
                <option value="alphaAsc">{translations[language].alphaAsc}</option>
                <option value="alphaDesc">{translations[language].alphaDesc}</option>
              </select>
            </div>

            <motion.div layout className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {displayedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    categories={categories}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                    language={language}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
          <h2 className="mb-4 text-2xl font-bold text-[#3A6D8C] dark:text-dark-text">
            {translations[language].dataManagement || "Data Management"}
          </h2>
          <DataManagement />
        </div>
      </main>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTask={handleAddTask}
        categories={categories}
        language={language}
      />
    </div>
  )
}

