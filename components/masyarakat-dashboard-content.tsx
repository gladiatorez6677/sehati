"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Shield, Brain, MessageCircle, Map, Music, Gamepad, FileText, ChevronRight, Video, PlayCircle, Pill, ClipboardList } from "lucide-react"
import Link from "next/link"
import { ArtikelCard } from "@/components/artikel-card"

const dashboardVideos = [
  {
    id: 1,
    judul: "Mengenal Hipertensi",
    url: "/video/Mengenal%20Hipertensi%20fix.mp4",
  },
  {
    id: 2,
    judul: "Pencegahan Hipertensi",
    url: "/video/pencegahan%20hipertensi%20fix.mp4",
  },
  {
    id: 3,
    judul: "Pengelolaan Hipertensi",
    url: "/video/pengelolaan%20hipertensi%20fix.mp4",
  },
  {
    id: 4,
    judul: "Manajemen Diri Penderita Hipertensi",
    url: "/video/Manajemen%20diri%20penderita%20hipertensi%20fix.mp4",
  },
]

interface MasyarakatDashboardContentProps {
  userName: string
  recentArticles: any[]
}

export function MasyarakatDashboardContent({ userName, recentArticles }: MasyarakatDashboardContentProps) {
  const { t } = useLanguage()

  const quickAccessItems = [
    {
      titleKey: "nav.bloodPressure",
      descriptionKey: "bloodPressure",
      icon: Heart,
      href: "/masyarakat/tekanan-darah",
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      titleKey: "Pengingat Obat",
      descriptionKey: "Jadwal minum obat",
      icon: Pill,
      href: "/masyarakat/pengingat-obat",
      color: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
    },
    {
      titleKey: "nav.articles",
      descriptionKey: "nav.articles",
      icon: FileText,
      href: "/masyarakat/artikel",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      titleKey: "Kuisioner",
      descriptionKey: "Isi kuisioner kesehatan",
      icon: ClipboardList,
      href: "/masyarakat/kuisioner",
      color: "text-rose-500",
      bgColor: "bg-rose-50 dark:bg-rose-900/20",
    },
    {
      titleKey: "nav.stress",
      descriptionKey: "nav.stress",
      icon: Brain,
      href: "/masyarakat/manajemen-stress",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      titleKey: "nav.cholesterol",
      descriptionKey: "nav.cholesterol",
      icon: Shield,
      href: "/masyarakat/kolesterol",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      titleKey: "nav.map",
      descriptionKey: "nearestFacilities",
      icon: Map,
      href: "/masyarakat/peta-fasilitas",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      titleKey: "nav.relaxation",
      descriptionKey: "nav.relaxation",
      icon: Music,
      href: "/masyarakat/relaksasi",
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
    },
    {
      titleKey: "nav.games",
      descriptionKey: "nav.games",
      icon: Gamepad,
      href: "/masyarakat/games",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      titleKey: "nav.ai",
      descriptionKey: "nav.ai",
      icon: MessageCircle,
      href: "/masyarakat/konsultasi",
      color: "text-teal-500",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
    },
    {
      titleKey: "nav.video",
      descriptionKey: "nav.video",
      icon: Video,
      href: "/masyarakat/video-kesehatan",
      color: "text-cyan-500",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    },
  ]

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
          {t('welcome')}, {userName}!
        </h1>
        <p className="mt-1 text-sm lg:text-base text-gray-600 dark:text-gray-400">
          {t('tagline')}
        </p>
      </div>

      {/* Quick Access */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('quickAccess')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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
                          {t(item.titleKey)}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {t(item.descriptionKey)}
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

      {/* Video Kesehatan */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Video className="h-5 w-5 text-cyan-500" />
            Video Kesehatan
          </h2>
          <Link
            href="/masyarakat/video-kesehatan"
            className="text-sm text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 flex items-center gap-1"
          >
            Lihat Semua
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardVideos.map((video) => (
            <Link key={video.id} href="/masyarakat/video-kesehatan">
              <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="relative bg-gradient-to-br from-cyan-900 to-cyan-700 aspect-video flex items-center justify-center">
                  <PlayCircle className="h-10 w-10 text-white/80" />
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{video.judul}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Articles */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('recentArticles')}</h2>
          <Link
            href="/masyarakat/artikel"
            className="text-sm text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 flex items-center gap-1"
          >
            {t('viewAll')}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentArticles.length > 0 ? (
            recentArticles.map((artikel) => (
              <ArtikelCard key={artikel.id} artikel={artikel} />
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Belum ada artikel yang dipublikasi</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Riwayat Pengukuran</CardTitle>
            <CardDescription className="text-sm">
              Pengukuran terakhir Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Belum ada data pengukuran</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aktivitas Terakhir</CardTitle>
            <CardDescription className="text-sm">
              Riwayat aktivitas Anda
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