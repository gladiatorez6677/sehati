import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// GET - Ambil artikel yang dipublikasi (untuk masyarakat)
export async function GET(req: NextRequest) {
  try {
    const articles = await prisma.artikelKesehatan.findMany({
      where: {
        status: "PUBLISHED"
      },
      include: {
        perawat: {
          include: {
            user: {
              select: {
                nama: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(articles)
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    )
  }
}

// POST - Buat artikel baru (untuk perawat)
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
    const { judul, konten, kategori, tipeArtikel, gambar, ebook, tags, status } = body

    const validTipe = ["UTAMA", "PENDUKUNG", "LOKAL"]
    const tipe = validTipe.includes(tipeArtikel) ? tipeArtikel : "UTAMA"

    // Validation
    if (!judul || !konten || !kategori) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get perawat ID
    const perawat = await prisma.perawat.findUnique({
      where: { userId: session.user.id }
    })

    if (!perawat) {
      return NextResponse.json(
        { error: "Perawat not found" },
        { status: 404 }
      )
    }

    // Create article
    const article = await prisma.artikelKesehatan.create({
      data: {
        perawatId: perawat.id,
        judul,
        konten,
        kategori,
        tipeArtikel: tipe,
        gambar: gambar || null,
        ebook: ebook || null,
        tags: tags || null,
        status: status || "DRAFT",
      }
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    )
  }
}