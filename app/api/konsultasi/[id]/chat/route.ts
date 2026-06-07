import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"
import { generateHealthResponse, checkEmergencyKeywords } from "@/lib/gemini"

// POST - Send message in consultation
export async function POST(
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
    const { message, messages } = body

    if (!message) {
      return NextResponse.json(
        { error: "Message required" },
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

    // Get consultation
    const consultation = await prisma.konsultasiAI.findFirst({
      where: {
        id: id,
        masyarakatId: masyarakat.id,
        status: "ACTIVE"
      }
    })

    if (!consultation) {
      return NextResponse.json(
        { error: "Active consultation not found" },
        { status: 404 }
      )
    }

    // Generate AI response using Gemini
    const previousMessages = messages || (consultation.messages as Array<{id: string, role: string, content: string, timestamp: Date}>) || []
    const aiResponse = await generateHealthResponse(message, consultation.topik, previousMessages)

    // Update messages
    const updatedMessages = [
      ...previousMessages,
      {
        id: Date.now().toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date()
      }
    ]

    // Update consultation
    await prisma.konsultasiAI.update({
      where: { id: id },
      data: {
        messages: updatedMessages
      }
    })

    // Check if escalation needed using improved emergency detection
    const needsEscalation = checkEmergencyKeywords(message)

    if (needsEscalation) {
      await prisma.konsultasiAI.update({
        where: { id: id },
        data: { eskalasi: true }
      })

      await prisma.notification.create({
        data: {
          masyarakatId: masyarakat.id,
          judul: "Perhatian: Kondisi Darurat",
          pesan: "Berdasarkan konsultasi Anda, kami sarankan untuk segera menghubungi layanan kesehatan terdekat.",
          tipe: "ALERT"
        }
      })
    }

    return NextResponse.json({ reply: aiResponse })
  } catch (error) {
    console.error("Error in chat:", error)
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    )
  }
}