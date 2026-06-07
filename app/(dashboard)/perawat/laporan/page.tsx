"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ClientSelect } from "@/components/ui/client-select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Users,
  Activity,
  TrendingUp,
  Calendar,
  Heart,
  Brain,
  Shield,
  FileText,
  Download,
  Search,
  BarChart3,
  PieChart,
} from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"
import { id } from "date-fns/locale"
import { toast } from "@/hooks/use-toast"

interface DashboardStats {
  totalUsers: number
  totalMasyarakat: number
  totalPerawat: number
  newUsersThisMonth: number
  tekananDarahRecords: number
  stressAssessments: number
  cholesterolChecks: number
  activeConsultations: number
}

interface HealthTrend {
  date: string
  tekananDarah: number
  stress: number
  kolesterol: number
}

interface CategoryData {
  kategori: string
  count: number
  percentage: number
}

export default function LaporanPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [healthTrends, setHealthTrends] = useState<HealthTrend[]>([])
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState("week")
  const [searchQuery, setSearchQuery] = useState("")
  const [reportType, setReportType] = useState("overview")

  useEffect(() => {
    fetchDashboardData()
  }, [dateRange, reportType])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch statistics
      const statsResponse = await fetch(`/api/laporan/stats?range=${dateRange}`)
      if (!statsResponse.ok) throw new Error("Failed to fetch stats")
      const statsData = await statsResponse.json()
      setStats(statsData)

      // Fetch health trends
      const trendsResponse = await fetch(`/api/laporan/trends?range=${dateRange}`)
      if (!trendsResponse.ok) throw new Error("Failed to fetch trends")
      const trendsData = await trendsResponse.json()
      setHealthTrends(trendsData)

      // Fetch category distribution
      const categoryResponse = await fetch(`/api/laporan/categories`)
      if (!categoryResponse.ok) throw new Error("Failed to fetch categories")
      const categoryData = await categoryResponse.json()
      setCategoryData(categoryData)

    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data laporan",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadReport = async () => {
    try {
      const response = await fetch(`/api/laporan/export?type=${reportType}&range=${dateRange}`)
      if (!response.ok) throw new Error("Failed to generate report")
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `laporan-${reportType}-${dateRange}-${format(new Date(), "yyyy-MM-dd")}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Berhasil",
        description: "Laporan berhasil diunduh",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengunduh laporan",
        variant: "destructive",
      })
    }
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat data laporan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
              Laporan Kesehatan
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Analisis dan statistik kesehatan pengguna
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={downloadReport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label>Periode</Label>
              <ClientSelect
                value={dateRange}
                onValueChange={setDateRange}
                placeholder="Pilih periode"
                items={[
                  { value: "week", label: "Minggu Ini" },
                  { value: "month", label: "Bulan Ini" },
                  { value: "quarter", label: "3 Bulan" },
                  { value: "year", label: "Tahun Ini" },
                ]}
              />
            </div>
            <div>
              <Label>Jenis Laporan</Label>
              <ClientSelect
                value={reportType}
                onValueChange={setReportType}
                placeholder="Pilih jenis"
                items={[
                  { value: "overview", label: "Overview" },
                  { value: "health", label: "Kesehatan" },
                  { value: "users", label: "Pengguna" },
                  { value: "activities", label: "Aktivitas" },
                ]}
              />
            </div>
            <div>
              <Label>Cari</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari data..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalMasyarakat} masyarakat, {stats.totalPerawat} perawat
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengguna Baru</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newUsersThisMonth}</div>
            <p className="text-xs text-muted-foreground">Bulan ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemeriksaan</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.tekananDarahRecords + stats.stressAssessments + stats.cholesterolChecks}
            </div>
            <p className="text-xs text-muted-foreground">Semua jenis pemeriksaan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Konsultasi Aktif</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeConsultations}</div>
            <p className="text-xs text-muted-foreground">Sedang berlangsung</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Health Trends Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tren Pemeriksaan Kesehatan</CardTitle>
            <CardDescription>Jumlah pemeriksaan per hari</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={300} minWidth={300}>
                <LineChart data={healthTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => format(new Date(value), "dd MMM", { locale: id })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => format(new Date(value), "dd MMMM yyyy", { locale: id })}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="tekananDarah" 
                  name="Tekanan Darah"
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="stress" 
                  name="Manajemen Stres"
                  stroke="#82ca9d" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="kolesterol" 
                  name="Kolesterol"
                  stroke="#ffc658" 
                  strokeWidth={2}
                />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Pemeriksaan</CardTitle>
            <CardDescription>Persentase per jenis pemeriksaan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={300} minWidth={300}>
                <RePieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.kategori}: ${entry.percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Health Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Metrik Kesehatan Detail</CardTitle>
          <CardDescription>Data kesehatan agregat pengguna</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            {/* Tekanan Darah */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Tekanan Darah
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Normal</span>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Prehipertensi</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Hipertensi</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stress Level */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Level Stres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Rendah</span>
                    <span className="text-sm font-medium">40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Sedang</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tinggi</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Kolesterol */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Kolesterol
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Normal</span>
                    <span className="text-sm font-medium">70%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Borderline</span>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tinggi</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
          <CardDescription>10 aktivitas pemeriksaan terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pengguna</TableHead>
                <TableHead>Jenis Pemeriksaan</TableHead>
                <TableHead>Hasil</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Sample data - in real app this would come from API */}
              {[
                {
                  user: "Budi Santoso",
                  type: "Tekanan Darah",
                  result: "120/80 mmHg",
                  date: new Date(),
                  status: "Normal",
                },
                {
                  user: "Siti Nurhaliza",
                  type: "Manajemen Stres",
                  result: "Level 7/10",
                  date: new Date(Date.now() - 3600000),
                  status: "Perlu Perhatian",
                },
                {
                  user: "Ahmad Dahlan",
                  type: "Kolesterol",
                  result: "Total: 180 mg/dL",
                  date: new Date(Date.now() - 7200000),
                  status: "Normal",
                },
              ].map((activity, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{activity.user}</TableCell>
                  <TableCell>{activity.type}</TableCell>
                  <TableCell>{activity.result}</TableCell>
                  <TableCell>
                    {format(activity.date, "dd MMM yyyy HH:mm", { locale: id })}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        activity.status === "Normal"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}