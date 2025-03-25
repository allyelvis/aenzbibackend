import { type NextRequest, NextResponse } from "next/server"
import { protectRoute } from "@/lib/auth"
import { db } from "@/lib/db"
import { customers, orders, products, users } from "@/lib/schema"
import { count, eq, sql, sum, gt, lt, and } from "drizzle-orm"
import logger from "@/lib/logger"

export async function GET(request: NextRequest) {
  // Check if the user is authenticated
  const authError = await protectRoute(request)
  if (authError) return authError

  try {
    // Get date range parameters
    const url = new URL(request.url)
    const period = url.searchParams.get("period") || "month"

    // Calculate date range based on period
    const now = new Date()
    let startDate: Date

    switch (period) {
      case "week":
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate = new Date(now)
        startDate.setMonth(now.getMonth() - 1)
        break
      case "quarter":
        startDate = new Date(now)
        startDate.setMonth(now.getMonth() - 3)
        break
      case "year":
        startDate = new Date(now)
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate = new Date(now)
        startDate.setMonth(now.getMonth() - 1)
    }

    // Get total customers
    const [customerResult] = await db.select({ count: count() }).from(customers)

    // Get new customers in period
    const [newCustomersResult] = await db
      .select({ count: count() })
      .from(customers)
      .where(gt(customers.createdAt, startDate))

    // Get total orders
    const [orderResult] = await db.select({ count: count() }).from(orders)

    // Get orders in period
    const [newOrdersResult] = await db.select({ count: count() }).from(orders).where(gt(orders.createdAt, startDate))

    // Get total revenue
    const [revenueResult] = await db.select({ total: sum(orders.total) }).from(orders)

    // Get revenue in period
    const [periodRevenueResult] = await db
      .select({ total: sum(orders.total) })
      .from(orders)
      .where(gt(orders.createdAt, startDate))

    // Get inventory value
    const [inventoryResult] = await db
      .select({
        value: sql`SUM(${products.price} * ${products.quantity})`,
      })
      .from(products)

    // Get low stock products count
    const [lowStockResult] = await db
      .select({ count: count() })
      .from(products)
      .where(and(gt(products.reorderLevel, 0), lt(products.quantity, products.reorderLevel)))

    // Get out of stock products count
    const [outOfStockResult] = await db.select({ count: count() }).from(products).where(eq(products.quantity, 0))

    // Get active users count
    const [activeUsersResult] = await db.select({ count: count() }).from(users).where(eq(users.isActive, true))

    // Format the results
    const stats = {
      customers: {
        total: customerResult.count || 0,
        new: newCustomersResult.count || 0,
      },
      orders: {
        total: orderResult.count || 0,
        new: newOrdersResult.count || 0,
      },
      revenue: {
        total: revenueResult.total || 0,
        period: periodRevenueResult.total || 0,
      },
      inventory: {
        value: inventoryResult.value || 0,
        lowStock: lowStockResult.count || 0,
        outOfStock: outOfStockResult.count || 0,
      },
      users: {
        active: activeUsersResult.count || 0,
      },
      period,
    }

    return NextResponse.json(stats)
  } catch (error) {
    logger.error({ error }, "Error fetching dashboard stats")

    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}

