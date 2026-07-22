"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, Edit, Trash, Eye, MoreHorizontal } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Artikel {
  id: string
  judul: string
  kategori: string
  tipeArtikel: "UTAMA" | "PENDUKUNG" | "LOKAL"
  status: string
  viewCount: number
  createdAt: string
}

const TIPE_LABEL: Record<string, string> = {
  UTAMA: "Utama",
  PENDUKUNG: "Pendukung",
  LOKAL: "Lokal Berbahasa Daerah",
}

export default function ArtikelPerawatPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<Artikel[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/artikel/perawat")
      if (response.ok) {
        const data = await response.json()
        setArticles(data)
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/artikel/${deleteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: "Artikel berhasil dihapus",
        })
        fetchArticles()
      } else {
        throw new Error("Failed to delete")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus artikel",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "default"
      case "DRAFT":
        return "secondary"
      case "ARCHIVED":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "Dipublikasi"
      case "DRAFT":
        return "Draft"
      case "ARCHIVED":
        return "Diarsipkan"
      default:
        return status
    }
  }

  const filteredArticles = articles.filter(article =>
    article.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.kategori.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
              Manajemen Artikel
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Kelola artikel kesehatan untuk masyarakat
            </p>
          </div>
          <Button onClick={() => router.push("/perawat/artikel/baru")}>
            <Plus className="h-4 w-4 mr-2" />
            Artikel Baru
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle>Daftar Artikel</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Cari artikel..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredArticles.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {searchQuery ? "Tidak ada artikel yang ditemukan" : "Belum ada artikel"}
            </p>
          ) : (
            <>
              {/* Mobile View */}
              <div className="space-y-4 md:hidden">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-sm line-clamp-2 flex-1 pr-2">{article.judul}</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/perawat/artikel/${article.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/perawat/artikel/${article.id}/edit`)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteId(article.id)}
                              className="text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <Badge variant="secondary">{TIPE_LABEL[article.tipeArtikel]}</Badge>
                        <Badge variant="outline">{article.kategori}</Badge>
                        <Badge variant={getStatusColor(article.status) as "default" | "secondary" | "destructive" | "outline"}>
                          {getStatusText(article.status)}
                        </Badge>
                        <span className="text-gray-500">{article.viewCount} views</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {mounted ? format(new Date(article.createdAt), "d MMM yyyy", { locale: id }) : ""}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block">
                <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">
                      {article.judul}
                    </TableCell>
                    <TableCell>{article.kategori}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{TIPE_LABEL[article.tipeArtikel]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(article.status) as "default" | "secondary" | "destructive" | "outline"}>
                        {getStatusText(article.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{article.viewCount}</TableCell>
                    <TableCell>
                      {mounted ? format(new Date(article.createdAt), "d MMM yyyy", {
                        locale: id,
                      }) : ""}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/perawat/artikel/${article.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/perawat/artikel/${article.id}/edit`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteId(article.id)}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Artikel?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Artikel akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}