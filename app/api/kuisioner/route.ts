import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

interface PertanyaanInput {
  teks: string
  tipe: "PILIHAN" | "TEKS"
  opsi?: string[]
}

// GET - daftar kuisioner milik perawat (dengan jumlah pertanyaan & responden)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const perawat = await prisma.perawat.findUnique({ where: { userId: session.user.id } })
    if (!perawat) return NextResponse.json({ error: "Perawat not found" }, { status: 404 })

    const items = await prisma.kuisioner.findMany({
      where: { perawatId: perawat.id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { pertanyaan: true, respon: true } } },
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching kuisioner:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

// POST - buat kuisioner + pertanyaan
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const perawat = await prisma.perawat.findUnique({ where: { userId: session.user.id } })
    if (!perawat) return NextResponse.json({ error: "Perawat not found" }, { status: 404 })

    const body = await req.json()
    const judul = String(body.judul || "").trim()
    const pertanyaan: PertanyaanInput[] = Array.isArray(body.pertanyaan) ? body.pertanyaan : []

    if (!judul) return NextResponse.json({ error: "Judul wajib diisi" }, { status: 400 })
    const clean = pertanyaan
      .map((p) => ({
        teks: String(p.teks || "").trim(),
        tipe: p.tipe === "TEKS" ? "TEKS" : "PILIHAN",
        opsi: Array.isArray(p.opsi) ? p.opsi.map((o) => String(o).trim()).filter(Boolean) : [],
      }))
      .filter((p) => p.teks)
    if (clean.length === 0) {
      return NextResponse.json({ error: "Minimal satu pertanyaan" }, { status: 400 })
    }
    for (const p of clean) {
      if (p.tipe === "PILIHAN" && p.opsi.length < 2) {
        return NextResponse.json({ error: `Pertanyaan pilihan "${p.teks}" butuh minimal 2 opsi` }, { status: 400 })
      }
    }

    const created = await prisma.kuisioner.create({
      data: {
        perawatId: perawat.id,
        judul,
        deskripsi: body.deskripsi ? String(body.deskripsi).trim() : null,
        aktif: body.aktif === false ? false : true,
        pertanyaan: {
          create: clean.map((p, i) => ({
            teks: p.teks,
            tipe: p.tipe as "PILIHAN" | "TEKS",
            opsi: p.tipe === "PILIHAN" ? JSON.stringify(p.opsi) : null,
            urutan: i,
          })),
        },
      },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("Error creating kuisioner:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
