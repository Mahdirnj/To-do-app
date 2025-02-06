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
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks")
    const storedCategories = localStorage.getItem("categories")
    if (storedTasks) setTasks(JSON.parse(storedTasks))
    if (storedCategories) setCategories(JSON.parse(storedCategories))
  }, [])

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

