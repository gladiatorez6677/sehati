import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// GET - Ambil semua artikel milik perawat yang login
export async function GET(req: NextRequest) {
  try {
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

    // Get articles
    const articles = await prisma.artikelKesehatan.findMany({
      where: {
        perawatId: perawat.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(articles)
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    )
  }
}