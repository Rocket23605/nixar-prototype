"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import type { User } from "@/lib/auth-context"

interface LoginPageProps {
  onLogin: (user: User) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง")
      } else {
        onLogin({
          id: data.id,
          username: data.username,
          role: data.role as "student" | "admin",
          displayName: data.displayName,
        })
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl overflow-hidden bg-accent/20 mb-4">
            <Image src="/56.png" alt="Nixar" width={56} height={56} className="object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Nixar</h1>
          <p className="text-muted-foreground">
            แพลตฟอร์มติวคณิตศาสตร์ A-Level อัจฉริยะ
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="text-center pb-4">
            <h2 className="text-xl font-semibold text-foreground">เข้าสู่ระบบ</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                ชื่อผู้ใช้
              </label>
              <Input
                type="text"
                placeholder="กรอกชื่อผู้ใช้"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-secondary/50 border-border"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                รหัสผ่าน
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="กรอกรหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary/50 border-border pr-10"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button
              onClick={handleLogin}
              disabled={isLoading || !username || !password}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  กำลังเข้าสู่ระบบ...
                </span>
              ) : (
                "เข้าสู่ระบบ"
              )}
            </Button>

            {/* Demo Accounts */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-3">
                บัญชีสำหรับทดสอบระบบ (Demo)
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-secondary/30 border border-border/50">
                  <p className="font-medium text-foreground">นักเรียน</p>
                  <p className="text-muted-foreground">student1 / 1234</p>
                </div>
                <div className="p-2 rounded-lg bg-secondary/30 border border-border/50">
                  <p className="font-medium text-foreground">ผู้ดูแล</p>
                  <p className="text-muted-foreground">admin / admin</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Nixar - ระบบติวคณิตศาสตร์อัจฉริยะด้วย AI
        </p>
      </div>
    </div>
  )
}

export type { User }
