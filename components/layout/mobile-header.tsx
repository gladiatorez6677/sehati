"use client"

import { Stethoscope, User, LogOut } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { LanguageSwitcher } from "@/components/language-switcher"

export function MobileHeader() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  // Determine user role from pathname
  const userRole = pathname.includes("/perawat") ? "PERAWAT" : "MASYARAKAT"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-pink-50 to-white dark:from-gray-900 dark:to-gray-900 border-b border-pink-200 dark:border-gray-800 lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">SehatKi</h1>
            <p className="text-xs text-pink-600 dark:text-pink-400">Hidup Sehat Keluarga Indonesia</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Language Switcher for Masyarakat */}
          {userRole === "MASYARAKAT" && <LanguageSwitcher />}
          
          {/* User Dropdown */}
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar-placeholder.png" />
                <AvatarFallback className="bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {mounted ? session?.user?.name : ""}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userRole === "MASYARAKAT" ? "Masyarakat" : "Perawat"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/${userRole.toLowerCase()}/profil`} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>
    </header>
  )
}