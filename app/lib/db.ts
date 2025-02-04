import { openDB } from "idb"

const DB_NAME = "todo-app-db"
const DB_VERSION = 1

export async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("tasks")) {
        db.createObjectStore("tasks", { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains("categories")) {
        db.createObjectStore("categories", { keyPath: "id" })
      }
    },
  })
  return db
}

export async function getAllTasks() {
  try {
    const db = await initDB()
    const tasks = await db.getAll("tasks")
    return tasks || []
  } catch (error) {
    console.error("Error getting tasks:", error)
    return []
  }
}

export async function addTask(task: any) {
  try {
    const db = await initDB()
    const id = Date.now().toString()
    const newTask = { ...task, id }
    await db.add("tasks", newTask)
    return newTask
  } catch (error) {
    console.error("Error adding task:", error)
    throw error
  }
}

export async function updateTask(id: string, updates: any) {
  try {
    const db = await initDB()
    const task = await db.get("tasks", id)
    if (!task) {
      throw new Error("Task not found")
    }
    const updatedTask = { ...task, ...updates }
    await db.put("tasks", updatedTask)
    return updatedTask
  } catch (error) {
    console.error("Error updating task:", error)
    throw error
  }
}

export async function deleteTask(id: string) {
  try {
    const db = await initDB()
    await db.delete("tasks", id)
  } catch (error) {
    console.error("Error deleting task:", error)
    throw error
  }
}

export async function getAllCategories() {
  try {
    const db = await initDB()
    const categories = await db.getAll("categories")
    return categories || []
  } catch (error) {
    console.error("Error getting categories:", error)
    return []
  }
}

export async function addCategory(category: { name: string; color: string }) {
  try {
    const db = await initDB()
    const id = Date.now().toString()
    const newCategory = { ...category, id }
    await db.add("categories", newCategory)
    return newCategory
  } catch (error) {
    console.error("Error adding category:", error)
    throw error
  }
}

export async function updateCategory(id: string, updates: any) {
  const db = await initDB()
  return db.put("categories", updates)
}

export async function deleteCategory(id: string) {
  const db = await initDB()
  return db.delete("categories", id)
}

