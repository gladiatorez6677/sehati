import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

function normalizeJam(jam: unknown): string {
  const arr = Array.isArray(jam) ? jam : String(jam || "").split(",")
  const valid = arr.map((j) => String(j).trim()).filter((j) => /^([01]\d|2[0-3]):[0-5]\d$/.test(j))
  return Array.from(new Set(valid)).sort().join(",")
}
function normalizeHari(hari: unknown): string {
  const arr = Array.isArray(hari) ? hari : String(hari || "").split(",")
  const valid = arr.map((h) => String(h).trim()).filter((h) => /^[0-6]$/.test(h))
  return valid.length ? Array.from(new Set(valid)).sort().join(",") : "0,1,2,3,4,5,6"
}

async function ownOrNull(userId: string, id: string) {
  const masyarakat = await prisma.masyarakat.findUnique({ where: { userId } })
  if (!masyarakat) return null
  const item = await prisma.pengingatObat.findFirst({ where: { id, masyarakatId: masyarakat.id } })
  return item
}

// PUT - ubah / toggle aktif
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "MASYARAKAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const existing = await ownOrNull(session.user.id, id)
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const body = await req.json()
    const data: Record<string, unknown> = {}
    if (typeof body.aktif === "boolean") data.aktif = body.aktif
    if (body.namaObat !== undefined) data.namaObat = String(body.namaObat).trim()
    if (body.dosis !== undefined) data.dosis = body.dosis ? String(body.dosis).trim() : null
    if (body.catatan !== undefined) data.catatan = body.catatan ? String(body.catatan).trim() : null
    if (body.jam !== undefined) {
      const jam = normalizeJam(body.jam)
      if (!jam) return NextResponse.json({ error: "Jam tidak valid" }, { status: 400 })
      data.jam = jam
    }
    if (body.hari !== undefined) data.hari = normalizeHari(body.hari)

    const item = await prisma.pengingatObat.update({ where: { id }, data })
    return NextResponse.json(item)
  } catch (error) {
    console.error("Error updating pengingat:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

// DELETE
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "MASYARAKAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const existing = await ownOrNull(session.user.id, id)
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    await prisma.pengingatObat.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting pengingat:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
