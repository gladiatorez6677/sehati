import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, BarChart, Activity, Bot, Home, FileBarChart, ChevronRight, MapPin, Video, ClipboardList, Gamepad2 } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/db"

export default async function PerawatDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "PERAWAT") {
    redirect("/")
  }

  // Fetch statistics
  const [totalUsers, totalArticles, totalConsultations] = await Promise.all([
    prisma.user.count(),
    prisma.artikelKesehatan.count({ where: { status: "PUBLISHED" } }),
    prisma.konsultasiAI.count({ where: { status: "ACTIVE" } }),
  ])

  const quickAccessItems = [
    {
      title: "Dashboard",
      description: "Overview sistem",
      icon: Home,
      href: "/perawat",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Artikel",
      description: "Kelola artikel",
      icon: FileText,
      href: "/perawat/artikel",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Video",
      description: "Kelola video",
      icon: Video,
      href: "/perawat/video-kesehatan",
      color: "text-cyan-500",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    },
    {
      title: "Konsultasi AI",
      description: "Monitor konsultasi",
      icon: Bot,
      href: "/perawat/konsultasi",
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
    },
    {
      title: "Kuesioner",
      description: "Buat & lihat hasil",
      icon: ClipboardList,
      href: "/perawat/kuisioner",
      color: "text-rose-500",
      bgColor: "bg-rose-50 dark:bg-rose-900/20",
    },
    {
      title: "Games",
      description: "Kuis + artikel",
      icon: Gamepad2,
      href: "/perawat/games",
      color: "text-fuchsia-500",
      bgColor: "bg-fuchsia-50 dark:bg-fuchsia-900/20",
    },
    {
      title: "Pengguna",
      description: "Data pengguna",
      icon: Users,
      href: "/perawat/pengguna",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Laporan",
      description: "Analisis data",
      icon: FileBarChart,
      href: "/perawat/laporan",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
  ]

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
          Selamat Datang, {session.user.name}!
        </h1>
        <p className="mt-1 text-sm lg:text-base text-gray-600 dark:text-gray-400">
          Kelola kesehatan masyarakat melalui SehatKi
        </p>
      </div>

      {/* Quick Access */}
      <div className="mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickAccessItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statistik</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Total Pengguna</CardTitle>
              <CardDescription className="text-sm">Pengguna terdaftar</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Artikel Publik</CardTitle>
              <CardDescription className="text-sm">Artikel dipublikasikan</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{totalArticles}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Konsultasi Aktif</CardTitle>
              <CardDescription className="text-sm">Sedang berlangsung</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-pink-600">{totalConsultations}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>
              Kelola konten dan pengguna
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/perawat/artikel/baru">
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Buat Artikel Baru
              </button>
            </Link>
            <Link href="/perawat/pengguna">
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Manajemen Pengguna
              </button>
            </Link>
            <Link href="/perawat/laporan">
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Generate Laporan
              </button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>
              Aktivitas sistem terkini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Belum ada aktivitas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}