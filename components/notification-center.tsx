"use client"

import { useState } from "react"
import { Bell, Check, ChevronRight, Shield, User, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, isToday, isYesterday } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

// Notification types
type NotificationType = "security" | "account" | "system"

// Notification interface
interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  date: Date
  read: boolean
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "security",
    title: "Security Alert",
    message: "Enable two-factor authentication to improve your account security.",
    date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
  },
  {
    id: "2",
    type: "system",
    title: "System Maintenance",
    message: "System maintenance scheduled for next weekend. The system may be unavailable for a few hours.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: false,
  },
  {
    id: "3",
    type: "account",
    title: "Profile Updated",
    message: "Your account details were updated successfully.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
  {
    id: "4",
    type: "security",
    title: "New Login",
    message: "New login detected from Chrome on Windows.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: true,
  },
  {
    id: "5",
    type: "system",
    title: "New Feature Available",
    message: "Check out the new reporting dashboard with enhanced analytics.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    read: true,
  },
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [isOpen, setIsOpen] = useState(false)

  // Get unread count
  const unreadCount = notifications.filter((n) => !n.read).length

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    return notification.type === activeTab
  })

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  // Clear notification
  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  // Format notification date
  const formatNotificationDate = (date: Date) => {
    if (isToday(date)) {
      return `Today at ${format(date, "h:mm a")}`
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, "h:mm a")}`
    } else {
      return format(date, "MMM d, yyyy")
    }
  }

  // Get notification icon
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "security":
        return <Shield className="h-5 w-5 text-red-500" />
      case "account":
        return <User className="h-5 w-5 text-green-500" />
      case "system":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
              <Check className="h-3.5 w-3.5 mr-1" />
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 p-1 m-2 bg-gray-100 dark:bg-gray-800 rounded-md">
            <TabsTrigger value="all" className="text-xs">
              All
              {unreadCount > 0 && <Badge className="ml-1 bg-primary text-[10px] h-4 min-w-4 px-1">{unreadCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs">
              Security
            </TabsTrigger>
            <TabsTrigger value="system" className="text-xs">
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <ScrollArea className="h-[300px]">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
                  <Bell className="h-8 w-8 mb-2 text-gray-300 dark:text-gray-600" />
                  <p>No notifications</p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`p-4 border-b border-gray-100 dark:border-gray-800 ${
                        !notification.read ? "bg-blue-50 dark:bg-blue-900/10" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex">
                        <div className="mr-3 mt-0.5">
                          <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                        <div className="flex-1 pr-6">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {notification.title}
                              {!notification.read && (
                                <span className="inline-block h-2 w-2 rounded-full bg-blue-500 ml-2"></span>
                              )}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                clearNotification(notification.id)
                              }}
                              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatNotificationDate(notification.date)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <Button variant="outline" size="sm" className="w-full justify-center" onClick={() => setIsOpen(false)}>
            View all notifications
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

