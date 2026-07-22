import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// GET - daftar kuisioner aktif untuk masyarakat + status sudah diisi
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "MASYARAKAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const masyarakat = await prisma.masyarakat.findUnique({ where: { userId: session.user.id } })
    if (!masyarakat) return NextResponse.json({ error: "Masyarakat not found" }, { status: 404 })

    const items = await prisma.kuisioner.findMany({
      where: { aktif: true },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { pertanyaan: true } },
        respon: { where: { masyarakatId: masyarakat.id }, select: { id: true } },
      },
    })

    const data = items.map((k) => ({
      id: k.id,
      judul: k.judul,
      deskripsi: k.deskripsi,
      jumlahPertanyaan: k._count.pertanyaan,
      sudahDiisi: k.respon.length > 0,
    }))
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching kuisioner masyarakat:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
