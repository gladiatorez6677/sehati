// Helper Web Push sisi klien

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function pushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  )
}

// Daftarkan SW (jika belum), minta izin, subscribe, lalu simpan ke server.
export async function subscribeToPush(): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!pushSupported()) {
      return { ok: false, error: "Browser tidak mendukung notifikasi push." }
    }

    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!vapidKey) {
      return { ok: false, error: "Konfigurasi notifikasi belum lengkap (VAPID key)." }
    }

    const permission = await Notification.requestPermission()
    if (permission !== "granted") {
      return { ok: false, error: "Izin notifikasi ditolak. Aktifkan lewat pengaturan browser." }
    }

    const registration = await navigator.serviceWorker.register("/sw.js")
    await navigator.serviceWorker.ready

    let subscription = await registration.pushManager.getSubscription()
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })
    }

    const res = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    })

    if (!res.ok) {
      return { ok: false, error: "Gagal menyimpan langganan notifikasi ke server." }
    }

    return { ok: true }
  } catch (err) {
    console.error("subscribeToPush error:", err)
    return { ok: false, error: err instanceof Error ? err.message : "Gagal mengaktifkan notifikasi." }
  }
}
