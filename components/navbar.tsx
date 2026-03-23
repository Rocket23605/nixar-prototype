"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogOut, User } from "lucide-react"

interface NavbarProps {
  displayName: string
  onLogout: () => void
}

export function Navbar({ displayName, onLogout }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-accent/20">
            <Image src="/32.png" alt="Nixar" width={32} height={32} className="object-contain" />
          </div>
          <span className="font-bold text-foreground">Nixar</span>
        </div>

        {/* User & Logout */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{displayName}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
