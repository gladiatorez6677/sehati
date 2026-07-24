"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { KuisionerForm } from "@/components/perawat/kuisioner-form"

export default function KuisionerEditPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <Button variant="ghost" onClick={() => router.push("/perawat/kuisioner")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
      </Button>
      <h1 className="mb-6 text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Edit Kuesioner</h1>
      <KuisionerForm kuisionerId={id} />
    </div>
  )
}
