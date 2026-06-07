import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// Fungsi untuk menentukan kategori tekanan darah
function getKategori(sistolik: number, diastolik: number): string {
  if (sistolik < 120 && diastolik < 80) {
    return "Normal"
  } else if ((sistolik >= 120 && sistolik <= 139) || (diastolik >= 80 && diastolik <= 89)) {
    return "Prehipertensi"
  } else if ((sistolik >= 140 && sistolik <= 159) || (diastolik >= 90 && diastolik <= 99)) {
    return "Hipertensi Stage 1"
  } else if (sistolik >= 160 || diastolik >= 100) {
    return "Hipertensi Stage 2"
  }
  return "Tidak Diketahui"
}

// GET - Ambil data tekanan darah user
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

    // Get tekanan darah data
    const measurements = await prisma.tekananDarah.findMany({
      where: { masyarakatId: masyarakat.id },
      orderBy: { tanggalPengukuran: 'desc' },
      take: 50 // Limit to last 50 measurements
    })

    return NextResponse.json(measurements)
  } catch (error) {
    console.error("Error fetching blood pressure data:", error)
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    )
  }
}

// POST - Simpan data tekanan darah baru
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
    const { sistolik, diastolik, denyutNadi, catatan } = body

    // Validation
    if (!sistolik || !diastolik || !denyutNadi) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    // Determine kategori
    const kategori = getKategori(sistolik, diastolik)

    // Create new measurement
    const measurement = await prisma.tekananDarah.create({
      data: {
        masyarakatId: masyarakat.id,
        sistolik,
        diastolik,
        denyutNadi,
        catatan: catatan || null,
        kategori,
      }
    })

    // Check if notification needed (for high blood pressure)
    if (kategori === "Hipertensi Stage 1" || kategori === "Hipertensi Stage 2") {
      await prisma.notification.create({
        data: {
          masyarakatId: masyarakat.id,
          judul: "Peringatan Tekanan Darah Tinggi",
          pesan: `Tekanan darah Anda ${sistolik}/${diastolik} mmHg termasuk kategori ${kategori}. Segera konsultasikan dengan dokter.`,
          tipe: "WARNING",
        }
      })
    }

    return NextResponse.json(measurement, { status: 201 })
  } catch (error) {
    console.error("Error saving blood pressure data:", error)
    return NextResponse.json(
      { error: "Failed to save data" },
      { status: 500 }
    )
  }
}