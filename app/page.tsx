"use client"

import Link from "next/link"
import { HomeNavbar } from "@/components/home-navbar"
import { Button } from "@/components/ui/button"
import { Brain, Sparkles, Target, BookOpen, TrendingUp, Award } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HomeNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight mb-6">
              เรียนรู้ด้วยการลงมือทำ
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              แก้โจทย์แบบโต้ตอบที่ได้ผลและสนุก พัฒนาคณิตศาสตร์ด้วยการวิเคราะห์จาก AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-base px-8">
                <Link href="/login">ฉันเป็นผู้เรียน</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <Link href="/login">ฉันเป็นผู้ปกครองหรือครู</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Brain, label: "คณิตศาสตร์", href: "/login" },
              { icon: Sparkles, label: "วิเคราะห์ด้วย AI", href: "/login" },
              { icon: Target, label: "ฝึกฝน", href: "/login" },
              { icon: BookOpen, label: "A-Level", href: "/login" },
            ].map(({ icon: Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-accent/50 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <span className="font-medium text-foreground">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            ร่วมกับผู้เรียนที่กำลังเตรียมสอบ A-Level
          </h2>
          <p className="text-muted-foreground mb-8">
            วิเคราะห์ผลการเรียนด้วย AI และเส้นทางการเรียนรู้เฉพาะบุคคล
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/20 mb-4">
                <Sparkles className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">แนวคิดที่เข้าใจง่าย</h3>
              <p className="text-muted-foreground">
                บทเรียนแบบโต้ตอบทีละขั้นช่วยให้แม้แนวคิดซับซ้อนก็รู้สึกเข้าใจได้ คำติชมอัจฉริยะช่วยจับข้อผิดพลาดขณะเรียนรู้
              </p>
            </div>
            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/20 mb-4">
                <TrendingUp className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">การเรียนรู้เฉพาะบุคคล</h3>
              <p className="text-muted-foreground">
                Nixar ติดตามแนวคิดที่คุณเชี่ยวชาญ ออกแบบชุดฝึกจากความคืบหน้า และปรับให้เหมาะกับจังหวะของคุณ
              </p>
            </div>
            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/20 mb-4">
                <Award className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">บทเรียนแบบมีแนวทาง</h3>
              <p className="text-muted-foreground">
                ติดตามเป้าหมาย เห็นความคืบหน้า และสร้างทักษะการแก้ปัญหาทีละแนวคิด
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-accent/10 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            ทุกคนเรียนคณิตศาสตร์ได้
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            ร่วมกับผู้เรียนที่เตรียมสอบ A-Level ด้วยการแก้โจทย์แบบโต้ตอบ
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-base px-10">
            <Link href="/login">เริ่มใช้ฟรี</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-muted-foreground">
          <p>Nixar — แพลตฟอร์มคณิตศาสตร์ A-Level ขับเคลื่อนด้วย AI</p>
        </div>
      </footer>
    </div>
  )
}
