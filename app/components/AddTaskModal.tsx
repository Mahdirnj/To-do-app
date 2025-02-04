"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import type React from "react"
import { translations, type Language } from "../lib/translations"

interface Category {
  id: string
  name: string
  color: string
}

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAddTask: (task: any) => void
  categories: Category[]
  language: Language
}

export default function AddTaskModal({ isOpen, onClose, onAddTask, categories, language }: AddTaskModalProps) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
    }
  }, [isOpen])

  const handleAnimationComplete = () => {
    if (!isOpen) {
      setShouldRender(false)
    }
  }

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "",
    dueDate: new Date().toISOString().split("T")[0],
    completed: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim()) return

    onAddTask(newTask)
    setNewTask({
      title: "",
      description: "",
      category: "",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
    })
    onClose()
  }

  if (!shouldRender) return null

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
              }}
              onAnimationComplete={handleAnimationComplete}
              className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            >
              <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
              <h2 className="mb-4 text-2xl font-bold text-[#3A6D8C]">{translations[language].addTask}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder={translations[language].taskTitle}
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full rounded-md border-2 border-[#3A6D8C] p-2 text-gray-900 focus:border-[#2C5269] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder={translations[language].description}
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full rounded-md border-2 border-[#3A6D8C] p-2 text-gray-900 focus:border-[#2C5269] focus:outline-none"
                  />
                </div>
                <div className="flex gap-4">
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="flex-1 rounded-md border-2 border-[#3A6D8C] p-2 text-gray-900 focus:border-[#2C5269] focus:outline-none"
                  >
                    <option value="">{translations[language].selectCategory}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="flex-1 rounded-md border-2 border-[#3A6D8C] p-2 text-gray-900 focus:border-[#2C5269] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-[#3A6D8C] p-2 text-white transition-colors hover:bg-[#2C5269]"
                >
                  {translations[language].addTask}
                </button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

