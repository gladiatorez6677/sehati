"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Users, UserCheck, Calendar } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { toast } from "@/hooks/use-toast"

interface User {
  id: string
  email: string
  nama: string
  role: string
  jenisKelamin: string
  nomorTelepon: string
  tanggalLahir: string
  createdAt: string
  masyarakat?: {
    id: string
  }
  perawat?: {
    id: string
    nomorSTR: string
    spesialisasi: string
  }
}

export default function PenggunaPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchQuery, roleFilter])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/pengguna")
      if (!response.ok) throw new Error("Failed to fetch users")
      
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data pengguna",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.nomorTelepon.includes(searchQuery)
      )
    }

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "MASYARAKAT":
        return <Badge variant="secondary">Masyarakat</Badge>
      case "PERAWAT":
        return <Badge variant="default">Perawat</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getGenderText = (gender: string) => {
    return gender === "L" ? "Laki-laki" : "Perempuan"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat data pengguna...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
          Data Pengguna
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Kelola dan lihat informasi semua pengguna aplikasi
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pengguna
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Masyarakat
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {users.filter(u => u.role === "MASYARAKAT").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Perawat
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {users.filter(u => u.role === "PERAWAT").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filter Pengguna</CardTitle>
          <CardDescription className="text-sm">
            Cari dan filter data pengguna
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama, email, atau nomor telepon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-sm"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Role</SelectItem>
                <SelectItem value="MASYARAKAT">Masyarakat</SelectItem>
                <SelectItem value="PERAWAT">Perawat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daftar Pengguna</CardTitle>
          <CardDescription className="text-sm">
            Total {filteredUsers.length} pengguna ditemukan
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {/* Mobile Card View */}
          <div className="block sm:hidden">
            <div className="space-y-4 p-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Tidak ada pengguna ditemukan</p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <Card key={user.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base">{user.nama}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.perawat && (
                          <p className="text-xs text-muted-foreground mt-1">
                            STR: {user.perawat.nomorSTR}
                          </p>
                        )}
                      </div>
                      <div className="ml-2">
                        {getRoleBadge(user.role)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Jenis Kelamin</p>
                        <p className="font-medium">{getGenderText(user.jenisKelamin)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">No. Telepon</p>
                        <p className="font-medium">{user.nomorTelepon}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Tanggal Lahir</p>
                        <p className="font-medium">
                          {mounted ? format(new Date(user.tanggalLahir), "d MMM yyyy", {
                            locale: id,
                          }) : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Bergabung</p>
                        <p className="font-medium">
                          {mounted ? format(new Date(user.createdAt), "d MMM yyyy", {
                            locale: id,
                          }) : ""}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Tidak ada pengguna ditemukan</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Jenis Kelamin</TableHead>
                    <TableHead>No. Telepon</TableHead>
                    <TableHead>Tanggal Lahir</TableHead>
                    <TableHead>Bergabung</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.nama}
                      {user.perawat && (
                        <div className="text-sm text-muted-foreground">
                          STR: {user.perawat.nomorSTR}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getGenderText(user.jenisKelamin)}</TableCell>
                    <TableCell>{user.nomorTelepon}</TableCell>
                    <TableCell>
                      {mounted ? format(new Date(user.tanggalLahir), "d MMM yyyy", {
                        locale: id,
                      }) : ""}
                    </TableCell>
                    <TableCell>
                      {mounted ? format(new Date(user.createdAt), "d MMM yyyy", {
                        locale: id,
                      }) : ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}