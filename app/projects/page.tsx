import { Calendar, Download, Plus, Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 md:px-8">
        <div className="flex items-center gap-2 font-semibold">
          <Calendar className="h-6 w-6 text-primary" />
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
            <Link href="/projects" className="font-medium text-primary">
              Projects
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
              <h1 className="text-2xl font-bold tracking-tight">Project Management</h1>
              <p className="text-muted-foreground">Manage your projects, tasks, and team collaboration</p>
            </div>
            <div className="flex items-center gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <Tabs defaultValue="projects">
              <TabsList>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
              </TabsList>
              <TabsContent value="projects" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>All Projects</CardTitle>
                        <CardDescription>View and manage your active projects</CardDescription>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search projects..."
                            className="w-full pl-8 md:w-[200px] lg:w-[300px]"
                          />
                        </div>
                        <Select defaultValue="all">
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="onhold">On Hold</SelectItem>
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
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {projectData.map((project) => (
                        <ProjectCard
                          key={project.id}
                          title={project.title}
                          description={project.description}
                          status={project.status}
                          progress={project.progress}
                          dueDate={project.dueDate}
                          team={project.team}
                        />
                      ))}
                      <div className="flex h-[220px] items-center justify-center rounded-lg border border-dashed">
                        <Button variant="outline">
                          <Plus className="mr-2 h-4 w-4" />
                          Add New Project
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tasks" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>Task Management</CardTitle>
                        <CardDescription>Track and manage tasks across all projects</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Task
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Task</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead className="hidden md:table-cell">Assignee</TableHead>
                            <TableHead className="hidden md:table-cell">Due Date</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {taskData.map((task) => (
                            <TableRow key={task.id}>
                              <TableCell className="font-medium">{task.title}</TableCell>
                              <TableCell>{task.project}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={task.assigneeAvatar} alt={task.assignee} />
                                    <AvatarFallback>
                                      {task.assignee
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{task.assignee}</span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">{task.dueDate}</TableCell>
                              <TableCell>
                                <TaskPriority priority={task.priority} />
                              </TableCell>
                              <TableCell>
                                <TaskStatus status={task.status} />
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
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="calendar" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Calendar</CardTitle>
                    <CardDescription>View project timelines and deadlines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[500px] rounded-md border bg-muted/20 p-4 flex items-center justify-center">
                      <p className="text-muted-foreground">Calendar view will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="gantt" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Gantt Chart</CardTitle>
                    <CardDescription>Visualize project timelines and dependencies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[500px] rounded-md border bg-muted/20 p-4 flex items-center justify-center">
                      <p className="text-muted-foreground">Gantt chart will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Analytics</CardTitle>
                <CardDescription>Track project performance and team productivity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">Active Projects</div>
                    <div className="mt-1 text-2xl font-bold">12</div>
                    <div className="mt-4 h-[80px] w-full rounded-md bg-muted/20"></div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">Completion Rate</div>
                    <div className="mt-1 text-2xl font-bold">78%</div>
                    <div className="mt-4 h-[80px] w-full rounded-md bg-muted/20"></div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">Overdue Tasks</div>
                    <div className="mt-1 text-2xl font-bold">5</div>
                    <div className="mt-4 h-[80px] w-full rounded-md bg-muted/20"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

function ProjectCard({
  title,
  description,
  status,
  progress,
  dueDate,
  team,
}: {
  title: string
  description: string
  status: "active" | "completed" | "onhold"
  progress: number
  dueDate: string
  team: { name: string; avatar?: string }[]
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <ProjectStatus status={status} />
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Due: {dueDate}</span>
            </div>
            <div className="flex -space-x-2">
              {team.map((member, i) => (
                <Avatar key={i} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full">
          View Project
        </Button>
      </CardFooter>
    </Card>
  )
}

function ProjectStatus({ status }: { status: "active" | "completed" | "onhold" }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-opacity-10 text-xs",
        status === "active" && "border-green-500 bg-green-500 text-green-700 dark:text-green-300",
        status === "completed" && "border-blue-500 bg-blue-500 text-blue-700 dark:text-blue-300",
        status === "onhold" && "border-yellow-500 bg-yellow-500 text-yellow-700 dark:text-yellow-300",
      )}
    >
      {status === "active" ? "Active" : status === "completed" ? "Completed" : "On Hold"}
    </Badge>
  )
}

function TaskStatus({ status }: { status: "todo" | "inprogress" | "review" | "completed" }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-opacity-10 text-xs",
        status === "todo" && "border-gray-500 bg-gray-500 text-gray-700 dark:text-gray-300",
        status === "inprogress" && "border-blue-500 bg-blue-500 text-blue-700 dark:text-blue-300",
        status === "review" && "border-yellow-500 bg-yellow-500 text-yellow-700 dark:text-yellow-300",
        status === "completed" && "border-green-500 bg-green-500 text-green-700 dark:text-green-300",
      )}
    >
      {status === "todo"
        ? "To Do"
        : status === "inprogress"
          ? "In Progress"
          : status === "review"
            ? "In Review"
            : "Completed"}
    </Badge>
  )
}

function TaskPriority({ priority }: { priority: "low" | "medium" | "high" }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-opacity-10 text-xs",
        priority === "low" && "border-green-500 bg-green-500 text-green-700 dark:text-green-300",
        priority === "medium" && "border-yellow-500 bg-yellow-500 text-yellow-700 dark:text-yellow-300",
        priority === "high" && "border-red-500 bg-red-500 text-red-700 dark:text-red-300",
      )}
    >
      {priority === "low" ? "Low" : priority === "medium" ? "Medium" : "High"}
    </Badge>
  )
}

const projectData = [
  {
    id: 1,
    title: "Website Redesign",
    description: "Complete overhaul of company website with new branding and improved UX",
    status: "active" as const,
    progress: 65,
    dueDate: "Apr 15, 2025",
    team: [
      { name: "John Smith", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Michael Brown", avatar: "/placeholder.svg?height=32&width=32" },
    ],
  },
  {
    id: 2,
    title: "Mobile App Development",
    description: "Create a new mobile app for iOS and Android platforms",
    status: "active" as const,
    progress: 40,
    dueDate: "May 30, 2025",
    team: [
      { name: "Emily Davis", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Robert Wilson", avatar: "/placeholder.svg?height=32&width=32" },
    ],
  },
  {
    id: 3,
    title: "CRM Implementation",
    description: "Deploy and configure new customer relationship management system",
    status: "onhold" as const,
    progress: 25,
    dueDate: "Jun 15, 2025",
    team: [
      { name: "Jennifer Lee", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "David Miller", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Lisa Chen", avatar: "/placeholder.svg?height=32&width=32" },
    ],
  },
  {
    id: 4,
    title: "Marketing Campaign",
    description: "Q2 marketing campaign for new product launch",
    status: "active" as const,
    progress: 80,
    dueDate: "Apr 01, 2025",
    team: [
      { name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "James Taylor", avatar: "/placeholder.svg?height=32&width=32" },
    ],
  },
  {
    id: 5,
    title: "Office Relocation",
    description: "Plan and execute office move to new location",
    status: "completed" as const,
    progress: 100,
    dueDate: "Mar 15, 2025",
    team: [
      { name: "Emily Davis", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Robert Wilson", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "John Smith", avatar: "/placeholder.svg?height=32&width=32" },
    ],
  },
]

const taskData = [
  {
    id: 1,
    title: "Design homepage mockups",
    project: "Website Redesign",
    assignee: "Sarah Johnson",
    assigneeAvatar: "/placeholder.svg?height=32&width=32",
    dueDate: "Mar 25, 2025",
    priority: "high" as const,
    status: "inprogress" as const,
  },
  {
    id: 2,
    title: "Develop user authentication",
    project: "Mobile App Development",
    assignee: "Michael Brown",
    assigneeAvatar: "/placeholder.svg?height=32&width=32",
    dueDate: "Apr 05, 2025",
    priority: "medium" as const,
    status: "todo" as const,
  },
  {
    id: 3,
    title: "Create content strategy",
    project: "Marketing Campaign",
    assignee: "James Taylor",
    assigneeAvatar: "/placeholder.svg?height=32&width=32",
    dueDate: "Mar 22, 2025",
    priority: "medium" as const,
    status: "review" as const,
  },
  {
    id: 4,
    title: "Configure CRM integrations",
    project: "CRM Implementation",
    assignee: "Jennifer Lee",
    assigneeAvatar: "/placeholder.svg?height=32&width=32",
    dueDate: "Apr 10, 2025",
    priority: "low" as const,
    status: "todo" as const,
  },
  {
    id: 5,
    title: "Finalize inventory list",
    project: "Office Relocation",
    assignee: "Emily Davis",
    assigneeAvatar: "/placeholder.svg?height=32&width=32",
    dueDate: "Mar 10, 2025",
    priority: "high" as const,
    status: "completed" as const,
  },
]

import { cn } from "@/lib/utils"

