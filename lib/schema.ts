import { pgTable, text, varchar, timestamp, integer, boolean, numeric, pgEnum, json } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { createId } from "@paralleldrive/cuid2"

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "manager", "employee", "viewer"])
export const orderStatusEnum = pgEnum("order_status", ["pending", "processing", "shipped", "delivered", "cancelled"])
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "failed", "refunded"])
export const inventoryStatusEnum = pgEnum("inventory_status", ["in_stock", "low_stock", "out_of_stock", "discontinued"])
export const projectStatusEnum = pgEnum("project_status", [
  "not_started",
  "in_progress",
  "on_hold",
  "completed",
  "cancelled",
])
export const taskStatusEnum = pgEnum("task_status", ["todo", "in_progress", "review", "done"])
export const taskPriorityEnum = pgEnum("task_priority", ["low", "medium", "high", "urgent"])
export const notificationTypeEnum = pgEnum("notification_type", ["system", "alert", "message"])

// Users
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("employee"),
  isActive: boolean("is_active").notNull().default(true),
  lastLogin: timestamp("last_login", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  customers: many(customers),
  products: many(products),
  projects: many(projects),
  tasks: many(tasks),
  notifications: many(notifications),
}))

// Customers
export const customers = pgTable("customers", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  zipCode: varchar("zip_code", { length: 20 }),
  country: varchar("country", { length: 100 }),
  notes: text("notes"),
  createdById: text("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
})

export const customersRelations = relations(customers, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [customers.createdById],
    references: [users.id],
  }),
  orders: many(orders),
}))

// Products
export const products = pgTable("products", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  sku: varchar("sku", { length: 100 }).unique(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  cost: numeric("cost", { precision: 10, scale: 2 }),
  quantity: integer("quantity").notNull().default(0),
  reorderLevel: integer("reorder_level"),
  status: inventoryStatusEnum("status").notNull().default("in_stock"),
  categoryId: text("category_id").references(() => categories.id),
  createdById: text("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
})

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  createdBy: one(users, {
    fields: [products.createdById],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}))

// Categories
export const categories = pgTable("categories", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
})

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}))

// Orders
export const orders = pgTable("orders", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  customerId: text("customer_id")
    .references(() => customers.id)
    .notNull(),
  orderDate: timestamp("order_date", { mode: "date" }).notNull().defaultNow(),
  status: orderStatusEnum("status").notNull().default("pending"),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: numeric("tax", { precision: 10, scale: 2 }),
  shipping: numeric("shipping", { precision: 10, scale: 2 }),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  createdById: text("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
})

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  createdBy: one(users, {
    fields: [orders.createdById],
    references: [users.id],
  }),
  orderItems: many(orderItems),
  payments: many(payments),
}))

// Order Items
export const orderItems = pgTable("order_items", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  orderId: text("order_id")
    .references(() => orders.id)
    .notNull(),
  productId: text("product_id")
    .references(() => products.id)
    .notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
})

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}))

// Payments
export const payments = pgTable("payments", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  orderId: text("order_id")
    .references(() => orders.id)
    .notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: timestamp("payment_date", { mode: "date" }).notNull().defaultNow(),
  paymentMethod: varchar("payment_method", { length: 100 }).notNull(),
  status: paymentStatusEnum("status").notNull().default("pending"),
  transactionId: varchar("transaction_id", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
})

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}))

// Projects
export const projects = pgTable("projects", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  startDate: timestamp("start_date", { mode: "date" }),
  endDate: timestamp("end_date", { mode: "date" }),
  status: projectStatusEnum("status").notNull().default("not_started"),
  budget: numeric("budget", { precision: 10, scale: 2 }),
  managerId: text("manager_id").references(() => users.id),
  createdById: text("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
})

export const projectsRelations = relations(projects, ({ one, many }) => ({
  manager: one(users, {
    fields: [projects.managerId],
    references: [users.id],
  }),
  createdBy: one(users, {
    fields: [projects.createdById],
    references: [users.id],
  }),
  tasks: many(tasks),
  projectMembers: many(projectMembers),
}))

// Project Members
export const projectMembers = pgTable("project_members", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  projectId: text("project_id")
    .references(() => projects.id)
    .notNull(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  role: varchar("role", { length: 100 }),
  joinedAt: timestamp("joined_at", { mode: "date" }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
})

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
}))

// Tasks
export const tasks = pgTable("tasks", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  projectId: text("project_id").references(() => projects.id),
  assigneeId: text("assignee_id").references(() => users.id),
  status: taskStatusEnum("status").notNull().default("todo"),
  priority: taskPriorityEnum("priority").notNull().default("medium"),
  dueDate: timestamp("due_date", { mode: "date" }),
  completedAt: timestamp("completed_at", { mode: "date" }),
  createdById: text("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
})

export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
  }),
  createdBy: one(users, {
    fields: [tasks.createdById],
    references: [users.id],
  }),
}))

// Notifications
export const notifications = pgTable("notifications", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  type: notificationTypeEnum("type").notNull().default("system"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  relatedId: text("related_id"),
  relatedType: varchar("related_type", { length: 100 }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
})

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}))

// Settings
export const settings = pgTable("settings", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  description: text("description"),
  isSystem: boolean("is_system").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
})

// Audit Logs
export const auditLogs = pgTable("audit_logs", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  userId: text("user_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 100 }).notNull(),
  entityId: text("entity_id"),
  details: json("details"),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
})

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}))

