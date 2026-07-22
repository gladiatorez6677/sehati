import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { prisma } from "@/lib/db"
import { webpush, isPushConfigured } from "@/lib/webpush"

export const dynamic = "force-dynamic"

// POST - kirim notifikasi uji ke semua perangkat user yang login
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!isPushConfigured()) {
      return NextResponse.json({ error: "Push belum dikonfigurasi di server" }, { status: 503 })
    }

    const subs = await prisma.pushSubscription.findMany({ where: { userId: session.user.id } })
    if (subs.length === 0) {
      return NextResponse.json({ error: "Belum ada perangkat yang berlangganan. Aktifkan notifikasi dulu." }, { status: 400 })
    }

    const payload = JSON.stringify({
      title: "🔔 Uji Notifikasi SehatKi",
      body: "Notifikasi pengingat obat sudah aktif di perangkat ini.",
      url: "/masyarakat/pengingat-obat",
      tag: "test-notif",
    })

    let sent = 0
    for (const s of subs) {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload)
        sent++
      } catch (err: unknown) {
        const code = (err as { statusCode?: number })?.statusCode
        if (code === 404 || code === 410) {
          await prisma.pushSubscription.delete({ where: { id: s.id } }).catch(() => {})
        }
      }
    }

    return NextResponse.json({ success: true, sent })
  } catch (error) {
    console.error("Error test push:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
