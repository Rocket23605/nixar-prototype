"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { ExamSelection } from "@/components/exam-selection"
import { StudentExamThai, type ExamData } from "@/components/student-exam-thai"
import { AIProcessingThai, type SubmitResult } from "@/components/ai-processing-thai"
import { AIReportThai } from "@/components/ai-report-thai"
import { AdminDashboardThai } from "@/components/admin-dashboard-thai"

type AppView = "exam-selection" | "exam" | "processing" | "report" | "admin"

export default function AppPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [currentView, setCurrentView] = useState<AppView>("exam-selection")
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null)
  const [examData, setExamData] = useState<ExamData | null>(null)
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({})
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null)

  useEffect(() => {
    if (!user) {
      router.replace("/login")
    }
  }, [user, router])

  useEffect(() => {
    if (user?.role === "admin") {
      setCurrentView("admin")
    }
  }, [user])

  const handleLogout = () => {
    logout()
    router.replace("/")
  }

  const handleSelectExam = (examId: string) => {
    setSelectedExamId(examId)
    setCurrentView("exam")
  }

  const handleSubmitExam = (answers: Record<string, string>, data: ExamData) => {
    setExamAnswers(answers)
    setExamData(data)
    setCurrentView("processing")
  }

  // Called by AIProcessingThai — actually hits the API
  const submitFn = useCallback(async (): Promise<SubmitResult> => {
    if (!selectedExamId || !user) throw new Error("ข้อมูลไม่ครบ")

    const answers = Object.entries(examAnswers).map(([questionId, selectedKey]) => ({
      questionId,
      selectedKey,
    }))

    const res = await fetch(`/api/exams/${selectedExamId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, answers }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "ส่งข้อสอบไม่สำเร็จ")
    }

    return res.json()
  }, [selectedExamId, user, examAnswers])

  const handleProcessingComplete = (result: SubmitResult) => {
    setSubmitResult(result)
    setCurrentView("report")
  }

  const handleRetakeExam = () => {
    setExamAnswers({})
    setSubmitResult(null)
    setCurrentView("exam")
  }

  const handleBackToSelection = () => {
    setExamAnswers({})
    setSelectedExamId(null)
    setExamData(null)
    setSubmitResult(null)
    setCurrentView("exam-selection")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <Navbar displayName={user.displayName} onLogout={handleLogout} />

      {currentView === "exam-selection" && (
        <ExamSelection studentName={user.displayName} onSelectExam={handleSelectExam} />
      )}

      {currentView === "exam" && selectedExamId && (
        <StudentExamThai
          examId={selectedExamId}
          onSubmit={handleSubmitExam}
          onBack={handleBackToSelection}
        />
      )}

      {currentView === "processing" && (
        <AIProcessingThai submitFn={submitFn} onComplete={handleProcessingComplete} />
      )}

      {currentView === "report" && examData && submitResult && (
        <AIReportThai
          examData={examData}
          answers={examAnswers}
          submitResult={submitResult}
          onRetake={handleRetakeExam}
          onBackToSelection={handleBackToSelection}
        />
      )}

      {currentView === "admin" && <AdminDashboardThai />}
    </div>
  )
}
