import { useState, useEffect } from "react"

export interface Task {
  id: string
  title: string
  description: string
  category: string
  completed: boolean
  dueDate: string
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === "undefined") {
      return []
    }

    try {
      const storedTasks = localStorage.getItem("tasks")
      return storedTasks ? (JSON.parse(storedTasks) as Task[]) : []
    } catch {
      return []
    }
  })
  const [categories, setCategories] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return []
    }

    try {
      const storedCategories = localStorage.getItem("categories")
      return storedCategories ? (JSON.parse(storedCategories) as string[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
    localStorage.setItem("categories", JSON.stringify(categories))
  }, [tasks, categories])

  const addTask = (task: Omit<Task, "id">) => {
    const newTask = { ...task, id: Date.now().toString() }
    setTasks([...tasks, newTask])
  }

  const editTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category])
    }
  }

  return { tasks, categories, addTask, editTask, deleteTask, addCategory }
}

