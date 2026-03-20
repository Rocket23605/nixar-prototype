"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark")

  if (!mounted) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Sun className="h-4 w-4 text-muted-foreground" />
        <Switch checked={false} disabled />
        <Moon className="h-4 w-4 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Sun className={cn("h-4 w-4 transition-colors", isDark ? "text-muted-foreground" : "text-foreground")} />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
      <Moon className={cn("h-4 w-4 transition-colors", isDark ? "text-foreground" : "text-muted-foreground")} />
      <span className="sr-only">Toggle light/dark mode</span>
    </div>
  )
}
