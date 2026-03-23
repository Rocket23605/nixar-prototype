"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function HomeNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-accent/20">
            <Image src="/36.png" alt="Nixar" width={36} height={36} className="object-contain" />
          </div>
          <span className="font-bold text-lg text-foreground">Nixar</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
