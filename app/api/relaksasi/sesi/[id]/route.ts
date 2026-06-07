import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// PUT - Update sesi relaksasi (complete session)
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

    const body = await req.json()
    const { durasi, selesai, feedback } = body

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

    // Check if session belongs to this user
    const existingSession = await prisma.sesiRelaksasi.findFirst({
      where: {
        id: id,
        masyarakatId: masyarakat.id
      },
      include: {
        relaksasi: true
      }
    })

    if (!existingSession) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    // Update session
    const updatedSession = await prisma.sesiRelaksasi.update({
      where: { id: id },
      data: {
        durasi: durasi || existingSession.durasi,
        selesai: selesai !== undefined ? selesai : existingSession.selesai,
        feedback: feedback || existingSession.feedback
      }
    })

    // Create notification for completed sessions
    if (selesai && durasi >= existingSession.relaksasi.durasi * 0.8) {
      await prisma.notification.create({
        data: {
          masyarakatId: masyarakat.id,
          judul: "Sesi Relaksasi Selesai",
          pesan: `Selamat! Anda telah menyelesaikan sesi "${existingSession.relaksasi.judul}". Terus jaga kesehatan mental Anda!`,
          tipe: "INFO"
        }
      })
    }

    return NextResponse.json(updatedSession)
  } catch (error) {
    console.error("Error updating relaxation session:", error)
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    )
  }
}