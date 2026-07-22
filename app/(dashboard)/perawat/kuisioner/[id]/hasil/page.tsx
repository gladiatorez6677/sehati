"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft, Users, BarChart3, User } from "lucide-react"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"

interface OpsiStat { label: string; jumlah: number; persen: number }
interface Ringkasan {
  pertanyaanId: string
  teks: string
  tipe: "PILIHAN" | "TEKS"
  total: number
  opsi?: OpsiStat[]
  jawabanTeks?: string[]
}
interface Responden {
  id: string
  nama: string
  createdAt: string
  jawaban: { pertanyaanId: string; teks: string; nilai: string }[]
}
interface Hasil {
  judul: string
  deskripsi: string | null
  totalResponden: number
  ringkasan: Ringkasan[]
  responden: Responden[]
}

export default function HasilKuisionerPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [data, setData] = useState<Hasil | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/api/kuisioner/${id}/hasil`)
        if (res.ok) setData(await res.json())
        else router.push("/perawat/kuisioner")
      } finally {
        setIsLoading(false)
      }
    })()
  }, [id, router])

  if (isLoading) {
    return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
  }
  if (!data) return null

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <Button variant="ghost" onClick={() => router.push("/perawat/kuisioner")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
      </Button>

      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{data.judul}</h1>
        {data.deskripsi && <p className="mt-1 text-gray-600 dark:text-gray-400">{data.deskripsi}</p>}
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Users className="h-4 w-4 text-pink-500" />
          <b>{data.totalResponden}</b> responden
        </div>
      </div>

      {data.totalResponden === 0 ? (
        <Card className="p-8"><p className="text-center text-gray-500">Belum ada yang mengisi kuisioner ini.</p></Card>
      ) : (
        <Tabs defaultValue="ringkasan">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="ringkasan"><BarChart3 className="h-4 w-4 mr-1.5" /> Ringkasan</TabsTrigger>
            <TabsTrigger value="responden"><User className="h-4 w-4 mr-1.5" /> Per Responden</TabsTrigger>
          </TabsList>

          <TabsContent value="ringkasan" className="space-y-4">
            {data.ringkasan.map((r, idx) => (
              <Card key={r.pertanyaanId}>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">{idx + 1}. {r.teks}</CardTitle>
                </CardHeader>
                <CardContent>
                  {r.tipe === "PILIHAN" && r.opsi ? (
                    <div className="space-y-2">
                      {r.opsi.map((o) => (
                        <div key={o.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 dark:text-gray-200">{o.label}</span>
                            <span className="text-gray-500">{o.jumlah} ({o.persen}%)</span>
                          </div>
                          <div className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                            <div className="h-full rounded-full bg-pink-500" style={{ width: `${o.persen}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {(r.jawabanTeks || []).length === 0 ? (
                        <p className="text-sm text-gray-400">Belum ada jawaban.</p>
                      ) : (
                        (r.jawabanTeks || []).map((t, i) => (
                          <p key={i} className="rounded-md bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200">
                            {t}
                          </p>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="responden" className="space-y-4">
            {data.responden.map((r) => (
              <Card key={r.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <User className="h-4 w-4 text-pink-500" /> {r.nama}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {format(new Date(r.createdAt), "d MMM yyyy, HH:mm", { locale: localeId })}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {r.jawaban.map((j, i) => (
                    <div key={j.pertanyaanId} className="text-sm">
                      <p className="text-gray-500">{i + 1}. {j.teks}</p>
                      <p className="font-medium text-gray-900 dark:text-white">{j.nilai}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
