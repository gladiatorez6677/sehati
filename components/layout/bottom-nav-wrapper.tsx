"use client"

import { MobileBottomNav } from "./mobile-bottom-nav"
import { PerawatBottomNav } from "./perawat-bottom-nav"
import { LanguageProvider } from "@/contexts/language-context"

export function BottomNavWrapper({ userRole }: { userRole: string }) {
  if (userRole === "MASYARAKAT") {
    return (
      <LanguageProvider>
        <MobileBottomNav />
      </LanguageProvider>
    )
  }
  
  return <PerawatBottomNav />
}