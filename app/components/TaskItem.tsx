"use client"

import { useState } from "react"
import { format, isValid, parseISO, differenceInDays } from "date-fns"
import { motion } from "framer-motion"
import { Calendar, CheckCircle2, Edit2, Trash2 } from "lucide-react"
import { PRESET_COLORS } from "./CategoryManager"
import { translations, type Language } from "../lib/translations"

interface Category {
  id: string
  name: string
  color: keyof typeof PRESET_COLORS
}

interface TaskItemProps {
  task: {
    id: string
    title: string
    description: string
    category: string
    dueDate: string
    completed: boolean
  }
  categories: Category[]
  onEditTask: (id: string, updates: any) => void
  onDeleteTask: (id: string) => void
  language: Language
}

export default function TaskItem({ task, categories, onEditTask, onDeleteTask, language }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)

  const category = categories.find((c) => c.id === task.category)

  const getDaysRemaining = (dateStr: string) => {
    if (!dateStr) return null
    const date = parseISO(dateStr)
    if (!isValid(date)) return null
    return differenceInDays(date, new Date())
  }

  const daysRemaining = getDaysRemaining(task.dueDate)

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    const date = parseISO(dateStr)
    if (!isValid(date)) return ""
    return format(date, "MMM dd, yyyy")
  }

  const handleSave = () => {
    onEditTask(task.id, editedTask)
    setIsEditing(false)
  }

  const taskVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  }

  return (
    <motion.div
      layout
      layoutId={task.id}
      variants={taskVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ type: "spring", stiffness: 500, damping: 30, mass: 1 }}
      className="group relative rounded-lg bg-white p-4 shadow-lg transition-all hover:shadow-xl dark:bg-dark-card"
    >
      {isEditing ? (
        <div className="animate-fadeIn space-y-4">
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            className="w-full rounded-md border-2 border-[#3A6D8C] p-2 text-gray-900 focus:border-[#2C5269] focus:outline-none dark:border-gray-600 dark:bg-dark-bg dark:text-dark-text"
          />
          <textarea
            value={editedTask.description}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            className="w-full rounded-md border-2 border-[#3A6D8C] p-2 text-gray-900 focus:border-[#2C5269] focus:outline-none dark:border-gray-600 dark:bg-dark-bg dark:text-dark-text"
          />
          <div className="flex gap-4">
            <select
              value={editedTask.category}
              onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
              className="flex-1 rounded-md border-2 border-[#3A6D8C] p-2 text-gray-900 focus:border-[#2C5269] focus:outline-none dark:border-gray-600 dark:bg-dark-bg dark:text-dark-text"
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
              value={editedTask.dueDate}
              onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
              className="flex-1 rounded-md border-2 border-[#3A6D8C] p-2 text-gray-900 focus:border-[#2C5269] focus:outline-none dark:border-gray-600 dark:bg-dark-bg dark:text-dark-text"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              {translations[language].cancel}
            </button>
            <button
              onClick={handleSave}
              className="rounded-md bg-[#3A6D8C] px-4 py-2 text-white transition-colors hover:bg-[#2C5269]"
            >
              {translations[language].save}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <button
                onClick={() => onEditTask(task.id, { ...task, completed: !task.completed })}
                className="mt-1 transition-transform hover:scale-110"
              >
                <CheckCircle2
                  className={`h-6 w-6 ${
                    task.completed ? "fill-[#3A6D8C] text-white" : "text-gray-400 dark:text-gray-400"
                  }`}
                />
              </button>
              <div className="space-y-2">
                <h3
                  className={`text-lg font-medium ${
                    task.completed
                      ? "text-gray-400 line-through dark:text-gray-400"
                      : "text-gray-900 dark:text-dark-text"
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
                  {task.dueDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(task.dueDate)}
                      {daysRemaining !== null && daysRemaining > 0 && (
                        <span className="ml-1 rounded-full bg-[#EAD8B1] px-2 py-1 text-[#3A6D8C] dark:bg-gray-700 dark:text-dark-text">
                          {daysRemaining} {translations[language].daysLeft}
                        </span>
                      )}
                    </span>
                  )}
                  {category && (
                    <span className="flex items-center gap-1">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: PRESET_COLORS[category.color] }}
                      />
                      <span>{category.name}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-[#3A6D8C] dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-dark-text"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}

