import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { protectRoute, getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { products, categories, auditLogs } from "@/lib/schema"
import { eq, ne, and } from "drizzle-orm"
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

// GET - Get product by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Check if the user is authenticated
  const authError = await protectRoute(request)
  if (authError) return authError

  try {
    const { id } = params

    // Get product by ID with category
    const [product] = await db
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
      .where(eq(products.id, id))
      .limit(1)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    logger.error({ error }, "Error fetching product")

    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

// PUT - Update product
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

    // Check if product exists
    const [existingProduct] = await db.select().from(products).where(eq(products.id, id)).limit(1)

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Parse request body
    const body = await request.json()

    // Validate request body
    const result = productSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request", details: result.error.format() }, { status: 400 })
    }

    const productData = result.data

    // Check if SKU is unique if changed
    if (productData.sku && productData.sku !== existingProduct.sku) {
      const existingSku = await db
        .select()
        .from(products)
        .where(and(eq(products.sku, productData.sku), ne(products.id, id)))
        .limit(1)

      if (existingSku.length > 0) {
        return NextResponse.json({ error: "SKU already exists" }, { status: 400 })
      }
    }

    // Update product
    const [updatedProduct] = await db
      .update(products)
      .set({
        ...productData,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning()

    // Log audit
    await db.insert(auditLogs).values({
      userId: user.id,
      action: "update",
      entityType: "product",
      entityId: id,
      details: productData,
    })

    logger.info({ productId: id }, "Product updated")

    return NextResponse.json({ product: updatedProduct })
  } catch (error) {
    logger.error({ error }, "Error updating product")

    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

// DELETE - Delete product
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

    // Check if product exists
    const [existingProduct] = await db.select().from(products).where(eq(products.id, id)).limit(1)

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Delete product
    await db.delete(products).where(eq(products.id, id))

    // Log audit
    await db.insert(auditLogs).values({
      userId: user.id,
      action: "delete",
      entityType: "product",
      entityId: id,
      details: { id },
    })

    logger.info({ productId: id }, "Product deleted")

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error({ error }, "Error deleting product")

    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}

