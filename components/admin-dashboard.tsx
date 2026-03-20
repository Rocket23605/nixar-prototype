"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  FileText,
  TrendingUp,
  Upload,
  CheckCircle,
  BarChart3,
  Clock,
  GraduationCap,
} from "lucide-react"

interface AdminDashboardProps {
  onSelectExam?: (examId: string) => void
}

export function AdminDashboard({ onSelectExam }: AdminDashboardProps) {
  const [exams, setExams] = useState([
    { id: "1", name: "A-Level Math Mock 1", students: 156, avgScore: 72 },
    { id: "2", name: "A-Level Math Mock 2", students: 143, avgScore: 68 },
    { id: "3", name: "A-Level Math Mock 3", students: 89, avgScore: 75 },
  ])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleUpload = () => {
    setUploading(true)
    setUploadProgress(0)
    setUploadSuccess(false)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          setUploadSuccess(true)
          setExams((prevExams) => [
            ...prevExams,
            {
              id: String(prevExams.length + 1),
              name: `A-Level Math Mock ${prevExams.length + 1}`,
              students: 0,
              avgScore: 0,
            },
          ])
          return 100
        }
        return prev + 10
      })
    }, 150)
  }

  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => setUploadSuccess(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [uploadSuccess])

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">2,847</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Exams Completed
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">12,459</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Score
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">71.8%</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+3.1%</span> improvement
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              AI Reports Generated
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">9,234</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+18.7%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload New Exam
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onClick={!uploading ? handleUpload : undefined}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                if (!uploading) handleUpload()
              }}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                dragOver
                  ? "border-accent bg-accent/10"
                  : uploading
                  ? "border-accent/50 bg-accent/5"
                  : uploadSuccess
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-border hover:border-muted-foreground hover:bg-secondary/50"
              }`}
            >
              {uploading ? (
                <div className="space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full border-2 border-accent border-t-transparent animate-spin" />
                  <p className="text-muted-foreground">
                    Uploading... {uploadProgress}%
                  </p>
                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : uploadSuccess ? (
                <div className="space-y-2">
                  <CheckCircle className="w-12 h-12 mx-auto text-emerald-500" />
                  <p className="text-emerald-500 font-medium">
                    Upload Successful!
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Exam added to your library
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-foreground font-medium">
                    Drop your exam file here
                  </p>
                  <p className="text-muted-foreground text-sm">
                    or click to browse (PDF, DOCX)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Exam Analytics */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Exam Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { topic: "Statistics", score: 78, color: "bg-emerald-500" },
                { topic: "Calculus", score: 65, color: "bg-amber-500" },
                { topic: "Algebra", score: 82, color: "bg-emerald-500" },
                { topic: "Trigonometry", score: 71, color: "bg-accent" },
              ].map((item) => (
                <div key={item.topic} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{item.topic}</span>
                    <span className="text-muted-foreground">{item.score}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exam List */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Exam Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {exams.map((exam, index) => (
              <div
                key={exam.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{exam.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {exam.students} students
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> {exam.avgScore}% avg
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {index === exams.length - 1 && uploadSuccess && (
                    <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      New
                    </span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border text-foreground hover:bg-secondary"
                    onClick={() => onSelectExam?.(exam.id)}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
