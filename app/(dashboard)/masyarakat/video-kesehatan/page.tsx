"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, PlayCircle } from "lucide-react"

const videos = [
  {
    id: 1,
    judul: "Mengenal Hipertensi",
    deskripsi: "Pelajari apa itu hipertensi, penyebab, dan faktor risiko yang perlu Anda ketahui.",
    url: "/video/Mengenal%20Hipertensi%20fix.mp4",
    kategori: "Edukasi",
  },
  {
    id: 2,
    judul: "Pencegahan Hipertensi",
    deskripsi: "Langkah-langkah efektif untuk mencegah hipertensi melalui gaya hidup sehat.",
    url: "/video/pencegahan%20hipertensi%20fix.mp4",
    kategori: "Pencegahan",
  },
  {
    id: 3,
    judul: "Pengelolaan Hipertensi",
    deskripsi: "Cara mengelola hipertensi dengan tepat agar tekanan darah tetap terkontrol.",
    url: "/video/pengelolaan%20hipertensi%20fix.mp4",
    kategori: "Pengelolaan",
  },
  {
    id: 4,
    judul: "Manajemen Diri Penderita Hipertensi",
    deskripsi: "Panduan mandiri bagi penderita hipertensi untuk menjalani hidup berkualitas.",
    url: "/video/Manajemen%20diri%20penderita%20hipertensi%20fix.mp4",
    kategori: "Manajemen Diri",
  },
]

export default function VideoKesehatanPage() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null)

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Video className="h-6 w-6 text-cyan-500" />
          Video Kesehatan
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Tonton video edukasi kesehatan seputar hipertensi dan cara pencegahannya
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative bg-black aspect-video">
              {activeVideo === video.id ? (
                <video
                  className="w-full h-full"
                  controls
                  autoPlay
                  src={video.url}
                  onEnded={() => setActiveVideo(null)}
                />
              ) : (
                <button
                  className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cyan-900/80 to-cyan-700/60 text-white transition-opacity hover:opacity-90"
                  onClick={() => setActiveVideo(video.id)}
                >
                  <PlayCircle className="h-16 w-16 mb-2 drop-shadow-lg" />
                  <span className="text-sm font-medium">Klik untuk memutar</span>
                </button>
              )}
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
                  {video.kategori}
                </Badge>
              </div>
              <CardTitle className="text-base mt-2">{video.judul}</CardTitle>
              <CardDescription className="text-sm">{video.deskripsi}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {activeVideo !== video.id && (
                <button
                  onClick={() => setActiveVideo(video.id)}
                  className="text-sm text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium flex items-center gap-1"
                >
                  <PlayCircle className="h-4 w-4" />
                  Putar Video
                </button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
