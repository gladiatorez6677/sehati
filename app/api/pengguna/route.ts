import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

// POST - Perawat menambah pengguna baru
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { email, password, nama, tanggalLahir, jenisKelamin, nomorTelepon, alamat, role, nomorSTR, spesialisasi } = body

    if (!email || !password || !nama || !tanggalLahir || !jenisKelamin || !nomorTelepon || !role) {
      return NextResponse.json({ error: "Semua field wajib harus diisi" }, { status: 400 })
    }
    if (String(password).length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 })
    }
    if (role !== UserRole.MASYARAKAT && role !== UserRole.PERAWAT) {
      return NextResponse.json({ error: "Role tidak valid" }, { status: 400 })
    }
    if (role === UserRole.PERAWAT && (!nomorSTR || !spesialisasi)) {
      return NextResponse.json({ error: "Nomor STR dan spesialisasi wajib untuk perawat" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 })
    }

    const parsedDate = new Date(tanggalLahir)
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "Format tanggal lahir tidak valid" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          nama,
          tanggalLahir: parsedDate,
          jenisKelamin,
          nomorTelepon,
          alamat: alamat || null,
          role,
        },
      })
      if (role === UserRole.MASYARAKAT) {
        await tx.masyarakat.create({ data: { userId: newUser.id } })
      } else {
        const existingPerawat = await tx.perawat.findUnique({ where: { nomorSTR } })
        if (existingPerawat) throw new Error("Nomor STR sudah terdaftar")
        await tx.perawat.create({ data: { userId: newUser.id, nomorSTR, spesialisasi } })
      }
      return newUser
    })

    const { password: _pw, ...userWithoutPassword } = user
    void _pw
    return NextResponse.json({ message: "Pengguna berhasil ditambahkan", user: userWithoutPassword }, { status: 201 })
  } catch (error) {
    const prismaError = error as { code?: string; meta?: { target?: string[] }; message?: string }
    if (prismaError.code === "P2002") {
      const field = prismaError.meta?.target?.[0]
      if (field === "email") return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 })
      if (field === "nomorSTR") return NextResponse.json({ error: "Nomor STR sudah terdaftar" }, { status: 400 })
    }
    if (prismaError.message === "Nomor STR sudah terdaftar") {
      return NextResponse.json({ error: "Nomor STR sudah terdaftar" }, { status: 400 })
    }
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Gagal menambahkan pengguna" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Only allow PERAWAT role to access this endpoint
    if (!session || session.user.role !== "PERAWAT") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const users = await prisma.user.findMany({
      include: {
        masyarakat: {
          select: {
            id: true
          }
        },
        perawat: {
          select: {
            id: true,
            nomorSTR: true,
            spesialisasi: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Remove password from response
    const usersWithoutPassword = users.map(({ password, ...user }) => user)

    return NextResponse.json(usersWithoutPassword)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}