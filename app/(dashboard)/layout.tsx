import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileHeaderWrapper } from "@/components/layout/mobile-header-wrapper"
import { BottomNavWrapper } from "@/components/layout/bottom-nav-wrapper"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar userRole={session.user.role} />
      <main className="flex-1 lg:pl-64">
        <MobileHeaderWrapper />
        <div className="h-full overflow-y-auto pt-16 pb-16 lg:pt-0 lg:pb-0">
          {children}
        </div>
        <BottomNavWrapper userRole={session.user.role} />
      </main>
    </div>
  )
}