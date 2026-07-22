"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, Eye, ChevronRight, FileText } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import Link from "next/link"

interface Artikel {
  id: string
  judul: string
  konten: string
  kategori: string
  tipeArtikel: "UTAMA" | "PENDUKUNG" | "LOKAL"
  gambar: string | null
  tags: string | null
  viewCount: number
  createdAt: string
  perawat: {
    user: {
      nama: string
    }
  }
}

const TIPE_TABS = [
  { value: "UTAMA", label: "Artikel Utama" },
  { value: "PENDUKUNG", label: "Artikel Pendukung" },
  { value: "LOKAL", label: "Lokal Berbahasa Daerah" },
] as const

export default function ArtikelMasyarakatPage() {
  const [articles, setArticles] = useState<Artikel[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Artikel[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("semua")
  const [selectedTipe, setSelectedTipe] = useState<"UTAMA" | "PENDUKUNG" | "LOKAL">("UTAMA")
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    "semua",
    "Nutrisi",
    "Olahraga",
    "Penyakit",
    "Kesehatan Mental",
    "Gaya Hidup",
    "Pencegahan"
  ]

  useEffect(() => {
    fetchArticles()
  }, [])

  useEffect(() => {
    filterArticles()
  }, [searchQuery, selectedCategory, selectedTipe, articles])

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/artikel")
      if (response.ok) {
        const data = await response.json()
        setArticles(data)
        setFilteredArticles(data)
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterArticles = () => {
    let filtered = articles

    // Filter by tipe artikel (tab kelompok)
    filtered = filtered.filter(article => article.tipeArtikel === selectedTipe)

    // Filter by category
    if (selectedCategory !== "semua") {
      filtered = filtered.filter(
        article => article.kategori === selectedCategory
      )
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        article =>
          article.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.konten.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (article.tags && article.tags.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredArticles(filtered)
  }

  const getExcerpt = (content: string, maxLength: number = 150) => {
    const plainText = content.replace(/<[^>]*>/g, '')
    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + "..."
      : plainText
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 ">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <FileText className="h-6 w-6 text-blue-500" />
          Artikel Kesehatan
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Baca artikel kesehatan terkini dari para ahli
        </p>
      </div>

      {/* Tabs kelompok artikel */}
      <Tabs
        value={selectedTipe}
        onValueChange={(v) => setSelectedTipe(v as "UTAMA" | "PENDUKUNG" | "LOKAL")}
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          {TIPE_TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="text-xs sm:text-sm">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Cari artikel..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredArticles.length === 0 ? (
        <Card className="p-8">
          <p className="text-center text-gray-500">
            {searchQuery || selectedCategory !== "semua"
              ? "Tidak ada artikel yang ditemukan"
              : `Belum ada artikel pada kelompok "${TIPE_TABS.find((t) => t.value === selectedTipe)?.label}"`}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Link key={article.id} href={`/masyarakat/artikel/${article.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                {article.gambar && (
                  <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
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
                <CardHeader className={!article.gambar ? "" : "pt-4"}>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {article.kategori}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <Eye className="h-3 w-3 mr-1" />
                      {article.viewCount}
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    {article.judul}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {getExcerpt(article.konten)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(new Date(article.createdAt), "d MMM yyyy", {
                        locale: id,
                      })}
                    </div>
                    <p className="text-xs">
                      Oleh: {article.perawat.user.nama}
                    </p>
                  </div>
                  {article.tags && (
                    <div className="mt-2 flex gap-1 flex-wrap">
                      {article.tags.split(",").map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          #{tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex items-center text-primary">
                    <span className="text-sm font-medium">Baca Selengkapnya</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}