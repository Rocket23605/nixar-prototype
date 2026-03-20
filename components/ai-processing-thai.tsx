"use client"

import { useEffect, useState } from "react"
import { Brain, BarChart3, Target, Lightbulb } from "lucide-react"

const PROCESSING_STEPS = [
  { icon: Brain, text: "กำลังวิเคราะห์คำตอบ..." },
  { icon: BarChart3, text: "กำลังประเมินคะแนนรายหมวด..." },
  { icon: Target, text: "กำลังระบุจุดอ่อน-จุดแข็ง..." },
  { icon: Lightbulb, text: "กำลังสร้างแผนการเรียนส่วนตัว..." },
]

interface AIProcessingThaiProps {
  onComplete: () => void
}

export function AIProcessingThai({ onComplete }: AIProcessingThaiProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < PROCESSING_STEPS.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 600)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          clearInterval(stepInterval)
          setTimeout(onComplete, 300)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
  }, [onComplete])

  const CurrentIcon = PROCESSING_STEPS[currentStep].icon

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

        {/* Title */}
        <h2 className="text-2xl font-bold text-foreground mb-2">
          AI กำลังวิเคราะห์ผลสอบ
        </h2>
        <p className="text-muted-foreground mb-8">
          กรุณารอสักครู่ ระบบกำลังประมวลผล
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-secondary rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Current Step */}
        <p className="text-accent font-medium animate-pulse">
          {PROCESSING_STEPS[currentStep].text}
        </p>

        {/* Steps Progress */}
        <div className="flex justify-center gap-2 mt-6">
          {PROCESSING_STEPS.map((step, idx) => (
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
