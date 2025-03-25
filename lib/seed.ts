import { db } from "@/lib/db"
import { users, categories, products, customers, settings } from "@/lib/schema"
import { hashPassword } from "@/lib/auth"
import logger from "@/lib/logger"

export async function seedDatabase() {
  try {
    logger.info("Starting database seeding...")

    // Check if admin user exists
    const existingAdmin = await db.select().from(users).limit(1)

    if (existingAdmin.length > 0) {
      logger.info("Database already seeded, skipping...")
      return
    }

    // Create admin user
    const adminPassword = await hashPassword("admin123")

    await db.insert(users).values({
      email: "admin@aenzbi.com",
      name: "Admin User",
      passwordHash: adminPassword,
      role: "admin",
      isActive: true,
    })

    logger.info("Created admin user: admin@aenzbi.com / admin123")

    // Create demo user
    const demoPassword = await hashPassword("demo123")

    await db.insert(users).values({
      email: "demo@aenzbi.com",
      name: "Demo User",
      passwordHash: demoPassword,
      role: "manager",
      isActive: true,
    })

    logger.info("Created demo user: demo@aenzbi.com / demo123")

    // Create product categories
    const categoryData = [
      { name: "Electronics", description: "Electronic devices and accessories" },
      { name: "Clothing", description: "Apparel and fashion items" },
      { name: "Home & Kitchen", description: "Home goods and kitchen supplies" },
      { name: "Office Supplies", description: "Office equipment and supplies" },
      { name: "Sports & Outdoors", description: "Sports equipment and outdoor gear" },
    ]

    await db.insert(categories).values(categoryData)
    logger.info("Created product categories")

    // Get category IDs
    const categoryResults = await db.select().from(categories)
    const categoryMap = new Map(categoryResults.map((cat) => [cat.name, cat.id]))

    // Create sample products
    const productData = [
      {
        name: "Laptop Pro X1",
        description: "High-performance laptop with 16GB RAM and 512GB SSD",
        sku: "LPRO-X1",
        price: 1299.99,
        cost: 899.99,
        quantity: 25,
        reorderLevel: 5,
        categoryId: categoryMap.get("Electronics"),
      },
      {
        name: "Wireless Headphones",
        description: "Noise-cancelling wireless headphones with 20-hour battery life",
        sku: "WH-100",
        price: 199.99,
        cost: 89.99,
        quantity: 50,
        reorderLevel: 10,
        categoryId: categoryMap.get("Electronics"),
      },
      {
        name: "Cotton T-Shirt",
        description: "Premium cotton t-shirt, available in multiple colors",
        sku: "TS-COTTON",
        price: 24.99,
        cost: 8.99,
        quantity: 100,
        reorderLevel: 20,
        categoryId: categoryMap.get("Clothing"),
      },
      {
        name: "Office Desk Chair",
        description: "Ergonomic office chair with lumbar support",
        sku: "ODC-ERG1",
        price: 249.99,
        cost: 149.99,
        quantity: 15,
        reorderLevel: 3,
        categoryId: categoryMap.get("Office Supplies"),
      },
      {
        name: "Smart Coffee Maker",
        description: "Programmable coffee maker with smartphone control",
        sku: "SCM-100",
        price: 129.99,
        cost: 79.99,
        quantity: 30,
        reorderLevel: 5,
        categoryId: categoryMap.get("Home & Kitchen"),
      },
    ]

    await db.insert(products).values(productData)
    logger.info("Created sample products")

    // Create sample customers
    const customerData = [
      {
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "555-123-4567",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      {
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "555-987-6543",
        address: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001",
        country: "USA",
      },
      {
        name: "Michael Brown",
        email: "michael.b@example.com",
        phone: "555-456-7890",
        address: "789 Pine St",
        city: "Chicago",
        state: "IL",
        zipCode: "60007",
        country: "USA",
      },
      {
        name: "Acme Corporation",
        email: "info@acmecorp.com",
        phone: "555-111-2222",
        address: "100 Corporate Blvd",
        city: "Boston",
        state: "MA",
        zipCode: "02108",
        country: "USA",
      },
      {
        name: "Global Enterprises",
        email: "contact@globalent.com",
        phone: "555-333-4444",
        address: "200 Business Park",
        city: "Seattle",
        state: "WA",
        zipCode: "98101",
        country: "USA",
      },
    ]

    await db.insert(customers).values(customerData)
    logger.info("Created sample customers")

    // Create system settings
    const settingsData = [
      {
        key: "company_name",
        value: "AENZBi Cloud Business",
        description: "Company name displayed throughout the application",
        isSystem: true,
      },
      {
        key: "company_email",
        value: "info@aenzbi.com",
        description: "Primary contact email",
        isSystem: true,
      },
      {
        key: "currency",
        value: "USD",
        description: "Default currency for transactions",
        isSystem: true,
      },
      {
        key: "tax_rate",
        value: "7.5",
        description: "Default tax rate percentage",
        isSystem: true,
      },
      {
        key: "order_prefix",
        value: "ORD-",
        description: "Prefix for order numbers",
        isSystem: true,
      },
    ]

    await db.insert(settings).values(settingsData)
    logger.info("Created system settings")

    logger.info("Database seeding completed successfully")
  } catch (error) {
    logger.error({ error }, "Database seeding failed")
    throw error
  }
}

