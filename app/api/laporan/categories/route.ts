import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Distribusi jumlah pemeriksaan per jenis (real)
    const [td, ms, kol] = await Promise.all([
      prisma.tekananDarah.count(),
      prisma.manajemenStress.count(),
      prisma.controlKolesterol.count(),
    ])

    const categories = [
      { kategori: "Tekanan Darah", count: td },
      { kategori: "Manajemen Stres", count: ms },
      { kategori: "Kolesterol", count: kol },
    ]

    const total = categories.reduce((sum, c) => sum + c.count, 0)
    const categoryData = categories.map((c) => ({
      ...c,
      percentage: total > 0 ? Math.round((c.count / total) * 100) : 0,
    }))

    return NextResponse.json(categoryData)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
