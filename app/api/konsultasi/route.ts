import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// GET - Ambil riwayat konsultasi
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

    // Get consultations
    const consultations = await prisma.konsultasiAI.findMany({
      where: { masyarakatId: masyarakat.id },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json(consultations)
  } catch (error) {
    console.error("Error fetching consultations:", error)
    return NextResponse.json(
      { error: "Failed to fetch consultations" },
      { status: 500 }
    )
  }
}

// POST - Mulai konsultasi baru
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
    const { topik } = body

    if (!topik) {
      return NextResponse.json(
        { error: "Topic required" },
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

    // Create new consultation
    const consultation = await prisma.konsultasiAI.create({
      data: {
        masyarakatId: masyarakat.id,
        topik,
        messages: [],
        status: "ACTIVE"
      }
    })

    return NextResponse.json(consultation, { status: 201 })
  } catch (error) {
    console.error("Error creating consultation:", error)
    return NextResponse.json(
      { error: "Failed to create consultation" },
      { status: 500 }
    )
  }
}