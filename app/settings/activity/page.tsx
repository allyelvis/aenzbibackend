"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  AlertCircle,
  Clock,
  Download,
  RefreshCw,
  Search,
  User,
  Shield,
  Key,
  LogOut,
  FileText,
  Smartphone,
  Lock,
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"

// Activity types and their icons
const activityIcons: Record<string, any> = {
  login: Clock,
  logout: LogOut,
  failed_login: AlertCircle,
  password_reset: Lock,
  profile_update: User,
  pin_setup: Key,
  pin_update: Key,
  account_locked: Shield,
  account_unlocked: Shield,
  two_factor_setup: Smartphone,
  two_factor_disabled: Smartphone,
}

// Mock activity data
const generateMockActivityData = (count = 50) => {
  const activities = [
    "login",
    "logout",
    "failed_login",
    "password_reset",
    "profile_update",
    "pin_setup",
    "pin_update",
    "account_locked",
    "account_unlocked",
    "two_factor_setup",
    "two_factor_disabled",
  ]

  const methods = ["password", "pin", "otp"]

  return Array.from({ length: count }, (_, i) => {
    const activity = activities[Math.floor(Math.random() * activities.length)]
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))

    return {
      id: `ACT-${1000 + i}`,
      action: activity,
      created_at: date.toISOString(),
      ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      user_agent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      details:
        activity === "login" || activity === "failed_login"
          ? { method: methods[Math.floor(Math.random() * methods.length)] }
          : {},
    }
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export default function ActivityPage() {
  const { user, loading, error } = useAuth()
  const [activities, setActivities] = useState<any[]>([])
  const [filteredActivities, setFilteredActivities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const itemsPerPage = 10

  // Load activity data
  useEffect(() => {
    if (user) {
      // In a real app, this would fetch from an API
      const mockData = generateMockActivityData()
      setActivities(mockData)
      setIsLoading(false)
    }
  }, [user])

  // Apply filters
  useEffect(() => {
    let filtered = [...activities]

    // Apply action type filter
    if (filter !== "all") {
      filtered = filtered.filter((activity) => activity.action === filter)
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (activity) =>
          activity.action.toLowerCase().includes(term) ||
          activity.ip_address.toLowerCase().includes(term) ||
          (activity.details?.method && activity.details.method.toLowerCase().includes(term)),
      )
    }

    setFilteredActivities(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [activities, filter, searchTerm])

  // Get activity description
  const getActivityDescription = (activity: any) => {
    switch (activity.action) {
      case "login":
        return `Successful login via ${activity.details?.method || "unknown method"}`
      case "logout":
        return "Logged out of the system"
      case "failed_login":
        return `Failed login attempt via ${activity.details?.method || "unknown method"}`
      case "password_reset":
        return "Password was reset"
      case "profile_update":
        return "Profile information was updated"
      case "pin_setup":
        return "PIN authentication was set up"
      case "pin_update":
        return "PIN was updated"
      case "account_locked":
        return "Account was locked due to too many failed attempts"
      case "account_unlocked":
        return "Account was unlocked"
      case "two_factor_setup":
        return "Two-factor authentication was enabled"
      case "two_factor_disabled":
        return "Two-factor authentication was disabled"
      default:
        return "Unknown activity"
    }
  }

  // Get activity icon
  const getActivityIcon = (activity: any) => {
    const Icon = activityIcons[activity.action] || Clock

    let iconColor = "text-gray-500 dark:text-gray-400"

    switch (activity.action) {
      case "login":
      case "account_unlocked":
      case "pin_setup":
      case "two_factor_setup":
        iconColor = "text-green-500 dark:text-green-400"
        break
      case "failed_login":
      case "account_locked":
        iconColor = "text-red-500 dark:text-red-400"
        break
      case "password_reset":
      case "pin_update":
        iconColor = "text-amber-500 dark:text-amber-400"
        break
      case "profile_update":
        iconColor = "text-blue-500 dark:text-blue-400"
        break
    }

    return <Icon className={`h-5 w-5 ${iconColor}`} />
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage)
  const paginatedActivities = filteredActivities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    // In a real app, this would fetch fresh data from an API
    setTimeout(() => {
      const mockData = generateMockActivityData()
      setActivities(mockData)
      setIsLoading(false)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>You need to be logged in to view this page.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          Activity Log
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View your recent account activity and security events</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>Your recent account activities and security events</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 w-full md:w-[200px] rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px] h-10">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="login">Logins</SelectItem>
                  <SelectItem value="logout">Logouts</SelectItem>
                  <SelectItem value="failed_login">Failed Logins</SelectItem>
                  <SelectItem value="password_reset">Password Resets</SelectItem>
                  <SelectItem value="profile_update">Profile Updates</SelectItem>
                  <SelectItem value="pin_setup">PIN Setup</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : paginatedActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No Activities Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                {searchTerm || filter !== "all"
                  ? "No activities match your current filters. Try adjusting your search or filter criteria."
                  : "You have no recent activities. Activities will appear here as you use the system."}
              </p>
              {(searchTerm || filter !== "all") && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("")
                    setFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedActivities.map((activity, index) => (
                      <motion.tr
                        key={activity.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="group"
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                              {getActivityIcon(activity)}
                            </div>
                            <div>
                              <p className="font-medium capitalize">{activity.action.replace(/_/g, " ")}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {getActivityDescription(activity)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{format(new Date(activity.created_at), "MMM d, yyyy")}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {format(new Date(activity.created_at), "h:mm a")}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {activity.ip_address}
                          </code>
                        </TableCell>
                        <TableCell>
                          {activity.details?.method && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                              {activity.details.method}
                            </span>
                          )}
                          {activity.details?.reason && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 ml-2">
                              {activity.details.reason}
                            </span>
                          )}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1),
                      )
                      .map((page, i, array) => {
                        // Add ellipsis
                        if (i > 0 && array[i - 1] !== page - 1) {
                          return (
                            <PaginationItem key={`ellipsis-${page}`}>
                              <span className="px-4 py-2">...</span>
                            </PaginationItem>
                          )
                        }

                        return (
                          <PaginationItem key={page}>
                            <PaginationLink onClick={() => setCurrentPage(page)} isActive={page === currentPage}>
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

