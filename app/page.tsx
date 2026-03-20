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
              Learn by doing
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Interactive problem solving that&apos;s effective and fun. Excel in math with AI-powered analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-base px-8">
                <Link href="/login">I&apos;m a learner</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <Link href="/login">I&apos;m a parent or teacher</Link>
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
              { icon: Brain, label: "Math", href: "/login" },
              { icon: Sparkles, label: "AI Analytics", href: "/login" },
              { icon: Target, label: "Practice", href: "/login" },
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
            Join learners preparing for A-Level
          </h2>
          <p className="text-muted-foreground mb-8">
            AI-powered performance analytics and personalized learning paths
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
              <h3 className="text-xl font-semibold text-foreground mb-2">Concepts that click</h3>
              <p className="text-muted-foreground">
                Step-by-step interactive lessons make even complex ideas feel intuitive. Custom, intelligent feedback catches mistakes as you learn.
              </p>
            </div>
            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/20 mb-4">
                <TrendingUp className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Personalized learning</h3>
              <p className="text-muted-foreground">
                Nixar tracks the concepts you&apos;ve mastered, designs practice sets based on your progress, and adapts to your pace.
              </p>
            </div>
            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/20 mb-4">
                <Award className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Guided lessons</h3>
              <p className="text-muted-foreground">
                Stay on track, see your progress, and build your problem solving skills one concept at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-accent/10 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everyone is a math person
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join learners preparing for A-Level with interactive problem solving.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-base px-10">
            <Link href="/login">Get started for free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-muted-foreground">
          <p>Nixar - AI-Powered A-Level Math Platform</p>
        </div>
      </footer>
    </div>
  )
}
