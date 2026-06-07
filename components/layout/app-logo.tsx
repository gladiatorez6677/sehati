"use client"

import { useEffect, useState } from "react"

interface AppLogoProps {
  className?: string
}

export function AppLogo({ className = "" }: AppLogoProps) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Always render the same text to avoid hydration mismatch
  return (
    <span className={className} suppressHydrationWarning>
      SehatKi
    </span>
  )
}