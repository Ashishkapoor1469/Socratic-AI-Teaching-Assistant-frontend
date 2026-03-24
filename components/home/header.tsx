"use client"

import { ChartNoAxesColumn } from "lucide-react"

export default function Header({ onToggleSidebar }) {
  return (
    <header id="top" className="h-14 fixed top-0 w-full z-40 backdrop-blur-2xl  border-b">
      <div className="flex justify-between items-center px-4 h-full">
        
        <button onClick={onToggleSidebar}>
          <ChartNoAxesColumn className="rotate-90" />
        </button>

        <h1 className="font-bold">Digital Socratic</h1>

        <div className="h-10 w-10 rounded-full bg-amber-700" />
      </div>
    </header>
  )
}