"use client"

import { useRouter } from "next/navigation"
import { LoginPage, type User } from "@/components/login-page"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth-context"

export default function LoginRoute() {
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = (user: User) => {
    login(user)
    router.push("/app")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <LoginPage onLogin={handleLogin} />
    </div>
  )
}
