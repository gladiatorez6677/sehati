import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { VideoForm } from "@/components/perawat/video-form"

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const video = await prisma.videoKesehatan.findUnique({ where: { id } })
  if (!video) notFound()

  return (
    <VideoForm
      initial={{
        id: video.id,
        judul: video.judul,
        deskripsi: video.deskripsi,
        kategori: video.kategori,
        url: video.url,
        status: video.status,
      }}
    />
  )
}
