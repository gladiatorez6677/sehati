import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// GET - Get all consultations for perawat monitoring
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get all consultations with user info
    const consultations = await prisma.konsultasiAI.findMany({
      include: {
        masyarakat: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              }
            }
          }
        }
      },
      orderBy: [
        { eskalasi: 'desc' },     // Prioritize escalated consultations
        { status: 'asc' },        // Active consultations first
        { updatedAt: 'desc' }     // Most recent first
      ]
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