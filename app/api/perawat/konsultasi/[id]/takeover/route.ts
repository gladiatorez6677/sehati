import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// POST - Take over a consultation
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get perawat ID
    const perawat = await prisma.perawat.findUnique({
      where: { userId: session.user.id }
    })

    if (!perawat) {
      return NextResponse.json(
        { error: "Perawat not found" },
        { status: 404 }
      )
    }

    // Update consultation status to escalated and assign perawat
    const consultation = await prisma.konsultasiAI.update({
      where: { id },
      data: {
        status: "ESCALATED",
        eskalasi: false, // Reset escalation flag since it's being handled
        messages: {
          push: {
            id: Date.now().toString(),
            role: "system",
            content: `Konsultasi diambil alih oleh ${session.user.name}. Anda sekarang terhubung dengan tenaga kesehatan profesional.`,
            timestamp: new Date()
          }
        }
      }
    })

    // Create notification for masyarakat
    await prisma.notification.create({
      data: {
        masyarakatId: consultation.masyarakatId,
        judul: "Konsultasi Diambil Alih",
        pesan: `Konsultasi Anda tentang "${consultation.topik}" telah diambil alih oleh perawat ${session.user.name}`,
        tipe: "INFO"
      }
    })

    return NextResponse.json({
      message: "Consultation taken over successfully",
      consultation
    })
  } catch (error) {
    console.error("Error taking over consultation:", error)
    return NextResponse.json(
      { error: "Failed to take over consultation" },
      { status: 500 }
    )
  }
}