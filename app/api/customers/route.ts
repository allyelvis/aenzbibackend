import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { protectRoute, getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { customers, auditLogs } from "@/lib/schema"
import { like, desc, sql, or } from "drizzle-orm"
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

// GET - List customers
export async function GET(request: NextRequest) {
  // Check if the user is authenticated
  const authError = await protectRoute(request)
  if (authError) return authError

  try {
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(url.searchParams.get("limit") || "10", 10)
    const search = url.searchParams.get("search") || ""

    const offset = (page - 1) * limit

    // Build query
    let query = db.select().from(customers)

    // Add search filter if provided
    if (search) {
      query = query.where(
        or(
          like(customers.name, `%${search}%`),
          like(customers.email, `%${search}%`),
          like(customers.phone, `%${search}%`),
        ),
      )
    }

    // Get total count for pagination
    const [countResult] = await db
      .select({ count: sql`COUNT(*)`.as("count") })
      .from(customers)
      .where(
        search
          ? or(
              like(customers.name, `%${search}%`),
              like(customers.email, `%${search}%`),
              like(customers.phone, `%${search}%`),
            )
          : sql`1=1`,
      )

    // Get customers with pagination
    const results = await query.orderBy(desc(customers.createdAt)).limit(limit).offset(offset)

    return NextResponse.json({
      customers: results,
      pagination: {
        total: Number.parseInt(countResult.count as string, 10),
        page,
        limit,
        totalPages: Math.ceil(Number.parseInt(countResult.count as string, 10) / limit),
      },
    })
  } catch (error) {
    logger.error({ error }, "Error fetching customers")

    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

// POST - Create customer
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
    const result = customerSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request", details: result.error.format() }, { status: 400 })
    }

    const customerData = result.data

    // Create customer
    const [newCustomer] = await db
      .insert(customers)
      .values({
        ...customerData,
        createdById: user.id,
      })
      .returning()

    // Log audit
    await db.insert(auditLogs).values({
      userId: user.id,
      action: "create",
      entityType: "customer",
      entityId: newCustomer.id,
      details: customerData,
    })

    logger.info({ customerId: newCustomer.id }, "Customer created")

    return NextResponse.json({ customer: newCustomer })
  } catch (error) {
    logger.error({ error }, "Error creating customer")

    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}

