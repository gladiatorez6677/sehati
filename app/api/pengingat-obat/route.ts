import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

async function getMasyarakat(userId: string) {
  return prisma.masyarakat.findUnique({ where: { userId } })
}

function normalizeJam(jam: unknown): string {
  const arr = Array.isArray(jam) ? jam : String(jam || "").split(",")
  const valid = arr
    .map((j) => String(j).trim())
    .filter((j) => /^([01]\d|2[0-3]):[0-5]\d$/.test(j))
  return Array.from(new Set(valid)).sort().join(",")
}

function normalizeHari(hari: unknown): string {
  const arr = Array.isArray(hari) ? hari : String(hari || "").split(",")
  const valid = arr
    .map((h) => String(h).trim())
    .filter((h) => /^[0-6]$/.test(h))
  return valid.length ? Array.from(new Set(valid)).sort().join(",") : "0,1,2,3,4,5,6"
}

// GET - daftar pengingat milik user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "MASYARAKAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const masyarakat = await getMasyarakat(session.user.id)
    if (!masyarakat) {
      return NextResponse.json({ error: "Masyarakat not found" }, { status: 404 })
    }

    const items = await prisma.pengingatObat.findMany({
      where: { masyarakatId: masyarakat.id },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching pengingat:", error)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

// POST - buat pengingat baru
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "MASYARAKAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const masyarakat = await getMasyarakat(session.user.id)
    if (!masyarakat) {
      return NextResponse.json({ error: "Masyarakat not found" }, { status: 404 })
    }

    const body = await req.json()
    const namaObat = String(body.namaObat || "").trim()
    const jam = normalizeJam(body.jam)

    if (!namaObat) {
      return NextResponse.json({ error: "Nama obat wajib diisi" }, { status: 400 })
    }
    if (!jam) {
      return NextResponse.json({ error: "Minimal satu jam pengingat wajib diisi" }, { status: 400 })
    }

    const item = await prisma.pengingatObat.create({
      data: {
        masyarakatId: masyarakat.id,
        namaObat,
        dosis: body.dosis ? String(body.dosis).trim() : null,
        catatan: body.catatan ? String(body.catatan).trim() : null,
        jam,
        hari: normalizeHari(body.hari),
        aktif: body.aktif === false ? false : true,
      },
    })
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("Error creating pengingat:", error)
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}
