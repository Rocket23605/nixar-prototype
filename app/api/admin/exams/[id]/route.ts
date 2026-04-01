import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const { title, subject, level, description, durationMins, isPublished, pdfUrl, pdfFileName } = body

  const exam = await prisma.examSet.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(subject !== undefined && { subject }),
      ...(level !== undefined && { level }),
      ...(description !== undefined && { description }),
      ...(durationMins !== undefined && { durationMins }),
      ...(isPublished !== undefined && { isPublished }),
      ...(pdfUrl !== undefined && { pdfUrl }),
      ...(pdfFileName !== undefined && { pdfFileName }),
    },
  })

  return NextResponse.json(exam)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  await prisma.examSet.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
