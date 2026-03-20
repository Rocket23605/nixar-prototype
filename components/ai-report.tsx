"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  Target,
  BookOpen,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Brain,
  Zap,
  Award,
} from "lucide-react"

interface AIReportProps {
  onStartDrill: () => void
  onRetakeExam: () => void
}

export function AIReport({ onStartDrill, onRetakeExam }: AIReportProps) {
  const overallScore = 72
  const grade = "B"

  const topicScores = [
    { topic: "Statistics", score: 85, trend: "up", status: "strong" },
    { topic: "Algebra", score: 78, trend: "up", status: "strong" },
    { topic: "Calculus", score: 54, trend: "down", status: "weak" },
    { topic: "Trigonometry", score: 71, trend: "stable", status: "moderate" },
  ]

  const strengths = [
    "Excellent grasp of statistical concepts",
    "Strong algebraic manipulation skills",
    "Good understanding of proof structures",
  ]

  const improvements = [
    "Differentiation rules need practice",
    "Chain rule application is inconsistent",
    "Integration techniques require revision",
  ]

  const learningPath = [
    {
      title: "Calculus Fundamentals",
      description: "Master the basics of differentiation",
      duration: "2 hours",
      priority: "high",
    },
    {
      title: "Chain Rule Deep Dive",
      description: "Practice complex differentiation problems",
      duration: "1.5 hours",
      priority: "high",
    },
    {
      title: "Integration Techniques",
      description: "Strengthen integration methods",
      duration: "2 hours",
      priority: "medium",
    },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero Score Section */}
      <Card className="border-border bg-card overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-emerald-500/10" />
          <CardContent className="relative py-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start mb-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium text-accent">
                    AI Performance Report
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Your Results Are In
                </h1>
                <p className="text-muted-foreground">
                  A-Level Math Mock 1 • Completed just now
                </p>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-secondary"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={`${overallScore * 3.52} 352`}
                        strokeLinecap="round"
                        className="text-accent transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-foreground">
                        {overallScore}%
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Overall
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <span className="text-4xl font-bold text-accent">
                      {grade}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Grade</p>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Topic Performance */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Topic Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {topicScores.map((item) => (
              <div
                key={item.topic}
                className={`p-4 rounded-lg border ${
                  item.status === "strong"
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : item.status === "weak"
                    ? "border-amber-500/30 bg-amber-500/5"
                    : "border-border bg-secondary/30"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-foreground">
                    {item.topic}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-lg font-bold ${
                        item.status === "strong"
                          ? "text-emerald-500"
                          : item.status === "weak"
                          ? "text-amber-500"
                          : "text-foreground"
                      }`}
                    >
                      {item.score}%
                    </span>
                    {item.trend === "up" && (
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    )}
                    {item.trend === "down" && (
                      <TrendingDown className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      item.status === "strong"
                        ? "bg-emerald-500"
                        : item.status === "weak"
                        ? "bg-amber-500"
                        : "bg-accent"
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-500" />
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {strengths.map((strength, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground text-sm">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-500" />
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {improvements.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20"
                >
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Learning Path */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              AI Personalized Learning Path
            </CardTitle>
            <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/20">
              Recommended for you
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {learningPath.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      item.priority === "high"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {item.priority === "high" ? (
                      <Zap className="w-5 h-5" />
                    ) : (
                      <BookOpen className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{item.title}</p>
                      {item.priority === "high" && (
                        <span className="px-2 py-0.5 rounded text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          Priority
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.description} • {item.duration}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-accent hover:text-accent hover:bg-accent/10"
                >
                  Start
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onStartDrill}
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Zap className="w-4 h-4 mr-2" />
              Start Weakness Drill
            </Button>
            <Button
              onClick={onRetakeExam}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-secondary"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Retake Exam
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
