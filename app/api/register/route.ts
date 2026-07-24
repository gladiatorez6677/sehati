import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("Registration request received:", { ...body, password: "[HIDDEN]" })
    const {
      email,
      password,
      nama,
      tanggalLahir,
      jenisKelamin,
      nomorTelepon,
      alamat,
      pendidikanTerakhir,
      pekerjaan,
      role,
      nomorSTR,
      spesialisasi,
    } = body

    // Validasi input
    if (!email || !password || !nama || !tanggalLahir || !jenisKelamin || !nomorTelepon || !role) {
      return NextResponse.json(
        { error: "Semua field wajib harus diisi" },
        { status: 400 }
      )
    }

    // Validasi role
    if (role !== UserRole.MASYARAKAT && role !== UserRole.PERAWAT) {
      console.error("Invalid role provided:", role)
      return NextResponse.json(
        { error: "Role tidak valid" },
        { status: 400 }
      )
    }

    // Khusus perawat, validasi nomorSTR dan spesialisasi
    if (role === UserRole.PERAWAT && (!nomorSTR || !spesialisasi)) {
      console.error("Missing required fields for PERAWAT:", { nomorSTR, spesialisasi })
      return NextResponse.json(
        { error: "Nomor STR dan spesialisasi wajib untuk perawat" },
        { status: 400 }
      )
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      )
    }

    // Validate date format
    const parsedDate = new Date(tanggalLahir)
    if (isNaN(parsedDate.getTime())) {
      console.error("Invalid date format:", tanggalLahir)
      return NextResponse.json(
        { error: "Format tanggal lahir tidak valid" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user dengan transaction
    console.log("Starting database transaction for role:", role)
    const user = await prisma.$transaction(async (tx) => {
      // Create base user
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          nama,
          tanggalLahir: parsedDate,
          jenisKelamin,
          nomorTelepon,
          alamat: alamat || null,
          pendidikanTerakhir: pendidikanTerakhir || null,
          pekerjaan: pekerjaan || null,
          role,
        },
      })

      // Create role-specific record
      if (role === UserRole.MASYARAKAT) {
        await tx.masyarakat.create({
          data: {
            userId: newUser.id,
          },
        })
      } else if (role === UserRole.PERAWAT) {
        console.log("Creating Perawat record with STR:", nomorSTR)
        // Check if nomorSTR already exists
        const existingPerawat = await tx.perawat.findUnique({
          where: { nomorSTR },
        })
        
        if (existingPerawat) {
          throw new Error("Nomor STR sudah terdaftar")
        }

        await tx.perawat.create({
          data: {
            userId: newUser.id,
            nomorSTR,
            spesialisasi,
          },
        })
      }

      return newUser
    })

    // Return success tanpa password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        message: "Registrasi berhasil",
        user: userWithoutPassword,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    console.error("Error stack:", (error as Error).stack)
    
    // Handle specific Prisma errors
    const prismaError = error as { code?: string; meta?: { target?: string[] } }
    if (prismaError.code === 'P2002') {
      const field = prismaError.meta?.target?.[0]
      if (field === 'email') {
        return NextResponse.json(
          { error: "Email sudah terdaftar" },
          { status: 400 }
        )
      }
      if (field === 'nomorSTR') {
        return NextResponse.json(
          { error: "Nomor STR sudah terdaftar" },
          { status: 400 }
        )
      }
    }
    
    // Handle transaction errors
    if ((error as Error).message === "Nomor STR sudah terdaftar") {
      return NextResponse.json(
        { error: "Nomor STR sudah terdaftar" },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: (error as Error).message || "Terjadi kesalahan saat registrasi" },
      { status: 500 }
    )
  }
}