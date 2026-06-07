"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  MapPin, 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  MoreHorizontal,
  Phone,
  Clock,
  Hospital,
  Stethoscope,
  Home,
  Pill,
  Loader2
} from "lucide-react"
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

interface FasilitasKesehatan {
  id: string
  nama: string
  jenis: string
  alamat: string
  latitude: number
  longitude: number
  nomorTelepon?: string
  jamBuka?: string
  jamTutup?: string
  layanan?: string
  createdAt: string
  updatedAt: string
}

export default function FasilitasPage() {
  const [facilities, setFacilities] = useState<FasilitasKesehatan[]>([])
  const [filteredFacilities, setFilteredFacilities] = useState<FasilitasKesehatan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [jenisFilter, setJenisFilter] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingFacility, setEditingFacility] = useState<FasilitasKesehatan | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    nama: "",
    jenis: "Klinik",
    alamat: "",
    latitude: "",
    longitude: "",
    nomorTelepon: "",
    jamBuka: "08:00",
    jamTutup: "17:00",
    layanan: "",
  })

  useEffect(() => {
    fetchFacilities()
  }, [])

  useEffect(() => {
    filterFacilities()
  }, [facilities, searchQuery, jenisFilter])

  const fetchFacilities = async () => {
    try {
      const response = await fetch("/api/fasilitas-kesehatan")
      if (response.ok) {
        const data = await response.json()
        setFacilities(data)
      }
    } catch (error) {
      console.error("Error fetching facilities:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data fasilitas kesehatan",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterFacilities = () => {
    let filtered = [...facilities]

    if (searchQuery) {
      filtered = filtered.filter(
        (f) =>
          f.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.alamat.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (jenisFilter !== "all") {
      filtered = filtered.filter((f) => f.jenis === jenisFilter)
    }

    setFilteredFacilities(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingFacility 
        ? `/api/fasilitas-kesehatan/${editingFacility.id}` 
        : "/api/fasilitas-kesehatan"
      
      const method = editingFacility ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        }),
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: editingFacility 
            ? "Fasilitas kesehatan berhasil diperbarui" 
            : "Fasilitas kesehatan berhasil ditambahkan",
        })
        fetchFacilities()
        handleCloseDialog()
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan data fasilitas kesehatan",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (facility: FasilitasKesehatan) => {
    setEditingFacility(facility)
    setFormData({
      nama: facility.nama,
      jenis: facility.jenis,
      alamat: facility.alamat,
      latitude: facility.latitude.toString(),
      longitude: facility.longitude.toString(),
      nomorTelepon: facility.nomorTelepon || "",
      jamBuka: facility.jamBuka || "08:00",
      jamTutup: facility.jamTutup || "17:00",
      layanan: facility.layanan || "",
    })
    setShowEditDialog(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/fasilitas-kesehatan/${deleteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: "Fasilitas kesehatan berhasil dihapus",
        })
        fetchFacilities()
      } else {
        throw new Error("Failed to delete")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus fasilitas kesehatan",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const handleCloseDialog = () => {
    setShowAddDialog(false)
    setShowEditDialog(false)
    setEditingFacility(null)
    setFormData({
      nama: "",
      jenis: "Klinik",
      alamat: "",
      latitude: "",
      longitude: "",
      nomorTelepon: "",
      jamBuka: "08:00",
      jamTutup: "17:00",
      layanan: "",
    })
  }

  const getJenisIcon = (jenis: string) => {
    switch (jenis) {
      case "RS":
        return <Hospital className="h-4 w-4" />
      case "Klinik":
        return <Stethoscope className="h-4 w-4" />
      case "Puskesmas":
        return <Home className="h-4 w-4" />
      case "Apotek":
        return <Pill className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
              Fasilitas Kesehatan
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Kelola data fasilitas kesehatan
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Fasilitas
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle>Daftar Fasilitas</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Cari fasilitas..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={jenisFilter} onValueChange={setJenisFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter Jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  <SelectItem value="RS">Rumah Sakit</SelectItem>
                  <SelectItem value="Klinik">Klinik</SelectItem>
                  <SelectItem value="Puskesmas">Puskesmas</SelectItem>
                  <SelectItem value="Apotek">Apotek</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredFacilities.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {searchQuery || jenisFilter !== "all" 
                ? "Tidak ada fasilitas yang ditemukan" 
                : "Belum ada data fasilitas kesehatan"}
            </p>
          ) : (
            <>
              {/* Mobile View */}
              <div className="space-y-4 md:hidden">
                {filteredFacilities.map((facility) => (
                  <Card key={facility.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-2 flex-1">
                          {getJenisIcon(facility.jenis)}
                          <div className="space-y-1 flex-1">
                            <h3 className="font-semibold text-sm">{facility.nama}</h3>
                            <Badge variant="outline" className="text-xs">{facility.jenis}</Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(facility)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteId(facility.id)}
                              className="text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex items-start gap-1">
                          <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{facility.alamat}</span>
                        </div>
                        {facility.nomorTelepon && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{facility.nomorTelepon}</span>
                          </div>
                        )}
                        {facility.jamBuka && facility.jamTutup && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{facility.jamBuka} - {facility.jamTutup}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block">
                <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Jam Operasional</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFacilities.map((facility) => (
                  <TableRow key={facility.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getJenisIcon(facility.jenis)}
                        {facility.nama}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{facility.jenis}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {facility.alamat}
                    </TableCell>
                    <TableCell>
                      {facility.nomorTelepon || "-"}
                    </TableCell>
                    <TableCell>
                      {facility.jamBuka && facility.jamTutup 
                        ? `${facility.jamBuka} - ${facility.jamTutup}`
                        : "-"}
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
                          <DropdownMenuItem onClick={() => handleEdit(facility)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteId(facility.id)}
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

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog || showEditDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingFacility ? "Edit Fasilitas Kesehatan" : "Tambah Fasilitas Kesehatan"}
              </DialogTitle>
              <DialogDescription>
                {editingFacility 
                  ? "Perbarui informasi fasilitas kesehatan" 
                  : "Masukkan informasi fasilitas kesehatan baru"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nama">Nama Fasilitas</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="jenis">Jenis</Label>
                <Select 
                  value={formData.jenis} 
                  onValueChange={(value) => setFormData({ ...formData, jenis: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RS">Rumah Sakit</SelectItem>
                    <SelectItem value="Klinik">Klinik</SelectItem>
                    <SelectItem value="Puskesmas">Puskesmas</SelectItem>
                    <SelectItem value="Apotek">Apotek</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Textarea
                  id="alamat"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nomorTelepon">Nomor Telepon</Label>
                <Input
                  id="nomorTelepon"
                  value={formData.nomorTelepon}
                  onChange={(e) => setFormData({ ...formData, nomorTelepon: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="jamBuka">Jam Buka</Label>
                  <Input
                    id="jamBuka"
                    type="time"
                    value={formData.jamBuka}
                    onChange={(e) => setFormData({ ...formData, jamBuka: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="jamTutup">Jam Tutup</Label>
                  <Input
                    id="jamTutup"
                    type="time"
                    value={formData.jamTutup}
                    onChange={(e) => setFormData({ ...formData, jamTutup: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="layanan">Layanan</Label>
                <Textarea
                  id="layanan"
                  placeholder="Contoh: UGD 24 Jam, Rawat Inap, Laboratorium..."
                  value={formData.layanan}
                  onChange={(e) => setFormData({ ...formData, layanan: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  editingFacility ? "Perbarui" : "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Fasilitas Kesehatan?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data fasilitas kesehatan akan dihapus secara permanen.
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