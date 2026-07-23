import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// GET - hasil/skor game untuk perawat
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const game = await prisma.gameEdukasi.findUnique({ where: { id } })
    if (!game) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const scores = await prisma.gameScore.findMany({
      where: { gameId: id },
      orderBy: { createdAt: "desc" },
      include: { masyarakat: { include: { user: { select: { nama: true } } } } },
    })

    const totalSoal = Array.isArray(game.pertanyaan) ? (game.pertanyaan as unknown[]).length : 0
    const totalMain = scores.length
    const pemainUnik = new Set(scores.map((s) => s.masyarakatId)).size
    const rataRata = totalMain > 0 ? Math.round(scores.reduce((a, s) => a + s.score, 0) / totalMain) : 0
    const tertinggi = totalMain > 0 ? Math.max(...scores.map((s) => s.score)) : 0

    return NextResponse.json({
      nama: game.nama,
      kategori: game.kategori,
      totalSoal,
      totalMain,
      pemainUnik,
      rataRata,
      tertinggi,
      skor: scores.map((s) => ({
        id: s.id,
        nama: s.masyarakat?.user?.nama || "Tanpa nama",
        score: s.score,
        waktuSelesai: s.waktuSelesai,
        achievement: s.achievement,
        createdAt: s.createdAt,
      })),
    })
  } catch (error) {
    console.error("Error fetching game hasil:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
