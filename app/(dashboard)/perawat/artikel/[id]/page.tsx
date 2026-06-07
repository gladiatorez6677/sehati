"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Eye, User, Clock, Edit } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface Artikel {
  id: string
  judul: string
  konten: string
  kategori: string
  gambar: string | null
  tags: string | null
  status: string
  viewCount: number
  createdAt: string
  updatedAt: string
  perawat: {
    user: {
      nama: string
    }
    spesialisasi: string
  }
}

export default function ArtikelPerawatDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<Artikel | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchArticle()
  }, [params.id])

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/artikel/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setArticle(data)
      } else {
        router.push("/perawat/artikel")
      }
    } catch (error) {
      console.error("Error fetching article:", error)
      router.push("/perawat/artikel")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!article) {
    return null
  }

  const readingTime = Math.ceil(article.konten.split(' ').length / 200)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED": return "default"
      case "DRAFT": return "secondary"
      case "ARCHIVED": return "outline"
      default: return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PUBLISHED": return "Dipublikasi"
      case "DRAFT": return "Draft"
      case "ARCHIVED": return "Diarsipkan"
      default: return status
    }
  }

  const processContent = (content: string) => {
    const hasHtmlTags = /<[a-z][\s\S]*>/i.test(content)
    if (hasHtmlTags) {
      return content
    }
    return content
      .split(/\n\s*\n/)
      .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br />')}</p>`)
      .join('')
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/perawat/artikel")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <Button
          onClick={() => router.push(`/perawat/artikel/${article.id}/edit`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Artikel
        </Button>
      </div>

      <article>
        {article.gambar && (
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-8">
            <img
              src={article.gambar}
              alt={article.judul}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-image.jpg"
              }}
            />
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">{article.kategori}</Badge>
              <Badge variant={getStatusColor(article.status) as "default" | "secondary" | "destructive" | "outline"}>
                {getStatusText(article.status)}
              </Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {readingTime} menit baca
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Eye className="h-4 w-4 mr-1" />
                {article.viewCount} kali dibaca
              </div>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">{article.judul}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 pb-6 border-b">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1.5" />
                <span>
                  {article.perawat.user.nama} ({article.perawat.spesialisasi})
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1.5" />
                <span>
                  {format(new Date(article.createdAt), "d MMMM yyyy", {
                    locale: id,
                  })}
                </span>
              </div>
            </div>

            {article.tags && (
              <div className="flex gap-2 flex-wrap mb-6">
                {article.tags.split(",").map((tag, index) => (
                  <Badge key={index} variant="outline">
                    #{tag.trim()}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent>
            <div
              className="prose prose-lg max-w-none dark:prose-invert article-content"
              dangerouslySetInnerHTML={{ __html: processContent(article.konten) }}
            />
          </CardContent>
        </Card>
      </article>
    </div>
  )
}
