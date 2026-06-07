import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// GET - Ambil riwayat skor user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "MASYARAKAT") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get masyarakat ID
    const masyarakat = await prisma.masyarakat.findUnique({
      where: { userId: session.user.id }
    })

    if (!masyarakat) {
      return NextResponse.json(
        { error: "Masyarakat not found" },
        { status: 404 }
      )
    }

    // Get game scores
    const scores = await prisma.gameScore.findMany({
      where: { masyarakatId: masyarakat.id },
      include: {
        game: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json(scores)
  } catch (error) {
    console.error("Error fetching game scores:", error)
    return NextResponse.json(
      { error: "Failed to fetch scores" },
      { status: 500 }
    )
  }
}

// POST - Simpan skor game baru
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "MASYARAKAT") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { gameId, score, waktuSelesai, achievement } = body

    if (!gameId || score === undefined || !waktuSelesai) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get masyarakat ID
    const masyarakat = await prisma.masyarakat.findUnique({
      where: { userId: session.user.id }
    })

    if (!masyarakat) {
      return NextResponse.json(
        { error: "Masyarakat not found" },
        { status: 404 }
      )
    }

    // Check if game exists
    const game = await prisma.gameEdukasi.findUnique({
      where: { id: gameId }
    })

    if (!game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      )
    }

    // Create game score
    const gameScore = await prisma.gameScore.create({
      data: {
        masyarakatId: masyarakat.id,
        gameId,
        score,
        waktuSelesai,
        achievement: achievement || null
      }
    })

    // Create notification for achievements
    if (achievement) {
      await prisma.notification.create({
        data: {
          masyarakatId: masyarakat.id,
          judul: "Achievement Unlocked!",
          pesan: `Selamat! Anda mendapat ${achievement} di game ${game.nama}`,
          tipe: "INFO"
        }
      })
    }

    return NextResponse.json(gameScore, { status: 201 })
  } catch (error) {
    console.error("Error saving game score:", error)
    return NextResponse.json(
      { error: "Failed to save score" },
      { status: 500 }
    )
  }
}