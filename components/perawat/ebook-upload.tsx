"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Upload, Loader2, X, FileText, ExternalLink } from "lucide-react"

interface EbookUploadProps {
  value?: string
  onChange: (url: string) => void
}

export function EbookUpload({ value, onChange }: EbookUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/artikel/upload-ebook", { method: "POST", body: fd })
      const data = await res.json()
      if (res.ok) {
        onChange(data.url)
        toast({ title: "Berhasil", description: "E-book PDF terunggah" })
      } else {
        throw new Error(data.error || "Upload gagal")
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Gagal mengunggah PDF",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  const fileName = value ? value.split("/").pop() : ""

  return (
    <div className="space-y-3">
      {value ? (
        <div className="flex items-center gap-3 rounded-lg border bg-gray-50 dark:bg-gray-900/40 p-3">
          <FileText className="h-8 w-8 text-red-500 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{fileName}</p>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Lihat PDF
            </a>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-600"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-dashed bg-gray-50 dark:bg-gray-900/40 p-3 text-gray-400">
          <FileText className="h-6 w-6" />
          <span className="text-xs">Belum ada e-book PDF</span>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="application/pdf,.pdf"
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
        {isUploading ? "Mengunggah..." : value ? "Ganti PDF" : "Unggah PDF"}
      </Button>
    </div>
  )
}
