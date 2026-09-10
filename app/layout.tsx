import "./globals.css"
import type { ReactNode } from "react"

export const metadata = {
  title: "Todo App",
  description: "A simple todo app built with Next.js",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}

