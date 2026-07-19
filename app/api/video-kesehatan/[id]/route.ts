import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// GET - Detail video (+ increment view bila published)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const video = await prisma.videoKesehatan.findUnique({ where: { id } })

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    if (video.status === "PUBLISHED") {
      await prisma.videoKesehatan.update({
        where: { id },
        data: { viewCount: video.viewCount + 1 },
      })
    }

    return NextResponse.json(video)
  } catch (error) {
    console.error("Error fetching video:", error)
    return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 })
  }
}

// PUT - Update video (perawat)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const existing = await prisma.videoKesehatan.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    const body = await req.json()
    const { judul, deskripsi, kategori, url, thumbnail, status } = body

    if (!judul || !deskripsi || !kategori || !url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const video = await prisma.videoKesehatan.update({
      where: { id },
      data: {
        judul,
        deskripsi,
        kategori,
        url,
        thumbnail: thumbnail || null,
        status,
      },
    })

    return NextResponse.json(video)
  } catch (error) {
    console.error("Error updating video:", error)
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 })
  }
}

// DELETE - Hapus video (perawat)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const existing = await prisma.videoKesehatan.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    await prisma.videoKesehatan.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting video:", error)
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 })
  }
}
