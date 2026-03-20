"use client"

import { useEffect, useState } from "react"
import { Brain, Sparkles, BarChart3, Target } from "lucide-react"

interface AIProcessingProps {
  onComplete: () => void
}

export function AIProcessing({ onComplete }: AIProcessingProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { icon: Brain, text: "Analyzing your responses..." },
    { icon: BarChart3, text: "Evaluating topic performance..." },
    { icon: Target, text: "Generating personalized insights..." },
    { icon: Sparkles, text: "Creating your learning path..." },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 300)
          return 100
        }
        return prev + 2
      })
    }, 40)

    return () => clearInterval(interval)
  }, [onComplete])

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 500)

    return () => clearInterval(stepInterval)
  }, [steps.length])

  const CurrentIcon = steps[currentStep].icon

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-center space-y-8 max-w-md">
        {/* Animated Icon */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center animate-pulse">
            <CurrentIcon className="w-12 h-12 text-accent" />
          </div>
          <div className="absolute -inset-4 rounded-3xl border-2 border-accent/20 animate-ping" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            AI is analyzing your performance
          </h2>
          <p className="text-muted-foreground animate-pulse">
            {steps[currentStep].text}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs mx-auto space-y-2">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">{progress}% complete</p>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentStep ? "bg-accent scale-125" : "bg-secondary"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
