import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

interface PertanyaanInput {
  teks: string
  tipe: "PILIHAN" | "TEKS"
  opsi?: string[]
}

// GET - detail kuisioner + pertanyaan. Perawat: miliknya. Masyarakat: hanya yang aktif.
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { id } = await params

    const kuisioner = await prisma.kuisioner.findUnique({
      where: { id },
      include: {
        pertanyaan: { orderBy: { urutan: "asc" } },
        _count: { select: { respon: true } },
      },
    })
    if (!kuisioner) return NextResponse.json({ error: "Not found" }, { status: 404 })

    if (session.user.role === "MASYARAKAT" && !kuisioner.aktif) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const data = {
      ...kuisioner,
      jumlahResponden: kuisioner._count.respon,
      pertanyaan: kuisioner.pertanyaan.map((p) => ({
        id: p.id,
        teks: p.teks,
        tipe: p.tipe,
        urutan: p.urutan,
        opsi: p.opsi ? (JSON.parse(p.opsi) as string[]) : [],
      })),
    }
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching kuisioner detail:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

async function ownedOrNull(userId: string, id: string) {
  const perawat = await prisma.perawat.findUnique({ where: { userId } })
  if (!perawat) return null
  return prisma.kuisioner.findFirst({
    where: { id, perawatId: perawat.id },
    include: { _count: { select: { respon: true } } },
  })
}

// PUT - update meta; ganti pertanyaan hanya bila belum ada responden
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const existing = await ownedOrNull(session.user.id, id)
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const body = await req.json()
    const data: Record<string, unknown> = {}
    if (body.judul !== undefined) data.judul = String(body.judul).trim()
    if (body.deskripsi !== undefined) data.deskripsi = body.deskripsi ? String(body.deskripsi).trim() : null
    if (typeof body.aktif === "boolean") data.aktif = body.aktif

    await prisma.kuisioner.update({ where: { id }, data })

    // Ganti pertanyaan hanya jika dikirim DAN belum ada responden (agar data jawaban tidak hilang)
    if (Array.isArray(body.pertanyaan) && existing._count.respon === 0) {
      const clean = (body.pertanyaan as PertanyaanInput[])
        .map((p) => ({
          teks: String(p.teks || "").trim(),
          tipe: p.tipe === "TEKS" ? "TEKS" : "PILIHAN",
          opsi: Array.isArray(p.opsi) ? p.opsi.map((o) => String(o).trim()).filter(Boolean) : [],
        }))
        .filter((p) => p.teks)
      if (clean.length > 0) {
        await prisma.pertanyaanKuisioner.deleteMany({ where: { kuisionerId: id } })
        await prisma.pertanyaanKuisioner.createMany({
          data: clean.map((p, i) => ({
            kuisionerId: id,
            teks: p.teks,
            tipe: p.tipe as "PILIHAN" | "TEKS",
            opsi: p.tipe === "PILIHAN" ? JSON.stringify(p.opsi) : null,
            urutan: i,
          })),
        })
      }
    }

    const updated = await prisma.kuisioner.findUnique({
      where: { id },
      include: { pertanyaan: { orderBy: { urutan: "asc" } } },
    })
    return NextResponse.json({
      ...updated,
      lockedQuestions: existing._count.respon > 0,
    })
  } catch (error) {
    console.error("Error updating kuisioner:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

// DELETE
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const existing = await ownedOrNull(session.user.id, id)
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
    await prisma.kuisioner.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting kuisioner:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
