import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import { format, subDays, eachDayOfInterval, startOfWeek, startOfMonth, startOfYear, subMonths } from "date-fns"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "PERAWAT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const searchParams = req.nextUrl.searchParams
    const range = searchParams.get("range") || "week"

    // Calculate date range and interval
    const now = new Date()
    let startDate: Date
    let endDate = now
    let intervalDays = 1
    
    switch (range) {
      case "week":
        startDate = startOfWeek(now, { weekStartsOn: 1 })
        intervalDays = 1
        break
      case "month":
        startDate = startOfMonth(now)
        intervalDays = 3 // Show every 3 days for monthly view
        break
      case "quarter":
        startDate = subMonths(startOfMonth(now), 2)
        intervalDays = 7 // Show weekly for quarterly view
        break
      case "year":
        startDate = startOfYear(now)
        intervalDays = 30 // Show monthly for yearly view
        break
      default:
        startDate = startOfWeek(now, { weekStartsOn: 1 })
        intervalDays = 1
    }

    // Generate dates for the interval
    const dates = eachDayOfInterval({ start: startDate, end: endDate })
      .filter((_, index) => index % intervalDays === 0)

    // Generate simulated trend data
    // In a real app, this would aggregate actual health check data
    const trends = dates.map(date => {
      const baseValue = 50
      const randomVariation = () => Math.floor(Math.random() * 30)
      
      return {
        date: format(date, "yyyy-MM-dd"),
        tekananDarah: baseValue + randomVariation(),
        stress: baseValue - 10 + randomVariation(),
        kolesterol: baseValue - 20 + randomVariation(),
      }
    })

    return NextResponse.json(trends)
  } catch (error) {
    console.error("Error fetching trends:", error)
    return NextResponse.json(
      { error: "Failed to fetch trends" },
      { status: 500 }
    )
  }
}