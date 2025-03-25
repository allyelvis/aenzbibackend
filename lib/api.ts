import type {
  Customer,
  Product,
  Order,
  Invoice,
  Transaction,
  Project,
  Task,
  Employee,
  Attendance,
  InventoryTransaction,
  Notification,
  SalesReport,
  InventoryReport,
  FinancialReport,
  CustomerReport,
} from "./types"

// Mock data functions - in a real app, these would connect to a database
// These functions simulate API calls with promises

// Customer API
export async function getCustomers(): Promise<Customer[]> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCustomers)
    }, 500)
  })
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const customer = mockCustomers.find((c) => c.id === id) || null
      resolve(customer)
    }, 300)
  })
}

export async function createCustomer(customer: Omit<Customer, "id" | "createdAt" | "updatedAt">): Promise<Customer> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCustomer: Customer = {
        id: `C${Math.floor(1000 + Math.random() * 9000)}`,
        totalOrders: 0,
        totalSpent: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...customer,
      }
      mockCustomers.push(newCustomer)
      resolve(newCustomer)
    }, 500)
  })
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockCustomers.findIndex((c) => c.id === id)
      if (index === -1) {
        reject(new Error("Customer not found"))
        return
      }

      const updatedCustomer = {
        ...mockCustomers[index],
        ...data,
        updatedAt: new Date(),
      }

      mockCustomers[index] = updatedCustomer
      resolve(updatedCustomer)
    }, 500)
  })
}

// Product API
export async function getProducts(): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts)
    }, 500)
  })
}

export async function getProductById(id: string): Promise<Product | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = mockProducts.find((p) => p.id === id) || null
      resolve(product)
    }, 300)
  })
}

export async function createProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProduct: Product = {
        id: `P${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...product,
      }
      mockProducts.push(newProduct)
      resolve(newProduct)
    }, 500)
  })
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockProducts.findIndex((p) => p.id === id)
      if (index === -1) {
        reject(new Error("Product not found"))
        return
      }

      const updatedProduct = {
        ...mockProducts[index],
        ...data,
        updatedAt: new Date(),
      }

      mockProducts[index] = updatedProduct
      resolve(updatedProduct)
    }, 500)
  })
}

export async function updateInventory(productId: string, quantity: number, type: "add" | "subtract"): Promise<Product> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockProducts.findIndex((p) => p.id === productId)
      if (index === -1) {
        reject(new Error("Product not found"))
        return
      }

      const product = mockProducts[index]
      const newStock = type === "add" ? product.stock + quantity : product.stock - quantity

      // Update stock status based on new quantity
      let status: "instock" | "lowstock" | "outofstock" = "instock"
      if (newStock <= 0) {
        status = "outofstock"
      } else if (newStock < 10) {
        status = "lowstock"
      }

      const updatedProduct = {
        ...product,
        stock: newStock,
        status,
        updatedAt: new Date(),
      }

      mockProducts[index] = updatedProduct

      // Create inventory transaction
      const transaction: InventoryTransaction = {
        id: `IT${Math.floor(1000 + Math.random() * 9000)}`,
        type: type === "add" ? "receive" : "sale",
        productId: productId,
        product: updatedProduct,
        quantity: quantity,
        date: new Date(),
        createdById: "USER1", // In a real app, this would be the current user
        createdAt: new Date(),
      }

      mockInventoryTransactions.push(transaction)

      resolve(updatedProduct)
    }, 500)
  })
}

// Order API
export async function getOrders(): Promise<Order[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Populate customer data for each order
      const ordersWithCustomers = mockOrders.map((order) => {
        const customer = mockCustomers.find((c) => c.id === order.customerId)
        return {
          ...order,
          customer,
        }
      })

      resolve(ordersWithCustomers)
    }, 500)
  })
}

export async function getOrderById(id: string): Promise<Order | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const order = mockOrders.find((o) => o.id === id)
      if (!order) {
        resolve(null)
        return
      }

      // Populate customer and product data
      const customer = mockCustomers.find((c) => c.id === order.customerId)
      const itemsWithProducts = order.items.map((item) => {
        const product = mockProducts.find((p) => p.id === item.productId)
        return {
          ...item,
          product,
        }
      })

      resolve({
        ...order,
        customer,
        items: itemsWithProducts,
      })
    }, 300)
  })
}

export async function createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newOrder: Order = {
        id: `ORD${Math.floor(1000 + Math.random() * 9000)}`,
        orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...orderData,
      }

      mockOrders.push(newOrder)

      // Update customer data
      const customerIndex = mockCustomers.findIndex((c) => c.id === orderData.customerId)
      if (customerIndex !== -1) {
        mockCustomers[customerIndex] = {
          ...mockCustomers[customerIndex],
          totalOrders: mockCustomers[customerIndex].totalOrders + 1,
          totalSpent: mockCustomers[customerIndex].totalSpent + orderData.total,
          lastOrderDate: new Date(),
          updatedAt: new Date(),
        }
      }

      // Update product inventory
      orderData.items.forEach((item) => {
        updateInventory(item.productId, item.quantity, "subtract")
      })

      // Create financial transaction
      const transaction: Transaction = {
        id: `TR${Math.floor(1000 + Math.random() * 9000)}`,
        transactionNumber: `TR-${Math.floor(1000 + Math.random() * 9000)}`,
        type: "income",
        amount: orderData.total,
        date: new Date(),
        description: `Payment for order ${newOrder.orderNumber}`,
        category: "Sales",
        accountId: "ACC001", // Default account
        relatedId: newOrder.id,
        relatedType: "order",
        status: orderData.paymentStatus === "paid" ? "completed" : "pending",
        createdById: orderData.createdById,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockTransactions.push(transaction)

      resolve(newOrder)
    }, 500)
  })
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockOrders.findIndex((o) => o.id === id)
      if (index === -1) {
        reject(new Error("Order not found"))
        return
      }

      const updatedOrder = {
        ...mockOrders[index],
        status,
        updatedAt: new Date(),
      }

      mockOrders[index] = updatedOrder

      // Create notification for status change
      const notification: Notification = {
        id: `N${Math.floor(1000 + Math.random() * 9000)}`,
        userId: "USER1", // In a real app, this would be the customer's user ID
        type: "alert",
        title: "Order Status Updated",
        description: `Your order ${updatedOrder.orderNumber} has been updated to ${status}`,
        isRead: false,
        relatedId: updatedOrder.id,
        relatedType: "order",
        createdAt: new Date(),
      }

      mockNotifications.push(notification)

      resolve(updatedOrder)
    }, 500)
  })
}

// Invoice API
export async function getInvoices(): Promise<Invoice[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Populate customer data for each invoice
      const invoicesWithCustomers = mockInvoices.map((invoice) => {
        const customer = mockCustomers.find((c) => c.id === invoice.customerId)
        return {
          ...invoice,
          customer,
        }
      })

      resolve(invoicesWithCustomers)
    }, 500)
  })
}

export async function createInvoiceFromOrder(orderId: string): Promise<Invoice> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const order = mockOrders.find((o) => o.id === orderId)
      if (!order) {
        reject(new Error("Order not found"))
        return
      }

      const newInvoice: Invoice = {
        id: `INV${Math.floor(1000 + Math.random() * 9000)}`,
        invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        orderId: order.id,
        order,
        customerId: order.customerId,
        customer: mockCustomers.find((c) => c.id === order.customerId),
        items: order.items.map((item) => ({
          id: `II${Math.floor(1000 + Math.random() * 9000)}`,
          invoiceId: "", // Will be set after creation
          productId: item.productId,
          product: mockProducts.find((p) => p.id === item.productId),
          description: item.product?.name || "Product",
          quantity: item.quantity,
          price: item.price,
          tax: item.tax,
          discount: item.discount,
          total: item.total,
        })),
        status: "draft",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        issueDate: new Date(),
        subtotal: order.subtotal,
        tax: order.tax,
        discount: order.discount,
        total: order.total,
        createdById: order.createdById,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Set the invoiceId for each item
      newInvoice.items = newInvoice.items.map((item) => ({
        ...item,
        invoiceId: newInvoice.id,
      }))

      mockInvoices.push(newInvoice)

      resolve(newInvoice)
    }, 500)
  })
}

// Financial API
export async function getTransactions(): Promise<Transaction[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTransactions)
    }, 500)
  })
}

export async function getAccounts(): Promise<Account[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAccounts)
    }, 500)
  })
}

// Project API
export async function getProjects(): Promise<Project[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProjects)
    }, 500)
  })
}

export async function getTasks(): Promise<Task[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTasks)
    }, 500)
  })
}

// Employee API
export async function getEmployees(): Promise<Employee[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Populate user data for each employee
      const employeesWithUsers = mockEmployees.map((employee) => {
        const user = mockUsers.find((u) => u.id === employee.userId)
        return {
          ...employee,
          user,
        }
      })

      resolve(employeesWithUsers)
    }, 500)
  })
}

export async function getAttendance(date?: Date): Promise<Attendance[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredAttendance = mockAttendance

      if (date) {
        const dateString = date.toISOString().split("T")[0]
        filteredAttendance = mockAttendance.filter((a) => a.date.toISOString().split("T")[0] === dateString)
      }

      // Populate employee data
      const attendanceWithEmployees = filteredAttendance.map((attendance) => {
        const employee = mockEmployees.find((e) => e.id === attendance.employeeId)
        return {
          ...attendance,
          employee,
        }
      })

      resolve(attendanceWithEmployees)
    }, 500)
  })
}

// Reporting API
export async function getSalesReport(startDate: Date, endDate: Date): Promise<SalesReport> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter orders within date range
      const filteredOrders = mockOrders.filter((order) => order.createdAt >= startDate && order.createdAt <= endDate)

      // Calculate total sales and orders
      const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0)
      const totalOrders = filteredOrders.length
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

      // Calculate top products
      const productSales: Record<string, { quantity: number; revenue: number }> = {}

      filteredOrders.forEach((order) => {
        order.items.forEach((item) => {
          if (!productSales[item.productId]) {
            productSales[item.productId] = { quantity: 0, revenue: 0 }
          }
          productSales[item.productId].quantity += item.quantity
          productSales[item.productId].revenue += item.total
        })
      })

      const topProducts = Object.entries(productSales)
        .map(([productId, data]) => {
          const product = mockProducts.find((p) => p.id === productId)
          return {
            productId,
            name: product?.name || "Unknown Product",
            quantity: data.quantity,
            revenue: data.revenue,
          }
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      // Calculate sales by day
      const salesByDay: SalesReport["salesByDay"] = []
      const dateMap = new Map<string, { orders: number; revenue: number }>()

      filteredOrders.forEach((order) => {
        const dateString = order.createdAt.toISOString().split("T")[0]
        if (!dateMap.has(dateString)) {
          dateMap.set(dateString, { orders: 0, revenue: 0 })
        }

        const current = dateMap.get(dateString)!
        dateMap.set(dateString, {
          orders: current.orders + 1,
          revenue: current.revenue + order.total,
        })
      })

      dateMap.forEach((value, dateString) => {
        salesByDay.push({
          date: new Date(dateString),
          orders: value.orders,
          revenue: value.revenue,
        })
      })

      // Sort by date
      salesByDay.sort((a, b) => a.date.getTime() - b.date.getTime())

      // Calculate sales by channel (mock data for now)
      const salesByChannel = [
        { channel: "Online Store", orders: Math.floor(totalOrders * 0.6), revenue: totalSales * 0.6, percentage: 60 },
        { channel: "In-Store", orders: Math.floor(totalOrders * 0.3), revenue: totalSales * 0.3, percentage: 30 },
        { channel: "Phone Orders", orders: Math.floor(totalOrders * 0.1), revenue: totalSales * 0.1, percentage: 10 },
      ]

      resolve({
        period: { startDate, endDate },
        totalSales,
        totalOrders,
        averageOrderValue,
        topProducts,
        salesByDay,
        salesByChannel,
      })
    }, 500)
  })
}

export async function getInventoryReport(): Promise<InventoryReport> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Calculate total items and value
      const totalItems = mockProducts.reduce((sum, product) => sum + product.stock, 0)
      const totalValue = mockProducts.reduce((sum, product) => sum + product.stock * product.cost, 0)

      // Count low stock and out of stock items
      const lowStockItems = mockProducts.filter((p) => p.status === "lowstock").length
      const outOfStockItems = mockProducts.filter((p) => p.status === "outofstock").length

      // Calculate inventory by category
      const categoryMap = new Map<string, { items: number; value: number }>()

      mockProducts.forEach((product) => {
        if (!categoryMap.has(product.category)) {
          categoryMap.set(product.category, { items: 0, value: 0 })
        }

        const current = categoryMap.get(product.category)!
        categoryMap.set(product.category, {
          items: current.items + product.stock,
          value: current.value + product.stock * product.cost,
        })
      })

      const inventoryByCategory = Array.from(categoryMap.entries()).map(([category, data]) => ({
        category,
        items: data.items,
        value: data.value,
        percentage: (data.value / totalValue) * 100,
      }))

      // Mock inventory by location
      const inventoryByLocation = [
        {
          locationId: "LOC001",
          locationName: "Main Warehouse",
          items: Math.floor(totalItems * 0.7),
          value: totalValue * 0.7,
        },
        {
          locationId: "LOC002",
          locationName: "Store #1",
          items: Math.floor(totalItems * 0.2),
          value: totalValue * 0.2,
        },
        {
          locationId: "LOC003",
          locationName: "Store #2",
          items: Math.floor(totalItems * 0.1),
          value: totalValue * 0.1,
        },
      ]

      resolve({
        date: new Date(),
        totalItems,
        totalValue,
        lowStockItems,
        outOfStockItems,
        inventoryByCategory,
        inventoryByLocation,
      })
    }, 500)
  })
}

export async function getFinancialReport(startDate: Date, endDate: Date): Promise<FinancialReport> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter transactions within date range
      const filteredTransactions = mockTransactions.filter(
        (transaction) => transaction.date >= startDate && transaction.date <= endDate,
      )

      // Calculate revenue, expenses, and profit
      const revenue = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

      const expenses = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

      const profit = revenue - expenses
      const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0

      // Calculate revenue by category
      const revenueByCategoryMap = new Map<string, number>()

      filteredTransactions
        .filter((t) => t.type === "income")
        .forEach((transaction) => {
          if (!revenueByCategoryMap.has(transaction.category)) {
            revenueByCategoryMap.set(transaction.category, 0)
          }

          revenueByCategoryMap.set(
            transaction.category,
            revenueByCategoryMap.get(transaction.category)! + transaction.amount,
          )
        })

      const revenueByCategory = Array.from(revenueByCategoryMap.entries()).map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / revenue) * 100,
      }))

      // Calculate expenses by category
      const expensesByCategoryMap = new Map<string, number>()

      filteredTransactions
        .filter((t) => t.type === "expense")
        .forEach((transaction) => {
          if (!expensesByCategoryMap.has(transaction.category)) {
            expensesByCategoryMap.set(transaction.category, 0)
          }

          expensesByCategoryMap.set(
            transaction.category,
            expensesByCategoryMap.get(transaction.category)! + transaction.amount,
          )
        })

      const expensesByCategory = Array.from(expensesByCategoryMap.entries()).map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / expenses) * 100,
      }))

      // Calculate cash flow
      const cashFlow: FinancialReport["cashFlow"] = []
      const dateMap = new Map<string, { inflow: number; outflow: number }>()

      filteredTransactions.forEach((transaction) => {
        const dateString = transaction.date.toISOString().split("T")[0]
        if (!dateMap.has(dateString)) {
          dateMap.set(dateString, { inflow: 0, outflow: 0 })
        }

        const current = dateMap.get(dateString)!

        if (transaction.type === "income") {
          dateMap.set(dateString, {
            ...current,
            inflow: current.inflow + transaction.amount,
          })
        } else if (transaction.type === "expense") {
          dateMap.set(dateString, {
            ...current,
            outflow: current.outflow + transaction.amount,
          })
        }
      })

      let balance = 0

      Array.from(dateMap.entries())
        .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
        .forEach(([dateString, { inflow, outflow }]) => {
          balance += inflow - outflow
          cashFlow.push({
            date: new Date(dateString),
            inflow,
            outflow,
            balance,
          })
        })

      resolve({
        period: { startDate, endDate },
        revenue,
        expenses,
        profit,
        profitMargin,
        revenueByCategory,
        expensesByCategory,
        cashFlow,
      })
    }, 500)
  })
}

export async function getCustomerReport(startDate: Date, endDate: Date): Promise<CustomerReport> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter orders within date range
      const filteredOrders = mockOrders.filter((order) => order.createdAt >= startDate && order.createdAt <= endDate)

      // Calculate total and new customers
      const totalCustomers = mockCustomers.length

      const newCustomers = mockCustomers.filter(
        (customer) => customer.createdAt >= startDate && customer.createdAt <= endDate,
      ).length

      // Calculate active customers (made an order in the period)
      const activeCustomerIds = new Set(filteredOrders.map((order) => order.customerId))
      const activeCustomers = activeCustomerIds.size

      // Calculate average lifetime value
      const averageLifetimeValue =
        mockCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0) / totalCustomers

      // Mock customer segments
      const customersBySegment = [
        { segment: "New", count: newCustomers, percentage: (newCustomers / totalCustomers) * 100 },
        { segment: "Returning", count: Math.floor(totalCustomers * 0.4), percentage: 40 },
        { segment: "Loyal", count: Math.floor(totalCustomers * 0.3), percentage: 30 },
        { segment: "At Risk", count: Math.floor(totalCustomers * 0.1), percentage: 10 },
      ]

      // Calculate top customers
      const customerOrderMap = new Map<string, { orders: number; spent: number }>()

      filteredOrders.forEach((order) => {
        if (!customerOrderMap.has(order.customerId)) {
          customerOrderMap.set(order.customerId, { orders: 0, spent: 0 })
        }

        const current = customerOrderMap.get(order.customerId)!
        customerOrderMap.set(order.customerId, {
          orders: current.orders + 1,
          spent: current.spent + order.total,
        })
      })

      const topCustomers = Array.from(customerOrderMap.entries())
        .map(([customerId, data]) => {
          const customer = mockCustomers.find((c) => c.id === customerId)
          return {
            customerId,
            name: customer?.name || "Unknown Customer",
            orders: data.orders,
            spent: data.spent,
          }
        })
        .sort((a, b) => b.spent - a.spent)
        .slice(0, 5)

      resolve({
        period: { startDate, endDate },
        totalCustomers,
        newCustomers,
        activeCustomers,
        averageLifetimeValue,
        customersBySegment,
        topCustomers,
      })
    }, 500)
  })
}

// Mock data
import type { Account } from "./types"

const mockUsers = [
  {
    id: "USER1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "admin" as const,
    department: "Management",
    avatar: "/placeholder.svg?height=32&width=32",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "USER2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    role: "manager" as const,
    department: "Sales",
    avatar: "/placeholder.svg?height=32&width=32",
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
  },
  {
    id: "USER3",
    name: "Michael Brown",
    email: "michael.b@example.com",
    role: "employee" as const,
    department: "Engineering",
    avatar: "/placeholder.svg?height=32&width=32",
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-03-05"),
  },
]

const mockCustomers = [
  {
    id: "C1001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    status: "active" as const,
    totalOrders: 12,
    totalSpent: 15680.45,
    lastOrderDate: new Date("2025-03-15"),
    avatar: "/placeholder.svg?height=32&width=32",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2025-03-15"),
  },
  {
    id: "C1002",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 987-6543",
    status: "active" as const,
    totalOrders: 8,
    totalSpent: 9450.2,
    lastOrderDate: new Date("2025-03-10"),
    avatar: "/placeholder.svg?height=32&width=32",
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2025-03-10"),
  },
  {
    id: "C1003",
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "+1 (555) 456-7890",
    status: "inactive" as const,
    totalOrders: 3,
    totalSpent: 2150.75,
    lastOrderDate: new Date("2024-12-05"),
    avatar: "/placeholder.svg?height=32&width=32",
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-12-05"),
  },
]

const mockProducts = [
  {
    id: "P001",
    sku: "LP-001",
    name: "Laptop Pro X",
    description: "High-performance laptop for professionals",
    category: "Electronics",
    price: 1299.99,
    cost: 899.99,
    stock: 45,
    status: "instock" as const,
    taxable: true,
    taxRate: 8.5,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2025-03-15"),
  },
  {
    id: "P002",
    sku: "WE-002",
    name: "Wireless Earbuds",
    description: "Premium wireless earbuds with noise cancellation",
    category: "Electronics",
    price: 89.99,
    cost: 39.99,
    stock: 8,
    status: "lowstock" as const,
    taxable: true,
    taxRate: 8.5,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2025-03-10"),
  },
  {
    id: "P003",
    sku: "OC-003",
    name: "Office Chair",
    description: "Ergonomic office chair with lumbar support",
    category: "Furniture",
    price: 199.99,
    cost: 89.99,
    stock: 12,
    status: "instock" as const,
    taxable: true,
    taxRate: 8.5,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2025-03-05"),
  },
  {
    id: "P004",
    sku: "CM-004",
    name: "Coffee Maker",
    description: "Programmable coffee maker with thermal carafe",
    category: "Appliances",
    price: 79.99,
    cost: 35.99,
    stock: 0,
    status: "outofstock" as const,
    taxable: true,
    taxRate: 8.5,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2025-03-01"),
  },
]

const mockOrders = [
  {
    id: "ORD1001",
    orderNumber: "ORD-1001",
    customerId: "C1001",
    items: [
      {
        id: "OI1001",
        orderId: "ORD1001",
        productId: "P001",
        quantity: 1,
        price: 1299.99,
        cost: 899.99,
        tax: 110.5,
        discount: 0,
        total: 1410.49,
      },
      {
        id: "OI1002",
        orderId: "ORD1001",
        productId: "P002",
        quantity: 2,
        price: 89.99,
        cost: 39.99,
        tax: 15.3,
        discount: 0,
        total: 195.28,
      },
    ],
    status: "delivered" as const,
    paymentStatus: "paid" as const,
    paymentMethod: "credit_card",
    subtotal: 1479.97,
    tax: 125.8,
    shipping: 0,
    discount: 0,
    total: 1605.77,
    createdById: "USER1",
    createdAt: new Date("2025-03-15"),
    updatedAt: new Date("2025-03-18"),
  },
  {
    id: "ORD1002",
    orderNumber: "ORD-1002",
    customerId: "C1002",
    items: [
      {
        id: "OI1003",
        orderId: "ORD1002",
        productId: "P003",
        quantity: 2,
        price: 199.99,
        cost: 89.99,
        tax: 34.0,
        discount: 0,
        total: 433.98,
      },
    ],
    status: "processing" as const,
    paymentStatus: "paid" as const,
    paymentMethod: "paypal",
    subtotal: 399.98,
    tax: 34.0,
    shipping: 15.0,
    discount: 0,
    total: 448.98,
    createdById: "USER2",
    createdAt: new Date("2025-03-10"),
    updatedAt: new Date("2025-03-10"),
  },
]

const mockInvoices = [
  {
    id: "INV1001",
    invoiceNumber: "INV-1001",
    orderId: "ORD1001",
    customerId: "C1001",
    items: [
      {
        id: "II1001",
        invoiceId: "INV1001",
        productId: "P001",
        description: "Laptop Pro X",
        quantity: 1,
        price: 1299.99,
        tax: 110.5,
        discount: 0,
        total: 1410.49,
      },
      {
        id: "II1002",
        invoiceId: "INV1001",
        productId: "P002",
        description: "Wireless Earbuds",
        quantity: 2,
        price: 89.99,
        tax: 15.3,
        discount: 0,
        total: 195.28,
      },
    ],
    status: "paid" as const,
    dueDate: new Date("2025-04-15"),
    issueDate: new Date("2025-03-15"),
    paymentDate: new Date("2025-03-15"),
    subtotal: 1479.97,
    tax: 125.8,
    discount: 0,
    total: 1605.77,
    createdById: "USER1",
    createdAt: new Date("2025-03-15"),
    updatedAt: new Date("2025-03-15"),
  },
]

const mockSuppliers = [
  {
    id: "SUP001",
    name: "Tech Distributors Inc.",
    contactName: "David Wilson",
    email: "david@techdist.com",
    phone: "+1 (555) 234-5678",
    status: "active" as const,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "SUP002",
    name: "Office Supplies Co.",
    contactName: "Jennifer Lee",
    email: "jennifer@officesupplies.com",
    phone: "+1 (555) 876-5432",
    status: "active" as const,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
]

const mockPurchases = [
  {
    id: "PUR001",
    purchaseNumber: "PUR-001",
    supplierId: "SUP001",
    items: [
      {
        id: "PI001",
        purchaseId: "PUR001",
        productId: "P001",
        quantity: 10,
        receivedQuantity: 10,
        price: 899.99,
        tax: 764.99,
        discount: 0,
        total: 8999.9,
      },
      {
        id: "PI002",
        purchaseId: "PUR001",
        productId: "P002",
        quantity: 50,
        receivedQuantity: 50,
        price: 39.99,
        tax: 169.96,
        discount: 0,
        total: 1999.5,
      },
    ],
    status: "received" as const,
    paymentStatus: "paid" as const,
    expectedDeliveryDate: new Date("2025-02-15"),
    receivedDate: new Date("2025-02-14"),
    subtotal: 10999.4,
    tax: 934.95,
    shipping: 0,
    discount: 0,
    total: 11934.35,
    createdById: "USER1",
    createdAt: new Date("2025-02-01"),
    updatedAt: new Date("2025-02-14"),
  },
]

const mockAccounts = [
  {
    id: "ACC001",
    name: "Business Checking",
    type: "checking" as const,
    balance: 45680.75,
    currency: "USD",
    accountNumber: "****4567",
    institution: "First National Bank",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2025-03-15"),
  },
  {
    id: "ACC002",
    name: "Business Savings",
    type: "savings" as const,
    balance: 125000.0,
    currency: "USD",
    accountNumber: "****7890",
    institution: "First National Bank",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2025-03-15"),
  },
  {
    id: "ACC003",
    name: "Business Credit Card",
    type: "credit" as const,
    balance: -4325.18,
    currency: "USD",
    accountNumber: "****1234",
    institution: "Capital One",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2025-03-15"),
  },
]

const mockTransactions = [
  {
    id: "TR001",
    transactionNumber: "TR-001",
    type: "income" as const,
    amount: 1605.77,
    date: new Date("2025-03-15"),
    description: "Payment for order ORD-1001",
    category: "Sales",
    accountId: "ACC001",
    relatedId: "ORD1001",
    relatedType: "order",
    status: "completed" as const,
    createdById: "USER1",
    createdAt: new Date("2025-03-15"),
    updatedAt: new Date("2025-03-15"),
  },
  {
    id: "TR002",
    transactionNumber: "TR-002",
    type: "income" as const,
    amount: 448.98,
    date: new Date("2025-03-10"),
    description: "Payment for order ORD-1002",
    category: "Sales",
    accountId: "ACC001",
    relatedId: "ORD1002",
    relatedType: "order",
    status: "completed" as const,
    createdById: "USER2",
    createdAt: new Date("2025-03-10"),
    updatedAt: new Date("2025-03-10"),
  },
  {
    id: "TR003",
    transactionNumber: "TR-003",
    type: "expense" as const,
    amount: 11934.35,
    date: new Date("2025-02-14"),
    description: "Payment for purchase PUR-001",
    category: "Inventory",
    accountId: "ACC001",
    relatedId: "PUR001",
    relatedType: "purchase",
    status: "completed" as const,
    createdById: "USER1",
    createdAt: new Date("2025-02-14"),
    updatedAt: new Date("2025-02-14"),
  },
  {
    id: "TR004",
    transactionNumber: "TR-004",
    type: "expense" as const,
    amount: 3500.0,
    date: new Date("2025-03-01"),
    description: "Office rent payment",
    category: "Rent",
    accountId: "ACC001",
    status: "completed" as const,
    createdById: "USER1",
    createdAt: new Date("2025-03-01"),
    updatedAt: new Date("2025-03-01"),
  },
  {
    id: "TR005",
    transactionNumber: "TR-005",
    type: "expense" as const,
    amount: 15420.0,
    date: new Date("2025-03-05"),
    description: "Employee payroll",
    category: "Payroll",
    accountId: "ACC001",
    status: "completed" as const,
    createdById: "USER1",
    createdAt: new Date("2025-03-05"),
    updatedAt: new Date("2025-03-05"),
  },
]

const mockProjects = [
  {
    id: "PROJ001",
    title: "Website Redesign",
    description: "Complete overhaul of company website with new branding and improved UX",
    status: "active" as const,
    startDate: new Date("2025-02-15"),
    endDate: new Date("2025-04-15"),
    budget: 15000,
    progress: 65,
    managerId: "USER1",
    teamMembers: mockUsers,
    tasks: [],
    createdAt: new Date("2025-02-10"),
    updatedAt: new Date("2025-03-15"),
  },
  {
    id: "PROJ002",
    title: "Mobile App Development",
    description: "Create a new mobile app for iOS and Android platforms",
    status: "active" as const,
    startDate: new Date("2025-03-01"),
    endDate: new Date("2025-05-30"),
    budget: 25000,
    progress: 40,
    managerId: "USER2",
    teamMembers: [mockUsers[1], mockUsers[2]],
    tasks: [],
    createdAt: new Date("2025-02-20"),
    updatedAt: new Date("2025-03-10"),
  },
]

const mockTasks = [
  {
    id: "TASK001",
    title: "Design homepage mockups",
    description: "Create mockups for the new homepage design",
    projectId: "PROJ001",
    status: "inprogress" as const,
    priority: "high" as const,
    startDate: new Date("2025-02-20"),
    dueDate: new Date("2025-03-05"),
    assigneeId: "USER2",
    createdById: "USER1",
    createdAt: new Date("2025-02-15"),
    updatedAt: new Date("2025-02-20"),
  },
  {
    id: "TASK002",
    title: "Develop user authentication",
    description: "Implement user authentication system for the mobile app",
    projectId: "PROJ002",
    status: "todo" as const,
    priority: "medium" as const,
    startDate: new Date("2025-03-15"),
    dueDate: new Date("2025-04-05"),
    assigneeId: "USER3",
    createdById: "USER2",
    createdAt: new Date("2025-03-01"),
    updatedAt: new Date("2025-03-01"),
  },
]

const mockEmployees = [
  {
    id: "EMP001",
    userId: "USER1",
    employeeId: "E001",
    position: "CEO",
    department: "Management",
    hireDate: new Date("2023-01-15"),
    status: "active" as const,
    salary: 120000,
    payType: "salary" as const,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "EMP002",
    userId: "USER2",
    employeeId: "E002",
    position: "Sales Manager",
    department: "Sales",
    managerId: "EMP001",
    hireDate: new Date("2023-02-10"),
    status: "active" as const,
    salary: 85000,
    payType: "salary" as const,
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
  },
  {
    id: "EMP003",
    userId: "USER3",
    employeeId: "E003",
    position: "Senior Developer",
    department: "Engineering",
    managerId: "EMP001",
    hireDate: new Date("2023-03-05"),
    status: "remote" as const,
    salary: 95000,
    payType: "salary" as const,
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-03-05"),
  },
]

const mockAttendance = [
  {
    id: "ATT001",
    employeeId: "EMP001",
    date: new Date("2025-03-15"),
    timeIn: new Date("2025-03-15T08:55:00"),
    timeOut: new Date("2025-03-15T17:05:00"),
    status: "present" as const,
    hours: 8.2,
    createdAt: new Date("2025-03-15"),
    updatedAt: new Date("2025-03-15"),
  },
  {
    id: "ATT002",
    employeeId: "EMP002",
    date: new Date("2025-03-15"),
    timeIn: new Date("2025-03-15T09:30:00"),
    timeOut: new Date("2025-03-15T17:15:00"),
    status: "late" as const,
    hours: 7.75,
    createdAt: new Date("2025-03-15"),
    updatedAt: new Date("2025-03-15"),
  },
  {
    id: "ATT003",
    employeeId: "EMP003",
    date: new Date("2025-03-15"),
    status: "remote" as const,
    hours: 8,
    createdAt: new Date("2025-03-15"),
    updatedAt: new Date("2025-03-15"),
  },
]

const mockInventoryTransactions = [
  {
    id: "IT001",
    type: "receive" as const,
    productId: "P001",
    quantity: 10,
    date: new Date("2025-02-14"),
    reference: "Purchase",
    referenceId: "PUR001",
    createdById: "USER1",
    createdAt: new Date("2025-02-14"),
  },
  {
    id: "IT002",
    type: "sale" as const,
    productId: "P001",
    quantity: 1,
    date: new Date("2025-03-15"),
    reference: "Order",
    referenceId: "ORD1001",
    createdById: "USER1",
    createdAt: new Date("2025-03-15"),
  },
  {
    id: "IT003",
    type: "sale" as const,
    productId: "P002",
    quantity: 2,
    date: new Date("2025-03-15"),
    reference: "Order",
    referenceId: "ORD1001",
    createdById: "USER1",
    createdAt: new Date("2025-03-15"),
  },
]

const mockNotifications = [
  {
    id: "N001",
    userId: "USER1",
    type: "system" as const,
    title: "System Maintenance",
    description: "Scheduled maintenance will occur on March 25, 2025 from 2:00 AM to 4:00 AM UTC.",
    isRead: false,
    createdAt: new Date("2025-03-15"),
  },
  {
    id: "N002",
    userId: "USER1",
    type: "alert" as const,
    title: "Low Inventory Alert",
    description: "Wireless Earbuds (SKU: WE-002) has reached the low stock threshold.",
    isRead: false,
    relatedId: "P002",
    relatedType: "product",
    createdAt: new Date("2025-03-10"),
  },
  {
    id: "N003",
    userId: "USER1",
    type: "message" as const,
    title: "New Order",
    description: "A new order (ORD-1001) has been placed by John Smith.",
    isRead: true,
    relatedId: "ORD1001",
    relatedType: "order",
    createdAt: new Date("2025-03-15"),
  },
]

// Initialize project tasks
mockProjects.forEach((project) => {
  project.tasks = mockTasks.filter((task) => task.projectId === project.id)
})

