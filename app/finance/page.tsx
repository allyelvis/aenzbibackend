"use client"

import React from "react"

import { ArrowUpDown, BarChart3, CreditCard, Download, Filter, Plus, Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

export default function FinancePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 md:px-8">
        <div className="flex items-center gap-2 font-semibold">
          <CreditCard className="h-6 w-6 text-primary" />
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
            <Link href="/sales" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Sales
            </Link>
            <Link href="/finance" className="font-medium text-primary">
              Finance
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
              <h1 className="text-2xl font-bold tracking-tight">Financial Management</h1>
              <p className="text-muted-foreground">Track income, expenses, and financial performance</p>
            </div>
            <div className="flex items-center gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Transaction
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$84,325.75</div>
                <p className="text-xs text-green-500">+15.3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$46,218.32</div>
                <p className="text-xs text-red-500">+8.7% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$38,107.43</div>
                <p className="text-xs text-green-500">+24.8% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$29,542.18</div>
                <p className="text-xs text-green-500">+12.1% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Tabs defaultValue="transactions">
              <TabsList>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="accounts">Accounts</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="budgets">Budgets</TabsTrigger>
              </TabsList>
              <TabsContent value="transactions" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>View and manage your financial transactions</CardDescription>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <DateRangePicker />
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search transactions..."
                            className="w-full pl-8 md:w-[200px] lg:w-[300px]"
                          />
                        </div>
                        <Button variant="outline" size="icon">
                          <Filter className="h-4 w-4" />
                          <span className="sr-only">Filter</span>
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
                                Date
                                <ArrowUpDown className="h-3 w-3" />
                              </div>
                            </TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Account</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactionData.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell className="font-medium">{transaction.date}</TableCell>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell>{transaction.category}</TableCell>
                              <TableCell>{transaction.account}</TableCell>
                              <TableCell
                                className={cn(
                                  "text-right font-medium",
                                  transaction.amount > 0 ? "text-green-600" : "text-red-600",
                                )}
                              >
                                {transaction.amount > 0 ? "+" : ""}
                                {transaction.amount.toFixed(2)}
                              </TableCell>
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
                        Showing <strong>1-5</strong> of <strong>125</strong> transactions
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
              <TabsContent value="accounts" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>Financial Accounts</CardTitle>
                        <CardDescription>
                          Manage your bank accounts, credit cards, and other financial accounts
                        </CardDescription>
                      </div>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Account
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <AccountCard
                        name="Business Checking"
                        type="Bank Account"
                        balance={42568.75}
                        accountNumber="****4567"
                      />
                      <AccountCard
                        name="Business Savings"
                        type="Bank Account"
                        balance={125789.32}
                        accountNumber="****7890"
                      />
                      <AccountCard
                        name="Business Credit Card"
                        type="Credit Card"
                        balance={-4325.18}
                        accountNumber="****1234"
                      />
                      <AccountCard
                        name="Investment Account"
                        type="Investment"
                        balance={250000.0}
                        accountNumber="****5678"
                      />
                      <AccountCard
                        name="Tax Reserve"
                        type="Savings Account"
                        balance={35000.0}
                        accountNumber="****9012"
                      />
                      <div className="flex items-center justify-center rounded-lg border border-dashed p-8">
                        <Button variant="outline">
                          <Plus className="mr-2 h-4 w-4" />
                          Add New Account
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reports" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Reports</CardTitle>
                    <CardDescription>Generate and view financial reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <ReportCard
                        title="Income Statement"
                        description="View revenue, expenses, and profit"
                        icon={<BarChart3 className="h-5 w-5" />}
                      />
                      <ReportCard
                        title="Balance Sheet"
                        description="View assets, liabilities, and equity"
                        icon={<BarChart3 className="h-5 w-5" />}
                      />
                      <ReportCard
                        title="Cash Flow"
                        description="Track cash inflows and outflows"
                        icon={<BarChart3 className="h-5 w-5" />}
                      />
                      <ReportCard
                        title="Tax Summary"
                        description="View tax obligations and payments"
                        icon={<BarChart3 className="h-5 w-5" />}
                      />
                      <ReportCard
                        title="Expense Report"
                        description="Analyze expenses by category"
                        icon={<BarChart3 className="h-5 w-5" />}
                      />
                      <ReportCard
                        title="Revenue Report"
                        description="Analyze revenue by source"
                        icon={<BarChart3 className="h-5 w-5" />}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="budgets" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>Budgets</CardTitle>
                        <CardDescription>Create and manage budgets to control spending</CardDescription>
                      </div>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Budget
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <BudgetCard name="Marketing" allocated={10000} spent={7500} remaining={2500} period="Monthly" />
                      <BudgetCard
                        name="Office Supplies"
                        allocated={2500}
                        spent={1800}
                        remaining={700}
                        period="Monthly"
                      />
                      <BudgetCard
                        name="Software Subscriptions"
                        allocated={5000}
                        spent={4200}
                        remaining={800}
                        period="Monthly"
                      />
                      <BudgetCard
                        name="Travel & Entertainment"
                        allocated={7500}
                        spent={3200}
                        remaining={4300}
                        period="Monthly"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Track your financial performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] rounded-md border bg-muted/20 p-4 flex items-center justify-center">
                  <p className="text-muted-foreground">Financial chart will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
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

function AccountCard({
  name,
  type,
  balance,
  accountNumber,
}: {
  name: string
  type: string
  balance: number
  accountNumber: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{name}</CardTitle>
          <Badge variant="outline">{type}</Badge>
        </div>
        <CardDescription>{accountNumber}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", balance >= 0 ? "text-green-600" : "text-red-600")}>
          ${Math.abs(balance).toFixed(2)}
        </div>
        <p className="text-xs text-muted-foreground">{balance >= 0 ? "Available Balance" : "Outstanding Balance"}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full">
          View Transactions
        </Button>
      </CardFooter>
    </Card>
  )
}

function ReportCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div>
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mt-2 flex justify-end">
          <Button variant="outline" size="sm">
            Generate
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function BudgetCard({
  name,
  allocated,
  spent,
  remaining,
  period,
}: {
  name: string
  allocated: number
  spent: number
  remaining: number
  period: string
}) {
  const percentSpent = (spent / allocated) * 100

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{name}</CardTitle>
          <Badge variant="outline">{period}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Budget: ${allocated.toFixed(2)}</span>
            <span>{percentSpent.toFixed(0)}% used</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className={cn(
                "h-2 rounded-full",
                percentSpent > 90 ? "bg-red-500" : percentSpent > 75 ? "bg-yellow-500" : "bg-green-500",
              )}
              style={{ width: `${percentSpent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Spent: ${spent.toFixed(2)}</span>
            <span className="text-muted-foreground">Remaining: ${remaining.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

const transactionData = [
  {
    id: 1,
    date: "Mar 15, 2025",
    description: "Client Payment - ABC Corp",
    category: "Sales Revenue",
    account: "Business Checking",
    amount: 12500.0,
  },
  {
    id: 2,
    date: "Mar 14, 2025",
    description: "Office Rent",
    category: "Rent & Utilities",
    account: "Business Checking",
    amount: -3500.0,
  },
  {
    id: 3,
    date: "Mar 12, 2025",
    description: "Software Subscription",
    category: "Software",
    account: "Business Credit Card",
    amount: -199.99,
  },
  {
    id: 4,
    date: "Mar 10, 2025",
    description: "Client Payment - XYZ Inc",
    category: "Sales Revenue",
    account: "Business Checking",
    amount: 8750.0,
  },
  {
    id: 5,
    date: "Mar 08, 2025",
    description: "Employee Payroll",
    category: "Payroll",
    account: "Business Checking",
    amount: -15420.0,
  },
]

