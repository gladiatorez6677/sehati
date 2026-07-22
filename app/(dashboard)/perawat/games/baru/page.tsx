"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { GameForm } from "@/components/perawat/game-form"

export default function GameBaruPage() {
  const router = useRouter()
  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <Button variant="ghost" onClick={() => router.push("/perawat/games")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
      </Button>
      <h1 className="mb-6 text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Buat Game</h1>
      <GameForm />
    </div>
  )
}
