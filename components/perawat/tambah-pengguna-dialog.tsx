"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ClientSelect } from "@/components/ui/client-select"
import { UserPlus, X, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const initial = {
  nama: "",
  email: "",
  password: "",
  tanggalLahir: "",
  jenisKelamin: "L",
  nomorTelepon: "",
  alamat: "",
  role: "MASYARAKAT",
  nomorSTR: "",
  spesialisasi: "",
}

export function TambahPenggunaDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ ...initial })
  const [saving, setSaving] = useState(false)

  const set = (k: keyof typeof initial, v: string) => setForm((f) => ({ ...f, [k]: v }))
  const close = () => { setOpen(false); setForm({ ...initial }) }

  const submit = async () => {
    if (!form.nama || !form.email || !form.password || !form.tanggalLahir || !form.nomorTelepon) {
      toast({ title: "Lengkapi data", description: "Nama, email, password, tanggal lahir, dan telepon wajib diisi", variant: "destructive" })
      return
    }
    if (form.role === "PERAWAT" && (!form.nomorSTR || !form.spesialisasi)) {
      toast({ title: "Lengkapi data", description: "Nomor STR dan spesialisasi wajib untuk perawat", variant: "destructive" })
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/pengguna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const j = await res.json().catch(() => ({}))
      if (res.ok) {
        toast({ title: "Berhasil", description: "Pengguna berhasil ditambahkan" })
        close()
        onCreated()
      } else {
        throw new Error(j.error || "Gagal menambahkan pengguna")
      }
    } catch (e) {
      toast({ title: "Gagal", description: e instanceof Error ? e.message : "Gagal", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4 mr-2" /> Tambah Pengguna
      </Button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={close}>
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b px-6 py-4 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tambah Pengguna</h2>
              <button onClick={close} className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800"><X className="h-5 w-5 text-gray-500" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Nama Lengkap *</label>
                <Input value={form.nama} onChange={(e) => set("nama", e.target.value)} placeholder="Nama" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email *</label>
                <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="email@contoh.com" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Password *</label>
                <Input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Minimal 6 karakter" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Tanggal Lahir *</label>
                  <Input type="date" value={form.tanggalLahir} onChange={(e) => set("tanggalLahir", e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Jenis Kelamin *</label>
                  <ClientSelect value={form.jenisKelamin} onValueChange={(v) => set("jenisKelamin", v)} placeholder="Pilih"
                    items={[{ value: "L", label: "Laki-laki" }, { value: "P", label: "Perempuan" }]} />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">No. Telepon *</label>
                  <Input value={form.nomorTelepon} onChange={(e) => set("nomorTelepon", e.target.value)} placeholder="08xxxx" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Role *</label>
                  <ClientSelect value={form.role} onValueChange={(v) => set("role", v)} placeholder="Pilih"
                    items={[{ value: "MASYARAKAT", label: "Masyarakat" }, { value: "PERAWAT", label: "Perawat" }]} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Alamat</label>
                <Input value={form.alamat} onChange={(e) => set("alamat", e.target.value)} placeholder="Alamat (opsional)" />
              </div>

              {form.role === "PERAWAT" && (
                <div className="grid gap-3 sm:grid-cols-2 rounded-lg bg-pink-50 p-3 dark:bg-pink-950/20">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Nomor STR *</label>
                    <Input value={form.nomorSTR} onChange={(e) => set("nomorSTR", e.target.value)} placeholder="Nomor STR" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Spesialisasi *</label>
                    <Input value={form.spesialisasi} onChange={(e) => set("spesialisasi", e.target.value)} placeholder="mis. Perawat Umum" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t px-6 py-4 dark:border-gray-800">
              <Button variant="outline" onClick={close} disabled={saving}>Batal</Button>
              <Button onClick={submit} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Simpan
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
