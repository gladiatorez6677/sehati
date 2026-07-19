import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// GET - Ambil video yang dipublikasi (untuk masyarakat)
export async function GET() {
  try {
    const videos = await prisma.videoKesehatan.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(videos)
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}

// POST - Buat video baru (untuk perawat)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { judul, deskripsi, kategori, url, thumbnail, status } = body

    if (!judul || !deskripsi || !kategori || !url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const video = await prisma.videoKesehatan.create({
      data: {
        judul,
        deskripsi,
        kategori,
        url,
        thumbnail: thumbnail || null,
        status: status || "PUBLISHED",
      },
    })

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error("Error creating video:", error)
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 })
  }
}
