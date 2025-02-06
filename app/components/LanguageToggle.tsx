"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Globe } from "lucide-react"

interface LanguageToggleProps {
  onToggle: (lang: "en" | "fa") => void
}

export default function LanguageToggle({ onToggle }: LanguageToggleProps) {
  const [isEnglish, setIsEnglish] = useState(true)

  const toggleLanguage = () => {
    const newIsEnglish = !isEnglish
    setIsEnglish(newIsEnglish)
    onToggle(newIsEnglish ? "en" : "fa")
  }

  return (
    <motion.button
      onClick={toggleLanguage}
      className="rounded-full p-2 text-[#3A6D8C] hover:bg-[#EAD8B1] dark:text-[#EAD8B1] dark:hover:bg-[#2C5269]"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div initial={false} animate={{ rotate: isEnglish ? 0 : 180 }} transition={{ duration: 0.3 }}>
        <Globe className="h-6 w-6" />
      </motion.div>
    </motion.button>
  )
}

