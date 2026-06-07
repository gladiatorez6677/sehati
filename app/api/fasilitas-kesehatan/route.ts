import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// GET - Ambil semua fasilitas kesehatan
export async function GET(req: NextRequest) {
  try {
    const facilities = await prisma.fasilitasKesehatan.findMany({
      orderBy: {
        nama: 'asc'
      }
    })

    // If no facilities exist, create some sample data
    if (facilities.length === 0) {
      const sampleFacilities = [
        {
          nama: "RS Cipto Mangunkusumo",
          jenis: "RS",
          alamat: "Jl. Diponegoro No. 71, Jakarta Pusat",
          latitude: -6.1975,
          longitude: 106.8472,
          nomorTelepon: "(021) 3900709",
          jamBuka: "00:00",
          jamTutup: "23:59",
          layanan: "UGD 24 Jam, Rawat Inap, Rawat Jalan, ICU"
        },
        {
          nama: "RS Fatmawati",
          jenis: "RS",
          alamat: "Jl. RS Fatmawati Raya, Jakarta Selatan",
          latitude: -6.2950,
          longitude: 106.7965,
          nomorTelepon: "(021) 7501524",
          jamBuka: "00:00",
          jamTutup: "23:59",
          layanan: "UGD 24 Jam, Rawat Inap, Rawat Jalan"
        },
        {
          nama: "Klinik Sehat Sentosa",
          jenis: "Klinik",
          alamat: "Jl. Sudirman No. 45, Jakarta Pusat",
          latitude: -6.2088,
          longitude: 106.8208,
          nomorTelepon: "(021) 5712345",
          jamBuka: "08:00",
          jamTutup: "21:00",
          layanan: "Dokter Umum, Dokter Gigi, Lab"
        },
        {
          nama: "Puskesmas Menteng",
          jenis: "Puskesmas",
          alamat: "Jl. Pegangsaan Barat No. 14, Jakarta Pusat",
          latitude: -6.1936,
          longitude: 106.8440,
          nomorTelepon: "(021) 3909089",
          jamBuka: "08:00",
          jamTutup: "15:00",
          layanan: "Pelayanan Kesehatan Dasar, Imunisasi, KB"
        },
        {
          nama: "Apotek K24 Sudirman",
          jenis: "Apotek",
          alamat: "Jl. Jend Sudirman No. 1, Jakarta Pusat",
          latitude: -6.2019,
          longitude: 106.8237,
          nomorTelepon: "(021) 5701524",
          jamBuka: "00:00",
          jamTutup: "23:59",
          layanan: "Obat-obatan, Konsultasi Apoteker"
        },
        {
          nama: "RS Siloam Semanggi",
          jenis: "RS",
          alamat: "Jl. Garnisun Dalam No. 2-3, Jakarta Selatan",
          latitude: -6.2195,
          longitude: 106.8144,
          nomorTelepon: "(021) 29962888",
          jamBuka: "00:00",
          jamTutup: "23:59",
          layanan: "UGD 24 Jam, Rawat Inap, Rawat Jalan, Medical Check Up"
        },
        {
          nama: "Puskesmas Tebet",
          jenis: "Puskesmas",
          alamat: "Jl. Tebet Raya No. 19, Jakarta Selatan",
          latitude: -6.2265,
          longitude: 106.8530,
          nomorTelepon: "(021) 8291040",
          jamBuka: "08:00",
          jamTutup: "15:00",
          layanan: "Pelayanan Kesehatan Dasar, Posyandu, Poli Gigi"
        },
        {
          nama: "Klinik Medika Plaza",
          jenis: "Klinik",
          alamat: "Jl. MH Thamrin No. 28, Jakarta Pusat",
          latitude: -6.1944,
          longitude: 106.8229,
          nomorTelepon: "(021) 3101234",
          jamBuka: "08:00",
          jamTutup: "20:00",
          layanan: "Dokter Spesialis, Laboratorium, Radiologi"
        },
        {
          nama: "Apotek Guardian Plaza Indonesia",
          jenis: "Apotek",
          alamat: "Plaza Indonesia, Jl. MH Thamrin, Jakarta Pusat",
          latitude: -6.1935,
          longitude: 106.8220,
          nomorTelepon: "(021) 29928899",
          jamBuka: "10:00",
          jamTutup: "22:00",
          layanan: "Obat-obatan, Alat Kesehatan, Produk Kesehatan"
        },
        {
          nama: "RS Harapan Kita",
          jenis: "RS",
          alamat: "Jl. S. Parman Kav. 87, Jakarta Barat",
          latitude: -6.1859,
          longitude: 106.7976,
          nomorTelepon: "(021) 5684093",
          jamBuka: "00:00",
          jamTutup: "23:59",
          layanan: "Spesialis Jantung, UGD 24 Jam, Kateterisasi"
        }
      ]

      // Create sample facilities
      await prisma.fasilitasKesehatan.createMany({
        data: sampleFacilities
      })

      // Fetch again after creating
      const newFacilities = await prisma.fasilitasKesehatan.findMany({
        orderBy: {
          nama: 'asc'
        }
      })

      return NextResponse.json(newFacilities)
    }

    return NextResponse.json(facilities)
  } catch (error) {
    console.error("Error fetching facilities:", error)
    return NextResponse.json(
      { error: "Failed to fetch facilities" },
      { status: 500 }
    )
  }
}

// POST - Create new facility (Perawat only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const {
      nama,
      jenis,
      alamat,
      latitude,
      longitude,
      nomorTelepon,
      jamBuka,
      jamTutup,
      layanan,
    } = body

    // Validate required fields
    if (!nama || !jenis || !alamat || !latitude || !longitude) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const facility = await prisma.fasilitasKesehatan.create({
      data: {
        nama,
        jenis,
        alamat,
        latitude,
        longitude,
        nomorTelepon,
        jamBuka,
        jamTutup,
        layanan,
      },
    })

    return NextResponse.json(facility)
  } catch (error) {
    console.error("Error creating facility:", error)
    return NextResponse.json(
      { error: "Failed to create facility" },
      { status: 500 }
    )
  }
}