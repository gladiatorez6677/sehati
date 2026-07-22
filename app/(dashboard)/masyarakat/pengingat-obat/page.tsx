"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Pill, Plus, Trash, Clock, X, Loader2, Pencil } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { PushEnable } from "@/components/masyarakat/push-enable"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Pengingat {
  id: string
  namaObat: string
  dosis: string | null
  catatan: string | null
  jam: string
  hari: string
  aktif: boolean
}

// Label per nomor hari JS (0=Minggu .. 6=Sabtu)
const HARI_LABEL = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
// Urutan tampil: Senin dulu s/d Minggu
const HARI_ORDER = [1, 2, 3, 4, 5, 6, 0]
const SEMUA_HARI = [0, 1, 2, 3, 4, 5, 6]

export default function PengingatObatPage() {
  const [items, setItems] = useState<Pengingat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)

  // Form state
  const [namaObat, setNamaObat] = useState("")
  const [dosis, setDosis] = useState("")
  const [catatan, setCatatan] = useState("")
  const [jamList, setJamList] = useState<string[]>(["08:00"])
  const [hariSet, setHariSet] = useState<Set<number>>(new Set([0, 1, 2, 3, 4, 5, 6]))

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/pengingat-obat")
      if (res.ok) setItems(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setNamaObat("")
    setDosis("")
    setCatatan("")
    setJamList(["08:00"])
    setHariSet(new Set([0, 1, 2, 3, 4, 5, 6]))
    setEditId(null)
  }

  const startEdit = (item: Pengingat) => {
    setEditId(item.id)
    setNamaObat(item.namaObat)
    setDosis(item.dosis || "")
    setCatatan(item.catatan || "")
    setJamList(item.jam.split(",").map((j) => j.trim()).filter(Boolean))
    setHariSet(new Set(item.hari.split(",").map((d) => parseInt(d.trim(), 10)).filter((n) => !isNaN(n))))
    setShowForm(true)
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const openNew = () => {
    resetForm()
    setShowForm(true)
  }

  const toggleHari = (d: number) => {
    setHariSet((prev) => {
      const next = new Set(prev)
      if (next.has(d)) next.delete(d)
      else next.add(d)
      return next
    })
  }

  const addJam = () => setJamList((p) => [...p, "12:00"])
  const removeJam = (i: number) => setJamList((p) => p.filter((_, idx) => idx !== i))
  const setJam = (i: number, v: string) => setJamList((p) => p.map((j, idx) => (idx === i ? v : j)))

  const handleSave = async () => {
    if (!namaObat.trim()) {
      toast({ title: "Lengkapi data", description: "Nama obat wajib diisi", variant: "destructive" })
      return
    }
    const jam = Array.from(new Set(jamList.filter(Boolean)))
    if (jam.length === 0) {
      toast({ title: "Lengkapi data", description: "Minimal satu jam pengingat", variant: "destructive" })
      return
    }
    if (hariSet.size === 0) {
      toast({ title: "Lengkapi data", description: "Pilih minimal satu hari", variant: "destructive" })
      return
    }

    setSaving(true)
    try {
      const res = await fetch(
        editId ? `/api/pengingat-obat/${editId}` : "/api/pengingat-obat",
        {
          method: editId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            namaObat,
            dosis,
            catatan,
            jam,
            hari: Array.from(hariSet).map(String),
          }),
        },
      )
      if (res.ok) {
        toast({
          title: "Tersimpan",
          description: editId ? "Pengingat berhasil diperbarui" : "Pengingat obat berhasil dibuat",
        })
        resetForm()
        setShowForm(false)
        fetchItems()
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

  const toggleAktif = async (item: Pengingat) => {
    // optimistic
    setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, aktif: !p.aktif } : p)))
    try {
      await fetch(`/api/pengingat-obat/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aktif: !item.aktif }),
      })
    } catch {
      fetchItems()
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/pengingat-obat/${deleteId}`, { method: "DELETE" })
      if (res.ok) {
        toast({ title: "Terhapus", description: "Pengingat dihapus" })
        setItems((prev) => prev.filter((p) => p.id !== deleteId))
      }
    } finally {
      setDeleteId(null)
    }
  }

  const hariLabel = (hari: string) => {
    const set = new Set(hari.split(",").map((d) => parseInt(d.trim(), 10)).filter((n) => !isNaN(n)))
    if (set.size === 7) return "Senin–Minggu (setiap hari)"
    return HARI_ORDER.filter((d) => set.has(d)).map((d) => HARI_LABEL[d]).join(", ")
  }

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Pill className="h-6 w-6 text-pink-500" />
          Pengingat Minum Obat
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Atur jadwal minum obat. Notifikasi akan muncul tepat waktu di HP Anda.
        </p>
      </div>

      <div className="mb-6">
        <PushEnable />
      </div>

      {!showForm && (
        <Button onClick={openNew} className="mb-6">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Pengingat
        </Button>
      )}

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{editId ? "Edit Pengingat" : "Pengingat Baru"}</CardTitle>
            <CardDescription>Isi detail obat dan waktu pengingat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Nama Obat *</label>
              <Input value={namaObat} onChange={(e) => setNamaObat(e.target.value)} placeholder="mis. Amlodipin" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Dosis (opsional)</label>
                <Input value={dosis} onChange={(e) => setDosis(e.target.value)} placeholder="mis. 1 tablet 5mg" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Catatan (opsional)</label>
                <Input value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="mis. sesudah makan" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Jam Pengingat *</label>
              <div className="space-y-2">
                {jamList.map((j, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input type="time" value={j} onChange={(e) => setJam(i, e.target.value)} className="w-40" />
                    {jamList.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeJam(i)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addJam}>
                  <Plus className="h-4 w-4 mr-1.5" /> Tambah jam
                </Button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Hari</label>
              <div className="flex flex-wrap gap-2">
                {HARI_ORDER.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleHari(d)}
                    className={`h-9 w-12 rounded-md text-sm font-medium transition-colors ${
                      hariSet.has(d)
                        ? "bg-pink-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {HARI_LABEL[d]}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-3">
                <button type="button" className="text-xs text-pink-600 hover:underline" onClick={() => setHariSet(new Set(SEMUA_HARI))}>
                  Pilih semua (Senin–Minggu)
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => { setShowForm(false); resetForm() }} disabled={saving}>
                Batal
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Simpan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : items.length === 0 ? (
        <Card className="p-8">
          <p className="text-center text-gray-500">Belum ada pengingat. Tekan "Tambah Pengingat" untuk membuat.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className={item.aktif ? "" : "opacity-60"}>
              <CardContent className="flex items-start justify-between gap-3 py-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-pink-500 shrink-0" />
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.namaObat}</h3>
                    {item.dosis && <span className="text-sm text-gray-500">• {item.dosis}</span>}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {item.jam.split(",").map((j) => (
                      <Badge key={j} variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {j.trim()}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">{hariLabel(item.hari)}</p>
                  {item.catatan && <p className="mt-1 text-xs text-gray-500 italic">{item.catatan}</p>}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <button
                    type="button"
                    onClick={() => toggleAktif(item)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${item.aktif ? "bg-pink-500" : "bg-gray-300 dark:bg-gray-600"}`}
                    aria-label={item.aktif ? "Nonaktifkan" : "Aktifkan"}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${item.aktif ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-300" onClick={() => startEdit(item)} aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => setDeleteId(item.id)} aria-label="Hapus">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus pengingat?</AlertDialogTitle>
            <AlertDialogDescription>Pengingat ini akan dihapus permanen.</AlertDialogDescription>
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
