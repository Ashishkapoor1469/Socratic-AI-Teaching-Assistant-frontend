"use client"

import { ChartNoAxesColumn } from "lucide-react"

import Link from "next/link"
import Image from "next/image"

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <header id="top" className="h-14 z-50 fixed top-0 w-full z-40 backdrop-blur-2xl border-b border-white/10 bg-[#171717]/80 text-white">
      <div className="flex justify-between items-center px-4 h-full">
        
        <button onClick={onToggleSidebar} className="text-neutral-400 hover:text-white transition-colors">
          <ChartNoAxesColumn className="rotate-90" />
        </button>

        <h1 className="font-bold tracking-tight">Digital Socratic</h1>

        <Link 
          href="/profile" 
          className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#212121] transition-transform hover:scale-105 active:scale-95"
        >
          <Image 
            src="/assets/logo-without.webp" 
            alt="Profile" 
            fill 
            className="object-cover p-1" 
          />
        </Link>
      </div>
    </header>
  )
}