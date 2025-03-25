import { type NextRequest, NextResponse } from "next/server"
import { protectRoute } from "@/lib/auth"
import { db } from "@/lib/db"
import { orders, customers, products, auditLogs, users } from "@/lib/schema"
import { desc, eq, sql } from "drizzle-orm"
import logger from "@/lib/logger"

export async function GET(request: NextRequest) {
  // Check if the user is authenticated
  const authError = await protectRoute(request)
  if (authError) return authError

  try {
    // Get limit parameter
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "10", 10)

    // Get recent orders
    const recentOrders = await db
      .select({
        id: orders.id,
        type: sql`'order'`.as("type"),
        title: sql`CONCAT('Order ', ${orders.orderNumber})`.as("title"),
        description: sql`CONCAT('Order placed by ', ${customers.name})`.as("description"),
        timestamp: orders.createdAt,
        status: orders.status,
        amount: orders.total,
      })
      .from(orders)
      .leftJoin(customers, eq(orders.customerId, customers.id))
      .orderBy(desc(orders.createdAt))
      .limit(limit)

    // Get recent audit logs
    const recentAuditLogs = await db
      .select({
        id: auditLogs.id,
        type: sql`'audit'`.as("type"),
        title: sql`CONCAT(${auditLogs.action}, ' ', ${auditLogs.entityType})`.as("title"),
        description: sql`CONCAT(${users.name}, ' ', ${auditLogs.action}, ' a ', ${auditLogs.entityType})`.as(
          "description",
        ),
        timestamp: auditLogs.createdAt,
        userId: auditLogs.userId,
        userName: users.name,
      })
      .from(auditLogs)
      .leftJoin(users, eq(auditLogs.userId, users.id))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)

    // Get recent inventory changes
    const recentInventory = await db
      .select({
        id: products.id,
        type: sql`'inventory'`.as("type"),
        title: sql`CONCAT('Inventory updated: ', ${products.name})`.as("title"),
        description: sql`CONCAT('Quantity: ', ${products.quantity})`.as("description"),
        timestamp: products.updatedAt,
        productName: products.name,
        quantity: products.quantity,
      })
      .from(products)
      .orderBy(desc(products.updatedAt))
      .limit(limit)

    // Combine and sort all activities
    const allActivities = [...recentOrders, ...recentAuditLogs, ...recentInventory]
      .sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      })
      .slice(0, limit)

    return NextResponse.json({ activities: allActivities })
  } catch (error) {
    logger.error({ error }, "Error fetching recent activity")

    return NextResponse.json({ error: "Failed to fetch recent activity" }, { status: 500 })
  }
}

