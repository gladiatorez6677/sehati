"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Heart, Bot, Shield, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

interface NavItem {
  href: string
  labelKey: string
  icon: React.ComponentType<{ className?: string }>
  isCenter?: boolean
}

export function MobileBottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()
  
  // Determine if we're in masyarakat or perawat section
  const isMasyarakat = pathname.includes("/masyarakat")
  const isPerawat = pathname.includes("/perawat")
  
  // Only show for masyarakat users
  if (!isMasyarakat) return null
  
  const navItems: NavItem[] = [
    {
      href: "/masyarakat",
      labelKey: "nav.home",
      icon: Home,
    },
    {
      href: "/masyarakat/tekanan-darah",
      labelKey: "bloodPressure",
      icon: Heart,
    },
    {
      href: "/masyarakat/konsultasi",
      labelKey: "nav.ai",
      icon: Bot,
      isCenter: true,
    },
    {
      href: "/masyarakat/kolesterol",
      labelKey: "nav.cholesterol",
      icon: Shield,
    },
    {
      href: "/masyarakat/peta-fasilitas",
      labelKey: "nav.map",
      icon: MapPin,
    },
  ]
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 lg:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center"
              >
                <div className="absolute -top-7 w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-900">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <span className="text-[10px] mt-6 text-pink-600 dark:text-pink-400 font-semibold">
                  {t(item.labelKey)}
                </span>
              </Link>
            )
          }
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 relative",
                isActive
                  ? "text-pink-600 dark:text-pink-400"
                  : "text-gray-600 dark:text-gray-400"
              )}
            >
              <Icon className={cn(
                "h-5 w-5",
                isActive && "text-pink-600 dark:text-pink-400"
              )} />
              <span className={cn(
                "text-[10px]",
                isActive ? "font-medium" : "font-normal"
              )}>
                {t(item.labelKey)}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}