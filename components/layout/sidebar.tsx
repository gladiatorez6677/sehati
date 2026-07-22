"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession, signOut } from "next-auth/react"
import {
  Heart,
  FileText,
  Brain,
  Shield,
  Map,
  Music,
  Gamepad,
  MessageCircle,
  Home,
  Menu,
  X,
  LogOut,
  User,
  Users,
  BarChart,
  Settings,
  Video,
  Pill,
  ClipboardList,
} from "lucide-react"
import { useState, useEffect } from "react"
import { AppLogo } from "@/components/layout/app-logo"

const masyarakatMenuItems = [
  { href: "/masyarakat", label: "Dashboard", icon: Home },
  { href: "/masyarakat/video-kesehatan", label: "Video Kesehatan", icon: Video },
  { href: "/masyarakat/tekanan-darah", label: "Tekanan Darah", icon: Heart },
  { href: "/masyarakat/pengingat-obat", label: "Pengingat Obat", icon: Pill },
  { href: "/masyarakat/artikel", label: "Artikel Kesehatan", icon: FileText },
  { href: "/masyarakat/kuisioner", label: "Kuisioner", icon: ClipboardList },
  { href: "/masyarakat/manajemen-stress", label: "Manajemen Stress", icon: Brain },
  { href: "/masyarakat/kolesterol", label: "Kontrol Kolesterol", icon: Shield },
  { href: "/masyarakat/peta-fasilitas", label: "Peta Fasilitas", icon: Map },
  { href: "/masyarakat/relaksasi", label: "Relaksasi", icon: Music },
  { href: "/masyarakat/games", label: "Games Edukasi", icon: Gamepad },
  { href: "/masyarakat/konsultasi", label: "Konsultasi AI", icon: MessageCircle },
]

const perawatMenuItems = [
  { href: "/perawat", label: "Dashboard", icon: Home },
  { href: "/perawat/pengguna", label: "Manajemen Pengguna", icon: Users },
  { href: "/perawat/artikel", label: "Manajemen Artikel", icon: FileText },
  { href: "/perawat/video-kesehatan", label: "Manajemen Video", icon: Video },
  { href: "/perawat/kuisioner", label: "Manajemen Kuisioner", icon: ClipboardList },
  { href: "/perawat/games", label: "Manajemen Games", icon: Gamepad },
  { href: "/perawat/laporan", label: "Laporan Kesehatan", icon: BarChart },
  { href: "/perawat/pengaturan", label: "Pengaturan", icon: Settings },
]

interface SidebarProps {
  userRole: "MASYARAKAT" | "PERAWAT"
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const menuItems = userRole === "MASYARAKAT" ? masyarakatMenuItems : perawatMenuItems

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 transform bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out lg:translate-x-0",
          "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-pink-100 dark:border-gray-800 px-6 bg-gradient-to-r from-pink-50 to-white dark:from-gray-900 dark:to-gray-900">
            <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-400">
              <AppLogo />
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-900/30"
                    )}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-0">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatar-placeholder.png" />
                      <AvatarFallback>
                        {mounted && session?.user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1 text-left">
                      <p className="text-sm font-medium leading-none">
                        {mounted ? session?.user?.name : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {userRole === "MASYARAKAT" ? "Masyarakat" : "Perawat"}
                      </p>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/${userRole.toLowerCase()}/profil`}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  )
}