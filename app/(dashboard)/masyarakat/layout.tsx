import { LanguageProvider } from "@/contexts/language-context"

export default function MasyarakatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  )
}