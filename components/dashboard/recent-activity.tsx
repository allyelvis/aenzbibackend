"use client"

import { useEffect, useState } from "react"
import { ShoppingCart, Package, CreditCard, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ActivityItem {
  id: string
  type: "order" | "inventory" | "payment" | "alert" | "task"
  title: string
  description: string
  time: string
  status?: string
  icon: "order" | "inventory" | "payment" | "alert" | "task"
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch data from an API
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setActivities([
        {
          id: "act1",
          type: "order",
          title: "New Order Received",
          description: "Order #ORD-1005 from Robert Wilson",
          time: "10 minutes ago",
          status: "pending",
          icon: "order",
        },
        {
          id: "act2",
          type: "inventory",
          title: "Low Stock Alert",
          description: "Wireless Earbuds (SKU: WE-002) is running low",
          time: "25 minutes ago",
          status: "warning",
          icon: "inventory",
        },
        {
          id: "act3",
          type: "payment",
          title: "Payment Received",
          description: "$1,605.77 for Invoice #INV-1001",
          time: "1 hour ago",
          status: "success",
          icon: "payment",
        },
        {
          id: "act4",
          type: "task",
          title: "Task Completed",
          description: "Design homepage mockups",
          time: "2 hours ago",
          status: "completed",
          icon: "task",
        },
        {
          id: "act5",
          type: "alert",
          title: "System Update",
          description: "New features available in the system",
          time: "3 hours ago",
          icon: "alert",
        },
      ])
      setLoading(false)
    }, 500)
  }, [])

  const getIcon = (icon: ActivityItem["icon"]) => {
    switch (icon) {
      case "order":
        return <ShoppingCart className="h-5 w-5" />
      case "inventory":
        return <Package className="h-5 w-5" />
      case "payment":
        return <CreditCard className="h-5 w-5" />
      case "alert":
        return <AlertCircle className="h-5 w-5" />
      case "task":
        return <CheckCircle2 className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return null

    const variant = "outline"
    let className = ""

    switch (status) {
      case "pending":
        className = "border-blue-500 bg-blue-500 bg-opacity-10 text-blue-700"
        break
      case "warning":
        className = "border-yellow-500 bg-yellow-500 bg-opacity-10 text-yellow-700"
        break
      case "success":
        className = "border-green-500 bg-green-500 bg-opacity-10 text-green-700"
        break
      case "completed":
        className = "border-green-500 bg-green-500 bg-opacity-10 text-green-700"
        break
      default:
        className = "border-gray-500 bg-gray-500 bg-opacity-10 text-gray-700"
    }

    return (
      <Badge variant={variant} className={className}>
        {status}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from across the system</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground">Loading activity data...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2 text-primary">{getIcon(activity.icon)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{activity.title}</p>
                    {getStatusBadge(activity.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2">
              View All Activity
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

