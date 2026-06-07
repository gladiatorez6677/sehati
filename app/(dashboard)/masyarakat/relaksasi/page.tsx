"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Pause,
  RotateCcw,
  Music,
  Brain,
  Wind,
  Heart,
  Clock,
  Star,
  Headphones,
} from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface Relaksasi {
  id: string
  judul: string
  deskripsi: string
  tipe: string
  durasi: number
  audioUrl?: string
  videoUrl?: string
  instruksi?: string
}

interface SesiRelaksasi {
  id: string
  relaksasiId: string
  relaksasi: Relaksasi
  durasi: number
  selesai: boolean
  createdAt: string
}

export default function RelaksasiPage() {
  const [relaksasiList, setRelaksasiList] = useState<Relaksasi[]>([])
  const [sesiHistory, setSesiHistory] = useState<SesiRelaksasi[]>([])
  const [selectedRelaksasi, setSelectedRelaksasi] = useState<Relaksasi | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRelaksasiData()
    fetchSesiHistory()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isPlaying && selectedRelaksasi) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= selectedRelaksasi.durasi) {
            handleComplete()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    } else if (!isPlaying && interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, selectedRelaksasi])

  const fetchRelaksasiData = async () => {
    try {
      const response = await fetch("/api/relaksasi")
      if (response.ok) {
        const data = await response.json()
        setRelaksasiList(data)
      }
    } catch (error) {
      console.error("Error fetching relaxation data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSesiHistory = async () => {
    try {
      const response = await fetch("/api/relaksasi/sesi")
      if (response.ok) {
        const data = await response.json()
        setSesiHistory(data)
      }
    } catch (error) {
      console.error("Error fetching session history:", error)
    }
  }

  const handlePlay = async (relaksasi: Relaksasi) => {
    setSelectedRelaksasi(relaksasi)
    setCurrentTime(0)
    setIsPlaying(true)

    // Start new session
    try {
      const response = await fetch("/api/relaksasi/sesi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          relaksasiId: relaksasi.id,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSessionId(data.id)
      }
    } catch (error) {
      console.error("Error starting session:", error)
    }
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleResume = () => {
    setIsPlaying(true)
  }

  const handleStop = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    setSelectedRelaksasi(null)
    setSessionId(null)
  }

  const handleComplete = async () => {
    setIsPlaying(false)

    if (sessionId) {
      try {
        await fetch(`/api/relaksasi/sesi/${sessionId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            durasi: currentTime,
            selesai: true,
          }),
        })

        toast({
          title: "Sesi Selesai",
          description: "Selamat! Anda telah menyelesaikan sesi relaksasi.",
        })

        fetchSesiHistory()
      } catch (error) {
        console.error("Error completing session:", error)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "MEDITASI":
        return <Brain className="h-5 w-5" />
      case "MUSIK_RELAKSASI":
        return <Music className="h-5 w-5" />
      case "GUIDED_BREATHING":
        return <Wind className="h-5 w-5" />
      case "PROGRESSIVE_RELAXATION":
        return <Heart className="h-5 w-5" />
      default:
        return <Brain className="h-5 w-5" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "MEDITASI":
        return "Meditasi"
      case "MUSIK_RELAKSASI":
        return "Musik Relaksasi"
      case "GUIDED_BREATHING":
        return "Pernapasan"
      case "PROGRESSIVE_RELAXATION":
        return "Relaksasi Progresif"
      default:
        return type
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 ">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Headphones className="h-6 w-6 text-purple-500" />
          Relaksasi
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Tenangkan pikiran dan tubuh Anda dengan sesi relaksasi
        </p>
      </div>

      <Tabs defaultValue="sesi" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sesi">Sesi Relaksasi</TabsTrigger>
          <TabsTrigger value="riwayat">Riwayat</TabsTrigger>
        </TabsList>

        <TabsContent value="sesi" className="space-y-6">
          {/* Active Session */}
          {selectedRelaksasi && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Sesi Aktif: {selectedRelaksasi.judul}</CardTitle>
                <CardDescription>{selectedRelaksasi.deskripsi}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(selectedRelaksasi.durasi)}</span>
                  </div>
                  <Progress
                    value={(currentTime / selectedRelaksasi.durasi) * 100}
                    className="h-2"
                  />
                </div>

                {selectedRelaksasi.instruksi && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm">{selectedRelaksasi.instruksi}</p>
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  {isPlaying ? (
                    <Button onClick={handlePause} size="lg">
                      <Pause className="h-5 w-5 mr-2" />
                      Jeda
                    </Button>
                  ) : (
                    <Button onClick={handleResume} size="lg">
                      <Play className="h-5 w-5 mr-2" />
                      Lanjutkan
                    </Button>
                  )}
                  <Button onClick={handleStop} variant="outline" size="lg">
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Berhenti
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Sessions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relaksasiList.map((relaksasi) => (
              <Card
                key={relaksasi.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(relaksasi.tipe)}
                      <Badge variant="secondary">
                        {getTypeLabel(relaksasi.tipe)}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {Math.floor(relaksasi.durasi / 60)} menit
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-2">{relaksasi.judul}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {relaksasi.deskripsi}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handlePlay(relaksasi)}
                    className="w-full"
                    disabled={isPlaying}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Mulai Sesi
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="riwayat">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Sesi Relaksasi</CardTitle>
              <CardDescription>
                Track record sesi relaksasi yang telah Anda lakukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sesiHistory.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Belum ada riwayat sesi relaksasi
                </p>
              ) : (
                <div className="space-y-3">
                  {sesiHistory.map((sesi) => (
                    <div
                      key={sesi.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeIcon(sesi.relaksasi.tipe)}
                          <h4 className="font-medium">{sesi.relaksasi.judul}</h4>
                          {sesi.selesai && (
                            <Star className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {format(new Date(sesi.createdAt), "dd MMM yyyy HH:mm", {
                            locale: id,
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {Math.floor(sesi.durasi / 60)} menit
                        </p>
                        <p className="text-xs text-gray-500">
                          {sesi.selesai ? "Selesai" : "Tidak selesai"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}