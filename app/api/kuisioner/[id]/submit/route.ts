import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// POST - masyarakat mengirim jawaban kuisioner (sekali per kuisioner)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "MASYARAKAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const masyarakat = await prisma.masyarakat.findUnique({ where: { userId: session.user.id } })
    if (!masyarakat) return NextResponse.json({ error: "Masyarakat not found" }, { status: 404 })

    const { id } = await params
    const kuisioner = await prisma.kuisioner.findUnique({
      where: { id },
      include: { pertanyaan: true },
    })
    if (!kuisioner || !kuisioner.aktif) {
      return NextResponse.json({ error: "Kuesioner tidak tersedia" }, { status: 404 })
    }

    // Sudah pernah mengisi?
    const sudah = await prisma.responKuisioner.findFirst({
      where: { kuisionerId: id, masyarakatId: masyarakat.id },
    })
    if (sudah) {
      return NextResponse.json({ error: "Anda sudah mengisi kuesioner ini" }, { status: 400 })
    }

    const body = await req.json()
    const jawabanInput: { pertanyaanId: string; nilai: string }[] = Array.isArray(body.jawaban) ? body.jawaban : []
    const map = new Map(jawabanInput.map((j) => [String(j.pertanyaanId), String(j.nilai ?? "").trim()]))

    // Validasi: semua pertanyaan wajib dijawab
    for (const p of kuisioner.pertanyaan) {
      const nilai = map.get(p.id)
      if (!nilai) {
        return NextResponse.json({ error: "Semua pertanyaan wajib dijawab" }, { status: 400 })
      }
    }

    await prisma.responKuisioner.create({
      data: {
        kuisionerId: id,
        masyarakatId: masyarakat.id,
        jawaban: {
          create: kuisioner.pertanyaan.map((p) => ({
            pertanyaanId: p.id,
            nilai: map.get(p.id) || "",
          })),
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error submitting kuisioner:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
