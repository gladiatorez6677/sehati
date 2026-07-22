import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

interface QInput {
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}
function cleanQuestions(raw: unknown): QInput[] {
  if (!Array.isArray(raw)) return []
  const out: QInput[] = []
  for (const q of raw) {
    const question = String(q?.question || "").trim()
    const options = Array.isArray(q?.options) ? q.options.map((o: unknown) => String(o).trim()).filter(Boolean) : []
    const correctAnswer = Number(q?.correctAnswer)
    if (!question || options.length < 2) continue
    out.push({
      question,
      options,
      correctAnswer: correctAnswer >= 0 && correctAnswer < options.length ? correctAnswer : 0,
      explanation: q?.explanation ? String(q.explanation).trim() : "",
    })
  }
  return out
}

// GET - detail game (+ artikel untuk tahap baca)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { id } = await params
    const game = await prisma.gameEdukasi.findUnique({
      where: { id },
      include: { artikel: { select: { id: true, judul: true, konten: true, gambar: true } } },
    })
    if (!game) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(game)
  } catch (error) {
    console.error("Error fetching game:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

// PUT - perawat update
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const existing = await prisma.gameEdukasi.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const body = await req.json()
    const data: Record<string, unknown> = {}
    if (body.nama !== undefined) data.nama = String(body.nama).trim()
    if (body.deskripsi !== undefined) data.deskripsi = String(body.deskripsi || "").trim()
    if (body.kategori !== undefined) data.kategori = String(body.kategori || "Umum").trim()
    if (body.difficulty !== undefined && ["MUDAH", "SEDANG", "SULIT"].includes(body.difficulty)) data.difficulty = body.difficulty
    if (body.artikelId !== undefined) data.artikelId = body.artikelId ? String(body.artikelId) : null
    if (body.pertanyaan !== undefined) {
      const q = cleanQuestions(body.pertanyaan)
      if (q.length === 0) return NextResponse.json({ error: "Minimal satu pertanyaan dengan 2 opsi" }, { status: 400 })
      data.pertanyaan = q.map((qq, i) => ({ id: i + 1, ...qq }))
    }

    const game = await prisma.gameEdukasi.update({ where: { id }, data })
    return NextResponse.json(game)
  } catch (error) {
    console.error("Error updating game:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

// DELETE - perawat hapus
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const existing = await prisma.gameEdukasi.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
    // Hapus skor terkait dulu (GameScore tidak set cascade)
    await prisma.gameScore.deleteMany({ where: { gameId: id } })
    await prisma.gameEdukasi.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting game:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
