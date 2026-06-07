import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// GET - Ambil data kolesterol
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

    // Get kolesterol data
    const measurements = await prisma.controlKolesterol.findMany({
      where: { masyarakatId: masyarakat.id },
      orderBy: { tanggalPemeriksaan: 'desc' },
      take: 50
    })

    return NextResponse.json(measurements)
  } catch (error) {
    console.error("Error fetching cholesterol data:", error)
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    )
  }
}

// POST - Simpan data kolesterol baru
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
    const { totalKolesterol, ldl, hdl, trigliserida, rekomendasi } = body

    // Validation
    if (!totalKolesterol || !ldl || !hdl || !trigliserida) {
      return NextResponse.json(
        { error: "All fields are required" },
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

    // Create measurement
    const measurement = await prisma.controlKolesterol.create({
      data: {
        masyarakatId: masyarakat.id,
        totalKolesterol,
        ldl,
        hdl,
        trigliserida,
        rekomendasi: rekomendasi || null,
      }
    })

    // Check if notification needed
    const needsWarning = 
      totalKolesterol >= 240 || 
      ldl >= 160 || 
      hdl < 40 || 
      trigliserida >= 200

    if (needsWarning) {
      let warningMessage = "Kadar kolesterol Anda memerlukan perhatian: "
      const warnings = []
      
      if (totalKolesterol >= 240) warnings.push("Total kolesterol tinggi")
      if (ldl >= 160) warnings.push("LDL tinggi")
      if (hdl < 40) warnings.push("HDL rendah")
      if (trigliserida >= 200) warnings.push("Trigliserida tinggi")
      
      warningMessage += warnings.join(", ") + ". Konsultasikan dengan dokter."

      await prisma.notification.create({
        data: {
          masyarakatId: masyarakat.id,
          judul: "Peringatan Kadar Kolesterol",
          pesan: warningMessage,
          tipe: "WARNING",
        }
      })
    }

    return NextResponse.json(measurement, { status: 201 })
  } catch (error) {
    console.error("Error saving cholesterol data:", error)
    return NextResponse.json(
      { error: "Failed to save data" },
      { status: 500 }
    )
  }
}