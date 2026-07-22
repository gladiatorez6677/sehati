import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { webpush, isPushConfigured } from "@/lib/webpush"

export const dynamic = "force-dynamic"

const TZ = "Asia/Makassar" // WITA (UTC+8) — sesuaikan bila perlu

function nowInTz() {
  const now = new Date()
  const hhmm = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now)
  const dateKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now)
  const wd = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short" }).format(now)
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return { hhmm, dateKey, today: dayMap[wd] ?? 0 }
}

async function handle(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  const provided = req.headers.get("x-cron-secret") || new URL(req.url).searchParams.get("secret")
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!isPushConfigured()) {
    return NextResponse.json({ error: "Push (VAPID) belum dikonfigurasi" }, { status: 503 })
  }

  const { hhmm, dateKey, today } = nowInTz()
  const fireKey = `${dateKey} ${hhmm}`

  // Ambil pengingat aktif, lalu saring yang jatuh tempo menit ini
  const reminders = await prisma.pengingatObat.findMany({
    where: { aktif: true },
    include: { masyarakat: { select: { id: true, userId: true } } },
  })

  const due = reminders.filter((r) => {
    const hariOk = r.hari.split(",").map((d) => d.trim()).includes(String(today))
    const jamOk = r.jam.split(",").map((j) => j.trim()).includes(hhmm)
    const notFired = r.lastFiredKey !== fireKey
    return hariOk && jamOk && notFired
  })

  let sent = 0
  let cleaned = 0

  for (const r of due) {
    const userId = r.masyarakat.userId
    const subs = await prisma.pushSubscription.findMany({ where: { userId } })

    const payload = JSON.stringify({
      title: "💊 Waktunya minum obat",
      body: r.dosis ? `${r.namaObat} — ${r.dosis}` : `Saatnya minum ${r.namaObat}`,
      url: "/masyarakat/pengingat-obat",
      tag: `obat-${r.id}-${hhmm}`,
    })

    for (const s of subs) {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload,
        )
        sent++
      } catch (err: unknown) {
        const code = (err as { statusCode?: number })?.statusCode
        if (code === 404 || code === 410) {
          await prisma.pushSubscription.delete({ where: { id: s.id } }).catch(() => {})
          cleaned++
        } else {
          console.error("push send error:", code, err)
        }
      }
    }

    // Catat notifikasi in-app + tandai sudah dikirim (anti-duplikat)
    await prisma.notification.create({
      data: {
        masyarakatId: r.masyarakatId,
        judul: "Pengingat Minum Obat",
        pesan: r.dosis ? `Saatnya minum ${r.namaObat} (${r.dosis})` : `Saatnya minum ${r.namaObat}`,
        tipe: "REMINDER",
      },
    }).catch(() => {})

    await prisma.pengingatObat.update({ where: { id: r.id }, data: { lastFiredKey: fireKey } })
  }

  return NextResponse.json({ ok: true, time: fireKey, dueCount: due.length, sent, cleaned })
}

export async function GET(req: NextRequest) {
  return handle(req)
}
export async function POST(req: NextRequest) {
  return handle(req)
}
