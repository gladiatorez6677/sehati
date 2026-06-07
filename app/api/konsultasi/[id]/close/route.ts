import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// PUT - Close consultation
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Check if consultation belongs to this user
    const consultation = await prisma.konsultasiAI.findFirst({
      where: {
        id: id,
        masyarakatId: masyarakat.id
      }
    })

    if (!consultation) {
      return NextResponse.json(
        { error: "Consultation not found" },
        { status: 404 }
      )
    }

    // Close consultation
    const updated = await prisma.konsultasiAI.update({
      where: { id: id },
      data: {
        status: "CLOSED"
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error closing consultation:", error)
    return NextResponse.json(
      { error: "Failed to close consultation" },
      { status: 500 }
    )
  }
}