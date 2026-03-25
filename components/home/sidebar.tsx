"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  Plus,
  Trash2,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Settings,
  Pencil,
  Check,
  X
} from "lucide-react"
import { useUserStore } from "@/store/userStore"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { renameChat } from "@/lib/api"

interface Chat {
  id: string
  title?: string
  createdAt?: string
}

interface SidebarProps {
  chats: Chat[]
  activeChatId: string | null
  onSelectChat: (id: string) => void
  onNewChat: () => void
  onDeleteChat: (id: string) => void
  isCreating?: boolean
}

export default function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isCreating,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [isRenaming, setIsRenaming] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  
  const { user, logout } = useUserStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const groupChats = () => {
    const now = new Date()
    const today: Chat[] = []
    const yesterday: Chat[] = []
    const older: Chat[] = []

    chats.forEach((chat) => {
      if (!chat.createdAt) {
        today.push(chat)
        return
      }
      const d = new Date(chat.createdAt)
      const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)
      if (diffDays < 1) today.push(chat)
      else if (diffDays < 2) yesterday.push(chat)
      else older.push(chat)
    })

    return { today, yesterday, older }
  }

  const groups = groupChats()

  const handleRename = async (e: React.MouseEvent, chatId: string, currentTitle: string) => {
    e.stopPropagation()
    setEditingChatId(chatId)
    setEditTitle(currentTitle || "New Chat")
  }

  const submitRename = async (e: React.MouseEvent | React.FormEvent, chatId: string) => {
    e.stopPropagation()
    if (e.type === "submit") e.preventDefault()
    
    if (!editTitle.trim()) {
      setEditingChatId(null)
      return
    }

    setIsRenaming(true)
    try {
      await renameChat(chatId, editTitle)
      // Optimistically update the local chat list or trigger a refresh
      router.refresh()
    } catch (error) {
      console.error("Failed to rename chat:", error)
    } finally {
      setIsRenaming(false)
      setEditingChatId(null)
    }
  }

  const cancelRename = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingChatId(null)
  }

  const ChatItem = ({ chat }: { chat: Chat }) => {
    const isEditing = editingChatId === chat.id

    return (
      <div
        className="group relative"
        onMouseEnter={() => setHoveredId(chat.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <button
          onClick={() => !isEditing && onSelectChat(chat.id)}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
            activeChatId === chat.id
              ? "bg-white/10 text-white"
              : "text-neutral-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5 shrink-0" />
          {!collapsed && (
            isEditing ? (
              <form 
                onSubmit={(e) => submitRename(e, chat.id)} 
                className="flex-1 flex items-center pr-12"
              >
                <input
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  disabled={isRenaming}
                  className="w-full bg-[#171717] border border-white/20 rounded px-2 py-0.5 text-xs text-white outline-none focus:border-white/40"
                />
              </form>
            ) : (
              <span className="flex-1 truncate">{chat.title || "New Chat"}</span>
            )
          )}
        </button>

      
        {!collapsed && hoveredId === chat.id && !isEditing && (
          <div className="absolute right-2 top-1.5 flex items-center gap-1">
            <button
              onClick={(e) => handleRename(e, chat.id, chat.title || "New Chat")}
              className="rounded p-1 text-neutral-500 hover:text-white transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeleteChat(chat.id)
              }}
              className="rounded p-1 text-neutral-500 hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {isEditing && (
          <div className="absolute right-2 top-1.5 flex items-center gap-1">
            <button
              onClick={(e) => submitRename(e, chat.id)}
              disabled={isRenaming}
              className="rounded p-1 text-green-500 hover:bg-green-500/10 transition-colors disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={cancelRename}
              disabled={isRenaming}
              className="rounded p-1 text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    )
  }

  const GroupSection = ({ label, items }: { label: string; items: Chat[] }) => {
    if (items.length === 0) return null
    return (
      <div className="mb-3">
        {!collapsed && (
          <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-600">
            {label}
          </p>
        )}
        <div className="space-y-0.5">
          {items.map((chat) => (
            <ChatItem key={chat.id} chat={chat} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 60 : 260 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex h-full shrink-0 flex-col border-r border-white/8 bg-[#171717] overflow-hidden"
    >
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#212121] text-neutral-400 hover:text-white shadow-sm"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3 " />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>

      <div className="flex h-14 items-center px-4 border-b border-white/8">
        <Image src="/assets/logo-without.webp" alt="Logo" width={28} height={28} className="shrink-0 object-contain" />
        {!collapsed && (
          <span className="ml-2.5 text-sm font-semibold text-white truncate">
            Digital Socratic
          </span>
        )}
      </div>

      <div className="px-2 py-3">
        <button
          onClick={onNewChat}
          disabled={isCreating}
          className={`flex w-full items-center gap-2.5 rounded-lg border border-white/10 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/8 disabled:opacity-50 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && <span>New chat</span>}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-1 scrollbar-thin scrollbar-thumb-white/10">
        {chats.length === 0 ? (
          !collapsed && (
            <p className="mt-4 px-3 text-xs text-neutral-600">
              No conversations yet
            </p>
          )
        ) : (
          <>
            <GroupSection label="Today" items={groups.today} />
            <GroupSection label="Yesterday" items={groups.yesterday} />
            <GroupSection label="Older" items={groups.older} />
          </>
        )}
      </div>

      <div className="relative border-t border-white/8 px-2 py-3" ref={menuRef}>
        <AnimatePresence>
          {isUserMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-2 right-2 mb-2 overflow-hidden rounded-xl border border-white/10 bg-[#212121] p-1 shadow-lg"
            >
              <Link
                href="/profile"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <Settings className="h-4 w-4" />
                {!collapsed && <span>Profile Settings</span>}
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                {!collapsed && <span>Log out</span>}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-neutral-400 hover:bg-white/5 hover:text-white transition-colors ${
            collapsed ? "justify-center" : ""
          } ${isUserMenuOpen ? "bg-white/5 text-white" : ""}`}
        >
          {user?.name ? (
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
              {user.name[0].toUpperCase()}
            </span>
          ) : (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-800">
               <User className="h-3.5 w-3.5" />
            </div>
          )}
          {!collapsed && (
            <span className="flex-1 truncate text-left">{user?.name || user?.email || "Profile"}</span>
          )}
        </button>
      </div>
    </motion.aside>
  )
}
