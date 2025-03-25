import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { protectRoute, getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { customers, auditLogs } from "@/lib/schema"
import { eq } from "drizzle-orm"
import logger from "@/lib/logger"

// Customer schema for validation
const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

// GET - Get customer by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Check if the user is authenticated
  const authError = await protectRoute(request)
  if (authError) return authError

  try {
    const { id } = params

    // Get customer by ID
    const [customer] = await db.select().from(customers).where(eq(customers.id, id)).limit(1)

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json({ customer })
  } catch (error) {
    logger.error({ error }, "Error fetching customer")

    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 })
  }
}

// PUT - Update customer
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Check if customer exists
    const [existingCustomer] = await db.select().from(customers).where(eq(customers.id, id)).limit(1)

    if (!existingCustomer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Parse request body
    const body = await request.json()

    // Validate request body
    const result = customerSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request", details: result.error.format() }, { status: 400 })
    }

    const customerData = result.data

    // Update customer
    const [updatedCustomer] = await db
      .update(customers)
      .set({
        ...customerData,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, id))
      .returning()

    // Log audit
    await db.insert(auditLogs).values({
      userId: user.id,
      action: "update",
      entityType: "customer",
      entityId: id,
      details: customerData,
    })

    logger.info({ customerId: id }, "Customer updated")

    return NextResponse.json({ customer: updatedCustomer })
  } catch (error) {
    logger.error({ error }, "Error updating customer")

    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
  }
}

// DELETE - Delete customer
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

    // Check if customer exists
    const [existingCustomer] = await db.select().from(customers).where(eq(customers.id, id)).limit(1)

    if (!existingCustomer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Delete customer
    await db.delete(customers).where(eq(customers.id, id))

    // Log audit
    await db.insert(auditLogs).values({
      userId: user.id,
      action: "delete",
      entityType: "customer",
      entityId: id,
      details: { id },
    })

    logger.info({ customerId: id }, "Customer deleted")

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error({ error }, "Error deleting customer")

    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 })
  }
}

