import { type NextRequest, NextResponse } from "next/server"
import { getProducts, updateProduct, createProduct } from "@/lib/api"
import { updateProductStock, createInventoryTransaction } from "@/lib/utils/relational"

export async function GET(request: NextRequest) {
  try {
    const products = await getProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const newProduct = await createProduct(data)
    return NextResponse.json(newProduct)
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const updatedProduct = await updateProduct(id, updateData)
    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

// Adjust inventory levels
export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json()
    const { productId, quantity, operation, reason } = data

    if (!productId || !quantity || !operation) {
      return NextResponse.json({ error: "Product ID, quantity, and operation are required" }, { status: 400 })
    }

    // Get the product
    const product = await getProductById(productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Update the product stock
    const updatedProduct = updateProductStock(product, quantity, operation)

    // Save the updated product
    const savedProduct = await updateProduct(productId, updatedProduct)

    // Create inventory transaction
    const transaction = createInventoryTransaction(
      savedProduct,
      quantity,
      operation === "add" ? "receive" : "adjustment",
      reason || "Manual adjustment",
    )

    // In a real app, we would save the transaction to the database

    return NextResponse.json({
      product: savedProduct,
      transaction,
    })
  } catch (error) {
    console.error("Error adjusting inventory:", error)
    return NextResponse.json({ error: "Failed to adjust inventory" }, { status: 500 })
  }
}

// Helper function to get a product by ID
async function getProductById(id: string) {
  const products = await getProducts()
  return products.find((p) => p.id === id) || null
}

