import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"
import { startOfWeek, startOfMonth, startOfYear, subMonths } from "date-fns"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only allow PERAWAT role
    if (session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const searchParams = req.nextUrl.searchParams
    const range = searchParams.get("range") || "week"

    // Calculate date range
    const now = new Date()
    let startDate: Date
    
    switch (range) {
      case "week":
        startDate = startOfWeek(now, { weekStartsOn: 1 })
        break
      case "month":
        startDate = startOfMonth(now)
        break
      case "quarter":
        startDate = subMonths(startOfMonth(now), 2)
        break
      case "year":
        startDate = startOfYear(now)
        break
      default:
        startDate = startOfWeek(now, { weekStartsOn: 1 })
    }

    // Get user statistics
    const [totalUsers, totalMasyarakat, totalPerawat] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "MASYARAKAT" } }),
      prisma.user.count({ where: { role: "PERAWAT" } }),
    ])

    // Get new users this month
    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: startOfMonth(now),
        },
      },
    })

    // Get health check records (simulated data for now)
    // In a real app, these would come from actual health check tables
    const tekananDarahRecords = Math.floor(Math.random() * 200) + 100
    const stressAssessments = Math.floor(Math.random() * 150) + 80
    const cholesterolChecks = Math.floor(Math.random() * 100) + 50
    const activeConsultations = Math.floor(Math.random() * 20) + 5

    const stats = {
      totalUsers,
      totalMasyarakat,
      totalPerawat,
      newUsersThisMonth,
      tekananDarahRecords,
      stressAssessments,
      cholesterolChecks,
      activeConsultations,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}