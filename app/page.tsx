import { Badge } from "@/components/ui/badge"
import type React from "react"
import {
  ArrowRight,
  BarChart3,
  Cloud,
  CreditCard,
  Database,
  FileText,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { InventoryStatus } from "@/components/dashboard/inventory-status"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 md:px-8">
        <div className="flex items-center gap-2 font-semibold">
          <Cloud className="h-6 w-6 text-primary" />
          <span>AENZBi Cloud</span>
        </div>
        <nav className="hidden flex-1 md:flex md:justify-center">
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="font-medium text-primary">
              Dashboard
            </a>
            <a href="/inventory" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Inventory
            </a>
            <a href="/sales" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Sales
            </a>
            <a href="/finance" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Finance
            </a>
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
        <aside className="hidden w-[240px] flex-col border-r bg-muted/40 md:flex">
          <div className="flex flex-col gap-1 py-2">
            <Button variant="ghost" className="flex items-center justify-start gap-2 px-4" asChild>
              <a href="/">
                <Home className="h-4 w-4" />
                Dashboard
              </a>
            </Button>
            <Button variant="ghost" className="flex items-center justify-start gap-2 px-4" asChild>
              <a href="/inventory">
                <Package className="h-4 w-4" />
                Inventory
              </a>
            </Button>
            <Button variant="ghost" className="flex items-center justify-start gap-2 px-4" asChild>
              <a href="/sales">
                <ShoppingCart className="h-4 w-4" />
                Sales
              </a>
            </Button>
            <Button variant="ghost" className="flex items-center justify-start gap-2 px-4" asChild>
              <a href="/finance">
                <CreditCard className="h-4 w-4" />
                Finance
              </a>
            </Button>
            <Button variant="ghost" className="flex items-center justify-start gap-2 px-4" asChild>
              <a href="/customers">
                <Users className="h-4 w-4" />
                Customers
              </a>
            </Button>
            <Button variant="ghost" className="flex items-center justify-start gap-2 px-4" asChild>
              <a href="/reports">
                <FileText className="h-4 w-4" />
                Reports
              </a>
            </Button>
            <Button variant="ghost" className="flex items-center justify-start gap-2 px-4" asChild>
              <a href="/projects">
                <BarChart3 className="h-4 w-4" />
                Projects
              </a>
            </Button>
            <Button variant="ghost" className="flex items-center justify-start gap-2 px-4" asChild>
              <a href="/employees">
                <Users className="h-4 w-4" />
                Employees
              </a>
            </Button>
            <Button variant="ghost" className="flex items-center justify-start gap-2 px-4" asChild>
              <a href="/settings">
                <Settings className="h-4 w-4" />
                Settings
              </a>
            </Button>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Welcome to AENZBi Cloud Business System</p>
            </div>
            <div className="flex items-center gap-2">
              <Button>Quick Actions</Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$84,325.75</div>
                <p className="text-xs text-green-500">+15.3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$152,345.80</div>
                <p className="text-xs text-green-500">+5.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,245</div>
                <p className="text-xs text-green-500">+12.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45.2%</div>
                <p className="text-xs text-green-500">+3.8% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mt-6">
            <SalesChart />
            <RecentActivity />
          </div>

          <div className="grid gap-4 md:grid-cols-3 mt-6">
            <InventoryStatus />
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Business Process Workflow</CardTitle>
                <CardDescription>
                  Visualize and manage your entire business process from suppliers to sales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessWorkflow />
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Tabs defaultValue="modules">
              <TabsList>
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
              </TabsList>
              <TabsContent value="modules" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <ModuleCard
                    title="Inventory Management"
                    description="Track stock levels, orders, and deliveries"
                    icon={<Package className="h-8 w-8" />}
                    href="/inventory"
                  />
                  <ModuleCard
                    title="Sales & Orders"
                    description="Manage sales, orders, and transactions"
                    icon={<ShoppingCart className="h-8 w-8" />}
                    href="/sales"
                  />
                  <ModuleCard
                    title="Financial Management"
                    description="Track income, expenses, and financial performance"
                    icon={<CreditCard className="h-8 w-8" />}
                    href="/finance"
                  />
                  <ModuleCard
                    title="Customer Management"
                    description="Manage customers and build relationships"
                    icon={<Users className="h-8 w-8" />}
                    href="/customers"
                  />
                  <ModuleCard
                    title="Reports & Analytics"
                    description="Gain insights with advanced reporting and dashboards"
                    icon={<BarChart3 className="h-8 w-8" />}
                    href="/reports"
                  />
                  <ModuleCard
                    title="Project Management"
                    description="Manage projects, tasks, and team collaboration"
                    icon={<FileText className="h-8 w-8" />}
                    href="/projects"
                  />
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Analytics</CardTitle>
                    <CardDescription>Track your business performance with real-time analytics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] rounded-md border bg-muted/40 p-4 flex items-center justify-center">
                      <p className="text-muted-foreground">Analytics dashboard will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="integrations" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>System Integrations</CardTitle>
                    <CardDescription>Connect with other business tools and services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <IntegrationCard
                        title="Accounting Software"
                        description="Connect with QuickBooks, Xero, or other accounting systems"
                        status="available"
                      />
                      <IntegrationCard
                        title="Payment Gateways"
                        description="Integrate with Stripe, PayPal, and other payment processors"
                        status="connected"
                      />
                      <IntegrationCard
                        title="E-commerce Platforms"
                        description="Connect with Shopify, WooCommerce, and other platforms"
                        status="available"
                      />
                      <IntegrationCard
                        title="Shipping Providers"
                        description="Integrate with UPS, FedEx, and other shipping services"
                        status="available"
                      />
                      <IntegrationCard
                        title="CRM Systems"
                        description="Connect with Salesforce, HubSpot, and other CRM tools"
                        status="connected"
                      />
                      <IntegrationCard
                        title="Marketing Tools"
                        description="Integrate with email marketing and automation tools"
                        status="available"
                      />
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

function BusinessWorkflow() {
  return (
    <div className="relative overflow-auto rounded-md border bg-muted/20 p-6">
      <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
        <WorkflowNode title="Suppliers" icon={<Users className="h-6 w-6" />} />
        <ArrowRight className="h-6 w-6 text-muted-foreground" />
        <WorkflowNode title="Purchasing" icon={<CreditCard className="h-6 w-6" />} />
        <ArrowRight className="h-6 w-6 text-muted-foreground" />
        <div className="flex flex-col gap-4">
          <WorkflowNode title="Central Store" icon={<Package className="h-6 w-6" />} />
          <div className="flex items-center justify-center gap-4">
            <ArrowRight className="h-6 w-6 rotate-90 text-muted-foreground" />
          </div>
          <WorkflowNode title="Departments" icon={<Database className="h-6 w-6" />} />
        </div>
        <ArrowRight className="h-6 w-6 text-muted-foreground" />
        <div className="flex flex-col gap-4">
          <WorkflowNode title="Restaurant" icon={<ShoppingCart className="h-6 w-6" />} />
          <div className="flex items-center justify-center gap-4">
            <ArrowRight className="h-6 w-6 rotate-90 text-muted-foreground" />
          </div>
          <WorkflowNode title="POS Center" icon={<CreditCard className="h-6 w-6" />} />
        </div>
        <ArrowRight className="h-6 w-6 text-muted-foreground" />
        <WorkflowNode title="Sales" icon={<ShoppingCart className="h-6 w-6" />} />
      </div>
      <div className="mt-8 flex items-center justify-center gap-8">
        <WorkflowNode title="Issue Voucher" icon={<FileText className="h-6 w-6" />} />
        <ArrowRight className="h-6 w-6 text-muted-foreground" />
        <WorkflowNode title="Adjustment" icon={<Settings className="h-6 w-6" />} />
      </div>
    </div>
  )
}

function WorkflowNode({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-20 w-32 flex-col items-center justify-center rounded-md border bg-card p-2 shadow-sm">
        <div className="rounded-full bg-primary/10 p-2 text-primary">{icon}</div>
        <span className="mt-1 text-sm font-medium">{title}</span>
      </div>
    </div>
  )
}

function ModuleCard({
  title,
  description,
  icon,
  href,
}: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a href={href}>Open Module</a>
        </Button>
      </CardFooter>
    </Card>
  )
}

function IntegrationCard({
  title,
  description,
  status,
}: {
  title: string
  description: string
  status: "available" | "connected" | "coming-soon"
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          {status === "connected" ? (
            <Badge className="bg-green-500">Connected</Badge>
          ) : status === "available" ? (
            <Badge variant="outline">Available</Badge>
          ) : (
            <Badge variant="outline" className="border-gray-500 text-gray-500">
              Coming Soon
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button
          variant={status === "connected" ? "outline" : "default"}
          size="sm"
          className="w-full"
          disabled={status === "coming-soon"}
        >
          {status === "connected" ? "Manage" : "Connect"}
        </Button>
      </CardFooter>
    </Card>
  )
}

