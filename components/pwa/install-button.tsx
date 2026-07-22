"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Share, X, Plus } from "lucide-react"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallPWAButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [installed, setInstalled] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    setInstalled(standalone)

    const ua = window.navigator.userAgent.toLowerCase()
    setIsIOS(/iphone|ipad|ipod/.test(ua) && !/crios|fxios/.test(ua))

    const onBIP = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setInstalled(true)
      setDeferred(null)
    }
    window.addEventListener("beforeinstallprompt", onBIP)
    window.addEventListener("appinstalled", onInstalled)
    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP)
      window.removeEventListener("appinstalled", onInstalled)
    }
  }, [])

  if (installed) return null
  // Tampilkan hanya bila bisa di-install (Android/desktop) atau iOS (butuh cara manual)
  if (!deferred && !isIOS) return null

  const handleClick = async () => {
    if (deferred) {
      await deferred.prompt()
      await deferred.userChoice
      setDeferred(null)
    } else if (isIOS) {
      setShowHelp(true)
    }
  }

  return (
    <>
      <Button
        onClick={handleClick}
        size="lg"
        className="gap-2 bg-gradient-to-br from-pink-500 to-pink-600 px-8 text-white hover:from-pink-600 hover:to-pink-700"
      >
        <Download className="h-5 w-5" />
        Install Aplikasi
      </Button>

      {showHelp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Install ke Layar Utama</h3>
              <button onClick={() => setShowHelp(false)} className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              Di Safari (iPhone/iPad), tambahkan aplikasi ini ke layar utama agar bisa dibuka seperti app dan menerima notifikasi:
            </p>
            <ol className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-600">1</span>
                Tekan tombol <Share className="mx-1 inline h-4 w-4" /> <b>Bagikan</b> di bilah bawah Safari
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-600">2</span>
                Pilih <Plus className="mx-1 inline h-4 w-4" /> <b>Tambahkan ke Layar Utama</b>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-600">3</span>
                Tekan <b>Tambah</b> di pojok kanan atas
              </li>
            </ol>
          </div>
        </div>
      )}
    </>
  )
}
