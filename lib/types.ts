// Core entity types
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "employee" | "viewer"
  department?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  address?: Address
  status: "active" | "inactive"
  notes?: string
  avatar?: string
  totalOrders: number
  totalSpent: number
  lastOrderDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  sku: string
  name: string
  description?: string
  category: string
  price: number
  cost: number
  stock: number
  status: "instock" | "lowstock" | "outofstock"
  images?: string[]
  attributes?: Record<string, string>
  taxable: boolean
  taxRate?: number
  barcode?: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  locationId?: string
  supplierId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customer?: Customer
  items: OrderItem[]
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "refunded" | "failed"
  paymentMethod?: string
  shippingMethod?: string
  shippingAddress?: Address
  billingAddress?: Address
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  notes?: string
  createdById: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product?: Product
  quantity: number
  price: number
  cost: number
  tax: number
  discount: number
  total: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  orderId?: string
  order?: Order
  customerId: string
  customer?: Customer
  items: InvoiceItem[]
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  dueDate: Date
  issueDate: Date
  paymentDate?: Date
  subtotal: number
  tax: number
  discount: number
  total: number
  notes?: string
  createdById: string
  createdAt: Date
  updatedAt: Date
}

export interface InvoiceItem {
  id: string
  invoiceId: string
  productId: string
  product?: Product
  description: string
  quantity: number
  price: number
  tax: number
  discount: number
  total: number
}

export interface Supplier {
  id: string
  name: string
  contactName?: string
  email?: string
  phone?: string
  address?: Address
  website?: string
  taxId?: string
  paymentTerms?: string
  notes?: string
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}

export interface Purchase {
  id: string
  purchaseNumber: string
  supplierId: string
  supplier?: Supplier
  items: PurchaseItem[]
  status: "draft" | "ordered" | "received" | "cancelled"
  paymentStatus: "pending" | "paid" | "partial"
  expectedDeliveryDate?: Date
  receivedDate?: Date
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  notes?: string
  createdById: string
  createdAt: Date
  updatedAt: Date
}

export interface PurchaseItem {
  id: string
  purchaseId: string
  productId: string
  product?: Product
  quantity: number
  receivedQuantity: number
  price: number
  tax: number
  discount: number
  total: number
}

export interface Transaction {
  id: string
  transactionNumber: string
  type: "income" | "expense" | "transfer"
  amount: number
  date: Date
  description: string
  category: string
  accountId: string
  account?: Account
  relatedId?: string // Could be orderId, invoiceId, purchaseId, etc.
  relatedType?: string // "order", "invoice", "purchase", etc.
  status: "pending" | "completed" | "failed"
  createdById: string
  createdAt: Date
  updatedAt: Date
}

export interface Account {
  id: string
  name: string
  type: "checking" | "savings" | "credit" | "investment" | "cash"
  balance: number
  currency: string
  accountNumber?: string
  institution?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  title: string
  description?: string
  status: "planning" | "active" | "onhold" | "completed" | "cancelled"
  startDate: Date
  endDate?: Date
  budget?: number
  progress: number
  managerId: string
  manager?: User
  teamMembers: User[]
  tasks: Task[]
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  title: string
  description?: string
  projectId: string
  project?: Project
  status: "todo" | "inprogress" | "review" | "completed"
  priority: "low" | "medium" | "high"
  startDate?: Date
  dueDate?: Date
  completedDate?: Date
  assigneeId?: string
  assignee?: User
  createdById: string
  createdAt: Date
  updatedAt: Date
}

export interface Employee {
  id: string
  userId: string
  user?: User
  employeeId: string
  position: string
  department: string
  manager?: Employee
  managerId?: string
  hireDate: Date
  status: "active" | "onleave" | "remote" | "terminated"
  salary?: number
  payRate?: number
  payType: "salary" | "hourly" | "commission"
  address?: Address
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  documents?: EmployeeDocument[]
  createdAt: Date
  updatedAt: Date
}

export interface EmployeeDocument {
  id: string
  employeeId: string
  name: string
  type: string
  fileUrl: string
  uploadedAt: Date
  uploadedById: string
}

export interface Attendance {
  id: string
  employeeId: string
  employee?: Employee
  date: Date
  timeIn?: Date
  timeOut?: Date
  status: "present" | "absent" | "late" | "vacation" | "sick" | "remote"
  hours?: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Payroll {
  id: string
  payrollNumber: string
  period: {
    startDate: Date
    endDate: Date
  }
  status: "draft" | "processing" | "completed"
  totalAmount: number
  items: PayrollItem[]
  processedDate?: Date
  processedById: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface PayrollItem {
  id: string
  payrollId: string
  employeeId: string
  employee?: Employee
  salary: number
  bonus?: number
  deductions?: number
  taxes?: number
  netPay: number
  notes?: string
}

export interface Inventory {
  id: string
  productId: string
  product?: Product
  locationId: string
  location?: Location
  quantity: number
  minQuantity?: number
  maxQuantity?: number
  lastUpdated: Date
  updatedById: string
}

export interface InventoryTransaction {
  id: string
  type: "receive" | "transfer" | "adjustment" | "sale" | "return"
  productId: string
  product?: Product
  fromLocationId?: string
  fromLocation?: Location
  toLocationId?: string
  toLocation?: Location
  quantity: number
  date: Date
  reference?: string
  referenceId?: string
  notes?: string
  createdById: string
  createdAt: Date
}

export interface Location {
  id: string
  name: string
  type: "warehouse" | "store" | "supplier" | "customer"
  address?: Address
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: "system" | "message" | "alert"
  title: string
  description: string
  isRead: boolean
  relatedId?: string
  relatedType?: string
  createdAt: Date
}

export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

// Report types
export interface SalesReport {
  period: {
    startDate: Date
    endDate: Date
  }
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  topProducts: {
    productId: string
    name: string
    quantity: number
    revenue: number
  }[]
  salesByDay: {
    date: Date
    orders: number
    revenue: number
  }[]
  salesByChannel: {
    channel: string
    orders: number
    revenue: number
    percentage: number
  }[]
}

export interface InventoryReport {
  date: Date
  totalItems: number
  totalValue: number
  lowStockItems: number
  outOfStockItems: number
  inventoryByCategory: {
    category: string
    items: number
    value: number
    percentage: number
  }[]
  inventoryByLocation: {
    locationId: string
    locationName: string
    items: number
    value: number
  }[]
}

export interface FinancialReport {
  period: {
    startDate: Date
    endDate: Date
  }
  revenue: number
  expenses: number
  profit: number
  profitMargin: number
  revenueByCategory: {
    category: string
    amount: number
    percentage: number
  }[]
  expensesByCategory: {
    category: string
    amount: number
    percentage: number
  }[]
  cashFlow: {
    date: Date
    inflow: number
    outflow: number
    balance: number
  }[]
}

export interface CustomerReport {
  period: {
    startDate: Date
    endDate: Date
  }
  totalCustomers: number
  newCustomers: number
  activeCustomers: number
  averageLifetimeValue: number
  customersBySegment: {
    segment: string
    count: number
    percentage: number
  }[]
  topCustomers: {
    customerId: string
    name: string
    orders: number
    spent: number
  }[]
}

