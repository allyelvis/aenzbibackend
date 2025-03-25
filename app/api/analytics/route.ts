import { type NextRequest, NextResponse } from "next/server"
import { protectRoute } from "@/lib/auth"
import logger from "@/lib/logger"

// Get analytics data
export async function GET(request: NextRequest) {
  // Check if the user is authenticated
  const authError = await protectRoute(request)
  if (authError) return authError

  try {
    const url = new URL(request.url)
    const metric = url.searchParams.get("metric")
    const period = url.searchParams.get("period") || "month"

    if (!metric) {
      return NextResponse.json({ error: "Metric parameter is required" }, { status: 400 })
    }

    // In a real app, you would fetch analytics data from your database
    // For demo purposes, we'll return mock data

    let data: any = null

    switch (metric) {
      case "sales":
        data = generateSalesData(period)
        break
      case "users":
        data = generateUsersData(period)
        break
      case "inventory":
        data = generateInventoryData(period)
        break
      case "revenue":
        data = generateRevenueData(period)
        break
      default:
        return NextResponse.json({ error: "Invalid metric" }, { status: 400 })
    }

    logger.info({ metric, period }, "Analytics data fetched")

    return NextResponse.json({
      metric,
      period,
      data,
    })
  } catch (error) {
    logger.error({ error }, "Error fetching analytics data")

    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}

// Helper functions to generate mock data
function generateSalesData(period: string) {
  if (period === "day") {
    return Array.from({ length: 24 }, (_, i) => ({
      name: `${i}:00`,
      value: Math.floor(Math.random() * 100),
    }))
  }

  if (period === "week") {
    return [
      { name: "Mon", value: Math.floor(Math.random() * 1000) },
      { name: "Tue", value: Math.floor(Math.random() * 1000) },
      { name: "Wed", value: Math.floor(Math.random() * 1000) },
      { name: "Thu", value: Math.floor(Math.random() * 1000) },
      { name: "Fri", value: Math.floor(Math.random() * 1000) },
      { name: "Sat", value: Math.floor(Math.random() * 1000) },
      { name: "Sun", value: Math.floor(Math.random() * 1000) },
    ]
  }

  if (period === "month") {
    return Array.from({ length: 30 }, (_, i) => ({
      name: `Day ${i + 1}`,
      value: Math.floor(Math.random() * 1000),
    }))
  }

  if (period === "year") {
    return [
      { name: "Jan", value: Math.floor(Math.random() * 10000) },
      { name: "Feb", value: Math.floor(Math.random() * 10000) },
      { name: "Mar", value: Math.floor(Math.random() * 10000) },
      { name: "Apr", value: Math.floor(Math.random() * 10000) },
      { name: "May", value: Math.floor(Math.random() * 10000) },
      { name: "Jun", value: Math.floor(Math.random() * 10000) },
      { name: "Jul", value: Math.floor(Math.random() * 10000) },
      { name: "Aug", value: Math.floor(Math.random() * 10000) },
      { name: "Sep", value: Math.floor(Math.random() * 10000) },
      { name: "Oct", value: Math.floor(Math.random() * 10000) },
      { name: "Nov", value: Math.floor(Math.random() * 10000) },
      { name: "Dec", value: Math.floor(Math.random() * 10000) },
    ]
  }

  return []
}

function generateUsersData(period: string) {
  if (period === "day") {
    return Array.from({ length: 24 }, (_, i) => ({
      name: `${i}:00`,
      active: Math.floor(Math.random() * 50),
      new: Math.floor(Math.random() * 10),
    }))
  }

  if (period === "week") {
    return [
      { name: "Mon", active: Math.floor(Math.random() * 500), new: Math.floor(Math.random() * 50) },
      { name: "Tue", active: Math.floor(Math.random() * 500), new: Math.floor(Math.random() * 50) },
      { name: "Wed", active: Math.floor(Math.random() * 500), new: Math.floor(Math.random() * 50) },
      { name: "Thu", active: Math.floor(Math.random() * 500), new: Math.floor(Math.random() * 50) },
      { name: "Fri", active: Math.floor(Math.random() * 500), new: Math.floor(Math.random() * 50) },
      { name: "Sat", active: Math.floor(Math.random() * 500), new: Math.floor(Math.random() * 50) },
      { name: "Sun", active: Math.floor(Math.random() * 500), new: Math.floor(Math.random() * 50) },
    ]
  }

  if (period === "month") {
    return Array.from({ length: 30 }, (_, i) => ({
      name: `Day ${i + 1}`,
      active: Math.floor(Math.random() * 500),
      new: Math.floor(Math.random() * 50),
    }))
  }

  if (period === "year") {
    return [
      { name: "Jan", active: Math.floor(Math.random() * 1000), new: Math.floor(Math.random() * 100) },
      { name: "Feb", active: Math.floor(Math.random() * 1000), new: Math.floor(Math.random() * 100) },
      { name: "Mar", active: Math.floor(Math.random() * 1000), new: Math.floor(Math.random() * 100) },
      { name: "Apr", active: Math.floor(Math.random() * 1000), new: Math.floor(Math.random() * 100) },
      { name: "May", active: Math.floor(Math.random() * 1000), new: Math.floor(Math.random() * 100) },
      { name: "Jun", active: Math.floor(Math.random() * 1000), new: Math.floor(Math.random() * 100) },
      { name: "Jul", active: Math.floor(Math.random() * 1000), new: Math.floor(Math.random() * 100) },
      { name: "Aug", active: Math.floor(Math.random() * 1000), new: Math.floor(Math.random() * 100) },
      { name: "Sep", active: Math.floor(Math.random() * 1000), new: Math.floor(Math.random() * 100) },
      { name: "Oct", active: Math.floor(Math.random() * 1000), new: Math.floor(Math.random() * 100) },
      { name: "Nov", active: Math.floor(Math.random() * 1000), new: Math.floor(Math.random() * 100) },
      { name: "Dec", active: Math.floor(Math.random() * 1000), new: Math.floor(Math.random() * 100) },
    ]
  }

  return []
}

function generateInventoryData(period: string) {
  if (period === "week") {
    return [
      { name: "Mon", inStock: 1245, lowStock: 32, outOfStock: 15 },
      { name: "Tue", inStock: 1240, lowStock: 35, outOfStock: 17 },
      { name: "Wed", inStock: 1235, lowStock: 38, outOfStock: 19 },
      { name: "Thu", inStock: 1230, lowStock: 40, outOfStock: 22 },
      { name: "Fri", inStock: 1225, lowStock: 42, outOfStock: 25 },
      { name: "Sat", inStock: 1220, lowStock: 45, outOfStock: 27 },
      { name: "Sun", inStock: 1215, lowStock: 48, outOfStock: 29 },
    ]
  }

  if (period === "month") {
    return Array.from({ length: 4 }, (_, i) => ({
      name: `Week ${i + 1}`,
      inStock: 1245 - i * 10,
      lowStock: 32 + i * 5,
      outOfStock: 15 + i * 3,
    }))
  }

  if (period === "year") {
    return [
      { name: "Jan", inStock: 1245, lowStock: 32, outOfStock: 15 },
      { name: "Feb", inStock: 1240, lowStock: 35, outOfStock: 17 },
      { name: "Mar", inStock: 1235, lowStock: 38, outOfStock: 19 },
      { name: "Apr", inStock: 1230, lowStock: 40, outOfStock: 22 },
      { name: "May", inStock: 1225, lowStock: 42, outOfStock: 25 },
      { name: "Jun", inStock: 1220, lowStock: 45, outOfStock: 27 },
      { name: "Jul", inStock: 1215, lowStock: 48, outOfStock: 29 },
      { name: "Aug", inStock: 1210, lowStock: 50, outOfStock: 32 },
      { name: "Sep", inStock: 1205, lowStock: 52, outOfStock: 35 },
      { name: "Oct", inStock: 1200, lowStock: 55, outOfStock: 37 },
      { name: "Nov", inStock: 1195, lowStock: 58, outOfStock: 39 },
      { name: "Dec", inStock: 1190, lowStock: 60, outOfStock: 42 },
    ]
  }

  return []
}

function generateRevenueData(period: string) {
  if (period === "week") {
    return [
      { name: "Mon", revenue: 4000, expenses: 2400, profit: 1600 },
      { name: "Tue", revenue: 3000, expenses: 1398, profit: 1602 },
      { name: "Wed", revenue: 2000, expenses: 9800, profit: 1000 },
      { name: "Thu", revenue: 2780, expenses: 3908, profit: 1872 },
      { name: "Fri", revenue: 1890, expenses: 4800, profit: 1090 },
      { name: "Sat", revenue: 2390, expenses: 3800, profit: 1590 },
      { name: "Sun", revenue: 3490, expenses: 4300, profit: 1190 },
    ]
  }

  if (period === "month") {
    return Array.from({ length: 4 }, (_, i) => ({
      name: `Week ${i + 1}`,
      revenue: 12000 + i * 1000,
      expenses: 8000 + i * 500,
      profit: 4000 + i * 500,
    }))
  }

  if (period === "year") {
    return [
      { name: "Jan", revenue: 42000, expenses: 30000, profit: 12000 },
      { name: "Feb", revenue: 38000, expenses: 28000, profit: 10000 },
      { name: "Mar", revenue: 45000, expenses: 32000, profit: 13000 },
      { name: "Apr", revenue: 41000, expenses: 29000, profit: 12000 },
      { name: "May", revenue: 39000, expenses: 27000, profit: 12000 },
      { name: "Jun", revenue: 48000, expenses: 34000, profit: 14000 },
      { name: "Jul", revenue: 52000, expenses: 36000, profit: 16000 },
      { name: "Aug", revenue: 49000, expenses: 35000, profit: 14000 },
      { name: "Sep", revenue: 51000, expenses: 36000, profit: 15000 },
      { name: "Oct", revenue: 54000, expenses: 38000, profit: 16000 },
      { name: "Nov", revenue: 58000, expenses: 40000, profit: 18000 },
      { name: "Dec", revenue: 63000, expenses: 43000, profit: 20000 },
    ]
  }

  return []
}

