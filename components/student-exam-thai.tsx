"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, ChevronLeft, ChevronRight, Send, AlertCircle } from "lucide-react"

interface Question {
  id: number
  category: string
  categoryColor: string
  question: string
  options: { key: string; value: string }[]
  correctAnswer: string
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: "แคลคูลัส",
    categoryColor: "bg-chart-1/20 text-chart-1",
    question: "จงหาอนุพันธ์ของ f(x) = 3x³ + 2x² - 5x + 1",
    options: [
      { key: "A", value: "f'(x) = 9x² + 4x - 5" },
      { key: "B", value: "f'(x) = 9x² + 2x - 5" },
      { key: "C", value: "f'(x) = 3x² + 4x - 5" },
      { key: "D", value: "f'(x) = 9x² + 4x + 5" },
    ],
    correctAnswer: "A",
  },
  {
    id: 2,
    category: "แคลคูลัส",
    categoryColor: "bg-chart-1/20 text-chart-1",
    question: "จงหาค่า ∫(2x + 3)dx",
    options: [
      { key: "A", value: "x² + 3x + C" },
      { key: "B", value: "2x² + 3x + C" },
      { key: "C", value: "x² + 3 + C" },
      { key: "D", value: "2x + 3 + C" },
    ],
    correctAnswer: "A",
  },
  {
    id: 3,
    category: "พีชคณิต",
    categoryColor: "bg-chart-2/20 text-chart-2",
    question: "ถ้า x² - 5x + 6 = 0 แล้ว ค่า x ที่เป็นไปได้คือ",
    options: [
      { key: "A", value: "x = 1 หรือ x = 6" },
      { key: "B", value: "x = 2 หรือ x = 3" },
      { key: "C", value: "x = -2 หรือ x = -3" },
      { key: "D", value: "x = 1 หรือ x = 5" },
    ],
    correctAnswer: "B",
  },
  {
    id: 4,
    category: "ตรีโกณมิติ",
    categoryColor: "bg-chart-3/20 text-chart-3",
    question: "ค่าของ sin²(45°) + cos²(45°) เท่ากับ",
    options: [
      { key: "A", value: "0" },
      { key: "B", value: "0.5" },
      { key: "C", value: "1" },
      { key: "D", value: "2" },
    ],
    correctAnswer: "C",
  },
  {
    id: 5,
    category: "สถิติ",
    categoryColor: "bg-chart-4/20 text-chart-4",
    question: "ข้อมูลชุดหนึ่งมีค่า 2, 4, 6, 8, 10 ค่าเฉลี่ยเลขคณิตคือ",
    options: [
      { key: "A", value: "5" },
      { key: "B", value: "6" },
      { key: "C", value: "7" },
      { key: "D", value: "8" },
    ],
    correctAnswer: "B",
  },
]

interface StudentExamThaiProps {
  examTitle: string
  onSubmit: (answers: Record<number, string>) => void
  onBack: () => void
}

export function StudentExamThai({ examTitle, onSubmit, onBack }: StudentExamThaiProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 minutes in seconds
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onSubmit(answers)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [answers, onSubmit])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSelectAnswer = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const question = QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100
  const answeredCount = Object.keys(answers).length

  const handleSubmit = () => {
    if (answeredCount < QUESTIONS.length) {
      setShowConfirm(true)
    } else {
      onSubmit(answers)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-foreground text-sm md:text-base">
                {examTitle}
              </h1>
              <p className="text-xs text-muted-foreground">
                ข้อที่ {currentQuestion + 1} จาก {QUESTIONS.length}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              timeLeft < 300 ? "bg-destructive/20 text-destructive" : "bg-secondary text-foreground"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Question Card */}
          <Card className="border-border/50 bg-card/50 mb-6">
            <CardContent className="p-6">
              {/* Category Badge */}
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 ${question.categoryColor}`}
              >
                {question.category}
              </span>

              {/* Question */}
              <h2 className="text-lg md:text-xl font-medium text-foreground mb-6">
                {question.id}. {question.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleSelectAnswer(question.id, option.key)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                      answers[question.id] === option.key
                        ? "border-accent bg-accent/10 ring-1 ring-accent"
                        : "border-border hover:border-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold shrink-0 ${
                          answers[question.id] === option.key
                            ? "bg-accent text-accent-foreground"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {option.key}
                      </span>
                      <span className="text-foreground pt-1">{option.value}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Question Navigator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {QUESTIONS.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                  idx === currentQuestion
                    ? "bg-accent text-accent-foreground"
                    : answers[q.id]
                    ? "bg-success/20 text-success border border-success/30"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {q.id}
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="border-border"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              ก่อนหน้า
            </Button>

            <div className="flex-1 max-w-xs">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center mt-1">
                ตอบแล้ว {answeredCount}/{QUESTIONS.length} ข้อ
              </p>
            </div>

            {currentQuestion < QUESTIONS.length - 1 ? (
              <Button
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                ถัดไป
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-success hover:bg-success/90 text-success-foreground"
              >
                <Send className="w-4 h-4 mr-1" />
                ส่งข้อสอบ
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    ยืนยันการส่งข้อสอบ
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    คุณยังตอบไม่ครบทุกข้อ ({answeredCount}/{QUESTIONS.length} ข้อ)
                    ต้องการส่งข้อสอบหรือไม่?
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 border-border"
                >
                  กลับไปทำต่อ
                </Button>
                <Button
                  onClick={() => onSubmit(answers)}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  ส่งข้อสอบ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export { QUESTIONS }
