"use client"

import React from "react"

import { ArrowUpDown, ChevronDown, Download, Filter, Plus, RefreshCw, Search, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

export default function SalesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 md:px-8">
        <div className="flex items-center gap-2 font-semibold">
          <ShoppingCart className="h-6 w-6 text-primary" />
          <span>AENZBi Cloud</span>
        </div>
        <nav className="hidden flex-1 md:flex md:justify-center">
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Dashboard
            </Link>
            <Link href="/inventory" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Inventory
            </Link>
            <Link href="/sales" className="font-medium text-primary">
              Sales
            </Link>
            <Link href="/customers" className="font-medium text-muted-foreground transition-colors hover:text-primary">
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
              <h1 className="text-2xl font-bold tracking-tight">Sales & Orders</h1>
              <p className="text-muted-foreground">Manage your sales, orders, and transactions</p>
            </div>
            <div className="flex items-center gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Order
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <Tabs defaultValue="orders">
              <TabsList>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="quotes">Quotes</TabsTrigger>
                <TabsTrigger value="pos">Point of Sale</TabsTrigger>
              </TabsList>
              <TabsContent value="orders" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>All Orders</CardTitle>
                        <CardDescription>View and manage customer orders</CardDescription>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <DateRangePicker />
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search orders..."
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
                            <TableHead className="w-[100px]">
                              <div className="flex items-center gap-1">
                                Order ID
                                <ArrowUpDown className="h-3 w-3" />
                              </div>
                            </TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead className="hidden md:table-cell">Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orderData.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                    {order.customerAvatar ? (
                                      <Image
                                        src={order.customerAvatar || "/placeholder.svg"}
                                        alt={order.customer}
                                        width={32}
                                        height={32}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-xs font-medium">
                                        {order.customer
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </span>
                                    )}
                                  </div>
                                  <span>{order.customer}</span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                              <TableCell className="hidden md:table-cell">{order.items}</TableCell>
                              <TableCell>${order.total.toFixed(2)}</TableCell>
                              <TableCell>
                                <OrderStatus status={order.status} />
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      Actions <ChevronDown className="ml-1 h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem>Edit Order</DropdownMenuItem>
                                    <DropdownMenuItem>Create Invoice</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Cancel Order</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Showing <strong>1-5</strong> of <strong>105</strong> orders
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled>
                          Previous
                        </Button>
                        <Button variant="outline" size="sm">
                          Next
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="invoices" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>Invoices</CardTitle>
                        <CardDescription>Manage customer invoices and payments</CardDescription>
                      </div>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Invoice
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Invoice #</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden md:table-cell">Issue Date</TableHead>
                            <TableHead className="hidden md:table-cell">Due Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">INV-1001</TableCell>
                            <TableCell>John Smith</TableCell>
                            <TableCell className="hidden md:table-cell">Mar 15, 2025</TableCell>
                            <TableCell className="hidden md:table-cell">Apr 15, 2025</TableCell>
                            <TableCell>$1,245.00</TableCell>
                            <TableCell>
                              <InvoiceStatus status="paid" />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">INV-1002</TableCell>
                            <TableCell>Sarah Johnson</TableCell>
                            <TableCell className="hidden md:table-cell">Mar 16, 2025</TableCell>
                            <TableCell className="hidden md:table-cell">Apr 16, 2025</TableCell>
                            <TableCell>$845.50</TableCell>
                            <TableCell>
                              <InvoiceStatus status="pending" />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">INV-1003</TableCell>
                            <TableCell>Michael Brown</TableCell>
                            <TableCell className="hidden md:table-cell">Mar 18, 2025</TableCell>
                            <TableCell className="hidden md:table-cell">Apr 18, 2025</TableCell>
                            <TableCell>$2,150.75</TableCell>
                            <TableCell>
                              <InvoiceStatus status="overdue" />
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
              <TabsContent value="quotes" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>Quotes</CardTitle>
                        <CardDescription>Manage customer quotes and estimates</CardDescription>
                      </div>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Quote
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Quote #</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead className="hidden md:table-cell">Expiry</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">QT-1001</TableCell>
                            <TableCell>Emily Davis</TableCell>
                            <TableCell className="hidden md:table-cell">Mar 10, 2025</TableCell>
                            <TableCell className="hidden md:table-cell">Apr 10, 2025</TableCell>
                            <TableCell>$3,450.00</TableCell>
                            <TableCell>
                              <QuoteStatus status="sent" />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">QT-1002</TableCell>
                            <TableCell>Robert Wilson</TableCell>
                            <TableCell className="hidden md:table-cell">Mar 12, 2025</TableCell>
                            <TableCell className="hidden md:table-cell">Apr 12, 2025</TableCell>
                            <TableCell>$1,875.25</TableCell>
                            <TableCell>
                              <QuoteStatus status="accepted" />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">QT-1003</TableCell>
                            <TableCell>Jennifer Lee</TableCell>
                            <TableCell className="hidden md:table-cell">Mar 14, 2025</TableCell>
                            <TableCell className="hidden md:table-cell">Apr 14, 2025</TableCell>
                            <TableCell>$950.00</TableCell>
                            <TableCell>
                              <QuoteStatus status="expired" />
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
              <TabsContent value="pos" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Point of Sale</CardTitle>
                    <CardDescription>Process in-person transactions quickly</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="rounded-md border p-4">
                          <h3 className="font-medium">Current Cart</h3>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">Laptop Pro X</div>
                                <div className="text-sm text-muted-foreground">1 x $1,299.99</div>
                              </div>
                              <div>$1,299.99</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">Wireless Earbuds</div>
                                <div className="text-sm text-muted-foreground">2 x $89.99</div>
                              </div>
                              <div>$179.98</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">Laptop Sleeve</div>
                                <div className="text-sm text-muted-foreground">1 x $49.99</div>
                              </div>
                              <div>$49.99</div>
                            </div>
                          </div>
                          <div className="mt-4 border-t pt-4">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">Subtotal</div>
                              <div>$1,529.96</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-muted-foreground">Tax (8%)</div>
                              <div className="text-sm text-muted-foreground">$122.40</div>
                            </div>
                            <div className="mt-2 flex items-center justify-between font-medium">
                              <div>Total</div>
                              <div>$1,652.36</div>
                            </div>
                          </div>
                          <div className="mt-4 grid gap-2">
                            <Button className="w-full">Process Payment</Button>
                            <Button variant="outline" className="w-full">
                              Clear Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input type="search" placeholder="Search products..." className="w-full pl-8" />
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <POSProductCard
                            name="Smartphone X12"
                            price={899.99}
                            image="/placeholder.svg?height=80&width=80"
                          />
                          <POSProductCard
                            name="Tablet Pro"
                            price={649.99}
                            image="/placeholder.svg?height=80&width=80"
                          />
                          <POSProductCard
                            name="Wireless Headphones"
                            price={199.99}
                            image="/placeholder.svg?height=80&width=80"
                          />
                          <POSProductCard
                            name="Smart Watch"
                            price={299.99}
                            image="/placeholder.svg?height=80&width=80"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$24,780.45</div>
                <p className="text-xs text-green-500">+12.5% from last month</p>
                <div className="mt-4 h-[80px] w-full rounded-md bg-muted/20"></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">105</div>
                <p className="text-xs text-green-500">+8.2% from last month</p>
                <div className="mt-4 h-[80px] w-full rounded-md bg-muted/20"></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$235.91</div>
                <p className="text-xs text-green-500">+4.3% from last month</p>
                <div className="mt-4 h-[80px] w-full rounded-md bg-muted/20"></div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

function OrderStatus({ status }: { status: "processing" | "shipped" | "delivered" | "cancelled" }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-opacity-10 text-xs",
        status === "processing" && "border-blue-500 bg-blue-500 text-blue-700 dark:text-blue-300",
        status === "shipped" && "border-yellow-500 bg-yellow-500 text-yellow-700 dark:text-yellow-300",
        status === "delivered" && "border-green-500 bg-green-500 text-green-700 dark:text-green-300",
        status === "cancelled" && "border-red-500 bg-red-500 text-red-700 dark:text-red-300",
      )}
    >
      {status === "processing"
        ? "Processing"
        : status === "shipped"
          ? "Shipped"
          : status === "delivered"
            ? "Delivered"
            : "Cancelled"}
    </Badge>
  )
}

function InvoiceStatus({ status }: { status: "paid" | "pending" | "overdue" }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-opacity-10 text-xs",
        status === "paid" && "border-green-500 bg-green-500 text-green-700 dark:text-green-300",
        status === "pending" && "border-yellow-500 bg-yellow-500 text-yellow-700 dark:text-yellow-300",
        status === "overdue" && "border-red-500 bg-red-500 text-red-700 dark:text-red-300",
      )}
    >
      {status === "paid" ? "Paid" : status === "pending" ? "Pending" : "Overdue"}
    </Badge>
  )
}

function QuoteStatus({ status }: { status: "draft" | "sent" | "accepted" | "expired" }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-opacity-10 text-xs",
        status === "draft" && "border-gray-500 bg-gray-500 text-gray-700 dark:text-gray-300",
        status === "sent" && "border-blue-500 bg-blue-500 text-blue-700 dark:text-blue-300",
        status === "accepted" && "border-green-500 bg-green-500 text-green-700 dark:text-green-300",
        status === "expired" && "border-red-500 bg-red-500 text-red-700 dark:text-red-300",
      )}
    >
      {status === "draft" ? "Draft" : status === "sent" ? "Sent" : status === "accepted" ? "Accepted" : "Expired"}
    </Badge>
  )
}

function POSProductCard({ name, price, image }: { name: string; price: number; image: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border p-3">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          width={80}
          height={80}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="font-medium">{name}</div>
        <div className="text-sm text-muted-foreground">${price.toFixed(2)}</div>
      </div>
      <Button size="sm" variant="ghost">
        Add
      </Button>
    </div>
  )
}

function DateRangePicker() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal sm:w-[240px]", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  )
}

const orderData = [
  {
    id: "ORD-1001",
    customer: "John Smith",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    date: "Mar 15, 2025",
    items: 3,
    total: 1529.97,
    status: "processing" as const,
  },
  {
    id: "ORD-1002",
    customer: "Sarah Johnson",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    date: "Mar 14, 2025",
    items: 2,
    total: 845.5,
    status: "shipped" as const,
  },
  {
    id: "ORD-1003",
    customer: "Michael Brown",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    date: "Mar 12, 2025",
    items: 5,
    total: 2150.75,
    status: "delivered" as const,
  },
  {
    id: "ORD-1004",
    customer: "Emily Davis",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    date: "Mar 10, 2025",
    items: 1,
    total: 299.99,
    status: "delivered" as const,
  },
  {
    id: "ORD-1005",
    customer: "Robert Wilson",
    customerAvatar: "/placeholder.svg?height=32&width=32",
    date: "Mar 08, 2025",
    items: 4,
    total: 1875.25,
    status: "cancelled" as const,
  },
]

