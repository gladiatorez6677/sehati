"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, Send } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Pertanyaan {
  id: string
  teks: string
  tipe: "PILIHAN" | "TEKS"
  opsi: string[]
}
interface Kuesioner {
  id: string
  judul: string
  deskripsi: string | null
  pertanyaan: Pertanyaan[]
}

export default function IsiKuisionerPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [data, setData] = useState<Kuesioner | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/api/kuisioner/${id}`)
        if (res.ok) setData(await res.json())
        else router.push("/masyarakat/kuisioner")
      } finally {
        setIsLoading(false)
      }
    })()
  }, [id, router])

  const setAnswer = (pid: string, val: string) => setAnswers((a) => ({ ...a, [pid]: val }))

  const handleSubmit = async () => {
    if (!data) return
    for (const p of data.pertanyaan) {
      if (!answers[p.id] || !answers[p.id].trim()) {
        toast({ title: "Belum lengkap", description: "Semua pertanyaan wajib dijawab", variant: "destructive" })
        return
      }
    }
    setSubmitting(true)
    try {
      const res = await fetch(`/api/kuisioner/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jawaban: data.pertanyaan.map((p) => ({ pertanyaanId: p.id, nilai: answers[p.id] })) }),
      })
      if (res.ok) {
        toast({ title: "Terima kasih", description: "Jawaban Anda berhasil dikirim" })
        router.push("/masyarakat/kuisioner")
      } else {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Gagal mengirim")
      }
    } catch (e) {
      toast({ title: "Gagal", description: e instanceof Error ? e.message : "Gagal mengirim", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
  }
  if (!data) return null

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto">
      <Button variant="ghost" onClick={() => router.push("/masyarakat/kuisioner")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
      </Button>

      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{data.judul}</h1>
        {data.deskripsi && <p className="mt-1 text-gray-600 dark:text-gray-400">{data.deskripsi}</p>}
      </div>

      <div className="space-y-4">
        {data.pertanyaan.map((p, idx) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle className="text-base font-semibold">{idx + 1}. {p.teks}</CardTitle>
              {p.tipe === "PILIHAN" && <CardDescription>Pilih salah satu</CardDescription>}
            </CardHeader>
            <CardContent>
              {p.tipe === "PILIHAN" ? (
                <div className="space-y-2">
                  {p.opsi.map((o) => (
                    <label
                      key={o}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                        answers[p.id] === o
                          ? "border-pink-500 bg-pink-50 dark:bg-pink-950/20"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <input
                        type="radio"
                        name={p.id}
                        value={o}
                        checked={answers[p.id] === o}
                        onChange={() => setAnswer(p.id, o)}
                        className="h-4 w-4 accent-pink-500"
                      />
                      <span className="text-sm text-gray-800 dark:text-gray-100">{o}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <Textarea
                  value={answers[p.id] || ""}
                  onChange={(e) => setAnswer(p.id, e.target.value)}
                  placeholder="Tulis jawaban Anda"
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
          Kirim Jawaban
        </Button>
      </div>
    </div>
  )
}
