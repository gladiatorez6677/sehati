"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, BellRing, BellOff, Loader2, Send } from "lucide-react"
import { subscribeToPush, pushSupported } from "@/lib/push-client"
import { toast } from "@/hooks/use-toast"

export function PushEnable() {
  const [supported, setSupported] = useState(true)
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const ok = pushSupported()
    setSupported(ok)
    if (ok) {
      setPermission(Notification.permission)
      navigator.serviceWorker?.ready
        ?.then((reg) => reg.pushManager.getSubscription())
        .then((s) => setSubscribed(!!s))
        .catch(() => {})
    }
  }, [])

  const enable = async () => {
    setLoading(true)
    const res = await subscribeToPush()
    setLoading(false)
    if (res.ok) {
      setSubscribed(true)
      setPermission("granted")
      toast({ title: "Notifikasi aktif", description: "Pengingat akan muncul walau aplikasi ditutup." })
    } else {
      toast({ title: "Gagal mengaktifkan", description: res.error, variant: "destructive" })
    }
  }

  const test = async () => {
    setLoading(true)
    try {
      const r = await fetch("/api/push/test", { method: "POST" })
      const j = await r.json().catch(() => ({}))
      if (r.ok) {
        toast({ title: "Notifikasi uji terkirim", description: "Cek layar/notifikasi HP Anda." })
      } else {
        toast({ title: "Gagal", description: j.error || "Gagal mengirim notifikasi uji", variant: "destructive" })
      }
    } finally {
      setLoading(false)
    }
  }

  if (!supported) {
    return (
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="flex items-center gap-3 py-4 text-sm text-amber-800 dark:text-amber-300">
          <BellOff className="h-5 w-5 shrink-0" />
          Browser ini belum mendukung notifikasi push. Gunakan Chrome di Android, dan tambahkan aplikasi ke layar utama (Add to Home Screen) untuk hasil terbaik.
        </CardContent>
      </Card>
    )
  }

  const blocked = permission === "denied"

  return (
    <Card className={subscribed ? "border-green-200 bg-green-50 dark:bg-green-950/20" : "border-pink-200 bg-pink-50 dark:bg-pink-950/20"}>
      <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          {subscribed ? (
            <BellRing className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          ) : (
            <Bell className="mt-0.5 h-5 w-5 shrink-0 text-pink-600" />
          )}
          <div className="text-sm">
            <p className="font-semibold text-gray-900 dark:text-white">
              {subscribed ? "Notifikasi pengingat aktif di perangkat ini" : "Aktifkan notifikasi pengingat"}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {blocked
                ? "Notifikasi diblokir. Aktifkan izin notifikasi untuk situs ini di pengaturan browser."
                : subscribed
                ? "Pengingat akan muncul di HP walau aplikasi ditutup."
                : "Izinkan notifikasi agar pengingat obat muncul tepat waktu, walau aplikasi ditutup."}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          {!subscribed && (
            <Button onClick={enable} disabled={loading || blocked} size="sm">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4 mr-1.5" />}
              Aktifkan
            </Button>
          )}
          {subscribed && (
            <Button onClick={test} disabled={loading} size="sm" variant="outline">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-1.5" />}
              Test
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
