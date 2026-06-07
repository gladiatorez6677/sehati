import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// PUT - Update facility
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const facility = await prisma.fasilitasKesehatan.update({
      where: { id },
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
    console.error("Error updating facility:", error)
    return NextResponse.json(
      { error: "Failed to update facility" },
      { status: 500 }
    )
  }
}

// DELETE - Delete facility
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await prisma.fasilitasKesehatan.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Facility deleted successfully" })
  } catch (error) {
    console.error("Error deleting facility:", error)
    return NextResponse.json(
      { error: "Failed to delete facility" },
      { status: 500 }
    )
  }
}