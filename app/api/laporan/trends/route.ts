import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"
import {
  format,
  eachDayOfInterval,
  startOfWeek,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns"

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
    let intervalDays = 1
    switch (range) {
      case "week":
        startDate = startOfWeek(now, { weekStartsOn: 1 })
        intervalDays = 1
        break
      case "month":
        startDate = startOfMonth(now)
        intervalDays = 3
        break
      case "quarter":
        startDate = subMonths(startOfMonth(now), 2)
        intervalDays = 7
        break
      case "year":
        startDate = startOfYear(now)
        intervalDays = 30
        break
      default:
        startDate = startOfWeek(now, { weekStartsOn: 1 })
        intervalDays = 1
    }

    // Titik awal tiap bucket
    const bucketStarts = eachDayOfInterval({ start: startDate, end: now }).filter(
      (_, i) => i % intervalDays === 0
    )

    // Ambil tanggal-tanggal pemeriksaan yang diinput masyarakat dalam periode
    const [td, ms, kol] = await Promise.all([
      prisma.tekananDarah.findMany({
        where: { tanggalPengukuran: { gte: startDate } },
        select: { tanggalPengukuran: true },
      }),
      prisma.manajemenStress.findMany({
        where: { tanggalPenilaian: { gte: startDate } },
        select: { tanggalPenilaian: true },
      }),
      prisma.controlKolesterol.findMany({
        where: { tanggalPemeriksaan: { gte: startDate } },
        select: { tanggalPemeriksaan: true },
      }),
    ])

    const tdDates = td.map((r) => r.tanggalPengukuran.getTime())
    const msDates = ms.map((r) => r.tanggalPenilaian.getTime())
    const kolDates = kol.map((r) => r.tanggalPemeriksaan.getTime())

    // Batas akhir tiap bucket
    const bounds = bucketStarts.map((d) => d.getTime())
    const countInBucket = (arr: number[], i: number) => {
      const lo = bounds[i]
      const hi = i + 1 < bounds.length ? bounds[i + 1] : Infinity
      return arr.filter((t) => t >= lo && t < hi).length
    }

    const trends = bucketStarts.map((date, i) => ({
      date: format(date, "yyyy-MM-dd"),
      tekananDarah: countInBucket(tdDates, i),
      stress: countInBucket(msDates, i),
      kolesterol: countInBucket(kolDates, i),
    }))

    return NextResponse.json(trends)
  } catch (error) {
    console.error("Error fetching trends:", error)
    return NextResponse.json({ error: "Failed to fetch trends" }, { status: 500 })
  }
}
