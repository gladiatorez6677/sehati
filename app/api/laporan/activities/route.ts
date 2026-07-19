import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

const withUser = { masyarakat: { include: { user: { select: { nama: true } } } } }

function tdStatus(sistolik: number, diastolik: number) {
  if (sistolik >= 140 || diastolik >= 90) return "Hipertensi"
  if (sistolik < 120 && diastolik < 80) return "Normal"
  return "Prehipertensi"
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const [td, ms, kol] = await Promise.all([
      prisma.tekananDarah.findMany({
        take: 10,
        orderBy: { tanggalPengukuran: "desc" },
        include: withUser,
      }),
      prisma.manajemenStress.findMany({
        take: 10,
        orderBy: { tanggalPenilaian: "desc" },
        include: withUser,
      }),
      prisma.controlKolesterol.findMany({
        take: 10,
        orderBy: { tanggalPemeriksaan: "desc" },
        include: withUser,
      }),
    ])

    type Activity = {
      user: string
      type: string
      result: string
      date: string
      status: string
    }

    const activities: Activity[] = [
      ...td.map((r) => ({
        user: r.masyarakat?.user?.nama || "Pengguna",
        type: "Tekanan Darah",
        result: `${r.sistolik}/${r.diastolik} mmHg`,
        date: r.tanggalPengukuran.toISOString(),
        status: tdStatus(r.sistolik, r.diastolik),
      })),
      ...ms.map((r) => ({
        user: r.masyarakat?.user?.nama || "Pengguna",
        type: "Manajemen Stres",
        result: `Level ${r.levelStress}/10`,
        date: r.tanggalPenilaian.toISOString(),
        status: r.levelStress >= 7 ? "Tinggi" : r.levelStress >= 4 ? "Sedang" : "Rendah",
      })),
      ...kol.map((r) => ({
        user: r.masyarakat?.user?.nama || "Pengguna",
        type: "Kolesterol",
        result: `Total: ${r.totalKolesterol} mg/dL`,
        date: r.tanggalPemeriksaan.toISOString(),
        status:
          r.totalKolesterol < 200 ? "Normal" : r.totalKolesterol < 240 ? "Borderline" : "Tinggi",
      })),
    ]

    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json(activities.slice(0, 10))
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
  }
}
