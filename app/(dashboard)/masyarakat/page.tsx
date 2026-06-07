import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { MasyarakatDashboardContent } from "@/components/masyarakat-dashboard-content"

export default async function MasyarakatDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "MASYARAKAT") {
    redirect("/")
  }

  // Fetch recent articles
  const recentArticles = await prisma.artikelKesehatan.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      perawat: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
  })

  return (
    <MasyarakatDashboardContent 
      userName={session.user.name || ""} 
      recentArticles={recentArticles}
    />
  )
}