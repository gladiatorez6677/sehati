import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Generate category distribution data
    // In a real app, this would come from actual health check data
    const categories = [
      { kategori: "Tekanan Darah", count: 156 },
      { kategori: "Manajemen Stres", count: 124 },
      { kategori: "Kolesterol", count: 89 },
      { kategori: "Gula Darah", count: 67 },
      { kategori: "BMI", count: 45 },
    ]

    // Calculate percentages
    const total = categories.reduce((sum, cat) => sum + cat.count, 0)
    const categoryData = categories.map(cat => ({
      ...cat,
      percentage: Math.round((cat.count / total) * 100),
    }))

    return NextResponse.json(categoryData)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}