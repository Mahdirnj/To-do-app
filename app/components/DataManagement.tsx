import { useState, type React } from "react"
import { getAllTasks, getAllCategories, addTask, addCategory } from "../lib/db"

export default function DataManagement() {
  const [importStatus, setImportStatus] = useState("")

  const exportData = async () => {
    const tasks = await getAllTasks()
    const categories = await getAllCategories()
    const data = JSON.stringify({ tasks, categories })
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "todo-app-data.json"
    a.click()
  }

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          for (const task of data.tasks) {
            await addTask(task)
          }
          for (const category of data.categories) {
            await addCategory(category)
          }
          setImportStatus("Data imported successfully")
        } catch (error) {
          setImportStatus("Error importing data")
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-4">
      <button
        onClick={exportData}
        className="rounded-md bg-[#3A6D8C] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2C5269] focus:outline-none focus:ring-2 focus:ring-[#3A6D8C] focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        Export Data
      </button>
      <label className="cursor-pointer rounded-md bg-[#3A6D8C] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2C5269] focus:outline-none focus:ring-2 focus:ring-[#3A6D8C] focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700">
        <span>Import Data</span>
        <input type="file" accept=".json" onChange={importData} className="hidden" />
      </label>
      {importStatus && <p className="text-sm text-gray-600 dark:text-gray-400">{importStatus}</p>}
    </div>
  )
}

