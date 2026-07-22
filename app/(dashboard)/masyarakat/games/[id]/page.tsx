"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, CheckCircle, XCircle, Trophy, RotateCcw, ChevronRight, Loader2 } from "lucide-react"

interface Soal {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}
interface Artikel {
  id: string
  judul: string
  konten: string
  gambar: string | null
}
interface Game {
  id: string
  nama: string
  deskripsi: string
  kategori: string
  difficulty: string
  pertanyaan: Soal[]
  artikel: Artikel | null
}

function processContent(content: string) {
  const hasHtml = /<[a-z][\s\S]*>/i.test(content)
  if (hasHtml) return content
  return content.split(/\n\s*\n/).map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`).join("")
}

export default function MainGamePage() {
  const params = useParams()
  const router = useRouter()
  const search = useSearchParams()
  const id = params.id as string
  const fromArtikel = search.get("fromArtikel") === "1"

  const [game, setGame] = useState<Game | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [step, setStep] = useState<"baca" | "main" | "hasil">("main")
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const startRef = useRef<number>(0)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/api/games/${id}`)
        if (!res.ok) { router.push("/masyarakat/games"); return }
        const g: Game = await res.json()
        setGame(g)
        if (g.artikel && !fromArtikel) setStep("baca")
        else { setStep("main"); startRef.current = Date.now() }
      } finally {
        setIsLoading(false)
      }
    })()
  }, [id, router, fromArtikel])

  const startQuiz = () => { startRef.current = Date.now(); setStep("main") }

  const total = game?.pertanyaan.length || 0
  const correctCount = game ? answers.filter((a, i) => a === game.pertanyaan[i]?.correctAnswer).length : 0
  const scorePct = total > 0 ? Math.round((correctCount / total) * 100) : 0

  const chooseOption = (oi: number) => { if (selected === null) setSelected(oi) }

  const nextQuestion = () => {
    if (selected === null) return
    const newAnswers = [...answers, selected]
    setAnswers(newAnswers)
    setSelected(null)
    if (current + 1 < total) setCurrent(current + 1)
    else finish(newAnswers)
  }

  const finish = async (finalAnswers: number[]) => {
    setStep("hasil")
    if (!game) return
    const correct = finalAnswers.filter((a, i) => a === game.pertanyaan[i]?.correctAnswer).length
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0
    const waktu = Math.max(1, Math.round((Date.now() - startRef.current) / 1000))
    const achievement = pct === 100 ? "Sempurna" : pct >= 80 ? "Hebat" : pct >= 60 ? "Baik" : null
    try {
      await fetch("/api/games/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: id, score: pct, waktuSelesai: waktu, achievement }),
      })
      setSaved(true)
    } catch { /* ignore */ }
  }

  const restart = () => {
    setAnswers([]); setCurrent(0); setSelected(null); setSaved(false)
    startRef.current = Date.now(); setStep("main")
  }

  if (isLoading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
  if (!game) return null

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto">
      <Button variant="ghost" onClick={() => router.push("/masyarakat/games")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
      </Button>

      {/* TAHAP BACA ARTIKEL */}
      {step === "baca" && game.artikel && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-sm text-pink-600">
              <BookOpen className="h-4 w-4" /> Baca artikel dulu sebelum main
            </div>
            <CardTitle className="text-xl">{game.artikel.judul}</CardTitle>
          </CardHeader>
          <CardContent>
            {game.artikel.gambar && (
              <div className="aspect-video mb-4 overflow-hidden rounded-lg bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={game.artikel.gambar} alt={game.artikel.judul} className="h-full w-full object-cover" />
              </div>
            )}
            <div
              className="prose prose-sm sm:prose-base max-w-none dark:prose-invert article-content"
              dangerouslySetInnerHTML={{ __html: processContent(game.artikel.konten) }}
            />
            <Button className="mt-6 w-full" onClick={startQuiz}>
              Saya sudah membaca, lanjut ke Kuis <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* TAHAP MAIN KUIS */}
      {step === "main" && total > 0 && (() => {
        const q = game.pertanyaan[current]
        const answered = selected !== null
        return (
          <div>
            <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
              <span>{game.nama}</span>
              <span>Soal {current + 1} / {total}</span>
            </div>
            <div className="mb-4 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div className="h-full bg-pink-500 transition-all" style={{ width: `${((current) / total) * 100}%` }} />
            </div>
            <Card>
              <CardHeader><CardTitle className="text-lg">{q.question}</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {q.options.map((o, oi) => {
                  const isCorrect = oi === q.correctAnswer
                  const isChosen = selected === oi
                  let cls = "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  if (answered) {
                    if (isCorrect) cls = "border-green-500 bg-green-50 dark:bg-green-950/20"
                    else if (isChosen) cls = "border-red-500 bg-red-50 dark:bg-red-950/20"
                    else cls = "border-gray-200 dark:border-gray-700 opacity-60"
                  }
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={answered}
                      onClick={() => chooseOption(oi)}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left text-sm transition-colors ${cls}`}
                    >
                      <span className="text-gray-800 dark:text-gray-100">{o}</span>
                      {answered && isCorrect && <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />}
                      {answered && isChosen && !isCorrect && <XCircle className="h-5 w-5 text-red-500 shrink-0" />}
                    </button>
                  )
                })}

                {answered && q.explanation && (
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-3 text-sm text-blue-800 dark:text-blue-300">
                    {q.explanation}
                  </div>
                )}

                {answered && (
                  <Button className="w-full mt-2" onClick={nextQuestion}>
                    {current + 1 < total ? "Lanjut" : "Lihat Skor"} <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )
      })()}

      {/* TAHAP HASIL */}
      {step === "hasil" && (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-pink-600">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skor Anda</h2>
            <p className="mt-2 text-4xl font-extrabold text-pink-600">{scorePct}</p>
            <p className="mt-1 text-gray-600 dark:text-gray-300">Benar {correctCount} dari {total} soal</p>
            {scorePct >= 60 && (
              <Badge className="mt-3 bg-green-100 text-green-700 hover:bg-green-100">
                {scorePct === 100 ? "Sempurna" : scorePct >= 80 ? "Hebat" : "Baik"}
              </Badge>
            )}
            {!saved && <p className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400"><Loader2 className="h-3 w-3 animate-spin" /> menyimpan skor…</p>}
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="outline" onClick={restart}><RotateCcw className="h-4 w-4 mr-1.5" /> Ulangi</Button>
              <Button onClick={() => router.push("/masyarakat/games")}>Selesai</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
