"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, CheckCircle, ChevronRight, HelpCircle } from "lucide-react"

interface KuisionerItem {
  id: string
  judul: string
  deskripsi: string | null
  jumlahPertanyaan: number
  sudahDiisi: boolean
}

export default function KuisionerMasyarakatPage() {
  const [items, setItems] = useState<KuisionerItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/kuisioner/masyarakat")
        if (res.ok) setItems(await res.json())
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <ClipboardList className="h-6 w-6 text-pink-500" />
          Kuisioner
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Isi kuisioner kesehatan dari petugas</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
      ) : items.length === 0 ? (
        <Card className="p-8"><p className="text-center text-gray-500">Belum ada kuisioner yang tersedia.</p></Card>
      ) : (
        <div className="space-y-3">
          {items.map((k) => (
            <Card key={k.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between gap-3 py-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{k.judul}</h3>
                    {k.sudahDiisi && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                        <CheckCircle className="h-3 w-3" /> Sudah diisi
                      </Badge>
                    )}
                  </div>
                  {k.deskripsi && <p className="mt-1 text-sm text-gray-500 line-clamp-2">{k.deskripsi}</p>}
                  <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                    <HelpCircle className="h-3.5 w-3.5" /> {k.jumlahPertanyaan} pertanyaan
                  </p>
                </div>
                {k.sudahDiisi ? (
                  <Button variant="outline" size="sm" disabled className="shrink-0">Selesai</Button>
                ) : (
                  <Link href={`/masyarakat/kuisioner/${k.id}`} className="shrink-0">
                    <Button size="sm">Isi <ChevronRight className="h-4 w-4 ml-1" /></Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
