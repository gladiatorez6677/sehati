"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, TrendingUp, AlertTriangle, Info } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

interface KolesterolData {
  id: string
  totalKolesterol: number
  ldl: number
  hdl: number
  trigliserida: number
  tanggalPemeriksaan: string
  rekomendasi: string | null
}

export default function KolesterolPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [measurements, setMeasurements] = useState<KolesterolData[]>([])
  const [formData, setFormData] = useState({
    totalKolesterol: "",
    ldl: "",
    hdl: "",
    trigliserida: "",
  })

  useEffect(() => {
    fetchMeasurements()
  }, [])

  const fetchMeasurements = async () => {
    try {
      const response = await fetch("/api/kolesterol")
      if (response.ok) {
        const data = await response.json()
        setMeasurements(data)
      }
    } catch (error) {
      console.error("Error fetching measurements:", error)
    }
  }

  const getRecommendations = (total: number, ldl: number, hdl: number, trig: number) => {
    const recommendations = []

    // Total Cholesterol
    if (total >= 240) {
      recommendations.push("Total kolesterol Anda tinggi. Kurangi makanan berlemak jenuh.")
    }

    // LDL
    if (ldl >= 160) {
      recommendations.push("LDL (kolesterol jahat) Anda tinggi. Perbanyak konsumsi serat dan olahraga.")
    } else if (ldl >= 130) {
      recommendations.push("LDL Anda di ambang batas. Jaga pola makan sehat.")
    }

    // HDL
    if (hdl < 40) {
      recommendations.push("HDL (kolesterol baik) Anda rendah. Tingkatkan dengan olahraga aerobik.")
    }

    // Triglycerides
    if (trig >= 200) {
      recommendations.push("Trigliserida Anda tinggi. Kurangi gula dan karbohidrat sederhana.")
    }

    if (recommendations.length === 0) {
      recommendations.push("Kadar kolesterol Anda dalam batas normal. Pertahankan gaya hidup sehat!")
    }

    return recommendations.join(" ")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const total = parseInt(formData.totalKolesterol)
    const ldl = parseInt(formData.ldl)
    const hdl = parseInt(formData.hdl)
    const trig = parseInt(formData.trigliserida)

    const rekomendasi = getRecommendations(total, ldl, hdl, trig)

    try {
      const response = await fetch("/api/kolesterol", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          totalKolesterol: total,
          ldl: ldl,
          hdl: hdl,
          trigliserida: trig,
          rekomendasi,
        }),
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: "Data kolesterol berhasil disimpan",
        })
        setFormData({
          totalKolesterol: "",
          ldl: "",
          hdl: "",
          trigliserida: "",
        })
        fetchMeasurements()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan data kolesterol",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (value: number, type: string) => {
    switch (type) {
      case "total":
        if (value < 200) return "text-green-600"
        if (value < 240) return "text-yellow-600"
        return "text-red-600"
      case "ldl":
        if (value < 100) return "text-green-600"
        if (value < 130) return "text-yellow-600"
        return "text-red-600"
      case "hdl":
        if (value >= 60) return "text-green-600"
        if (value >= 40) return "text-yellow-600"
        return "text-red-600"
      case "trigliserida":
        if (value < 150) return "text-green-600"
        if (value < 200) return "text-yellow-600"
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const chartData = measurements.slice(0, 10).reverse().map(m => ({
    tanggal: format(new Date(m.tanggalPemeriksaan), "dd/MM", { locale: id }),
    Total: m.totalKolesterol,
    LDL: m.ldl,
    HDL: m.hdl,
    Trigliserida: m.trigliserida,
  }))

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 ">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Shield className="h-6 w-6 text-green-500" />
          Kontrol Kolesterol
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Monitor dan kelola kadar kolesterol Anda
        </p>
      </div>

      <Tabs defaultValue="input" className="space-y-4">
        <TabsList>
          <TabsTrigger value="input">Input Data</TabsTrigger>
          <TabsTrigger value="riwayat">Riwayat</TabsTrigger>
          <TabsTrigger value="grafik">Grafik Trend</TabsTrigger>
        </TabsList>

        <TabsContent value="input">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Input Hasil Pemeriksaan</CardTitle>
                <CardDescription>
                  Masukkan hasil tes kolesterol Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="total">Total Kolesterol (mg/dL)</Label>
                      <Input
                        id="total"
                        type="number"
                        placeholder="200"
                        value={formData.totalKolesterol}
                        onChange={(e) =>
                          setFormData({ ...formData, totalKolesterol: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="ldl">LDL (mg/dL)</Label>
                      <Input
                        id="ldl"
                        type="number"
                        placeholder="100"
                        value={formData.ldl}
                        onChange={(e) =>
                          setFormData({ ...formData, ldl: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="hdl">HDL (mg/dL)</Label>
                      <Input
                        id="hdl"
                        type="number"
                        placeholder="60"
                        value={formData.hdl}
                        onChange={(e) =>
                          setFormData({ ...formData, hdl: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="trigliserida">Trigliserida (mg/dL)</Label>
                      <Input
                        id="trigliserida"
                        type="number"
                        placeholder="150"
                        value={formData.trigliserida}
                        onChange={(e) =>
                          setFormData({ ...formData, trigliserida: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Menyimpan..." : "Simpan Data"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nilai Normal Kolesterol</CardTitle>
                <CardDescription>
                  Panduan nilai kolesterol yang sehat
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="font-semibold">Total Kolesterol:</p>
                  <div className="pl-4 text-sm space-y-1">
                    <p className="text-green-600">• Baik: &lt;200 mg/dL</p>
                    <p className="text-yellow-600">• Batas Tinggi: 200-239 mg/dL</p>
                    <p className="text-red-600">• Tinggi: ≥240 mg/dL</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">LDL (Kolesterol Jahat):</p>
                  <div className="pl-4 text-sm space-y-1">
                    <p className="text-green-600">• Optimal: &lt;100 mg/dL</p>
                    <p className="text-yellow-600">• Batas Tinggi: 130-159 mg/dL</p>
                    <p className="text-red-600">• Tinggi: ≥160 mg/dL</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">HDL (Kolesterol Baik):</p>
                  <div className="pl-4 text-sm space-y-1">
                    <p className="text-green-600">• Baik: ≥60 mg/dL</p>
                    <p className="text-yellow-600">• Rendah: 40-59 mg/dL</p>
                    <p className="text-red-600">• Sangat Rendah: &lt;40 mg/dL</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Trigliserida:</p>
                  <div className="pl-4 text-sm space-y-1">
                    <p className="text-green-600">• Normal: &lt;150 mg/dL</p>
                    <p className="text-yellow-600">• Batas Tinggi: 150-199 mg/dL</p>
                    <p className="text-red-600">• Tinggi: ≥200 mg/dL</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="riwayat">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pemeriksaan Kolesterol</CardTitle>
            </CardHeader>
            <CardContent>
              {measurements.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Belum ada data pemeriksaan
                </p>
              ) : (
                <div className="space-y-3">
                  {measurements.map((measurement) => (
                    <div
                      key={measurement.id}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-sm">
                            {format(
                              new Date(measurement.tanggalPemeriksaan),
                              "dd MMMM yyyy",
                              { locale: id }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Total</p>
                          <p className={`font-semibold ${getStatusColor(measurement.totalKolesterol, "total")}`}>
                            {measurement.totalKolesterol} mg/dL
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">LDL</p>
                          <p className={`font-semibold ${getStatusColor(measurement.ldl, "ldl")}`}>
                            {measurement.ldl} mg/dL
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">HDL</p>
                          <p className={`font-semibold ${getStatusColor(measurement.hdl, "hdl")}`}>
                            {measurement.hdl} mg/dL
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Trigliserida</p>
                          <p className={`font-semibold ${getStatusColor(measurement.trigliserida, "trigliserida")}`}>
                            {measurement.trigliserida} mg/dL
                          </p>
                        </div>
                      </div>
                      {measurement.rekomendasi && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm flex items-start gap-2">
                            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                            {measurement.rekomendasi}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grafik">
          <Card>
            <CardHeader>
              <CardTitle>Trend Kolesterol</CardTitle>
              <CardDescription>
                Grafik perkembangan kadar kolesterol Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tanggal" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Total"
                        stroke="#8884d8"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="LDL"
                        stroke="#82ca9d"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="HDL"
                        stroke="#ffc658"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="Trigliserida"
                        stroke="#ff7c7c"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Belum ada data untuk ditampilkan
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}