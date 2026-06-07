import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// GET - Ambil riwayat sesi relaksasi user
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

    // Get session history
    const sesiRelaksasi = await prisma.sesiRelaksasi.findMany({
      where: { masyarakatId: masyarakat.id },
      include: {
        relaksasi: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json(sesiRelaksasi)
  } catch (error) {
    console.error("Error fetching relaxation sessions:", error)
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    )
  }
}

// POST - Mulai sesi relaksasi baru
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
    const { relaksasiId } = body

    if (!relaksasiId) {
      return NextResponse.json(
        { error: "Relaxation ID required" },
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

    // Check if relaxation exists
    const relaksasi = await prisma.relaksasi.findUnique({
      where: { id: relaksasiId }
    })

    if (!relaksasi) {
      return NextResponse.json(
        { error: "Relaxation not found" },
        { status: 404 }
      )
    }

    // Create new session
    const sesiRelaksasi = await prisma.sesiRelaksasi.create({
      data: {
        masyarakatId: masyarakat.id,
        relaksasiId,
        durasi: 0,
        selesai: false
      }
    })

    return NextResponse.json(sesiRelaksasi, { status: 201 })
  } catch (error) {
    console.error("Error creating relaxation session:", error)
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    )
  }
}