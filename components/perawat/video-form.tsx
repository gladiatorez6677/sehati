"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ClientSelect } from "@/components/ui/client-select"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Upload, PlayCircle, Loader2 } from "lucide-react"

const KATEGORI = [
  { value: "Edukasi", label: "Edukasi" },
  { value: "Pencegahan", label: "Pencegahan" },
  { value: "Pengelolaan", label: "Pengelolaan" },
  { value: "Manajemen Diri", label: "Manajemen Diri" },
  { value: "Lainnya", label: "Lainnya" },
]

const STATUS = [
  { value: "PUBLISHED", label: "Dipublikasi" },
  { value: "DRAFT", label: "Draft" },
  { value: "ARCHIVED", label: "Diarsipkan" },
]

export interface VideoFormValues {
  id?: string
  judul: string
  deskripsi: string
  kategori: string
  url: string
  status: string
}

export function VideoForm({ initial }: { initial?: VideoFormValues }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const isEdit = Boolean(initial?.id)

  const [judul, setJudul] = useState(initial?.judul ?? "")
  const [deskripsi, setDeskripsi] = useState(initial?.deskripsi ?? "")
  const [kategori, setKategori] = useState(initial?.kategori ?? "Edukasi")
  const [url, setUrl] = useState(initial?.url ?? "")
  const [status, setStatus] = useState(initial?.status ?? "PUBLISHED")
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/video-kesehatan/upload", {
        method: "POST",
        body: fd,
      })
      const data = await res.json()
      if (res.ok) {
        setUrl(data.url)
        toast({ title: "Berhasil", description: "Video terunggah" })
      } else {
        throw new Error(data.error || "Upload gagal")
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Gagal mengunggah video",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  const handleSubmit = async () => {
    if (!judul.trim() || !deskripsi.trim() || !kategori || !url.trim()) {
      toast({
        title: "Lengkapi data",
        description: "Judul, deskripsi, kategori, dan video/URL wajib diisi.",
        variant: "destructive",
      })
      return
    }
    setIsSaving(true)
    try {
      const res = await fetch(
        isEdit ? `/api/video-kesehatan/${initial!.id}` : "/api/video-kesehatan",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ judul, deskripsi, kategori, url, status }),
        }
      )
      if (res.ok) {
        toast({
          title: "Berhasil",
          description: isEdit ? "Video diperbarui" : "Video ditambahkan",
        })
        router.push("/perawat/video-kesehatan")
        router.refresh()
      } else {
        throw new Error("Gagal menyimpan")
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Gagal menyimpan video",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const isYouTube = /youtu\.?be/.test(url)

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
          {isEdit ? "Edit Video" : "Video Baru"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Video</CardTitle>
          <CardDescription>
            Isi detail video edukasi. Anda bisa mengunggah file MP4 atau menempel URL
            (misalnya tautan YouTube).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Judul</Label>
            <Input
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Mengenal Hipertensi"
            />
          </div>

          <div className="space-y-2">
            <Label>Kategori</Label>
            <ClientSelect
              value={kategori}
              onValueChange={setKategori}
              placeholder="Pilih kategori"
              items={KATEGORI}
            />
          </div>

          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Ringkasan isi video"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Sumber Video</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/video/nama-file.mp4 atau https://youtu.be/..."
                className="flex-1"
              />
              <input
                ref={fileRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleUpload}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {isUploading ? "Mengunggah..." : "Unggah MP4"}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Tempel URL video, atau unggah file MP4 (maks 200 MB).
            </p>
          </div>

          {url && !isYouTube && (
            <div className="rounded-lg overflow-hidden bg-black aspect-video">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video className="w-full h-full" controls src={url} />
            </div>
          )}
          {url && isYouTube && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <PlayCircle className="h-4 w-4" />
              URL YouTube terdeteksi — akan diputar sebagai embed di sisi pengguna.
            </div>
          )}

          <div className="space-y-2">
            <Label>Status</Label>
            <ClientSelect
              value={status}
              onValueChange={setStatus}
              placeholder="Pilih status"
              items={STATUS}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => router.back()} disabled={isSaving}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving || isUploading}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Simpan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
