import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// GET - Ambil data stress assessments
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "MASYARAKAT") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get masyarakat ID
    const masyarakat = await prisma.masyarakat.findUnique({
      where: { userId: session.user.id }
    })

    if (!masyarakat) {
      return NextResponse.json(
        { error: "Masyarakat not found" },
        { status: 404 }
      )
    }

    // Get stress assessments
    const assessments = await prisma.manajemenStress.findMany({
      where: { masyarakatId: masyarakat.id },
      orderBy: { tanggalPenilaian: 'desc' },
      take: 20
    })

    return NextResponse.json(assessments)
  } catch (error) {
    console.error("Error fetching stress assessments:", error)
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    )
  }
}

// POST - Simpan stress assessment baru
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "MASYARAKAT") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { levelStress, gejala, pemicu, rekomendasi } = body

    // Validation
    if (levelStress === undefined || levelStress === null) {
      return NextResponse.json(
        { error: "Level stress required" },
        { status: 400 }
      )
    }

    // Get masyarakat ID
    const masyarakat = await prisma.masyarakat.findUnique({
      where: { userId: session.user.id }
    })

    if (!masyarakat) {
      return NextResponse.json(
        { error: "Masyarakat not found" },
        { status: 404 }
      )
    }

    // Determine coping strategy based on stress level
    let copingStrategy = ""
    if (levelStress <= 3) {
      copingStrategy = "Pertahankan aktivitas positif: olahraga ringan, hobi, dan sosialisasi"
    } else if (levelStress <= 6) {
      copingStrategy = "Terapkan teknik relaksasi: meditasi, yoga, atau pernapasan dalam. Atur waktu istirahat dengan baik"
    } else {
      copingStrategy = "Segera cari dukungan: berbicara dengan orang terdekat, pertimbangkan konsultasi profesional, gunakan fitur relaksasi secara rutin"
    }

    // Create assessment
    const assessment = await prisma.manajemenStress.create({
      data: {
        masyarakatId: masyarakat.id,
        levelStress,
        gejala: gejala || null,
        pemicu: pemicu || null,
        copingStrategy,
        rekomendasi: rekomendasi || null,
      }
    })

    // Create notification if stress level is high
    if (levelStress >= 7) {
      await prisma.notification.create({
        data: {
          masyarakatId: masyarakat.id,
          judul: "Peringatan Tingkat Stress Tinggi",
          pesan: `Tingkat stress Anda ${levelStress}/10. ${rekomendasi}`,
          tipe: "WARNING",
        }
      })
    }

    return NextResponse.json(assessment, { status: 201 })
  } catch (error) {
    console.error("Error saving stress assessment:", error)
    return NextResponse.json(
      { error: "Failed to save data" },
      { status: 500 }
    )
  }
}