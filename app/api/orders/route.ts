import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { protectRoute, getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { orders, orderItems, customers, products, auditLogs } from "@/lib/schema"
import { eq, like, desc, sql, and, or } from "drizzle-orm"
import { generateOrderNumber } from "@/lib/utils"
import logger from "@/lib/logger"

// Order item schema
const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be a positive number"),
})

// Order schema for validation
const orderSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  orderDate: z.string().optional(),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
  subtotal: z.number().min(0, "Subtotal must be a positive number"),
  tax: z.number().min(0, "Tax must be a positive number").optional().nullable(),
  shipping: z.number().min(0, "Shipping must be a positive number").optional().nullable(),
  total: z.number().min(0, "Total must be a positive number"),
  notes: z.string().optional().nullable(),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
})

// GET - List orders
export async function GET(request: NextRequest) {
  // Check if the user is authenticated
  const authError = await protectRoute(request)
  if (authError) return authError

  try {
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(url.searchParams.get("limit") || "10", 10)
    const search = url.searchParams.get("search") || ""
    const status = url.searchParams.get("status") || ""
    const customerId = url.searchParams.get("customerId") || ""

    const offset = (page - 1) * limit

    // Build query
    let query = db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        customerId: orders.customerId,
        customerName: customers.name,
        orderDate: orders.orderDate,
        status: orders.status,
        subtotal: orders.subtotal,
        tax: orders.tax,
        shipping: orders.shipping,
        total: orders.total,
        notes: orders.notes,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .leftJoin(customers, eq(orders.customerId, customers.id))

    // Add filters
    const filters = []

    if (search) {
      filters.push(or(like(orders.orderNumber, `%${search}%`), like(customers.name, `%${search}%`)))
    }

    if (status) {
      filters.push(eq(orders.status, status))
    }

    if (customerId) {
      filters.push(eq(orders.customerId, customerId))
    }

    if (filters.length > 0) {
      query = query.where(and(...filters))
    }

    // Get total count for pagination
    const [countResult] = await db
      .select({ count: sql`COUNT(*)`.as("count") })
      .from(orders)
      .leftJoin(customers, eq(orders.customerId, customers.id))
      .where(filters.length > 0 ? and(...filters) : sql`1=1`)

    // Get orders with pagination
    const results = await query.orderBy(desc(orders.createdAt)).limit(limit).offset(offset)

    return NextResponse.json({
      orders: results,
      pagination: {
        total: Number.parseInt(countResult.count as string, 10),
        page,
        limit,
        totalPages: Math.ceil(Number.parseInt(countResult.count as string, 10) / limit),
      },
    })
  } catch (error) {
    logger.error({ error }, "Error fetching orders")

    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

// POST - Create order
export async function POST(request: NextRequest) {
  // Check if the user is authenticated
  const authError = await protectRoute(request)
  if (authError) return authError

  try {
    // Get current user
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()

    // Validate request body
    const result = orderSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request", details: result.error.format() }, { status: 400 })
    }

    const orderData = result.data

    // Check if customer exists
    const [customer] = await db.select().from(customers).where(eq(customers.id, orderData.customerId)).limit(1)

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 400 })
    }

    // Validate products and check inventory
    for (const item of orderData.items) {
      const [product] = await db.select().from(products).where(eq(products.id, item.productId)).limit(1)

      if (!product) {
        return NextResponse.json({ error: `Product with ID ${item.productId} not found` }, { status: 400 })
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json({ error: `Insufficient inventory for product ${product.name}` }, { status: 400 })
      }
    }

    // Generate order number
    const orderNumber = generateOrderNumber()

    // Create order
    const [newOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerId: orderData.customerId,
        orderDate: orderData.orderDate ? new Date(orderData.orderDate) : new Date(),
        status: orderData.status,
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        shipping: orderData.shipping,
        total: orderData.total,
        notes: orderData.notes,
        createdById: user.id,
      })
      .returning()

    // Create order items
    const orderItemsData = orderData.items.map((item) => ({
      orderId: newOrder.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.quantity * item.unitPrice,
    }))

    await db.insert(orderItems).values(orderItemsData)

    // Update product inventory
    for (const item of orderData.items) {
      await db
        .update(products)
        .set({
          quantity: sql`${products.quantity} - ${item.quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(products.id, item.productId))
    }

    // Log audit
    await db.insert(auditLogs).values({
      userId: user.id,
      action: "create",
      entityType: "order",
      entityId: newOrder.id,
      details: { order: newOrder, items: orderItemsData },
    })

    logger.info({ orderId: newOrder.id }, "Order created")

    return NextResponse.json({ order: newOrder })
  } catch (error) {
    logger.error({ error }, "Error creating order")

    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

