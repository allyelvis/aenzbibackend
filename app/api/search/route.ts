import { type NextRequest, NextResponse } from "next/server"
import { protectRoute } from "@/lib/auth"
import { db } from "@/lib/db"
import { customers, products, orders } from "@/lib/schema"
import { like, or, desc, sql } from "drizzle-orm"
import logger from "@/lib/logger"

export async function GET(request: NextRequest) {
  // Check if the user is authenticated
  const authError = await protectRoute(request)
  if (authError) return authError

  try {
    const url = new URL(request.url)
    const query = url.searchParams.get("q") || ""
    const limit = Number.parseInt(url.searchParams.get("limit") || "20", 10)

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    // Search customers
    const customerResults = await db
      .select({
        id: customers.id,
        title: customers.name,
        description: customers.email,
        type: sql`'customer'`.as("type"),
        url: sql`CONCAT('/customers/', ${customers.id})`.as("url"),
      })
      .from(customers)
      .where(
        or(
          like(customers.name, `%${query}%`),
          like(customers.email, `%${query}%`),
          like(customers.phone, `%${query}%`),
        ),
      )
      .orderBy(desc(customers.updatedAt))
      .limit(limit)

    // Search products
    const productResults = await db
      .select({
        id: products.id,
        title: products.name,
        description: products.description,
        type: sql`'product'`.as("type"),
        url: sql`CONCAT('/products/', ${products.id})`.as("url"),
      })
      .from(products)
      .where(
        or(
          like(products.name, `%${query}%`),
          like(products.description, `%${query}%`),
          like(products.sku, `%${query}%`),
        ),
      )
      .orderBy(desc(products.updatedAt))
      .limit(limit)

    // Search orders
    const orderResults = await db
      .select({
        id: orders.id,
        title: sql`CONCAT('Order #', ${orders.orderNumber})`.as("title"),
        description: sql`CONCAT('$', ${orders.total})`.as("description"),
        type: sql`'order'`.as("type"),
        url: sql`CONCAT('/orders/', ${orders.id})`.as("url"),
      })
      .from(orders)
      .where(or(like(orders.orderNumber, `%${query}%`), like(orders.customerName, `%${query}%`)))
      .orderBy(desc(orders.orderDate))
      .limit(limit)

    // Combine results
    const results = [...customerResults, ...productResults, ...orderResults]

    // Sort by relevance (simple implementation)
    const sortedResults = results.sort((a, b) => {
      const aTitle = a.title.toLowerCase()
      const bTitle = b.title.toLowerCase()
      const queryLower = query.toLowerCase()

      // Exact matches first
      if (aTitle === queryLower && bTitle !== queryLower) return -1
      if (bTitle === queryLower && aTitle !== queryLower) return 1

      // Starts with query next
      if (aTitle.startsWith(queryLower) && !bTitle.startsWith(queryLower)) return -1
      if (bTitle.startsWith(queryLower) && !aTitle.startsWith(queryLower)) return 1

      // Default to alphabetical
      return aTitle.localeCompare(bTitle)
    })

    return NextResponse.json({ results: sortedResults })
  } catch (error) {
    logger.error({ error }, "Error searching")

    return NextResponse.json({ error: "Failed to search" }, { status: 500 })
  }
}

