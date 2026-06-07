"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"
import {
  MessageCircle,
  Bot,
  User,
  AlertCircle,
  Clock,
  CheckCircle,
  Search,
  Filter,
} from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Consultation {
  id: string
  topik: string
  status: string
  eskalasi: boolean
  createdAt: string
  updatedAt: string
  masyarakat: {
    user: {
      name: string
      email: string
    }
  }
  messages: Array<{
    id: string
    role: string
    content: string
    timestamp: string
  }>
}

export default function PerawatKonsultasiPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([])
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [eskalasiFilter, setEskalasiFilter] = useState("all")

  useEffect(() => {
    fetchConsultations()
    // Refresh every 30 seconds
    const interval = setInterval(fetchConsultations, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    filterConsultations()
  }, [consultations, searchQuery, statusFilter, eskalasiFilter])

  const fetchConsultations = async () => {
    try {
      const response = await fetch("/api/perawat/konsultasi")
      if (response.ok) {
        const data = await response.json()
        setConsultations(data)
      }
    } catch (error) {
      console.error("Error fetching consultations:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data konsultasi",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterConsultations = () => {
    let filtered = [...consultations]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.topik.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.masyarakat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter)
    }

    // Eskalasi filter
    if (eskalasiFilter !== "all") {
      filtered = filtered.filter((c) => 
        eskalasiFilter === "yes" ? c.eskalasi : !c.eskalasi
      )
    }

    setFilteredConsultations(filtered)
  }

  const handleTakeOver = async (consultationId: string) => {
    try {
      const response = await fetch(`/api/perawat/konsultasi/${consultationId}/takeover`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: "Konsultasi berhasil diambil alih",
        })
        fetchConsultations()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengambil alih konsultasi",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700"
      case "CLOSED":
        return "bg-gray-100 text-gray-700"
      case "ESCALATED":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
          Monitoring Konsultasi AI
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Monitor dan kelola konsultasi AI yang memerlukan perhatian
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Cari konsultasi..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="ACTIVE">Aktif</SelectItem>
                <SelectItem value="CLOSED">Selesai</SelectItem>
                <SelectItem value="ESCALATED">Eskalasi</SelectItem>
              </SelectContent>
            </Select>
            <Select value={eskalasiFilter} onValueChange={setEskalasiFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter Eskalasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="yes">Perlu Eskalasi</SelectItem>
                <SelectItem value="no">Normal</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>{filteredConsultations.length} konsultasi</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consultation List */}
        <div className="lg:col-span-1">
          <Card className="h-[600px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Daftar Konsultasi</CardTitle>
              <CardDescription className="text-sm">
                Klik untuk melihat detail percakapan
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[520px] px-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredConsultations.length === 0 ? (
                  <p className="text-center text-gray-500 py-8 text-sm">
                    Tidak ada konsultasi ditemukan
                  </p>
                ) : (
                  <div className="space-y-2 pb-4">
                    {filteredConsultations.map((consultation) => (
                      <button
                        key={consultation.id}
                        onClick={() => setSelectedConsultation(consultation)}
                        className={`w-full text-left p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                          selectedConsultation?.id === consultation.id
                            ? "bg-primary/10 border-primary"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm line-clamp-1">
                              {consultation.masyarakat.user.name}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {consultation.topik}
                            </p>
                          </div>
                          {consultation.eskalasi && (
                            <AlertCircle className="h-4 w-4 text-orange-500 flex-shrink-0 ml-2" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-xs ${getStatusColor(consultation.status)}`}
                          >
                            {consultation.status === "ACTIVE" ? "Aktif" : 
                             consultation.status === "CLOSED" ? "Selesai" : "Eskalasi"}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {format(new Date(consultation.updatedAt), "d MMM HH:mm", {
                              locale: id,
                            })}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chat Detail */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            {selectedConsultation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {selectedConsultation.masyarakat.user.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {selectedConsultation.topik}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`text-xs ${getStatusColor(selectedConsultation.status)}`}>
                          {selectedConsultation.status === "ACTIVE" ? "Aktif" : 
                           selectedConsultation.status === "CLOSED" ? "Selesai" : "Eskalasi"}
                        </Badge>
                        {selectedConsultation.eskalasi && (
                          <Badge variant="destructive" className="text-xs">
                            Perlu Eskalasi
                          </Badge>
                        )}
                      </div>
                    </div>
                    {selectedConsultation.status === "ACTIVE" && selectedConsultation.eskalasi && (
                      <Button
                        size="sm"
                        onClick={() => handleTakeOver(selectedConsultation.id)}
                      >
                        Ambil Alih
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                      {selectedConsultation.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${
                            message.role === "user" ? "justify-end" : ""
                          }`}
                        >
                          {message.role === "assistant" && (
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                              <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-gray-100 dark:bg-gray-800"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">
                              {message.content}
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                message.role === "user"
                                  ? "text-primary-foreground/70"
                                  : "text-gray-500"
                              }`}
                            >
                              {format(new Date(message.timestamp), "HH:mm")}
                            </p>
                          </div>
                          {message.role === "user" && (
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                              <User className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Pilih Konsultasi
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    Pilih konsultasi dari daftar untuk melihat detail percakapan
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <MessageCircle className="h-6 w-6 text-gray-400 mb-2" />
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-xl font-bold">{consultations.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <Clock className="h-6 w-6 text-green-400 mb-2" />
              <p className="text-xs text-gray-500">Aktif</p>
              <p className="text-xl font-bold text-green-600">
                {consultations.filter((c) => c.status === "ACTIVE").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="h-6 w-6 text-orange-400 mb-2" />
              <p className="text-xs text-gray-500">Eskalasi</p>
              <p className="text-xl font-bold text-orange-600">
                {consultations.filter((c) => c.eskalasi).length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="h-6 w-6 text-blue-400 mb-2" />
              <p className="text-xs text-gray-500">Selesai</p>
              <p className="text-xl font-bold text-blue-600">
                {consultations.filter((c) => 
                  c.status === "CLOSED" && 
                  new Date(c.updatedAt).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}