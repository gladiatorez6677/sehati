"use client"

import { MobileHeader } from "./mobile-header"
import { LanguageProvider } from "@/contexts/language-context"
import { usePathname } from "next/navigation"

export function MobileHeaderWrapper() {
  const pathname = usePathname()
  const isMasyarakat = pathname.includes("/masyarakat")
  
  if (isMasyarakat) {
    return (
      <LanguageProvider>
        <MobileHeader />
      </LanguageProvider>
    )
  }
  
  return <MobileHeader />
}