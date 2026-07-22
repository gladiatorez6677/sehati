/* Service Worker SehatKi — Web Push pengingat minum obat */

self.addEventListener("install", () => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener("push", (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch (e) {
    data = { title: "Pengingat Minum Obat", body: event.data ? event.data.text() : "" }
  }

  const title = data.title || "Pengingat Minum Obat"
  const options = {
    body: data.body || "Saatnya minum obat Anda.",
    icon: data.icon || "/icon-192.png",
    badge: "/icon-192.png",
    // Getaran panjang & berulang agar lebih terasa seperti alarm
    vibrate: [600, 200, 600, 200, 600, 200, 600, 200, 800],
    silent: false,
    tag: data.tag || "pengingat-obat",
    renotify: true,
    requireInteraction: true,
    data: { url: data.url || "/masyarakat/pengingat-obat" },
  }

  event.waitUntil(
    (async () => {
      await self.registration.showNotification(title, options)
      // Bila ada halaman app yang terbuka, minta mainkan alarm suara di dalam app
      const wins = await self.clients.matchAll({ type: "window", includeUncontrolled: true })
      for (const c of wins) {
        c.postMessage({ type: "reminder-alarm", title, body: options.body })
      }
    })()
  )
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const targetUrl =
    (event.notification.data && event.notification.data.url) || "/masyarakat/pengingat-obat"

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(targetUrl)
          return client.focus()
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl)
      }
    })
  )
})
