import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

function csvCell(v: unknown): string {
  const s = String(v ?? "")
  if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
  return s
}

function tgl(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Makassar",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(d)
}

// GET - unduh hasil kuisioner sebagai CSV (satu baris per responden)
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

    const header = ["Nama", "Tanggal", ...kuisioner.pertanyaan.map((p) => p.teks)]
    const rows = respon.map((r) => [
      r.masyarakat?.user?.nama || "Tanpa nama",
      tgl(r.createdAt),
      ...kuisioner.pertanyaan.map((p) => r.jawaban.find((j) => j.pertanyaanId === p.id)?.nilai ?? ""),
    ])

    const csv =
      "﻿" +
      [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n")

    const slug = (kuisioner.judul || "kuisioner").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "kuisioner"

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="hasil-${slug}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error exporting kuisioner:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
