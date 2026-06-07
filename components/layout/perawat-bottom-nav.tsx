"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, Bot, Users, FileBarChart } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  isCenter?: boolean
}

export function PerawatBottomNav() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      href: "/perawat",
      label: "Home",
      icon: Home,
    },
    {
      href: "/perawat/artikel",
      label: "Artikel",
      icon: FileText,
    },
    {
      href: "/perawat/konsultasi",
      label: "AI",
      icon: Bot,
      isCenter: true,
    },
    {
      href: "/perawat/pengguna",
      label: "User",
      icon: Users,
    },
    {
      href: "/perawat/laporan",
      label: "Report",
      icon: FileBarChart,
    },
  ]

  const isActive = (href: string) => {
    if (href === "/perawat") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-gray-950 border-t">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center"
              >
                <div className="absolute -top-3">
                  <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all",
                    active
                      ? "bg-gradient-to-br from-pink-500 to-pink-600 scale-110"
                      : "bg-gradient-to-br from-pink-500 to-pink-600"
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <span className={cn(
                  "text-[10px] mt-7 font-medium transition-colors",
                  active ? "text-pink-600" : "text-gray-600 dark:text-gray-400"
                )}>
                  {item.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <Icon className={cn(
                "w-5 h-5 transition-colors",
                active 
                  ? "text-pink-600" 
                  : "text-gray-600 dark:text-gray-400"
              )} />
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                active 
                  ? "text-pink-600" 
                  : "text-gray-600 dark:text-gray-400"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}