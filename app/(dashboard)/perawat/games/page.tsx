"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Gamepad2, Pencil, Trash, HelpCircle, FileText, BarChart3 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Game {
  id: string
  nama: string
  deskripsi: string
  kategori: string
  difficulty: string
  pertanyaan: unknown[]
  artikel: { id: string; judul: string } | null
}

const DIFF_LABEL: Record<string, string> = { MUDAH: "Mudah", SEDANG: "Sedang", SULIT: "Sulit" }

export default function GamesPerawatPage() {
  const router = useRouter()
  const [items, setItems] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/games")
      if (res.ok) setItems(await res.json())
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/games/${deleteId}`, { method: "DELETE" })
      if (res.ok) {
        toast({ title: "Terhapus", description: "Game dihapus" })
        setItems((prev) => prev.filter((g) => g.id !== deleteId))
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
            <Gamepad2 className="h-6 w-6 text-pink-500" /> Manajemen Games
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Buat kuis edukasi yang terhubung dengan artikel</p>
        </div>
        <Button onClick={() => router.push("/perawat/games/baru")}>
          <Plus className="h-4 w-4 mr-2" /> Buat Game
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
      ) : items.length === 0 ? (
        <Card className="p-8"><p className="text-center text-gray-500">Belum ada game. Tekan "Buat Game".</p></Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((g) => (
            <Card key={g.id}>
              <CardContent className="flex flex-col gap-2 py-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{g.nama}</h3>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" title="Hasil" onClick={() => router.push(`/perawat/games/${g.id}/hasil`)}>
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => router.push(`/perawat/games/${g.id}/edit`)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" title="Hapus" onClick={() => setDeleteId(g.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{g.kategori}</Badge>
                  <Badge variant="outline">{DIFF_LABEL[g.difficulty] || g.difficulty}</Badge>
                  <Badge variant="outline" className="gap-1"><HelpCircle className="h-3 w-3" />{Array.isArray(g.pertanyaan) ? g.pertanyaan.length : 0} soal</Badge>
                </div>
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <FileText className="h-3.5 w-3.5" />
                  {g.artikel ? <>Artikel: <span className="truncate">{g.artikel.judul}</span></> : "Tanpa artikel"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus game?</AlertDialogTitle>
            <AlertDialogDescription>Game beserta skor pemain akan terhapus permanen.</AlertDialogDescription>
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
