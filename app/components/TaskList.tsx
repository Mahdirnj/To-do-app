import type { Language } from "../lib/translations"
import type { Task } from "../hooks/useTasks"
import TaskItem from "./TaskItem"
import { PRESET_COLORS } from "./CategoryManager"

interface Category {
  id: string
  name: string
  color: keyof typeof PRESET_COLORS
}

interface TaskListProps {
  tasks: Task[]
  categories: Category[]
  onEditTask: (id: string, updatedTask: Partial<Task>) => void
  onDeleteTask: (id: string) => void
  language: Language
}

export default function TaskList({ tasks, categories, onEditTask, onDeleteTask, language }: TaskListProps) {
  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          categories={categories}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          language={language}
        />
      ))}
    </ul>
  )
}

