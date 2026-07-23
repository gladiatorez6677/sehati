"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Trophy, Gauge, PlayCircle, User } from "lucide-react"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"

interface Skor {
  id: string
  nama: string
  score: number
  waktuSelesai: number
  achievement: string | null
  createdAt: string
}
interface Hasil {
  nama: string
  kategori: string
  totalSoal: number
  totalMain: number
  pemainUnik: number
  rataRata: number
  tertinggi: number
  skor: Skor[]
}

function fmtWaktu(d: number) {
  if (d < 60) return `${d} dtk`
  const m = Math.floor(d / 60)
  const s = d % 60
  return s ? `${m} mnt ${s} dtk` : `${m} mnt`
}

export default function HasilGamePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [data, setData] = useState<Hasil | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/api/games/${id}/hasil`)
        if (res.ok) setData(await res.json())
        else router.push("/perawat/games")
      } finally {
        setIsLoading(false)
      }
    })()
  }, [id, router])

  if (isLoading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
  if (!data) return null

  const stats = [
    { label: "Total dimainkan", value: data.totalMain, icon: PlayCircle, color: "text-blue-500" },
    { label: "Pemain", value: data.pemainUnik, icon: Users, color: "text-purple-500" },
    { label: "Rata-rata skor", value: data.rataRata, icon: Gauge, color: "text-pink-500" },
    { label: "Skor tertinggi", value: data.tertinggi, icon: Trophy, color: "text-amber-500" },
  ]

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <Button variant="ghost" onClick={() => router.push("/perawat/games")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
      </Button>

      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{data.nama}</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">{data.kategori} • {data.totalSoal} soal</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label}>
              <CardContent className="py-4 text-center">
                <Icon className={`mx-auto mb-1 h-5 w-5 ${s.color}`} />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {data.skor.length === 0 ? (
        <Card className="p-8"><p className="text-center text-gray-500">Belum ada yang memainkan game ini.</p></Card>
      ) : (
        <div className="space-y-2">
          {data.skor.map((s) => (
            <Card key={s.id}>
              <CardContent className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-50 dark:bg-pink-950/20">
                    <User className="h-4 w-4 text-pink-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{s.nama}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(s.createdAt), "d MMM yyyy, HH:mm", { locale: localeId })} • {fmtWaktu(s.waktuSelesai)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {s.achievement && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">{s.achievement}</Badge>}
                  <span className="text-lg font-bold text-pink-600">{s.score}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
