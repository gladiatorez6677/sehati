"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlayCircle } from "lucide-react"

export interface VideoData {
  id: string
  judul: string
  deskripsi: string
  url: string
  kategori: string
}

function youTubeEmbed(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  )
  return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1` : null
}

export function VideoGallery({ videos }: { videos: VideoData[] }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {videos.map((video) => {
        const embed = youTubeEmbed(video.url)
        const isActive = activeVideo === video.id
        return (
          <Card
            key={video.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative bg-black aspect-video">
              {isActive ? (
                embed ? (
                  <iframe
                    className="w-full h-full"
                    src={embed}
                    title={video.judul}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    className="w-full h-full"
                    controls
                    autoPlay
                    src={video.url}
                    onEnded={() => setActiveVideo(null)}
                  />
                )
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
                <Badge
                  variant="secondary"
                  className="text-xs bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300"
                >
                  {video.kategori}
                </Badge>
              </div>
              <CardTitle className="text-base mt-2">{video.judul}</CardTitle>
              <CardDescription className="text-sm">{video.deskripsi}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {!isActive && (
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
        )
      })}
    </div>
  )
}
