"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, ClipboardList, BarChart3, Pencil, Trash, Users, HelpCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Kuesioner {
  id: string
  judul: string
  deskripsi: string | null
  aktif: boolean
  _count: { pertanyaan: number; respon: number }
}

export default function KuisionerPerawatPage() {
  const router = useRouter()
  const [items, setItems] = useState<Kuesioner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/kuisioner")
      if (res.ok) setItems(await res.json())
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAktif = async (item: Kuesioner) => {
    setItems((prev) => prev.map((k) => (k.id === item.id ? { ...k, aktif: !k.aktif } : k)))
    await fetch(`/api/kuisioner/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aktif: !item.aktif }),
    }).catch(() => fetchItems())
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/kuisioner/${deleteId}`, { method: "DELETE" })
      if (res.ok) {
        toast({ title: "Terhapus", description: "Kuesioner dihapus" })
        setItems((prev) => prev.filter((k) => k.id !== deleteId))
      }
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <ClipboardList className="h-6 w-6 text-pink-500" />
            Manajemen Kuesioner
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Buat kuesioner dan lihat hasilnya</p>
        </div>
        <Button onClick={() => router.push("/perawat/kuisioner/baru")}>
          <Plus className="h-4 w-4 mr-2" /> Buat Kuesioner
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
      ) : items.length === 0 ? (
        <Card className="p-8"><p className="text-center text-gray-500">Belum ada kuesioner. Tekan "Buat Kuesioner".</p></Card>
      ) : (
        <div className="space-y-3">
          {items.map((k) => (
            <Card key={k.id} className={k.aktif ? "" : "opacity-70"}>
              <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{k.judul}</h3>
                    <Badge variant={k.aktif ? "default" : "secondary"}>{k.aktif ? "Aktif" : "Nonaktif"}</Badge>
                  </div>
                  {k.deskripsi && <p className="mt-1 text-sm text-gray-500 line-clamp-1">{k.deskripsi}</p>}
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><HelpCircle className="h-3.5 w-3.5" />{k._count.pertanyaan} pertanyaan</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{k._count.respon} responden</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleAktif(k)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${k.aktif ? "bg-pink-500" : "bg-gray-300 dark:bg-gray-600"}`}
                    aria-label="Toggle aktif"
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${k.aktif ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/perawat/kuisioner/${k.id}/hasil`)}>
                    <BarChart3 className="h-4 w-4 mr-1.5" /> Hasil
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/perawat/kuisioner/${k.id}/edit`)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => setDeleteId(k.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus kuesioner?</AlertDialogTitle>
            <AlertDialogDescription>Semua pertanyaan dan jawaban responden akan ikut terhapus permanen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
