import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get("file") as File | null
  const examSetId = formData.get("examSetId") as string | null
  const type = (formData.get("type") as string) ?? "exam-pdfs"

  if (!file) {
    return NextResponse.json({ error: "ไม่พบไฟล์" }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  let storagePath: string
  if (type === "question-images" && examSetId) {
    storagePath = `question-images/${examSetId}/${Date.now()}-${file.name}`
  } else if (examSetId) {
    storagePath = `exam-pdfs/${examSetId}/exam-document.pdf`
  } else {
    storagePath = `exam-pdfs/${Date.now()}-${file.name}`
  }

  const { error: uploadError } = await supabase.storage
    .from("nixar")
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: true,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: urlData } = supabase.storage.from("nixar").getPublicUrl(storagePath)
  const publicUrl = urlData.publicUrl

  if (examSetId && type === "exam-pdfs") {
    await prisma.examSet.update({
      where: { id: examSetId },
      data: { pdfUrl: publicUrl, pdfFileName: file.name },
    })
  }

  return NextResponse.json({ url: publicUrl, fileName: file.name })
}
