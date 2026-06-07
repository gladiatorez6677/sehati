import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// GET - Ambil semua sesi relaksasi yang tersedia
export async function GET(req: NextRequest) {
  try {
    let relaksasi = await prisma.relaksasi.findMany({
      orderBy: {
        judul: 'asc'
      }
    })

    // If no relaxation sessions exist, create sample data
    if (relaksasi.length === 0) {
      const sampleRelaksasi = [
        {
          judul: "Meditasi Pagi Hari",
          deskripsi: "Mulai hari Anda dengan meditasi singkat untuk kejernihan pikiran",
          tipe: "MEDITASI",
          durasi: 600, // 10 minutes
          instruksi: "Duduk dengan nyaman, tutup mata, dan fokus pada pernapasan Anda. Tarik napas dalam-dalam melalui hidung, tahan sejenak, lalu hembuskan perlahan melalui mulut.",
        },
        {
          judul: "Musik Relaksasi Alam",
          deskripsi: "Dengarkan suara alam yang menenangkan untuk mengurangi stress",
          tipe: "MUSIK_RELAKSASI",
          durasi: 900, // 15 minutes
          audioUrl: "https://example.com/nature-sounds.mp3",
          instruksi: "Cari tempat yang nyaman, gunakan headphone jika memungkinkan, dan biarkan suara alam membawa Anda ke ketenangan.",
        },
        {
          judul: "Latihan Pernapasan 4-7-8",
          deskripsi: "Teknik pernapasan untuk menenangkan sistem saraf",
          tipe: "GUIDED_BREATHING",
          durasi: 300, // 5 minutes
          instruksi: "Tarik napas selama 4 hitungan, tahan selama 7 hitungan, hembuskan selama 8 hitungan. Ulangi 4-5 kali.",
        },
        {
          judul: "Relaksasi Otot Progresif",
          deskripsi: "Lepaskan ketegangan dari seluruh tubuh secara bertahap",
          tipe: "PROGRESSIVE_RELAXATION",
          durasi: 1200, // 20 minutes
          instruksi: "Mulai dari kaki, kencangkan otot selama 5 detik lalu lepaskan. Lanjutkan ke bagian tubuh lain secara bertahap hingga kepala.",
        },
        {
          judul: "Meditasi Tidur Malam",
          deskripsi: "Persiapkan tubuh dan pikiran untuk tidur nyenyak",
          tipe: "MEDITASI",
          durasi: 600, // 10 minutes
          instruksi: "Berbaring dengan nyaman di tempat tidur. Fokus pada pernapasan dan lepaskan semua pikiran tentang hari ini.",
        },
        {
          judul: "Pernapasan Box",
          deskripsi: "Teknik pernapasan sederhana untuk menenangkan pikiran",
          tipe: "GUIDED_BREATHING",
          durasi: 480, // 8 minutes
          instruksi: "Tarik napas 4 hitungan, tahan 4 hitungan, hembuskan 4 hitungan, tahan 4 hitungan. Bayangkan membentuk kotak dengan napas Anda.",
        },
        {
          judul: "Musik Piano Relaksasi",
          deskripsi: "Melodi piano lembut untuk menenangkan pikiran",
          tipe: "MUSIK_RELAKSASI",
          durasi: 720, // 12 minutes
          audioUrl: "https://example.com/piano-relaxation.mp3",
          instruksi: "Dengarkan dengan volume rendah sambil melakukan aktivitas ringan atau beristirahat.",
        },
        {
          judul: "Body Scan Meditation",
          deskripsi: "Scan seluruh tubuh untuk melepaskan ketegangan",
          tipe: "PROGRESSIVE_RELAXATION",
          durasi: 900, // 15 minutes
          instruksi: "Mulai dari ujung kepala, perhatikan setiap bagian tubuh. Rasakan dan lepaskan ketegangan yang ada.",
        }
      ]

      await prisma.relaksasi.createMany({
        data: sampleRelaksasi
      })

      // Fetch again after creating
      relaksasi = await prisma.relaksasi.findMany({
        orderBy: {
          judul: 'asc'
        }
      })
    }

    return NextResponse.json(relaksasi)
  } catch (error) {
    console.error("Error fetching relaxation sessions:", error)
    return NextResponse.json(
      { error: "Failed to fetch relaxation sessions" },
      { status: 500 }
    )
  }
}