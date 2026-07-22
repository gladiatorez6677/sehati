import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

const gameInclude = { artikel: { select: { id: true, judul: true } } }

// GET - Ambil semua games edukasi (opsional ?artikelId= untuk game milik satu artikel)
export async function GET(req: NextRequest) {
  try {
    const artikelId = new URL(req.url).searchParams.get("artikelId")
    if (artikelId) {
      const filtered = await prisma.gameEdukasi.findMany({
        where: { artikelId },
        orderBy: { nama: "asc" },
        include: gameInclude,
      })
      return NextResponse.json(filtered)
    }

    let games = await prisma.gameEdukasi.findMany({
      orderBy: {
        nama: 'asc'
      },
      include: gameInclude,
    })

    // If no games exist, create sample games
    if (games.length === 0) {
      const sampleGames = [
        {
          nama: "Quiz Nutrisi Sehat",
          deskripsi: "Uji pengetahuan Anda tentang nutrisi dan makanan sehat",
          kategori: "Nutrisi",
          difficulty: "MUDAH",
          pertanyaan: [
            {
              id: 1,
              question: "Vitamin apa yang paling banyak terdapat dalam jeruk?",
              options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
              correctAnswer: 2,
              explanation: "Jeruk kaya akan Vitamin C yang baik untuk sistem imun."
            },
            {
              id: 2,
              question: "Berapa gelas air putih yang dianjurkan untuk diminum setiap hari?",
              options: ["4-5 gelas", "6-8 gelas", "10-12 gelas", "2-3 gelas"],
              correctAnswer: 1,
              explanation: "Dianjurkan minum 6-8 gelas air putih per hari untuk menjaga hidrasi tubuh."
            },
            {
              id: 3,
              question: "Makanan apa yang merupakan sumber protein nabati?",
              options: ["Daging ayam", "Ikan salmon", "Kacang kedelai", "Telur"],
              correctAnswer: 2,
              explanation: "Kacang kedelai adalah sumber protein nabati yang baik."
            },
            {
              id: 4,
              question: "Apa manfaat utama serat bagi tubuh?",
              options: ["Meningkatkan energi", "Membantu pencernaan", "Menambah berat badan", "Meningkatkan kecerdasan"],
              correctAnswer: 1,
              explanation: "Serat membantu melancarkan pencernaan dan menjaga kesehatan usus."
            },
            {
              id: 5,
              question: "Buah apa yang tinggi kalium?",
              options: ["Apel", "Pisang", "Anggur", "Jeruk"],
              correctAnswer: 1,
              explanation: "Pisang kaya akan kalium yang baik untuk kesehatan jantung dan otot."
            }
          ]
        },
        {
          nama: "Tantangan Olahraga",
          deskripsi: "Pelajari jenis-jenis olahraga dan manfaatnya",
          kategori: "Olahraga",
          difficulty: "SEDANG",
          pertanyaan: [
            {
              id: 1,
              question: "Berapa lama durasi olahraga yang dianjurkan per minggu?",
              options: ["30 menit", "75 menit", "150 menit", "300 menit"],
              correctAnswer: 2,
              explanation: "WHO merekomendasikan minimal 150 menit olahraga intensitas sedang per minggu."
            },
            {
              id: 2,
              question: "Olahraga apa yang terbaik untuk kesehatan jantung?",
              options: ["Angkat beban", "Kardio", "Yoga", "Pilates"],
              correctAnswer: 1,
              explanation: "Olahraga kardio seperti lari, berenang, dan bersepeda sangat baik untuk jantung."
            },
            {
              id: 3,
              question: "Kapan waktu terbaik untuk melakukan peregangan?",
              options: ["Sebelum tidur", "Setelah makan", "Sebelum dan sesudah olahraga", "Saat bangun tidur"],
              correctAnswer: 2,
              explanation: "Peregangan sebelum dan sesudah olahraga membantu mencegah cedera."
            },
            {
              id: 4,
              question: "Apa manfaat yoga bagi kesehatan mental?",
              options: ["Menambah berat badan", "Mengurangi stress", "Meningkatkan nafsu makan", "Mempercepat detak jantung"],
              correctAnswer: 1,
              explanation: "Yoga terbukti efektif mengurangi stress dan meningkatkan kesehatan mental."
            },
            {
              id: 5,
              question: "Berapa detak jantung normal saat istirahat?",
              options: ["40-60 bpm", "60-100 bpm", "100-120 bpm", "120-140 bpm"],
              correctAnswer: 1,
              explanation: "Detak jantung normal saat istirahat adalah 60-100 kali per menit."
            },
            {
              id: 6,
              question: "Olahraga apa yang baik untuk keseimbangan?",
              options: ["Lari sprint", "Tai chi", "Angkat beban berat", "Tinju"],
              correctAnswer: 1,
              explanation: "Tai chi adalah olahraga yang fokus pada keseimbangan dan koordinasi."
            }
          ]
        },
        {
          nama: "Kenali Penyakitmu",
          deskripsi: "Pahami gejala dan pencegahan berbagai penyakit",
          kategori: "Penyakit",
          difficulty: "SULIT",
          pertanyaan: [
            {
              id: 1,
              question: "Apa gejala utama diabetes tipe 2?",
              options: ["Demam tinggi", "Sering haus dan buang air kecil", "Batuk kronis", "Sakit kepala"],
              correctAnswer: 1,
              explanation: "Sering haus (polidipsia) dan sering buang air kecil (poliuria) adalah gejala klasik diabetes."
            },
            {
              id: 2,
              question: "Tekanan darah normal adalah?",
              options: ["140/90 mmHg", "120/80 mmHg", "100/60 mmHg", "160/100 mmHg"],
              correctAnswer: 1,
              explanation: "Tekanan darah normal adalah sekitar 120/80 mmHg."
            },
            {
              id: 3,
              question: "Apa penyebab utama stroke?",
              options: ["Kurang vitamin", "Penyumbatan atau pecahnya pembuluh darah otak", "Infeksi bakteri", "Alergi makanan"],
              correctAnswer: 1,
              explanation: "Stroke terjadi karena penyumbatan (iskemik) atau pecahnya (hemoragik) pembuluh darah di otak."
            },
            {
              id: 4,
              question: "Kolesterol LDL normal harus di bawah?",
              options: ["200 mg/dL", "150 mg/dL", "130 mg/dL", "100 mg/dL"],
              correctAnswer: 3,
              explanation: "Kolesterol LDL optimal adalah di bawah 100 mg/dL."
            },
            {
              id: 5,
              question: "Apa yang dimaksud dengan hipertensi?",
              options: ["Gula darah tinggi", "Tekanan darah tinggi", "Kolesterol tinggi", "Asam urat tinggi"],
              correctAnswer: 1,
              explanation: "Hipertensi adalah kondisi tekanan darah tinggi yang konsisten."
            },
            {
              id: 6,
              question: "Bagaimana cara pencegahan utama penyakit jantung?",
              options: ["Minum suplemen", "Tidur larut malam", "Pola hidup sehat dan olahraga teratur", "Makan makanan manis"],
              correctAnswer: 2,
              explanation: "Pola hidup sehat dengan diet seimbang dan olahraga teratur adalah kunci pencegahan penyakit jantung."
            },
            {
              id: 7,
              question: "Apa itu IMT (Indeks Massa Tubuh)?",
              options: ["Ukuran kekuatan otot", "Rasio berat dan tinggi badan", "Kadar gula darah", "Tekanan darah"],
              correctAnswer: 1,
              explanation: "IMT adalah perhitungan untuk menentukan kategori berat badan berdasarkan rasio berat dan tinggi badan."
            }
          ]
        },
        {
          nama: "Mental Health Matters",
          deskripsi: "Pelajari tentang kesehatan mental dan cara menjaganya",
          kategori: "Kesehatan Mental",
          difficulty: "SEDANG",
          pertanyaan: [
            {
              id: 1,
              question: "Apa itu stress?",
              options: ["Penyakit menular", "Respon tubuh terhadap tekanan", "Jenis makanan", "Olahraga berat"],
              correctAnswer: 1,
              explanation: "Stress adalah respon fisik dan mental tubuh terhadap tekanan atau tuntutan."
            },
            {
              id: 2,
              question: "Berapa jam tidur yang dianjurkan untuk orang dewasa?",
              options: ["4-5 jam", "6-7 jam", "7-9 jam", "10-12 jam"],
              correctAnswer: 2,
              explanation: "Orang dewasa membutuhkan 7-9 jam tidur untuk kesehatan optimal."
            },
            {
              id: 3,
              question: "Apa manfaat meditasi?",
              options: ["Menambah berat badan", "Mengurangi kecemasan", "Meningkatkan nafsu makan", "Mempercepat metabolisme"],
              correctAnswer: 1,
              explanation: "Meditasi terbukti efektif mengurangi kecemasan dan meningkatkan fokus."
            },
            {
              id: 4,
              question: "Tanda-tanda depresi meliputi?",
              options: ["Semangat berlebihan", "Kehilangan minat dan energi", "Nafsu makan meningkat", "Tidur terlalu sedikit"],
              correctAnswer: 1,
              explanation: "Kehilangan minat pada aktivitas yang biasa dinikmati adalah salah satu tanda depresi."
            },
            {
              id: 5,
              question: "Cara sehat mengatasi stress adalah?",
              options: ["Merokok", "Minum alkohol", "Olahraga dan relaksasi", "Begadang"],
              correctAnswer: 2,
              explanation: "Olahraga dan teknik relaksasi adalah cara sehat mengatasi stress."
            }
          ]
        }
      ]

      // Create games with proper JSON structure
      for (const gameData of sampleGames) {
        await prisma.gameEdukasi.create({
          data: {
            nama: gameData.nama,
            deskripsi: gameData.deskripsi,
            kategori: gameData.kategori,
            difficulty: gameData.difficulty,
            pertanyaan: gameData.pertanyaan
          }
        })
      }

      // Fetch again after creating
      games = await prisma.gameEdukasi.findMany({
        orderBy: {
          nama: 'asc'
        },
        include: gameInclude,
      })
    }

    return NextResponse.json(games)
  } catch (error) {
    console.error("Error fetching games:", error)
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    )
  }
}

interface QInput {
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

function cleanQuestions(raw: unknown): QInput[] | null {
  if (!Array.isArray(raw)) return null
  const out: QInput[] = []
  raw.forEach((q, idx) => {
    const question = String(q?.question || "").trim()
    const options = Array.isArray(q?.options) ? q.options.map((o: unknown) => String(o).trim()).filter(Boolean) : []
    const correctAnswer = Number(q?.correctAnswer)
    if (!question || options.length < 2) return
    out.push({
      question,
      options,
      correctAnswer: correctAnswer >= 0 && correctAnswer < options.length ? correctAnswer : 0,
      explanation: q?.explanation ? String(q.explanation).trim() : "",
    })
    void idx
  })
  return out
}

// POST - Perawat membuat game baru
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const body = await req.json()
    const nama = String(body.nama || "").trim()
    const difficulty = ["MUDAH", "SEDANG", "SULIT"].includes(body.difficulty) ? body.difficulty : "MUDAH"
    const questions = cleanQuestions(body.pertanyaan)

    if (!nama) return NextResponse.json({ error: "Nama game wajib diisi" }, { status: 400 })
    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: "Minimal satu pertanyaan dengan 2 opsi" }, { status: 400 })
    }

    const game = await prisma.gameEdukasi.create({
      data: {
        nama,
        deskripsi: body.deskripsi ? String(body.deskripsi).trim() : "",
        kategori: body.kategori ? String(body.kategori).trim() : "Umum",
        difficulty,
        pertanyaan: questions.map((q, i) => ({ id: i + 1, ...q })),
        artikelId: body.artikelId ? String(body.artikelId) : null,
      },
    })
    return NextResponse.json(game, { status: 201 })
  } catch (error) {
    console.error("Error creating game:", error)
    return NextResponse.json({ error: "Failed to create game" }, { status: 500 })
  }
}