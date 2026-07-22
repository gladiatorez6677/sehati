"use client"

import { useEffect } from "react"

export function RegisterSW() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.error("Gagal mendaftarkan service worker:", err)
      })
    }
  }, [])
  return null
}
