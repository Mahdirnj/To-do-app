import "./globals.css"
import { Inter, Vazirmatn } from "next/font/google"
import type React from "react" // Import React

const inter = Inter({ subsets: ["latin"] })
const vazirmatn = Vazirmatn({ subsets: ["arabic"] })

export const metadata = {
  title: "Todo App",
  description: "A simple todo app built with Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${vazirmatn.variable}`}>{children}</body>
    </html>
  )
}

