"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Clock,
  CheckCircle,
  Circle,
  ArrowRight,
  Sparkles,
} from "lucide-react"

interface StudentExamProps {
  onSubmit: () => void
}

export function StudentExam({ onSubmit }: StudentExamProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const questions = [
    {
      id: "q1",
      type: "multiple-choice",
      question:
        "If f(x) = 3x² + 2x - 1, what is f'(x)?",
      options: ["6x + 2", "6x - 2", "3x + 2", "6x² + 2"],
      correctAnswer: "6x + 2",
      topic: "Calculus",
    },
    {
      id: "q2",
      type: "multiple-choice",
      question:
        "A dataset has values: 2, 4, 4, 6, 8. What is the standard deviation (to 2 d.p.)?",
      options: ["1.79", "2.00", "3.20", "2.53"],
      correctAnswer: "2.00",
      topic: "Statistics",
    },
    {
      id: "q3",
      type: "subjective",
      question:
        "Prove that the sum of the first n positive integers is n(n+1)/2. Show your working clearly.",
      topic: "Algebra",
    },
  ]

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const answeredCount = Object.keys(answers).length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Exam Header */}
      <Card className="border-border bg-card">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                A-Level Math Mock 1
              </h2>
              <p className="text-muted-foreground text-sm">
                3 Questions • Estimated time: 45 minutes
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-mono">44:32</span>
              </div>
              <div className="flex items-center gap-1">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQuestion(i)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                      currentQuestion === i
                        ? "bg-accent text-accent-foreground"
                        : answers[questions[i].id]
                        ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-md bg-accent/10 text-accent text-xs font-medium">
              {questions[currentQuestion].topic}
            </span>
            <span className="text-muted-foreground text-sm">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-foreground leading-relaxed">
            {questions[currentQuestion].question}
          </p>

          {questions[currentQuestion].type === "multiple-choice" ? (
            <div className="grid gap-3">
              {questions[currentQuestion].options?.map((option, i) => (
                <button
                  key={i}
                  onClick={() =>
                    handleAnswer(questions[currentQuestion].id, option)
                  }
                  className={`p-4 rounded-lg border text-left transition-all ${
                    answers[questions[currentQuestion].id] === option
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border bg-secondary/30 text-foreground hover:bg-secondary/50 hover:border-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {answers[questions[currentQuestion].id] === option ? (
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className="font-medium">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <Textarea
                placeholder="Type your answer here. Show all working clearly..."
                className="min-h-[200px] bg-secondary/30 border-border text-foreground placeholder:text-muted-foreground resize-none"
                value={answers[questions[currentQuestion].id] || ""}
                onChange={(e) =>
                  handleAnswer(questions[currentQuestion].id, e.target.value)
                }
              />
              <p className="text-xs text-muted-foreground">
                Tip: Structure your proof with clear steps and justify each
                statement.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="border-border text-foreground hover:bg-secondary"
        >
          Previous
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {answeredCount} of {questions.length} answered
          </span>
          <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {currentQuestion < questions.length - 1 ? (
          <Button
            onClick={() =>
              setCurrentQuestion((prev) =>
                Math.min(questions.length - 1, prev + 1)
              )
            }
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={answeredCount < questions.length}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Submit & Analyze
          </Button>
        )}
      </div>
    </div>
  )
}
