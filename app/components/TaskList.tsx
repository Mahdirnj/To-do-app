import type { Task } from "../hooks/useTasks"
import TaskItem from "./TaskItem"

interface TaskListProps {
  tasks: Task[]
  onEditTask: (id: string, updatedTask: Partial<Task>) => void
  onDeleteTask: (id: string) => void
}

export default function TaskList({ tasks, onEditTask, onDeleteTask }: TaskListProps) {
  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onEditTask={onEditTask} onDeleteTask={onDeleteTask} />
      ))}
    </ul>
  )
}

