"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ClientSelect } from "@/components/ui/client-select"
import { Plus, Trash, X, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Soal {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}
const emptySoal = (): Soal => ({ question: "", options: ["", ""], correctAnswer: 0, explanation: "" })

const KATEGORI = ["Nutrisi", "Olahraga", "Penyakit", "Kesehatan Mental", "Gaya Hidup", "Pencegahan"].map((k) => ({ value: k, label: k }))
const DIFFICULTY = [
  { value: "MUDAH", label: "Mudah" },
  { value: "SEDANG", label: "Sedang" },
  { value: "SULIT", label: "Sulit" },
]

export function GameForm({ gameId }: { gameId?: string }) {
  const router = useRouter()
  const isEdit = !!gameId

  const [nama, setNama] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const [kategori, setKategori] = useState("Nutrisi")
  const [difficulty, setDifficulty] = useState("MUDAH")
  const [artikelId, setArtikelId] = useState("")
  const [soal, setSoal] = useState<Soal[]>([emptySoal()])
  const [artikelList, setArtikelList] = useState<{ value: string; label: string }[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/artikel")
      .then((r) => (r.ok ? r.json() : []))
      .then((arts: { id: string; judul: string }[]) =>
        setArtikelList([{ value: "", label: "— Tanpa artikel —" }, ...arts.map((a) => ({ value: a.id, label: a.judul }))]),
      )
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!gameId) return
    ;(async () => {
      try {
        const res = await fetch(`/api/games/${gameId}`)
        if (res.ok) {
          const g = await res.json()
          setNama(g.nama || "")
          setDeskripsi(g.deskripsi || "")
          setKategori(g.kategori || "Nutrisi")
          setDifficulty(g.difficulty || "MUDAH")
          setArtikelId(g.artikelId || "")
          if (Array.isArray(g.pertanyaan) && g.pertanyaan.length) {
            setSoal(
              g.pertanyaan.map((q: Partial<Soal>) => ({
                question: q.question || "",
                options: Array.isArray(q.options) && q.options.length >= 2 ? q.options : ["", ""],
                correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
                explanation: q.explanation || "",
              })),
            )
          }
        } else router.push("/perawat/games")
      } finally {
        setLoading(false)
      }
    })()
  }, [gameId, router])

  const updateSoal = (i: number, patch: Partial<Soal>) => setSoal((s) => s.map((q, idx) => (idx === i ? { ...q, ...patch } : q)))
  const addSoal = () => setSoal((s) => [...s, emptySoal()])
  const removeSoal = (i: number) => setSoal((s) => s.filter((_, idx) => idx !== i))
  const addOpsi = (i: number) => updateSoal(i, { options: [...soal[i].options, ""] })
  const setOpsi = (i: number, oi: number, v: string) => updateSoal(i, { options: soal[i].options.map((o, idx) => (idx === oi ? v : o)) })
  const removeOpsi = (i: number, oi: number) => {
    const opts = soal[i].options.filter((_, idx) => idx !== oi)
    const correct = soal[i].correctAnswer >= opts.length ? 0 : soal[i].correctAnswer
    updateSoal(i, { options: opts, correctAnswer: correct })
  }

  const handleSubmit = async () => {
    if (!nama.trim()) {
      toast({ title: "Lengkapi data", description: "Nama game wajib diisi", variant: "destructive" })
      return
    }
    const clean = soal
      .map((q) => ({ ...q, question: q.question.trim(), options: q.options.map((o) => o.trim()).filter(Boolean) }))
      .filter((q) => q.question)
    if (clean.length === 0) {
      toast({ title: "Lengkapi data", description: "Minimal satu pertanyaan", variant: "destructive" })
      return
    }
    for (const q of clean) {
      if (q.options.length < 2) {
        toast({ title: "Opsi kurang", description: `Pertanyaan "${q.question}" butuh minimal 2 opsi`, variant: "destructive" })
        return
      }
    }

    setSaving(true)
    try {
      const res = await fetch(isEdit ? `/api/games/${gameId}` : "/api/games", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, deskripsi, kategori, difficulty, artikelId: artikelId || null, pertanyaan: clean }),
      })
      if (res.ok) {
        toast({ title: "Tersimpan", description: isEdit ? "Game diperbarui" : "Game dibuat" })
        router.push("/perawat/games")
      } else {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Gagal menyimpan")
      }
    } catch (e) {
      toast({ title: "Gagal", description: e instanceof Error ? e.message : "Gagal menyimpan", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-lg">Informasi Game</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Nama Game *</label>
            <Input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="mis. Kuis Hipertensi" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Deskripsi</label>
            <Textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Penjelasan singkat game" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Kategori</label>
              <ClientSelect value={kategori} onValueChange={setKategori} placeholder="Pilih kategori" items={KATEGORI} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Tingkat Kesulitan</label>
              <ClientSelect value={difficulty} onValueChange={setDifficulty} placeholder="Pilih" items={DIFFICULTY} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Artikel Terkait</label>
            <ClientSelect value={artikelId} onValueChange={setArtikelId} placeholder="Pilih artikel" items={artikelList} />
            <p className="mt-1 text-xs text-gray-500">
              Jika dipilih, masyarakat wajib membaca artikel ini dulu sebelum main (saat masuk dari menu Games), dan bisa lanjut ke game dari halaman artikel.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {soal.map((q, i) => (
          <Card key={i}>
            <CardContent className="space-y-3 py-4">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <label className="mb-1.5 block text-sm font-medium">Pertanyaan {i + 1}</label>
                  <Input value={q.question} onChange={(e) => updateSoal(i, { question: e.target.value })} placeholder="Tulis pertanyaan" />
                </div>
                {soal.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" className="mt-6 text-red-600" onClick={() => removeSoal(i)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Klik lingkaran untuk menandai jawaban benar.</p>
                {q.options.map((o, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateSoal(i, { correctAnswer: oi })}
                      className="shrink-0"
                      aria-label="Tandai benar"
                      title="Tandai sebagai jawaban benar"
                    >
                      <CheckCircle2 className={`h-5 w-5 ${q.correctAnswer === oi ? "text-green-500" : "text-gray-300"}`} />
                    </button>
                    <Input value={o} onChange={(e) => setOpsi(i, oi, e.target.value)} placeholder={`Opsi ${String.fromCharCode(65 + oi)}`} className="max-w-md" />
                    {q.options.length > 2 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeOpsi(i, oi)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addOpsi(i)}>
                  <Plus className="h-4 w-4 mr-1.5" /> Tambah opsi
                </Button>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Penjelasan (opsional)</label>
                <Input value={q.explanation} onChange={(e) => updateSoal(i, { explanation: e.target.value })} placeholder="Muncul setelah menjawab" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button type="button" variant="outline" onClick={addSoal} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Tambah Pertanyaan
      </Button>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.push("/perawat/games")} disabled={saving}>Batal</Button>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Simpan
        </Button>
      </div>
    </div>
  )
}
