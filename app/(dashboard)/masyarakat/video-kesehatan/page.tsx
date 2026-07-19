import { Video } from "lucide-react"
import { prisma } from "@/lib/db"
import { VideoGallery } from "./video-gallery"

export const dynamic = "force-dynamic"

export default async function VideoKesehatanPage() {
  const rows = await prisma.videoKesehatan.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
  })

  const videos = rows.map((v) => ({
    id: v.id,
    judul: v.judul,
    deskripsi: v.deskripsi,
    url: v.url,
    kategori: v.kategori,
  }))

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

      {videos.length === 0 ? (
        <p className="text-center text-gray-500 py-12">Belum ada video tersedia.</p>
      ) : (
        <VideoGallery videos={videos} />
      )}
    </div>
  )
}
