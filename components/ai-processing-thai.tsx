"use client"

import { useEffect, useState, useRef } from "react"
import { Brain, BarChart3, Target, Lightbulb } from "lucide-react"

export interface ScoredAnswer {
  questionId: string
  selectedKey: string | null
  isCorrect: boolean
  correctAnswer: string
  explanation: string | null
}

export interface SubmitResult {
  attemptId: string
  score: number
  totalScore: number
  aiReport: {
    summary: string
    strengths: string[]
    weaknesses: string[]
    suggestions: string[]
  }
  scoredAnswers: ScoredAnswer[]
}

const PROCESSING_STEPS = [
  { icon: Brain, text: "กำลังวิเคราะห์คำตอบ..." },
  { icon: BarChart3, text: "กำลังประเมินคะแนนรายหมวด..." },
  { icon: Target, text: "กำลังระบุจุดอ่อน-จุดแข็ง..." },
  { icon: Lightbulb, text: "กำลังสร้างแผนการเรียนส่วนตัว..." },
]

interface AIProcessingThaiProps {
  submitFn: () => Promise<SubmitResult>
  onComplete: (result: SubmitResult) => void
}

export function AIProcessingThai({ submitFn, onComplete }: AIProcessingThaiProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [submitError, setSubmitError] = useState("")
  const submitted = useRef(false)

  useEffect(() => {
    if (submitted.current) return
    submitted.current = true

    // Start API call immediately
    const submitPromise = submitFn().catch((err) => {
      console.error(err)
      setSubmitError("เกิดข้อผิดพลาดในการส่งข้อสอบ")
      return null
    })

    // Animate progress bar (target 90% while waiting for API)
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) =>
        prev < PROCESSING_STEPS.length - 1 ? prev + 1 : prev
      )
    }, 700)

    let currentProgress = 0
    const progressInterval = setInterval(() => {
      currentProgress += 2
      if (currentProgress >= 90) {
        clearInterval(progressInterval)
      }
      setProgress(currentProgress)
    }, 50)

    // When API resolves, finish animation then call onComplete
    submitPromise.then((result) => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)

      if (!result) return

      // Fast-complete progress to 100%
      setCurrentStep(PROCESSING_STEPS.length - 1)
      let p = currentProgress
      const finish = setInterval(() => {
        p += 5
        setProgress(p)
        if (p >= 100) {
          clearInterval(finish)
          setTimeout(() => onComplete(result), 300)
        }
      }, 30)
    })

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const CurrentIcon = PROCESSING_STEPS[currentStep].icon

  if (submitError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-destructive mb-4">{submitError}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-muted-foreground underline"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Animated Icon */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute inset-0 w-32 h-32 rounded-full bg-accent/20 animate-ping" />
          <div className="absolute inset-2 w-28 h-28 rounded-full bg-accent/30 animate-pulse" />
          <div className="relative w-24 h-24 rounded-full bg-accent/40 flex items-center justify-center">
            <CurrentIcon className="w-10 h-10 text-accent animate-pulse" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          AI กำลังวิเคราะห์ผลสอบ
        </h2>
        <p className="text-muted-foreground mb-8">
          กรุณารอสักครู่ ระบบกำลังประมวลผล
        </p>

        <div className="w-full bg-secondary rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-accent font-medium animate-pulse">
          {PROCESSING_STEPS[currentStep].text}
        </p>

        <div className="flex justify-center gap-2 mt-6">
          {PROCESSING_STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx <= currentStep ? "bg-accent" : "bg-secondary"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
