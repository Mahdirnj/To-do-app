import { useState } from "react"
import type { Task } from "../hooks/useTasks"

interface AddTaskProps {
  onAddTask: (task: Omit<Task, "id">) => void
  categories: string[]
}

export default function AddTask({ onAddTask, categories }: AddTaskProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [dueDate, setDueDate] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAddTask({ title, description, category, completed: false, dueDate })
    setTitle("")
    setDescription("")
    setCategory("")
    setDueDate("")
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-white shadow rounded-lg">
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2 p-2 border border-gray-300 rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mb-2 p-2 border border-gray-300 rounded"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full mb-2 p-2 border border-gray-300 rounded"
      >
        <option value="">Select category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full mb-2 p-2 border border-gray-300 rounded"
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Add Task
      </button>
    </form>
  )
}

