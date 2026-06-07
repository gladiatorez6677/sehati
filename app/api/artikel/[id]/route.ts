import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// GET - Ambil detail artikel
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const article = await prisma.artikelKesehatan.findUnique({
      where: {
        id: id
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
      }
    })

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      )
    }

    // Increment view count if published
    if (article.status === "PUBLISHED") {
      await prisma.artikelKesehatan.update({
        where: { id: id },
        data: { viewCount: article.viewCount + 1 }
      })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    )
  }
}

// PUT - Update artikel
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { judul, konten, kategori, gambar, tags, status } = body

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

    // Check if article belongs to this perawat
    const { id } = await params
    const existingArticle = await prisma.artikelKesehatan.findFirst({
      where: {
        id: id,
        perawatId: perawat.id
      }
    })

    if (!existingArticle) {
      return NextResponse.json(
        { error: "Article not found or unauthorized" },
        { status: 404 }
      )
    }

    // Update article
    const article = await prisma.artikelKesehatan.update({
      where: { id: id },
      data: {
        judul,
        konten,
        kategori,
        gambar: gambar || null,
        tags: tags || null,
        status,
      }
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    )
  }
}

// DELETE - Hapus artikel
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
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

    // Check if article belongs to this perawat
    const { id } = await params
    const existingArticle = await prisma.artikelKesehatan.findFirst({
      where: {
        id: id,
        perawatId: perawat.id
      }
    })

    if (!existingArticle) {
      return NextResponse.json(
        { error: "Article not found or unauthorized" },
        { status: 404 }
      )
    }

    // Delete article
    await prisma.artikelKesehatan.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: "Article deleted successfully" })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    )
  }
}