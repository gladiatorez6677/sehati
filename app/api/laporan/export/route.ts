import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"
import { format, startOfWeek, startOfMonth, startOfYear, subMonths } from "date-fns"
import { id } from "date-fns/locale"

function pct(count: number, total: number) {
  return total > 0 ? Math.round((count / total) * 100) : 0
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const type = req.nextUrl.searchParams.get("type") || "overview"
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

    const withUser = { masyarakat: { include: { user: { select: { nama: true } } } } }

    const [
      totalUsers,
      totalMasyarakat,
      totalPerawat,
      newUsersThisMonth,
      tdCount,
      msCount,
      kolCount,
      activeConsultations,
      tdAll,
      msAll,
      kolAll,
      tdRecent,
      msRecent,
      kolRecent,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "MASYARAKAT" } }),
      prisma.user.count({ where: { role: "PERAWAT" } }),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth(now) } } }),
      prisma.tekananDarah.count({ where: { tanggalPengukuran: { gte: startDate } } }),
      prisma.manajemenStress.count({ where: { tanggalPenilaian: { gte: startDate } } }),
      prisma.controlKolesterol.count({ where: { tanggalPemeriksaan: { gte: startDate } } }),
      prisma.konsultasiAI.count({ where: { status: "ACTIVE" } }),
      prisma.tekananDarah.findMany({ select: { sistolik: true, diastolik: true } }),
      prisma.manajemenStress.findMany({ select: { levelStress: true } }),
      prisma.controlKolesterol.findMany({ select: { totalKolesterol: true } }),
      prisma.tekananDarah.findMany({ take: 5, orderBy: { tanggalPengukuran: "desc" }, include: withUser }),
      prisma.manajemenStress.findMany({ take: 5, orderBy: { tanggalPenilaian: "desc" }, include: withUser }),
      prisma.controlKolesterol.findMany({ take: 5, orderBy: { tanggalPemeriksaan: "desc" }, include: withUser }),
    ])

    // Distribusi tekanan darah
    let tdNormal = 0, tdPre = 0, tdHiper = 0
    for (const r of tdAll) {
      if (r.sistolik >= 140 || r.diastolik >= 90) tdHiper++
      else if (r.sistolik < 120 && r.diastolik < 80) tdNormal++
      else tdPre++
    }
    // Distribusi stres
    let sRendah = 0, sSedang = 0, sTinggi = 0
    for (const r of msAll) {
      if (r.levelStress <= 3) sRendah++
      else if (r.levelStress <= 6) sSedang++
      else sTinggi++
    }
    // Distribusi kolesterol
    let kNormal = 0, kBorder = 0, kTinggi = 0
    for (const r of kolAll) {
      if (r.totalKolesterol < 200) kNormal++
      else if (r.totalKolesterol < 240) kBorder++
      else kTinggi++
    }

    const recent = [
      ...tdRecent.map((r) => ({
        nama: r.masyarakat?.user?.nama || "Pengguna",
        text: `Tekanan Darah: ${r.sistolik}/${r.diastolik} mmHg`,
        date: r.tanggalPengukuran,
      })),
      ...msRecent.map((r) => ({
        nama: r.masyarakat?.user?.nama || "Pengguna",
        text: `Manajemen Stres: Level ${r.levelStress}/10`,
        date: r.tanggalPenilaian,
      })),
      ...kolRecent.map((r) => ({
        nama: r.masyarakat?.user?.nama || "Pengguna",
        text: `Kolesterol: Total ${r.totalKolesterol} mg/dL`,
        date: r.tanggalPemeriksaan,
      })),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10)

    const typeLabel =
      type === "overview" ? "Overview" : type === "health" ? "Kesehatan" : type === "users" ? "Pengguna" : "Aktivitas"
    const rangeLabel =
      range === "week" ? "Minggu Ini" : range === "month" ? "Bulan Ini" : range === "quarter" ? "3 Bulan" : "Tahun Ini"

    const report = `LAPORAN KESEHATAN SEHATKI
========================

Jenis Laporan: ${typeLabel}
Periode: ${rangeLabel}
Tanggal Cetak: ${format(now, "dd MMMM yyyy HH:mm", { locale: id })}
Dicetak oleh: ${session.user.name} (${session.user.role})

========================
RINGKASAN STATISTIK
========================

Total Pengguna: ${totalUsers}
- Masyarakat: ${totalMasyarakat}
- Perawat: ${totalPerawat}

Pengguna Baru (Bulan Ini): ${newUsersThisMonth}

Total Pemeriksaan (${rangeLabel}):
- Tekanan Darah: ${tdCount} pemeriksaan
- Manajemen Stres: ${msCount} pemeriksaan
- Kolesterol: ${kolCount} pemeriksaan
- Total: ${tdCount + msCount + kolCount} pemeriksaan

Konsultasi Aktif: ${activeConsultations}

========================
DISTRIBUSI KESEHATAN (keseluruhan)
========================

Tekanan Darah (${tdAll.length} data):
- Normal: ${pct(tdNormal, tdAll.length)}% (${tdNormal})
- Prehipertensi: ${pct(tdPre, tdAll.length)}% (${tdPre})
- Hipertensi: ${pct(tdHiper, tdAll.length)}% (${tdHiper})

Level Stres (${msAll.length} data):
- Rendah: ${pct(sRendah, msAll.length)}% (${sRendah})
- Sedang: ${pct(sSedang, msAll.length)}% (${sSedang})
- Tinggi: ${pct(sTinggi, msAll.length)}% (${sTinggi})

Kolesterol (${kolAll.length} data):
- Normal: ${pct(kNormal, kolAll.length)}% (${kNormal})
- Borderline: ${pct(kBorder, kolAll.length)}% (${kBorder})
- Tinggi: ${pct(kTinggi, kolAll.length)}% (${kTinggi})

========================
AKTIVITAS TERBARU
========================

${recent.length === 0
        ? "(Belum ada data pemeriksaan)"
        : recent
            .map(
              (a, i) =>
                `${i + 1}. ${a.nama} - ${a.text} (${format(a.date, "dd MMM yyyy HH:mm", { locale: id })})`
            )
            .join("\n")}

========================

Laporan ini digenerate secara otomatis oleh sistem SehatKi.
`

    return new NextResponse(report, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="laporan-${type}-${range}-${format(now, "yyyy-MM-dd")}.txt"`,
      },
    })
  } catch (error) {
    console.error("Error generating export:", error)
    return NextResponse.json({ error: "Failed to generate export" }, { status: 500 })
  }
}
