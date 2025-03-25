import { Bell, Check, Clock, MailOpen, RefreshCw, Search, Trash } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function NotificationsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 md:px-8">
        <div className="flex items-center gap-2 font-semibold">
          <Bell className="h-6 w-6 text-primary" />
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
            <Link href="/notifications" className="font-medium text-primary">
              Notifications
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
              <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
              <p className="text-muted-foreground">Stay updated with system alerts and messages</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Check className="mr-2 h-4 w-4" />
                Mark All as Read
              </Button>
              <Button variant="outline">
                <Trash className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">
                  Unread
                  <Badge className="ml-2 bg-primary text-primary-foreground" variant="default">
                    12
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle>All Notifications</CardTitle>
                        <CardDescription>View all your notifications in one place</CardDescription>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search notifications..."
                            className="w-full pl-8 md:w-[200px] lg:w-[300px]"
                          />
                        </div>
                        <Select defaultValue="all">
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                            <SelectItem value="messages">Messages</SelectItem>
                            <SelectItem value="alerts">Alerts</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon">
                          <RefreshCw className="h-4 w-4" />
                          <span className="sr-only">Refresh</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notificationData.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          type={notification.type}
                          title={notification.title}
                          description={notification.description}
                          time={notification.time}
                          isRead={notification.isRead}
                          sender={notification.sender}
                        />
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-center">
                      <Button variant="outline">Load More</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="unread" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Unread Notifications</CardTitle>
                    <CardDescription>Notifications you haven't read yet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notificationData
                        .filter((n) => !n.isRead)
                        .map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            type={notification.type}
                            title={notification.title}
                            description={notification.description}
                            time={notification.time}
                            isRead={notification.isRead}
                            sender={notification.sender}
                          />
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="system" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>System Notifications</CardTitle>
                    <CardDescription>Important alerts and updates from the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notificationData
                        .filter((n) => n.type === "system")
                        .map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            type={notification.type}
                            title={notification.title}
                            description={notification.description}
                            time={notification.time}
                            isRead={notification.isRead}
                            sender={notification.sender}
                          />
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="messages" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Messages</CardTitle>
                    <CardDescription>Messages from team members and customers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notificationData
                        .filter((n) => n.type === "message")
                        .map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            type={notification.type}
                            title={notification.title}
                            description={notification.description}
                            time={notification.time}
                            isRead={notification.isRead}
                            sender={notification.sender}
                          />
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <NotificationSetting
                    title="Email Notifications"
                    description="Receive notifications via email"
                    defaultChecked={true}
                  />
                  <NotificationSetting
                    title="Push Notifications"
                    description="Receive notifications in your browser"
                    defaultChecked={true}
                  />
                  <NotificationSetting
                    title="SMS Notifications"
                    description="Receive important alerts via SMS"
                    defaultChecked={false}
                  />
                  <NotificationSetting
                    title="System Alerts"
                    description="Notifications about system updates and maintenance"
                    defaultChecked={true}
                  />
                  <NotificationSetting
                    title="Order Updates"
                    description="Get notified about order status changes"
                    defaultChecked={true}
                  />
                  <NotificationSetting
                    title="Inventory Alerts"
                    description="Notifications for low stock and inventory changes"
                    defaultChecked={true}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

function NotificationItem({
  type,
  title,
  description,
  time,
  isRead,
  sender,
}: {
  type: "system" | "message" | "alert"
  title: string
  description: string
  time: string
  isRead: boolean
  sender?: {
    name: string
    avatar?: string
  }
}) {
  return (
    <div className={`rounded-lg border p-4 ${isRead ? "" : "bg-muted/20"}`}>
      <div className="flex items-start gap-4">
        <div className="rounded-full p-2 bg-primary/10">
          {type === "system" ? (
            <Bell className="h-4 w-4 text-primary" />
          ) : type === "message" ? (
            <MailOpen className="h-4 w-4 text-primary" />
          ) : (
            <Clock className="h-4 w-4 text-primary" />
          )}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{title}</h4>
            <span className="text-xs text-muted-foreground">{time}</span>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
          {sender && (
            <div className="mt-2 flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={sender.avatar} alt={sender.name} />
                <AvatarFallback>
                  {sender.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">{sender.name}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Check className="h-4 w-4" />
            <span className="sr-only">Mark as read</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Trash className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

function NotificationSetting({
  title,
  description,
  defaultChecked,
}: {
  title: string
  description: string
  defaultChecked: boolean
}) {
  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="space-y-0.5">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  )
}

import { Switch } from "@/components/ui/switch"

const notificationData = [
  {
    id: 1,
    type: "system" as const,
    title: "System Maintenance",
    description: "Scheduled maintenance will occur on March 25, 2025 from 2:00 AM to 4:00 AM UTC.",
    time: "10 minutes ago",
    isRead: false,
  },
  {
    id: 2,
    type: "message" as const,
    title: "New Message",
    description: "You have received a new message regarding the website redesign project.",
    time: "25 minutes ago",
    isRead: false,
    sender: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: 3,
    type: "alert" as const,
    title: "Low Inventory Alert",
    description: "Wireless Earbuds (SKU: P002) has reached the low stock threshold.",
    time: "1 hour ago",
    isRead: false,
  },
  {
    id: 4,
    type: "system" as const,
    title: "Update Available",
    description: "A new version of the AENZBi Cloud platform is available. Click to update.",
    time: "3 hours ago",
    isRead: true,
  },
  {
    id: 5,
    type: "message" as const,
    title: "New Comment",
    description: "Michael Brown commented on the CRM implementation project.",
    time: "5 hours ago",
    isRead: true,
    sender: {
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: 6,
    type: "alert" as const,
    title: "Payment Received",
    description: "Payment of $1,245.00 received from John Smith for invoice INV-1001.",
    time: "Yesterday",
    isRead: true,
  },
  {
    id: 7,
    type: "system" as const,
    title: "Account Security",
    description: "Your password will expire in 7 days. Please update your password.",
    time: "Yesterday",
    isRead: true,
  },
]

