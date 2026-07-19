import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

// PUT - Ganti password user yang sedang login
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { passwordLama, passwordBaru } = body

    if (!passwordLama || !passwordBaru) {
      return NextResponse.json({ error: "Password lama dan baru wajib diisi" }, { status: 400 })
    }
    if (passwordBaru.length < 6) {
      return NextResponse.json(
        { error: "Password baru minimal 6 karakter" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    })

    if (!user?.password) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const valid = await bcrypt.compare(passwordLama, user.password)
    if (!valid) {
      return NextResponse.json({ error: "Password lama salah" }, { status: 400 })
    }

    const hashed = await bcrypt.hash(passwordBaru, 10)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashed },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 })
  }
}
