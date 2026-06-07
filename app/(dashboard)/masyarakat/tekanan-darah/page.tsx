"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Heart, Plus, TrendingUp, AlertCircle, Calendar } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface TekananDarahData {
  id: string
  sistolik: number
  diastolik: number
  denyutNadi: number
  tanggalPengukuran: string
  catatan: string | null
  kategori: string
}

export default function TekananDarahPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [measurements, setMeasurements] = useState<TekananDarahData[]>([])
  const [formData, setFormData] = useState({
    sistolik: "",
    diastolik: "",
    denyutNadi: "",
    catatan: "",
  })
  const [selectedMeasurementId, setSelectedMeasurementId] = useState<string | null>(null)

  useEffect(() => {
    fetchMeasurements()
  }, [])

  const fetchMeasurements = async () => {
    try {
      const response = await fetch("/api/tekanan-darah")
      if (response.ok) {
        const data = await response.json()
        setMeasurements(data)
      }
    } catch (error) {
      console.error("Error fetching measurements:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/tekanan-darah", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sistolik: parseInt(formData.sistolik),
          diastolik: parseInt(formData.diastolik),
          denyutNadi: parseInt(formData.denyutNadi),
          catatan: formData.catatan || null,
        }),
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: "Data tekanan darah berhasil disimpan",
        })
        setFormData({
          sistolik: "",
          diastolik: "",
          denyutNadi: "",
          catatan: "",
        })
        fetchMeasurements()
      } else {
        throw new Error("Failed to save measurement")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan data tekanan darah",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getKategoriColor = (kategori: string) => {
    switch (kategori) {
      case "Normal":
        return "text-green-600 bg-green-50"
      case "Prehipertensi":
        return "text-yellow-600 bg-yellow-50"
      case "Hipertensi Stage 1":
        return "text-orange-600 bg-orange-50"
      case "Hipertensi Stage 2":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getSelectedMeasurement = () => {
    if (!selectedMeasurementId) {
      return measurements.length > 0 ? measurements[0] : null
    }
    return measurements.find(m => m.id === selectedMeasurementId) || null
  }

  const selectedMeasurement = getSelectedMeasurement()

  // Set initial selected measurement when data loads
  useEffect(() => {
    if (measurements.length > 0 && !selectedMeasurementId) {
      setSelectedMeasurementId(measurements[0].id)
    }
  }, [measurements, selectedMeasurementId])

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 ">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Heart className="h-6 w-6 text-red-500" />
          Tekanan Darah
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Pantau dan catat tekanan darah Anda secara rutin
        </p>
      </div>

      <Tabs defaultValue="input" className="space-y-4">
        <TabsList>
          <TabsTrigger value="input">Input Data</TabsTrigger>
          <TabsTrigger value="riwayat">Riwayat</TabsTrigger>
          <TabsTrigger value="analisis">Analisis</TabsTrigger>
        </TabsList>

        <TabsContent value="input">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Input Pengukuran
                </CardTitle>
                <CardDescription>
                  Masukkan hasil pengukuran tekanan darah Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sistolik">Sistolik (mmHg)</Label>
                      <Input
                        id="sistolik"
                        type="number"
                        placeholder="120"
                        value={formData.sistolik}
                        onChange={(e) =>
                          setFormData({ ...formData, sistolik: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="diastolik">Diastolik (mmHg)</Label>
                      <Input
                        id="diastolik"
                        type="number"
                        placeholder="80"
                        value={formData.diastolik}
                        onChange={(e) =>
                          setFormData({ ...formData, diastolik: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="denyutNadi">Denyut Nadi (bpm)</Label>
                    <Input
                      id="denyutNadi"
                      type="number"
                      placeholder="70"
                      value={formData.denyutNadi}
                      onChange={(e) =>
                        setFormData({ ...formData, denyutNadi: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="catatan">Catatan (Opsional)</Label>
                    <Textarea
                      id="catatan"
                      placeholder="Tambahkan catatan..."
                      value={formData.catatan}
                      onChange={(e) =>
                        setFormData({ ...formData, catatan: e.target.value })
                      }
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Menyimpan..." : "Simpan Pengukuran"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Panduan Kategori</CardTitle>
                <CardDescription>
                  Klasifikasi tekanan darah menurut AHA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    Normal
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sistolik: &lt;120 mmHg dan Diastolik: &lt;80 mmHg
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                    Prehipertensi
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sistolik: 120-139 mmHg atau Diastolik: 80-89 mmHg
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <p className="font-semibold text-orange-600 dark:text-orange-400">
                    Hipertensi Stage 1
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sistolik: 140-159 mmHg atau Diastolik: 90-99 mmHg
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <p className="font-semibold text-red-600 dark:text-red-400">
                    Hipertensi Stage 2
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sistolik: ≥160 mmHg atau Diastolik: ≥100 mmHg
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="riwayat">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pengukuran</CardTitle>
              <CardDescription>
                Data pengukuran tekanan darah Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              {measurements.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Belum ada data pengukuran
                </p>
              ) : (
                <div className="space-y-3">
                  {measurements.map((measurement) => (
                    <div
                      key={measurement.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">
                            {measurement.sistolik}/{measurement.diastolik} mmHg
                          </p>
                          <p className="text-sm text-gray-600">
                            Denyut Nadi: {measurement.denyutNadi} bpm
                          </p>
                          {measurement.catatan && (
                            <p className="text-sm text-gray-500 mt-1">
                              {measurement.catatan}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getKategoriColor(
                              measurement.kategori
                            )}`}
                          >
                            {measurement.kategori}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            {format(
                              new Date(measurement.tanggalPengukuran),
                              "dd MMM yyyy",
                              { locale: id }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analisis">
          {measurements.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Pilih Pemeriksaan</CardTitle>
                <CardDescription>
                  Pilih tanggal pemeriksaan untuk melihat analisis detail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedMeasurementId || ""} onValueChange={setSelectedMeasurementId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih pemeriksaan" />
                  </SelectTrigger>
                  <SelectContent>
                    {measurements.map((measurement) => (
                      <SelectItem key={measurement.id} value={measurement.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {format(new Date(measurement.tanggalPengukuran), "dd MMMM yyyy HH:mm", { locale: id })}
                          </span>
                          <span className="ml-4 text-sm text-gray-500">
                            {measurement.sistolik}/{measurement.diastolik} mmHg
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hasil Analisis</CardTitle>
                <CardDescription>
                  Analisis pemeriksaan yang dipilih
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedMeasurement ? (
                  <div className="space-y-4">
                    <div
                      className={`p-4 rounded-lg text-center ${getKategoriColor(
                        selectedMeasurement.kategori
                      )}`}
                    >
                      <p className="text-2xl font-bold">
                        {selectedMeasurement.sistolik}/{selectedMeasurement.diastolik}
                      </p>
                      <p className="text-sm mt-1">mmHg</p>
                      <p className="font-semibold mt-2">
                        {selectedMeasurement.kategori}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Tanggal:</span>{" "}
                        {format(
                          new Date(selectedMeasurement.tanggalPengukuran),
                          "dd MMMM yyyy",
                          { locale: id }
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Denyut Nadi:</span>{" "}
                        {selectedMeasurement.denyutNadi} bpm
                      </p>
                      {selectedMeasurement.catatan && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Catatan:</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedMeasurement.catatan}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Belum ada data pengukuran
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rekomendasi</CardTitle>
                <CardDescription>
                  Saran untuk menjaga tekanan darah
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <p className="text-sm">
                    Lakukan pengukuran secara rutin, idealnya pada waktu yang
                    sama setiap hari
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <p className="text-sm">
                    Hindari kafein dan rokok 30 menit sebelum pengukuran
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <p className="text-sm">
                    Duduk dengan nyaman dan rileks selama 5 menit sebelum
                    pengukuran
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <p className="text-sm">
                    Konsultasikan dengan dokter jika tekanan darah Anda
                    konsisten tinggi
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}