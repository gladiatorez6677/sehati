import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    // Test basic database connection
    const userCount = await prisma.user.count()
    const perawatCount = await prisma.perawat.count()
    const masyarakatCount = await prisma.masyarakat.count()
    
    return NextResponse.json({
      status: "Database connected successfully",
      counts: {
        users: userCount,
        perawat: perawatCount,
        masyarakat: masyarakatCount
      }
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      { 
        error: "Database connection failed",
        details: (error as Error).message 
      },
      { status: 500 }
    )
  }
}