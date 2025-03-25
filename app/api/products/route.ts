import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { protectRoute, getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { products, categories, auditLogs } from "@/lib/schema"
import { eq, like, desc, sql, and, or } from "drizzle-orm"
import logger from "@/lib/logger"

// Product schema for validation
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  price: z.number().min(0, "Price must be a positive number"),
  cost: z.number().min(0, "Cost must be a positive number").optional().nullable(),
  quantity: z.number().int().min(0, "Quantity must be a positive integer"),
  reorderLevel: z.number().int().min(0, "Reorder level must be a positive integer").optional().nullable(),
  status: z.enum(["in_stock", "low_stock", "out_of_stock", "discontinued"]).default("in_stock"),
  categoryId: z.string().optional().nullable(),
})

// GET - List products
export async function GET(request: NextRequest) {
  // Check if the user is authenticated
  const authError = await protectRoute(request)
  if (authError) return authError

  try {
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(url.searchParams.get("limit") || "10", 10)
    const search = url.searchParams.get("search") || ""
    const category = url.searchParams.get("category") || ""
    const status = url.searchParams.get("status") || ""

    const offset = (page - 1) * limit

    // Build query
    let query = db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        sku: products.sku,
        price: products.price,
        cost: products.cost,
        quantity: products.quantity,
        reorderLevel: products.reorderLevel,
        status: products.status,
        categoryId: products.categoryId,
        categoryName: categories.name,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))

    // Add filters
    const filters = []

    if (search) {
      filters.push(
        or(
          like(products.name, `%${search}%`),
          like(products.sku, `%${search}%`),
          like(products.description, `%${search}%`),
        ),
      )
    }

    if (category) {
      filters.push(eq(products.categoryId, category))
    }

    if (status) {
      filters.push(eq(products.status, status))
    }

    if (filters.length > 0) {
      query = query.where(and(...filters))
    }

    // Get total count for pagination
    const [countResult] = await db
      .select({ count: sql`COUNT(*)`.as("count") })
      .from(products)
      .where(filters.length > 0 ? and(...filters) : sql`1=1`)

    // Get products with pagination
    const results = await query.orderBy(desc(products.createdAt)).limit(limit).offset(offset)

    return NextResponse.json({
      products: results,
      pagination: {
        total: Number.parseInt(countResult.count as string, 10),
        page,
        limit,
        totalPages: Math.ceil(Number.parseInt(countResult.count as string, 10) / limit),
      },
    })
  } catch (error) {
    logger.error({ error }, "Error fetching products")

    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

// POST - Create product
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
    const result = productSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request", details: result.error.format() }, { status: 400 })
    }

    const productData = result.data

    // Check if SKU is unique if provided
    if (productData.sku) {
      const existingSku = await db.select().from(products).where(eq(products.sku, productData.sku)).limit(1)

      if (existingSku.length > 0) {
        return NextResponse.json({ error: "SKU already exists" }, { status: 400 })
      }
    }

    // Create product
    const [newProduct] = await db
      .insert(products)
      .values({
        ...productData,
        createdById: user.id,
      })
      .returning()

    // Log audit
    await db.insert(auditLogs).values({
      userId: user.id,
      action: "create",
      entityType: "product",
      entityId: newProduct.id,
      details: productData,
    })

    logger.info({ productId: newProduct.id }, "Product created")

    return NextResponse.json({ product: newProduct })
  } catch (error) {
    logger.error({ error }, "Error creating product")

    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

