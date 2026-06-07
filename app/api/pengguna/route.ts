import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

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