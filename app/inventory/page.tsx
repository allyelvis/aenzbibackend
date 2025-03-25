import { Download, Filter, Package, Plus, RefreshCw, Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InventoryPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 md:px-8">
        <div className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6 text-primary" />
          <span>AENZBi Cloud</span>
        </div>
        <nav className="hidden flex-1 md:flex md:justify-center">
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Dashboard
            </Link>
            <Link href="/inventory" className="font-medium text-primary">
              Inventory
            </Link>
            <Link href="#" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Sales
            </Link>
            <Link href="#" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Customers
            </Link>
          </div>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          <Button variant="outline" size="sm">
            Help
          </Button>
          <Button size="sm">Upgrade Plan</Button>
        </div>
      </header>
      <div className="flex flex-1">
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
              <p className="text-muted-foreground">Manage your products, stock levels, and inventory operations</p>
            </div>
            <div className="flex items-center gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <Tabs defaultValue="products">
              <TabsList>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="stock">Stock Levels</TabsTrigger>
                <TabsTrigger value="transfers">Transfers</TabsTrigger>
              </TabsList>
              <TabsContent value="products" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>All Products</CardTitle>
                        <CardDescription>Manage your product catalog and inventory</CardDescription>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search products..."
                            className="w-full pl-8 md:w-[200px] lg:w-[300px]"
                          />
                        </div>
                        <Button variant="outline" size="icon">
                          <Filter className="h-4 w-4" />
                          <span className="sr-only">Filter</span>
                        </Button>
                        <Button variant="outline" size="icon">
                          <RefreshCw className="h-4 w-4" />
                          <span className="sr-only">Refresh</span>
                        </Button>
                        <Button variant="outline" size="icon">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[80px]">SKU</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="hidden md:table-cell">Price</TableHead>
                            <TableHead className="hidden md:table-cell">Cost</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="hidden md:table-cell">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inventoryData.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.sku}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell className="hidden md:table-cell">${item.price.toFixed(2)}</TableCell>
                              <TableCell className="hidden md:table-cell">${item.cost.toFixed(2)}</TableCell>
                              <TableCell>{item.stock}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                <StockStatus status={item.status} />
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm">
                        Next
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="categories" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Categories</CardTitle>
                    <CardDescription>Organize your products with categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Products</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Electronics</TableCell>
                            <TableCell>Electronic devices and accessories</TableCell>
                            <TableCell>24</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Furniture</TableCell>
                            <TableCell>Home and office furniture</TableCell>
                            <TableCell>18</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Clothing</TableCell>
                            <TableCell>Apparel and fashion items</TableCell>
                            <TableCell>32</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Food & Beverage</TableCell>
                            <TableCell>Consumable products</TableCell>
                            <TableCell>15</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="stock" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Stock Levels</CardTitle>
                    <CardDescription>Monitor inventory levels across locations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          <SelectItem value="main">Main Warehouse</SelectItem>
                          <SelectItem value="store1">Store #1</SelectItem>
                          <SelectItem value="store2">Store #2</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="instock">In Stock</SelectItem>
                          <SelectItem value="low">Low Stock</SelectItem>
                          <SelectItem value="outofstock">Out of Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      <StockCard title="In Stock" value="1,245" change="+12%" />
                      <StockCard title="Low Stock" value="32" change="-8%" isNegative />
                      <StockCard title="Out of Stock" value="15" change="-24%" isNegative />
                    </div>
                    <div className="mt-6 h-[300px] rounded-md border bg-muted/20 p-4 flex items-center justify-center">
                      <p className="text-muted-foreground">Stock level chart will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="transfers" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Transfers</CardTitle>
                    <CardDescription>Manage stock transfers between locations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Select defaultValue="all">
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Transfers</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search transfers..."
                            className="w-full pl-8 md:w-[200px] lg:w-[300px]"
                          />
                        </div>
                      </div>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Transfer
                      </Button>
                    </div>
                    <div className="mt-4 rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Transfer ID</TableHead>
                            <TableHead>From</TableHead>
                            <TableHead>To</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead className="hidden md:table-cell">Items</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">TRF-1001</TableCell>
                            <TableCell>Main Warehouse</TableCell>
                            <TableCell>Store #1</TableCell>
                            <TableCell className="hidden md:table-cell">Mar 15, 2025</TableCell>
                            <TableCell className="hidden md:table-cell">12</TableCell>
                            <TableCell>
                              <TransferStatus status="completed" />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">TRF-1002</TableCell>
                            <TableCell>Store #2</TableCell>
                            <TableCell>Store #1</TableCell>
                            <TableCell className="hidden md:table-cell">Mar 18, 2025</TableCell>
                            <TableCell className="hidden md:table-cell">5</TableCell>
                            <TableCell>
                              <TransferStatus status="pending" />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">TRF-1003</TableCell>
                            <TableCell>Main Warehouse</TableCell>
                            <TableCell>Store #2</TableCell>
                            <TableCell className="hidden md:table-cell">Mar 19, 2025</TableCell>
                            <TableCell className="hidden md:table-cell">8</TableCell>
                            <TableCell>
                              <TransferStatus status="cancelled" />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

function StockStatus({ status }: { status: "instock" | "lowstock" | "outofstock" }) {
  return (
    <div className="flex items-center">
      <div
        className={`mr-2 h-2 w-2 rounded-full ${
          status === "instock" ? "bg-green-500" : status === "lowstock" ? "bg-yellow-500" : "bg-red-500"
        }`}
      />
      <span>{status === "instock" ? "In Stock" : status === "lowstock" ? "Low Stock" : "Out of Stock"}</span>
    </div>
  )
}

function TransferStatus({ status }: { status: "pending" | "completed" | "cancelled" }) {
  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        status === "completed"
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          : status === "pending"
            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      }`}
    >
      {status === "completed" ? "Completed" : status === "pending" ? "Pending" : "Cancelled"}
    </div>
  )
}

function StockCard({
  title,
  value,
  change,
  isNegative = false,
}: {
  title: string
  value: string
  change: string
  isNegative?: boolean
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${isNegative ? "text-red-500" : "text-green-500"}`}>{change} from last month</p>
      </CardContent>
    </Card>
  )
}

const inventoryData = [
  {
    id: 1,
    sku: "P001",
    name: "Laptop Pro X",
    category: "Electronics",
    price: 1299.99,
    cost: 899.99,
    stock: 45,
    status: "instock" as const,
  },
  {
    id: 2,
    sku: "P002",
    name: "Wireless Earbuds",
    category: "Electronics",
    price: 89.99,
    cost: 39.99,
    stock: 120,
    status: "instock" as const,
  },
  {
    id: 3,
    sku: "P003",
    name: "Office Chair",
    category: "Furniture",
    price: 199.99,
    cost: 89.99,
    stock: 8,
    status: "lowstock" as const,
  },
  {
    id: 4,
    sku: "P004",
    name: "Coffee Maker",
    category: "Appliances",
    price: 79.99,
    cost: 35.99,
    stock: 0,
    status: "outofstock" as const,
  },
  {
    id: 5,
    sku: "P005",
    name: "Smartphone X12",
    category: "Electronics",
    price: 899.99,
    cost: 599.99,
    stock: 32,
    status: "instock" as const,
  },
  {
    id: 6,
    sku: "P006",
    name: "Desk Lamp",
    category: "Home Goods",
    price: 39.99,
    cost: 15.99,
    stock: 5,
    status: "lowstock" as const,
  },
]

