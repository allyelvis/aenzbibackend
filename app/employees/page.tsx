import { cn } from "@/lib/utils"
import { Calendar, ChevronDown, Download, Plus, Search, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Progress } from "@/components/ui/progress"

export default function EmployeesPage() {
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
            <Link href="/sales" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Sales
            </Link>
            <Link href="/employees" className="font-medium text-primary">
              Employees
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
              <h1 className="text-2xl font-bold tracking-tight">Employee Management</h1>
              <p className="text-muted-foreground">Manage your team, attendance, and performance</p>
            </div>
            <div className="flex items-center gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <Tabs defaultValue="directory">
              <TabsList>
                <TabsTrigger value="directory">Directory</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="payroll">Payroll</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
              <TabsContent value="directory" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>Employee Directory</CardTitle>
                        <CardDescription>View and manage your team members</CardDescription>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search employees..."
                            className="w-full pl-8 md:w-[200px] lg:w-[300px]"
                          />
                        </div>
                        <Select defaultValue="all">
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="engineering">Engineering</SelectItem>
                            <SelectItem value="hr">HR</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                          </SelectContent>
                        </Select>
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
                            <TableHead>Employee</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead className="hidden md:table-cell">Position</TableHead>
                            <TableHead className="hidden md:table-cell">Status</TableHead>
                            <TableHead className="hidden md:table-cell">Start Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {employeeData.map((employee) => (
                            <TableRow key={employee.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                    {employee.avatar ? (
                                      <Image
                                        src={employee.avatar || "/placeholder.svg"}
                                        alt={employee.name}
                                        width={32}
                                        height={32}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-xs font-medium">
                                        {employee.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-medium">{employee.name}</div>
                                    <div className="text-xs text-muted-foreground">{employee.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{employee.department}</TableCell>
                              <TableCell className="hidden md:table-cell">{employee.position}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                <EmployeeStatus status={employee.status} />
                              </TableCell>
                              <TableCell className="hidden md:table-cell">{employee.startDate}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      Actions <ChevronDown className="ml-1 h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                    <DropdownMenuItem>Manage Access</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
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
                        Showing <strong>1-5</strong> of <strong>24</strong> employees
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
              <TabsContent value="attendance" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>Attendance Tracking</CardTitle>
                        <CardDescription>Monitor employee attendance and time off</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline">
                          <Calendar className="mr-2 h-4 w-4" />
                          Select Date
                        </Button>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Record Time Off
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Status Today</TableHead>
                            <TableHead className="hidden md:table-cell">Time In</TableHead>
                            <TableHead className="hidden md:table-cell">Time Out</TableHead>
                            <TableHead>Hours</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                  <span className="text-xs font-medium">JS</span>
                                </div>
                                <span>John Smith</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <AttendanceStatus status="present" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">8:55 AM</TableCell>
                            <TableCell className="hidden md:table-cell">5:05 PM</TableCell>
                            <TableCell>8.2</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                  <span className="text-xs font-medium">SJ</span>
                                </div>
                                <span>Sarah Johnson</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <AttendanceStatus status="late" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">9:30 AM</TableCell>
                            <TableCell className="hidden md:table-cell">5:15 PM</TableCell>
                            <TableCell>7.75</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                  <span className="text-xs font-medium">MB</span>
                                </div>
                                <span>Michael Brown</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <AttendanceStatus status="vacation" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">-</TableCell>
                            <TableCell className="hidden md:table-cell">-</TableCell>
                            <TableCell>0</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                  <span className="text-xs font-medium">ED</span>
                                </div>
                                <span>Emily Davis</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <AttendanceStatus status="remote" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">8:45 AM</TableCell>
                            <TableCell className="hidden md:table-cell">5:30 PM</TableCell>
                            <TableCell>8.75</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="payroll" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>Payroll Management</CardTitle>
                        <CardDescription>Manage employee compensation and benefits</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select defaultValue="march">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="january">January 2025</SelectItem>
                            <SelectItem value="february">February 2025</SelectItem>
                            <SelectItem value="march">March 2025</SelectItem>
                            <SelectItem value="april">April 2025</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button>Run Payroll</Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead className="hidden md:table-cell">Salary</TableHead>
                            <TableHead className="hidden md:table-cell">Bonus</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                  <span className="text-xs font-medium">JS</span>
                                </div>
                                <span>John Smith</span>
                              </div>
                            </TableCell>
                            <TableCell>Sales</TableCell>
                            <TableCell className="hidden md:table-cell">$75,000</TableCell>
                            <TableCell className="hidden md:table-cell">$5,000</TableCell>
                            <TableCell>$80,000</TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant="outline"
                                className="border-green-500 bg-green-500 bg-opacity-10 text-green-700"
                              >
                                Processed
                              </Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                  <span className="text-xs font-medium">SJ</span>
                                </div>
                                <span>Sarah Johnson</span>
                              </div>
                            </TableCell>
                            <TableCell>Marketing</TableCell>
                            <TableCell className="hidden md:table-cell">$70,000</TableCell>
                            <TableCell className="hidden md:table-cell">$3,500</TableCell>
                            <TableCell>$73,500</TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant="outline"
                                className="border-green-500 bg-green-500 bg-opacity-10 text-green-700"
                              >
                                Processed
                              </Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                  <span className="text-xs font-medium">MB</span>
                                </div>
                                <span>Michael Brown</span>
                              </div>
                            </TableCell>
                            <TableCell>Engineering</TableCell>
                            <TableCell className="hidden md:table-cell">$95,000</TableCell>
                            <TableCell className="hidden md:table-cell">$7,500</TableCell>
                            <TableCell>$102,500</TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant="outline"
                                className="border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-700"
                              >
                                Pending
                              </Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                  <span className="text-xs font-medium">ED</span>
                                </div>
                                <span>Emily Davis</span>
                              </div>
                            </TableCell>
                            <TableCell>HR</TableCell>
                            <TableCell className="hidden md:table-cell">$65,000</TableCell>
                            <TableCell className="hidden md:table-cell">$2,000</TableCell>
                            <TableCell>$67,000</TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant="outline"
                                className="border-green-500 bg-green-500 bg-opacity-10 text-green-700"
                              >
                                Processed
                              </Badge>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-6">
                      <h3 className="mb-4 text-lg font-medium">Payroll Summary</h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-medium text-muted-foreground">Total Payroll</div>
                          <div className="mt-1 text-2xl font-bold">$323,000</div>
                        </div>
                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-medium text-muted-foreground">Base Salaries</div>
                          <div className="mt-1 text-2xl font-bold">$305,000</div>
                        </div>
                        <div className="rounded-lg border p-4">
                          <div className="text-sm font-medium text-muted-foreground">Bonuses</div>
                          <div className="mt-1 text-2xl font-bold">$18,000</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="performance" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>Performance Management</CardTitle>
                        <CardDescription>Track employee performance and goals</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          New Review
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="mb-4 text-lg font-medium">Performance Reviews</h3>
                        <div className="space-y-4">
                          <PerformanceReviewCard
                            employee="John Smith"
                            position="Sales Manager"
                            reviewDate="Mar 15, 2025"
                            reviewType="Quarterly"
                            status="completed"
                          />
                          <PerformanceReviewCard
                            employee="Sarah Johnson"
                            position="Marketing Specialist"
                            reviewDate="Mar 10, 2025"
                            reviewType="Quarterly"
                            status="completed"
                          />
                          <PerformanceReviewCard
                            employee="Michael Brown"
                            position="Senior Developer"
                            reviewDate="Mar 25, 2025"
                            reviewType="Quarterly"
                            status="scheduled"
                          />
                          <PerformanceReviewCard
                            employee="Emily Davis"
                            position="HR Coordinator"
                            reviewDate="Apr 05, 2025"
                            reviewType="Quarterly"
                            status="scheduled"
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-4 text-lg font-medium">Team Goals</h3>
                        <div className="space-y-4">
                          <GoalCard
                            title="Increase Sales Revenue"
                            description="Achieve 15% growth in quarterly sales"
                            department="Sales"
                            progress={75}
                            dueDate="Mar 31, 2025"
                          />
                          <GoalCard
                            title="Launch New Website"
                            description="Complete redesign and launch of company website"
                            department="Marketing"
                            progress={60}
                            dueDate="Apr 15, 2025"
                          />
                          <GoalCard
                            title="Implement New CRM"
                            description="Roll out new customer relationship management system"
                            department="IT"
                            progress={40}
                            dueDate="May 01, 2025"
                          />
                          <GoalCard
                            title="Reduce Employee Turnover"
                            description="Decrease turnover rate by 5% through improved engagement"
                            department="HR"
                            progress={25}
                            dueDate="Jun 30, 2025"
                          />
                        </div>
                      </div>
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

function EmployeeStatus({ status }: { status: "active" | "onleave" | "remote" | "terminated" }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-opacity-10 text-xs",
        status === "active" && "border-green-500 bg-green-500 text-green-700 dark:text-green-300",
        status === "onleave" && "border-yellow-500 bg-yellow-500 text-yellow-700 dark:text-yellow-300",
        status === "remote" && "border-blue-500 bg-blue-500 text-blue-700 dark:text-blue-300",
        status === "terminated" && "border-red-500 bg-red-500 text-red-700 dark:text-red-300",
      )}
    >
      {status === "active"
        ? "Active"
        : status === "onleave"
          ? "On Leave"
          : status === "remote"
            ? "Remote"
            : "Terminated"}
    </Badge>
  )
}

function AttendanceStatus({ status }: { status: "present" | "absent" | "late" | "vacation" | "remote" }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-opacity-10 text-xs",
        status === "present" && "border-green-500 bg-green-500 text-green-700 dark:text-green-300",
        status === "absent" && "border-red-500 bg-red-500 text-red-700 dark:text-red-300",
        status === "late" && "border-yellow-500 bg-yellow-500 text-yellow-700 dark:text-yellow-300",
        status === "vacation" && "border-purple-500 bg-purple-500 text-purple-700 dark:text-purple-300",
        status === "remote" && "border-blue-500 bg-blue-500 text-blue-700 dark:text-blue-300",
      )}
    >
      {status === "present"
        ? "Present"
        : status === "absent"
          ? "Absent"
          : status === "late"
            ? "Late"
            : status === "vacation"
              ? "Vacation"
              : "Remote"}
    </Badge>
  )
}

function PerformanceReviewCard({
  employee,
  position,
  reviewDate,
  reviewType,
  status,
}: {
  employee: string
  position: string
  reviewDate: string
  reviewType: string
  status: "completed" | "scheduled" | "overdue"
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">{employee}</h4>
          <p className="text-sm text-muted-foreground">{position}</p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "bg-opacity-10 text-xs",
            status === "completed" && "border-green-500 bg-green-500 text-green-700",
            status === "scheduled" && "border-blue-500 bg-blue-500 text-blue-700",
            status === "overdue" && "border-red-500 bg-red-500 text-red-700",
          )}
        >
          {status === "completed" ? "Completed" : status === "scheduled" ? "Scheduled" : "Overdue"}
        </Badge>
      </div>
      <div className="mt-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{reviewDate}</span>
        </div>
        <span className="text-muted-foreground">{reviewType} Review</span>
      </div>
      <div className="mt-4">
        <Button variant="outline" size="sm" className="w-full">
          View Details
        </Button>
      </div>
    </div>
  )
}

function GoalCard({
  title,
  description,
  department,
  progress,
  dueDate,
}: {
  title: string
  description: string
  department: string
  progress: number
  dueDate: string
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{title}</h4>
        <Badge variant="outline">{department}</Badge>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Due: {dueDate}</span>
        </div>
        <Button variant="ghost" size="sm">
          Details
        </Button>
      </div>
    </div>
  )
}

const employeeData = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    department: "Sales",
    position: "Sales Manager",
    status: "active" as const,
    startDate: "Jan 15, 2020",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    department: "Marketing",
    position: "Marketing Specialist",
    status: "active" as const,
    startDate: "Mar 10, 2021",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.b@example.com",
    department: "Engineering",
    position: "Senior Developer",
    status: "remote" as const,
    startDate: "Jun 05, 2019",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@example.com",
    department: "HR",
    position: "HR Coordinator",
    status: "active" as const,
    startDate: "Nov 18, 2022",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 5,
    name: "Robert Wilson",
    email: "robert.w@example.com",
    department: "Finance",
    position: "Financial Analyst",
    status: "onleave" as const,
    startDate: "Aug 22, 2021",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

