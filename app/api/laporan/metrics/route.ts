import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

function pct(count: number, total: number) {
  return total > 0 ? Math.round((count / total) * 100) : 0
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
      prisma.tekananDarah.findMany({ select: { sistolik: true, diastolik: true } }),
      prisma.manajemenStress.findMany({ select: { levelStress: true } }),
      prisma.controlKolesterol.findMany({ select: { totalKolesterol: true } }),
    ])

    // Tekanan darah: Normal (<120/<80), Hipertensi (>=140 atau >=90), sisanya Prehipertensi
    let tdNormal = 0,
      tdPre = 0,
      tdHiper = 0
    for (const r of td) {
      if (r.sistolik >= 140 || r.diastolik >= 90) tdHiper++
      else if (r.sistolik < 120 && r.diastolik < 80) tdNormal++
      else tdPre++
    }

    // Level stres: Rendah (1-3), Sedang (4-6), Tinggi (7-10)
    let sRendah = 0,
      sSedang = 0,
      sTinggi = 0
    for (const r of ms) {
      if (r.levelStress <= 3) sRendah++
      else if (r.levelStress <= 6) sSedang++
      else sTinggi++
    }

    // Kolesterol total: Normal (<200), Borderline (200-239), Tinggi (>=240)
    let kNormal = 0,
      kBorder = 0,
      kTinggi = 0
    for (const r of kol) {
      if (r.totalKolesterol < 200) kNormal++
      else if (r.totalKolesterol < 240) kBorder++
      else kTinggi++
    }

    return NextResponse.json({
      tekananDarah: {
        total: td.length,
        items: [
          { label: "Normal", count: tdNormal, pct: pct(tdNormal, td.length) },
          { label: "Prehipertensi", count: tdPre, pct: pct(tdPre, td.length) },
          { label: "Hipertensi", count: tdHiper, pct: pct(tdHiper, td.length) },
        ],
      },
      stress: {
        total: ms.length,
        items: [
          { label: "Rendah", count: sRendah, pct: pct(sRendah, ms.length) },
          { label: "Sedang", count: sSedang, pct: pct(sSedang, ms.length) },
          { label: "Tinggi", count: sTinggi, pct: pct(sTinggi, ms.length) },
        ],
      },
      kolesterol: {
        total: kol.length,
        items: [
          { label: "Normal", count: kNormal, pct: pct(kNormal, kol.length) },
          { label: "Borderline", count: kBorder, pct: pct(kBorder, kol.length) },
          { label: "Tinggi", count: kTinggi, pct: pct(kTinggi, kol.length) },
        ],
      },
    })
  } catch (error) {
    console.error("Error fetching metrics:", error)
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}
