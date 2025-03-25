import { Download, Filter, Plus, RefreshCw, Search, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CustomersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 md:px-8">
        <div className="flex items-center gap-2 font-semibold">
          <Users className="h-6 w-6 text-primary" />
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
            <Link href="#" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Sales
            </Link>
            <Link href="/customers" className="font-medium text-primary">
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
              <h1 className="text-2xl font-bold tracking-tight">Customer Management</h1>
              <p className="text-muted-foreground">
                Manage your customers, track interactions, and build relationships
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Customers</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>Customer Directory</CardTitle>
                        <CardDescription>View and manage all your customer accounts</CardDescription>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search customers..."
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
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden md:table-cell">Email</TableHead>
                            <TableHead className="hidden md:table-cell">Phone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden md:table-cell">Orders</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {customerData.map((customer) => (
                            <TableRow key={customer.id}>
                              <TableCell className="font-medium">{customer.id}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                    {customer.avatar ? (
                                      <Image
                                        src={customer.avatar || "/placeholder.svg"}
                                        alt={customer.name}
                                        width={32}
                                        height={32}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-xs font-medium">
                                        {customer.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-medium">{customer.name}</div>
                                    <div className="text-xs text-muted-foreground md:hidden">{customer.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">{customer.email}</TableCell>
                              <TableCell className="hidden md:table-cell">{customer.phone}</TableCell>
                              <TableCell>
                                <CustomerStatus status={customer.status} />
                              </TableCell>
                              <TableCell className="hidden md:table-cell">{customer.orders}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Showing <strong>1-6</strong> of <strong>24</strong> customers
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
              <TabsContent value="active" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Customers</CardTitle>
                    <CardDescription>Customers who have made a purchase in the last 90 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] rounded-md border bg-muted/20 p-4 flex items-center justify-center">
                      <p className="text-muted-foreground">Active customers list will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="inactive" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Inactive Customers</CardTitle>
                    <CardDescription>Customers who haven't made a purchase in over 90 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] rounded-md border bg-muted/20 p-4 flex items-center justify-center">
                      <p className="text-muted-foreground">Inactive customers list will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="groups" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <CardTitle>Customer Groups</CardTitle>
                        <CardDescription>Organize customers into groups for targeted marketing</CardDescription>
                      </div>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Group
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Group Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Members</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">VIP Customers</TableCell>
                            <TableCell>High-value customers with premium status</TableCell>
                            <TableCell>24</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Manage
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">New Customers</TableCell>
                            <TableCell>Customers who joined in the last 30 days</TableCell>
                            <TableCell>18</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Manage
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Corporate Accounts</TableCell>
                            <TableCell>Business and enterprise customers</TableCell>
                            <TableCell>12</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Manage
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

function CustomerStatus({ status }: { status: "active" | "inactive" }) {
  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        status === "active"
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      }`}
    >
      {status === "active" ? "Active" : "Inactive"}
    </div>
  )
}

const customerData = [
  {
    id: "C1001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    status: "active" as const,
    orders: 12,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "C1002",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 987-6543",
    status: "active" as const,
    orders: 8,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "C1003",
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "+1 (555) 456-7890",
    status: "inactive" as const,
    orders: 3,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "C1004",
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "+1 (555) 234-5678",
    status: "active" as const,
    orders: 15,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "C1005",
    name: "Robert Wilson",
    email: "robert.w@example.com",
    phone: "+1 (555) 876-5432",
    status: "active" as const,
    orders: 6,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "C1006",
    name: "Jennifer Lee",
    email: "jennifer.l@example.com",
    phone: "+1 (555) 345-6789",
    status: "inactive" as const,
    orders: 1,
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

