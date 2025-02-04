"use client"

import { Search } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#3A6D8C] dark:text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full rounded-lg border-2 border-[#3A6D8C] bg-white pl-10 pr-4 py-2 text-gray-900 focus:border-[#2C5269] focus:outline-none dark:border-gray-600 dark:bg-dark-bg dark:text-dark-text"
        />
      </div>
    </div>
  )
}

