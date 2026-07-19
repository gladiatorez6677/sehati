import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// GET - Ambil profil user yang sedang login
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        nama: true,
        email: true,
        nomorTelepon: true,
        alamat: true,
        role: true,
        perawat: { select: { nomorSTR: true, spesialisasi: true } },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

// PUT - Perbarui profil user
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { nama, nomorTelepon, alamat, spesialisasi } = body

    if (!nama || !nama.trim()) {
      return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 })
    }
    if (!nomorTelepon || !nomorTelepon.trim()) {
      return NextResponse.json({ error: "Nomor telepon wajib diisi" }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        nama: nama.trim(),
        nomorTelepon: nomorTelepon.trim(),
        alamat: alamat?.trim() || null,
      },
    })

    // Update data khusus perawat
    if (session.user.role === "PERAWAT" && typeof spesialisasi === "string") {
      await prisma.perawat.updateMany({
        where: { userId: session.user.id },
        data: { spesialisasi: spesialisasi.trim() },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
