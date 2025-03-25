import { type NextRequest, NextResponse } from "next/server"
import { protectRoute } from "@/lib/auth"
import { db } from "@/lib/db"
import { orders } from "@/lib/schema"
import { sql, gt } from "drizzle-orm"
import logger from "@/lib/logger"

export async function GET(request: NextRequest) {
  // Check if the user is authenticated
  const authError = await protectRoute(request)
  if (authError) return authError

  try {
    // Get period parameter
    const url = new URL(request.url)
    const period = url.searchParams.get("period") || "month"

    // Calculate date range based on period
    const now = new Date()
    let startDate: Date
    let groupByFormat: string
    let limit: number

    switch (period) {
      case "week":
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7)
        groupByFormat = "YYYY-MM-DD"
        limit = 7
        break
      case "month":
        startDate = new Date(now)
        startDate.setMonth(now.getMonth() - 1)
        groupByFormat = "YYYY-MM-DD"
        limit = 30
        break
      case "quarter":
        startDate = new Date(now)
        startDate.setMonth(now.getMonth() - 3)
        groupByFormat = "YYYY-MM-DD"
        limit = 90
        break
      case "year":
        startDate = new Date(now)
        startDate.setFullYear(now.getFullYear() - 1)
        groupByFormat = "YYYY-MM"
        limit = 12
        break
      default:
        startDate = new Date(now)
        startDate.setMonth(now.getMonth() - 1)
        groupByFormat = "YYYY-MM-DD"
        limit = 30
    }

    // Get sales data grouped by date
    const salesData = await db
      .select({
        date: sql`TO_CHAR(${orders.orderDate}, ${groupByFormat})`.as("date"),
        revenue: sql`SUM(${orders.total})`.as("revenue"),
        orders: sql`COUNT(*)`.as("orders"),
      })
      .from(orders)
      .where(gt(orders.orderDate, startDate))
      .groupBy(sql`TO_CHAR(${orders.orderDate}, ${groupByFormat})`)
      .orderBy(sql`TO_CHAR(${orders.orderDate}, ${groupByFormat})`)
      .limit(limit)

    // Format the data for the chart
    const chartData = salesData.map((item) => ({
      name: item.date,
      revenue: Number.parseFloat(item.revenue as string),
      orders: Number.parseInt(item.orders as string),
    }))

    return NextResponse.json({ data: chartData, period })
  } catch (error) {
    logger.error({ error }, "Error fetching sales analytics data")

    return NextResponse.json({ error: "Failed to fetch sales analytics data" }, { status: 500 })
  }
}

