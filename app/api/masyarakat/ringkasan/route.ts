import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

// GET - ringkasan data diri + kondisi kesehatan terakhir untuk masyarakat yang login
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "MASYARAKAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const masyarakat = await prisma.masyarakat.findUnique({ where: { userId: session.user.id } })
    if (!masyarakat) return NextResponse.json({ error: "Masyarakat not found" }, { status: 404 })

    const [user, tekananDarah, kolesterol, stress] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { nama: true, email: true, tanggalLahir: true, jenisKelamin: true, nomorTelepon: true, alamat: true, pendidikanTerakhir: true, pekerjaan: true },
      }),
      prisma.tekananDarah.findFirst({ where: { masyarakatId: masyarakat.id }, orderBy: { tanggalPengukuran: "desc" } }),
      prisma.controlKolesterol.findFirst({ where: { masyarakatId: masyarakat.id }, orderBy: { tanggalPemeriksaan: "desc" } }),
      prisma.manajemenStress.findFirst({ where: { masyarakatId: masyarakat.id }, orderBy: { tanggalPenilaian: "desc" } }),
    ])

    return NextResponse.json({ dataDiri: user, tekananDarah, kolesterol, stress })
  } catch (error) {
    console.error("Error fetching ringkasan:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
