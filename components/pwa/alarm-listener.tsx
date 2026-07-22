"use client"

import { useEffect } from "react"

// Mainkan bunyi alarm keras (Web Audio) saat pengingat tiba DAN app sedang terbuka.
// Untuk kondisi app tertutup, suara mengikuti pengaturan notifikasi HP (di luar kendali web).
function playAlarm() {
  try {
    const AC: typeof AudioContext | undefined =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    const ctx = new AC()
    if (ctx.state === "suspended") void ctx.resume()

    const start = ctx.currentTime
    const beeps = 10
    for (let i = 0; i < beeps; i++) {
      const t = start + i * 0.45
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "square"
      osc.frequency.setValueAtTime(i % 2 === 0 ? 988 : 784, t) // nada bergantian
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.8, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.35)
    }
    if (navigator.vibrate) navigator.vibrate([600, 200, 600, 200, 600, 200, 600])
    setTimeout(() => ctx.close().catch(() => {}), beeps * 500 + 500)
  } catch {
    /* abaikan (mis. autoplay diblokir sebelum ada interaksi) */
  }
}

export function AlarmListener() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return
    const onMsg = (e: MessageEvent) => {
      if (e?.data?.type === "reminder-alarm") playAlarm()
    }
    navigator.serviceWorker.addEventListener("message", onMsg)
    return () => navigator.serviceWorker.removeEventListener("message", onMsg)
  }, [])
  return null
}
