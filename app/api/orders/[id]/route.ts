import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { protectRoute, getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { orders, orderItems, customers, products, auditLogs } from "@/lib/schema"
import { eq, sql } from "drizzle-orm"
import logger from "@/lib/logger"

// Order status update schema
const orderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
  notes: z.string().optional().nullable(),
})

// GET - Get order by ID with items
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Check if the user is authenticated
  const authError = await protectRoute(request)
  if (authError) return authError

  try {
    const { id } = params

    // Get order by ID
    const [order] = await db
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
        updatedAt: orders.updatedAt,
      })
      .from(orders)
      .leftJoin(customers, eq(orders.customerId, customers.id))
      .where(eq(orders.id, id))
      .limit(1)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Get order items
    const items = await db
      .select({
        id: orderItems.id,
        productId: orderItems.productId,
        productName: products.name,
        quantity: orderItems.quantity,
        unitPrice: orderItems.unitPrice,
        subtotal: orderItems.subtotal,
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, id))

    return NextResponse.json({ order, items })
  } catch (error) {
    logger.error({ error }, "Error fetching order")

    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

// PATCH - Update order status
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  // Check if the user is authenticated
  const authError = await protectRoute(request)
  if (authError) return authError

  try {
    // Get current user
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Check if order exists
    const [existingOrder] = await db.select().from(orders).where(eq(orders.id, id)).limit(1)

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Parse request body
    const body = await request.json()

    // Validate request body
    const result = orderStatusSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request", details: result.error.format() }, { status: 400 })
    }

    const { status, notes } = result.data

    // Handle cancellation - restore inventory if order is cancelled
    if (status === "cancelled" && existingOrder.status !== "cancelled") {
      // Get order items
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id))

      // Restore inventory for each item
      for (const item of items) {
        await db
          .update(products)
          .set({
            quantity: sql`${products.quantity} + ${item.quantity}`,
            updatedAt: new Date(),
          })
          .where(eq(products.id, item.productId))
      }
    }

    // Update order
    const [updatedOrder] = await db
      .update(orders)
      .set({
        status,
        notes: notes !== undefined ? notes : existingOrder.notes,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning()

    // Log audit
    await db.insert(auditLogs).values({
      userId: user.id,
      action: "update",
      entityType: "order",
      entityId: id,
      details: { status, notes },
    })

    logger.info({ orderId: id, status }, "Order status updated")

    return NextResponse.json({ order: updatedOrder })
  } catch (error) {
    logger.error({ error }, "Error updating order status")

    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }
}

// DELETE - Delete order
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Check if the user is authenticated
  const authError = await protectRoute(request)
  if (authError) return authError

  try {
    // Get current user
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Check if order exists
    const [existingOrder] = await db.select().from(orders).where(eq(orders.id, id)).limit(1)

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Get order items before deletion
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id))

    // Restore inventory for each item
    for (const item of items) {
      await db
        .update(products)
        .set({
          quantity: sql`${products.quantity} + ${item.quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(products.id, item.productId))
    }

    // Delete order items
    await db.delete(orderItems).where(eq(orderItems.orderId, id))

    // Delete order
    await db.delete(orders).where(eq(orders.id, id))

    // Log audit
    await db.insert(auditLogs).values({
      userId: user.id,
      action: "delete",
      entityType: "order",
      entityId: id,
      details: { id },
    })

    logger.info({ orderId: id }, "Order deleted")

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error({ error }, "Error deleting order")

    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 })
  }
}

