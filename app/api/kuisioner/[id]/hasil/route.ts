import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// GET - hasil kuisioner untuk perawat (per responden + ringkasan)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const perawat = await prisma.perawat.findUnique({ where: { userId: session.user.id } })
    if (!perawat) return NextResponse.json({ error: "Perawat not found" }, { status: 404 })

    const { id } = await params
    const kuisioner = await prisma.kuisioner.findFirst({
      where: { id, perawatId: perawat.id },
      include: { pertanyaan: { orderBy: { urutan: "asc" } } },
    })
    if (!kuisioner) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const respon = await prisma.responKuisioner.findMany({
      where: { kuisionerId: id },
      orderBy: { createdAt: "desc" },
      include: {
        jawaban: true,
        masyarakat: { include: { user: { select: { nama: true } } } },
      },
    })

    const pertanyaan = kuisioner.pertanyaan.map((p) => ({
      id: p.id,
      teks: p.teks,
      tipe: p.tipe,
      opsi: p.opsi ? (JSON.parse(p.opsi) as string[]) : [],
    }))

    // Ringkasan per pertanyaan
    const ringkasan = pertanyaan.map((p) => {
      const jawabanUntukP = respon
        .flatMap((r) => r.jawaban)
        .filter((j) => j.pertanyaanId === p.id)
        .map((j) => j.nilai)

      if (p.tipe === "PILIHAN") {
        const counts: Record<string, number> = {}
        for (const o of p.opsi) counts[o] = 0
        for (const nilai of jawabanUntukP) {
          counts[nilai] = (counts[nilai] || 0) + 1
        }
        const total = jawabanUntukP.length
        return {
          pertanyaanId: p.id,
          teks: p.teks,
          tipe: p.tipe,
          total,
          opsi: p.opsi.map((o) => ({
            label: o,
            jumlah: counts[o] || 0,
            persen: total > 0 ? Math.round(((counts[o] || 0) / total) * 100) : 0,
          })),
        }
      }
      return {
        pertanyaanId: p.id,
        teks: p.teks,
        tipe: p.tipe,
        total: jawabanUntukP.length,
        jawabanTeks: jawabanUntukP,
      }
    })

    // Per responden
    const responden = respon.map((r) => ({
      id: r.id,
      nama: r.masyarakat?.user?.nama || "Tanpa nama",
      createdAt: r.createdAt,
      jawaban: pertanyaan.map((p) => ({
        pertanyaanId: p.id,
        teks: p.teks,
        nilai: r.jawaban.find((j) => j.pertanyaanId === p.id)?.nilai ?? "-",
      })),
    }))

    return NextResponse.json({
      judul: kuisioner.judul,
      deskripsi: kuisioner.deskripsi,
      totalResponden: respon.length,
      pertanyaan,
      ringkasan,
      responden,
    })
  } catch (error) {
    console.error("Error fetching hasil:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
