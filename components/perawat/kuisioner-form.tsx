"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash, X, Loader2, GripVertical } from "lucide-react"
import { toast } from "@/hooks/use-toast"

type Tipe = "PILIHAN" | "TEKS"
interface Pertanyaan {
  teks: string
  tipe: Tipe
  opsi: string[]
}

const emptyQuestion = (): Pertanyaan => ({ teks: "", tipe: "PILIHAN", opsi: ["", ""] })

export function KuisionerForm({ kuisionerId }: { kuisionerId?: string }) {
  const router = useRouter()
  const isEdit = !!kuisionerId

  const [judul, setJudul] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const [aktif, setAktif] = useState(true)
  const [questions, setQuestions] = useState<Pertanyaan[]>([emptyQuestion()])
  const [locked, setLocked] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!kuisionerId) return
    ;(async () => {
      try {
        const res = await fetch(`/api/kuisioner/${kuisionerId}`)
        if (res.ok) {
          const d = await res.json()
          setJudul(d.judul || "")
          setDeskripsi(d.deskripsi || "")
          setAktif(!!d.aktif)
          setLocked((d.jumlahResponden || 0) > 0)
          if (Array.isArray(d.pertanyaan) && d.pertanyaan.length) {
            setQuestions(
              d.pertanyaan.map((p: { teks: string; tipe: Tipe; opsi: string[] }) => ({
                teks: p.teks,
                tipe: p.tipe,
                opsi: p.tipe === "PILIHAN" ? (p.opsi.length ? p.opsi : ["", ""]) : [],
              })),
            )
          }
        } else {
          router.push("/perawat/kuisioner")
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [kuisionerId, router])

  const updateQ = (i: number, patch: Partial<Pertanyaan>) =>
    setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)))
  const addQ = () => setQuestions((qs) => [...qs, emptyQuestion()])
  const removeQ = (i: number) => setQuestions((qs) => qs.filter((_, idx) => idx !== i))
  const setTipe = (i: number, tipe: Tipe) =>
    updateQ(i, { tipe, opsi: tipe === "PILIHAN" ? (questions[i].opsi.length ? questions[i].opsi : ["", ""]) : [] })
  const addOpsi = (i: number) => updateQ(i, { opsi: [...questions[i].opsi, ""] })
  const setOpsi = (i: number, oi: number, v: string) =>
    updateQ(i, { opsi: questions[i].opsi.map((o, idx) => (idx === oi ? v : o)) })
  const removeOpsi = (i: number, oi: number) =>
    updateQ(i, { opsi: questions[i].opsi.filter((_, idx) => idx !== oi) })

  const handleSubmit = async () => {
    if (!judul.trim()) {
      toast({ title: "Lengkapi data", description: "Judul kuisioner wajib diisi", variant: "destructive" })
      return
    }
    const clean = questions
      .map((q) => ({ teks: q.teks.trim(), tipe: q.tipe, opsi: q.opsi.map((o) => o.trim()).filter(Boolean) }))
      .filter((q) => q.teks)
    if (!locked && clean.length === 0) {
      toast({ title: "Lengkapi data", description: "Minimal satu pertanyaan", variant: "destructive" })
      return
    }
    for (const q of clean) {
      if (q.tipe === "PILIHAN" && q.opsi.length < 2) {
        toast({ title: "Opsi kurang", description: `Pertanyaan "${q.teks}" butuh minimal 2 opsi`, variant: "destructive" })
        return
      }
    }

    setSaving(true)
    try {
      const res = await fetch(isEdit ? `/api/kuisioner/${kuisionerId}` : "/api/kuisioner", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul, deskripsi, aktif, pertanyaan: clean }),
      })
      if (res.ok) {
        toast({ title: "Tersimpan", description: isEdit ? "Kuisioner diperbarui" : "Kuisioner dibuat" })
        router.push("/perawat/kuisioner")
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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informasi Kuisioner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Judul *</label>
            <Input value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="mis. Survei Pola Hidup Sehat" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Deskripsi (opsional)</label>
            <Textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Penjelasan singkat kuisioner" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={aktif} onChange={(e) => setAktif(e.target.checked)} className="h-4 w-4" />
            Aktif (tampil & bisa diisi masyarakat)
          </label>
        </CardContent>
      </Card>

      {locked && (
        <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
          Kuisioner ini sudah memiliki responden, jadi <b>pertanyaan tidak bisa diubah</b> (agar data jawaban tetap konsisten). Anda tetap bisa mengubah judul, deskripsi, dan status aktif.
        </div>
      )}

      <div className="space-y-4">
        {questions.map((q, i) => (
          <Card key={i} className={locked ? "opacity-70" : ""}>
            <CardContent className="space-y-3 py-4">
              <div className="flex items-start gap-2">
                <GripVertical className="mt-2.5 h-4 w-4 shrink-0 text-gray-400" />
                <div className="flex-1">
                  <label className="mb-1.5 block text-sm font-medium">Pertanyaan {i + 1}</label>
                  <Input
                    value={q.teks}
                    onChange={(e) => updateQ(i, { teks: e.target.value })}
                    placeholder="Tulis pertanyaan"
                    disabled={locked}
                  />
                </div>
                {!locked && questions.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" className="mt-6 text-red-600" onClick={() => removeQ(i)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="flex gap-2 pl-6">
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => setTipe(i, "PILIHAN")}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${q.tipe === "PILIHAN" ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800"}`}
                >
                  Pilihan Ganda
                </button>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => setTipe(i, "TEKS")}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${q.tipe === "TEKS" ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800"}`}
                >
                  Isian Teks
                </button>
              </div>

              {q.tipe === "PILIHAN" && (
                <div className="space-y-2 pl-6">
                  {q.opsi.map((o, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{String.fromCharCode(65 + oi)}.</span>
                      <Input value={o} onChange={(e) => setOpsi(i, oi, e.target.value)} placeholder={`Opsi ${oi + 1}`} disabled={locked} className="max-w-md" />
                      {!locked && q.opsi.length > 2 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeOpsi(i, oi)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {!locked && (
                    <Button type="button" variant="outline" size="sm" onClick={() => addOpsi(i)}>
                      <Plus className="h-4 w-4 mr-1.5" /> Tambah opsi
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {!locked && (
        <Button type="button" variant="outline" onClick={addQ} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Tambah Pertanyaan
        </Button>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.push("/perawat/kuisioner")} disabled={saving}>
          Batal
        </Button>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Simpan
        </Button>
      </div>
    </div>
  )
}
