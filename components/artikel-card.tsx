"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Eye, ImageIcon } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useState } from "react"

interface ArtikelCardProps {
  artikel: {
    id: string
    judul: string
    konten: string
    kategori: string
    gambar: string | null
    viewCount: number
    createdAt: Date
  }
}

export function ArtikelCard({ artikel }: ArtikelCardProps) {
  const [imageError, setImageError] = useState(false)
  
  return (
    <Link href={`/masyarakat/artikel/${artikel.id}`}>
      <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer overflow-hidden">
        {artikel.gambar && !imageError ? (
          <div className="relative h-32 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img 
              src={artikel.gambar} 
              alt={artikel.judul}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-br from-pink-100 to-blue-100 dark:from-pink-900/20 dark:to-blue-900/20 flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-gray-400 dark:text-gray-600" />
          </div>
        )}
        <CardContent className="p-4">
          <div className="inline-block px-2 py-1 text-xs font-medium text-pink-700 bg-pink-100 dark:text-pink-300 dark:bg-pink-900/20 rounded mb-2">
            {artikel.kategori}
          </div>
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-gray-900 dark:text-white">
            {artikel.judul}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {artikel.konten.replace(/<[^>]*>/g, '').substring(0, 80)}...
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{format(artikel.createdAt, "d MMM", { locale: id })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{artikel.viewCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}