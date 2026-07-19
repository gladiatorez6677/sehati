"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Upload, Loader2, X, ImageIcon } from "lucide-react"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/artikel/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (res.ok) {
        onChange(data.url)
        toast({ title: "Berhasil", description: "Gambar terunggah" })
      } else {
        throw new Error(data.error || "Upload gagal")
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Gagal mengunggah gambar",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative w-full max-w-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Pratinjau gambar"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex w-full max-w-sm h-48 items-center justify-center rounded-lg border border-dashed bg-gray-50 dark:bg-gray-900/40 text-gray-400">
          <div className="flex flex-col items-center gap-1">
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs">Belum ada gambar</span>
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
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
        {isUploading ? "Mengunggah..." : value ? "Ganti Gambar" : "Unggah Gambar"}
      </Button>
    </div>
  )
}
