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
    if (session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const range = req.nextUrl.searchParams.get("range") || "week"
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

    // Statistik pengguna (real)
    const [totalUsers, totalMasyarakat, totalPerawat] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "MASYARAKAT" } }),
      prisma.user.count({ where: { role: "PERAWAT" } }),
    ])

    const newUsersThisMonth = await prisma.user.count({
      where: { createdAt: { gte: startOfMonth(now) } },
    })

    // Pemeriksaan yang diinput masyarakat dalam periode (real)
    const [
      tekananDarahRecords,
      stressAssessments,
      cholesterolChecks,
      activeConsultations,
    ] = await Promise.all([
      prisma.tekananDarah.count({ where: { tanggalPengukuran: { gte: startDate } } }),
      prisma.manajemenStress.count({ where: { tanggalPenilaian: { gte: startDate } } }),
      prisma.controlKolesterol.count({ where: { tanggalPemeriksaan: { gte: startDate } } }),
      prisma.konsultasiAI.count({ where: { status: "ACTIVE" } }),
    ])

    return NextResponse.json({
      totalUsers,
      totalMasyarakat,
      totalPerawat,
      newUsersThisMonth,
      tekananDarahRecords,
      stressAssessments,
      cholesterolChecks,
      activeConsultations,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
