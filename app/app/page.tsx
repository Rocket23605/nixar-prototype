"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { ExamSelection } from "@/components/exam-selection"
import { StudentExamThai } from "@/components/student-exam-thai"
import { AIProcessingThai } from "@/components/ai-processing-thai"
import { AIReportThai } from "@/components/ai-report-thai"
import { AdminDashboardThai } from "@/components/admin-dashboard-thai"

type AppView =
  | "exam-selection"
  | "exam"
  | "processing"
  | "report"
  | "admin"

export default function AppPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [currentView, setCurrentView] = useState<AppView>("exam-selection")
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null)
  const [examAnswers, setExamAnswers] = useState<Record<number, string>>({})

  useEffect(() => {
    if (!user) {
      router.replace("/login")
    }
  }, [user, router])

  const handleLogout = () => {
    logout()
    router.replace("/")
  }

  const handleSelectExam = (examId: string) => {
    setSelectedExamId(examId)
    setCurrentView("exam")
  }

  const handleSubmitExam = (answers: Record<number, string>) => {
    setExamAnswers(answers)
    setCurrentView("processing")
  }

  const handleProcessingComplete = () => {
    setCurrentView("report")
  }

  const handleRetakeExam = () => {
    setExamAnswers({})
    setCurrentView("exam")
  }

  const handleBackToSelection = () => {
    setExamAnswers({})
    setSelectedExamId(null)
    setCurrentView("exam-selection")
  }

  const getExamTitle = () => {
    switch (selectedExamId) {
      case "exam1":
        return "ข้อสอบ A-Level คณิตศาสตร์ ชุด 1"
      case "exam2":
        return "ข้อสอบ A-Level คณิตศาสตร์ ชุด 2"
      case "exam3":
        return "ข้อสอบ A-Level คณิตศาสตร์ ชุด 3"
      default:
        return "ข้อสอบ A-Level คณิตศาสตร์"
    }
  }

  useEffect(() => {
    if (user?.role === "admin") {
      setCurrentView("admin")
    }
  }, [user])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar displayName={user.displayName} onLogout={handleLogout} />

      {currentView === "exam-selection" && (
        <ExamSelection
          studentName={user.displayName}
          onSelectExam={handleSelectExam}
        />
      )}

      {currentView === "exam" && (
        <StudentExamThai
          examTitle={getExamTitle()}
          onSubmit={handleSubmitExam}
          onBack={handleBackToSelection}
        />
      )}

      {currentView === "processing" && (
        <AIProcessingThai onComplete={handleProcessingComplete} />
      )}

      {currentView === "report" && (
        <AIReportThai
          answers={examAnswers}
          onRetake={handleRetakeExam}
          onBackToSelection={handleBackToSelection}
        />
      )}

      {currentView === "admin" && <AdminDashboardThai />}
    </div>
  )
}
