import type {
  Customer,
  Product,
  Order,
  OrderItem,
  InvoiceItem,
  Transaction,
  Task,
  InventoryTransaction,
} from "../types"

/**
 * Utility functions for handling relational data between modules
 */

// Order-related functions
export function calculateOrderTotals(items: OrderItem[]): {
  subtotal: number
  tax: number
  total: number
} {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = items.reduce((sum, item) => sum + item.tax, 0)
  const total = subtotal + tax

  return { subtotal, tax, total }
}

export function createOrderItemsFromProducts(
  products: Array<{ product: Product; quantity: number; discount?: number }>,
): OrderItem[] {
  return products.map(({ product, quantity, discount = 0 }) => {
    const price = product.price
    const taxAmount = product.taxable ? (price * quantity * (product.taxRate || 0)) / 100 : 0
    const discountAmount = (price * quantity * discount) / 100
    const total = price * quantity + taxAmount - discountAmount

    return {
      id: "", // Will be set when saved
      orderId: "", // Will be set when saved
      productId: product.id,
      product,
      quantity,
      price,
      cost: product.cost,
      tax: taxAmount,
      discount: discountAmount,
      total,
    }
  })
}

// Invoice-related functions
export function createInvoiceItemsFromOrderItems(orderItems: OrderItem[]): InvoiceItem[] {
  return orderItems.map((item) => ({
    id: "", // Will be set when saved
    invoiceId: "", // Will be set when saved
    productId: item.productId,
    product: item.product,
    description: item.product?.name || "Product",
    quantity: item.quantity,
    price: item.price,
    tax: item.tax,
    discount: item.discount,
    total: item.total,
  }))
}

// Inventory-related functions
export function updateProductStock(product: Product, quantity: number, operation: "add" | "subtract"): Product {
  const newStock = operation === "add" ? product.stock + quantity : Math.max(0, product.stock - quantity)

  // Update stock status based on new quantity
  let status: "instock" | "lowstock" | "outofstock" = "instock"
  if (newStock <= 0) {
    status = "outofstock"
  } else if (newStock < 10) {
    status = "lowstock"
  }

  return {
    ...product,
    stock: newStock,
    status,
    updatedAt: new Date(),
  }
}

export function createInventoryTransaction(
  product: Product,
  quantity: number,
  type: InventoryTransaction["type"],
  reference?: string,
  referenceId?: string,
): InventoryTransaction {
  return {
    id: "", // Will be set when saved
    type,
    productId: product.id,
    product,
    quantity,
    date: new Date(),
    reference,
    referenceId,
    createdById: "USER1", // In a real app, this would be the current user
    createdAt: new Date(),
  }
}

// Customer-related functions
export function updateCustomerOrderStats(customer: Customer, orderTotal: number): Customer {
  return {
    ...customer,
    totalOrders: customer.totalOrders + 1,
    totalSpent: customer.totalSpent + orderTotal,
    lastOrderDate: new Date(),
    updatedAt: new Date(),
  }
}

// Project-related functions
export function calculateProjectProgress(tasks: Task[]): number {
  if (tasks.length === 0) return 0

  const completedTasks = tasks.filter((task) => task.status === "completed").length
  return Math.round((completedTasks / tasks.length) * 100)
}

// Employee-related functions
export function calculateAttendanceHours(timeIn: Date | undefined, timeOut: Date | undefined): number {
  if (!timeIn || !timeOut) return 0

  const diffMs = timeOut.getTime() - timeIn.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)

  return Number.parseFloat(diffHours.toFixed(2))
}

// Financial-related functions
export function createTransactionFromOrder(order: Order, accountId: string): Transaction {
  return {
    id: "", // Will be set when saved
    transactionNumber: `TR-${Math.floor(1000 + Math.random() * 9000)}`,
    type: "income",
    amount: order.total,
    date: new Date(),
    description: `Payment for order ${order.orderNumber}`,
    category: "Sales",
    accountId,
    relatedId: order.id,
    relatedType: "order",
    status: order.paymentStatus === "paid" ? "completed" : "pending",
    createdById: order.createdById,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

// Cross-module functions
export function processOrderCreation(
  order: Order,
  customer: Customer,
  accountId: string,
): {
  updatedProducts: Product[]
  updatedCustomer: Customer
  inventoryTransactions: InventoryTransaction[]
  financialTransaction: Transaction
} {
  // Update product inventory
  const updatedProducts: Product[] = []
  const inventoryTransactions: InventoryTransaction[] = []

  order.items.forEach((item) => {
    if (item.product) {
      const updatedProduct = updateProductStock(item.product, item.quantity, "subtract")
      updatedProducts.push(updatedProduct)

      const inventoryTransaction = createInventoryTransaction(item.product, item.quantity, "sale", "Order", order.id)

      inventoryTransactions.push(inventoryTransaction)
    }
  })

  // Update customer stats
  const updatedCustomer = updateCustomerOrderStats(customer, order.total)

  // Create financial transaction
  const financialTransaction = createTransactionFromOrder(order, accountId)

  return {
    updatedProducts,
    updatedCustomer,
    inventoryTransactions,
    financialTransaction,
  }
}

