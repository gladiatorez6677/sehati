"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, Trophy, BookOpen, ChevronRight, HelpCircle } from "lucide-react"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"

interface Game {
  id: string
  nama: string
  deskripsi: string
  kategori: string
  difficulty: string
  pertanyaan: unknown[]
  artikel: { id: string; judul: string } | null
}
interface Score {
  id: string
  score: number
  createdAt: string
  achievement: string | null
  game: { nama: string }
}

const DIFF_LABEL: Record<string, string> = { MUDAH: "Mudah", SEDANG: "Sedang", SULIT: "Sulit" }

export default function GamesMasyarakatPage() {
  const [games, setGames] = useState<Game[]>([])
  const [scores, setScores] = useState<Score[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const [g, s] = await Promise.all([
          fetch("/api/games").then((r) => (r.ok ? r.json() : [])),
          fetch("/api/games/scores").then((r) => (r.ok ? r.json() : [])),
        ])
        setGames(g)
        setScores(s)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Gamepad2 className="h-6 w-6 text-pink-500" /> Games Edukasi
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Uji pengetahuan kesehatan Anda dan raih skor terbaik</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
      ) : (
        <>
          {games.length === 0 ? (
            <Card className="p-8"><p className="text-center text-gray-500">Belum ada game tersedia.</p></Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {games.map((g) => (
                <Card key={g.id} className="flex flex-col">
                  <CardContent className="flex flex-1 flex-col gap-2 py-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{g.nama}</h3>
                    {g.deskripsi && <p className="text-sm text-gray-500 line-clamp-2">{g.deskripsi}</p>}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{g.kategori}</Badge>
                      <Badge variant="outline">{DIFF_LABEL[g.difficulty] || g.difficulty}</Badge>
                      <Badge variant="outline" className="gap-1"><HelpCircle className="h-3 w-3" />{Array.isArray(g.pertanyaan) ? g.pertanyaan.length : 0} soal</Badge>
                    </div>
                    {g.artikel && (
                      <p className="flex items-center gap-1 text-xs text-pink-600">
                        <BookOpen className="h-3.5 w-3.5" /> Ada artikel untuk dibaca dulu
                      </p>
                    )}
                    <Link href={`/masyarakat/games/${g.id}`} className="mt-auto pt-2">
                      <Button className="w-full">Main <ChevronRight className="h-4 w-4 ml-1" /></Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {scores.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Trophy className="h-5 w-5 text-amber-500" /> Riwayat Skor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {scores.slice(0, 10).map((s) => (
                  <div key={s.id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{s.game?.nama}</p>
                      <p className="text-xs text-gray-500">{format(new Date(s.createdAt), "d MMM yyyy, HH:mm", { locale: localeId })}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.achievement && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">{s.achievement}</Badge>}
                      <span className="text-lg font-bold text-pink-600">{s.score}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
