import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"

// POST - Simpan langganan Web Push milik user yang login
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sub = await req.json()
    const endpoint: string | undefined = sub?.endpoint
    const p256dh: string | undefined = sub?.keys?.p256dh
    const auth: string | undefined = sub?.keys?.auth

    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json({ error: "Data langganan tidak lengkap" }, { status: 400 })
    }

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { userId: session.user.id, p256dh, auth },
      create: { userId: session.user.id, endpoint, p256dh, auth },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving push subscription:", error)
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
  }
}

// DELETE - Hapus langganan (mis. saat nonaktifkan notifikasi)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { endpoint } = await req.json()
    if (endpoint) {
      await prisma.pushSubscription.deleteMany({
        where: { endpoint, userId: session.user.id },
      })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting push subscription:", error)
    return NextResponse.json({ error: "Failed to delete subscription" }, { status: 500 })
  }
}
