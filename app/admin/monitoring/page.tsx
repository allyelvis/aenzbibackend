"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { ChartContainer } from "@/components/charts/chart-container"
import {
  AlertCircle,
  RefreshCw,
  Download,
  Server,
  Cpu,
  HardDrive,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { format, subHours, subDays } from "date-fns"
import { motion } from "framer-motion"

// Generate mock system metrics
const generateMockMetrics = () => {
  // CPU usage over time (last 24 hours)
  const cpuLabels = Array.from({ length: 24 }, (_, i) => format(subHours(new Date(), 23 - i), "HH:mm"))

  const cpuData = {
    labels: cpuLabels,
    datasets: [
      {
        label: "CPU Usage (%)",
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 40) + 20),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
        fill: true,
      },
    ],
  }

  // Memory usage over time (last 24 hours)
  const memoryData = {
    labels: cpuLabels,
    datasets: [
      {
        label: "Memory Usage (%)",
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 30) + 40),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        tension: 0.3,
        fill: true,
      },
    ],
  }

  // API response times (last 24 hours)
  const responseTimeData = {
    labels: cpuLabels,
    datasets: [
      {
        label: "Response Time (ms)",
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 150) + 50),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        tension: 0.3,
      },
    ],
  }

  // Error rates (last 7 days)
  const errorLabels = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), 6 - i), "MMM dd"))

  const errorData = {
    labels: errorLabels,
    datasets: [
      {
        label: "Error Rate (%)",
        data: Array.from({ length: 7 }, () => (Math.random() * 2).toFixed(2)),
        backgroundColor: "rgba(239, 68, 68, 0.8)",
      },
    ],
  }

  return {
    cpu: cpuData,
    memory: memoryData,
    responseTime: responseTimeData,
    errorRate: errorData,
    currentMetrics: {
      cpu: Math.floor(Math.random() * 40) + 20,
      memory: Math.floor(Math.random() * 30) + 40,
      disk: Math.floor(Math.random() * 20) + 30,
      responseTime: Math.floor(Math.random() * 150) + 50,
      errorRate: (Math.random() * 2).toFixed(2),
      uptime: Math.floor(Math.random() * 30) + 90,
      activeUsers: Math.floor(Math.random() * 100) + 50,
      requestsPerMinute: Math.floor(Math.random() * 500) + 100,
    },
  }
}

// Generate mock server logs
const generateMockLogs = (count = 50) => {
  const logLevels = ["info", "warning", "error", "debug"]
  const services = ["api", "auth", "database", "web", "background"]
  const messages = [
    "Application started",
    "User authenticated successfully",
    "Database connection established",
    "Request processed successfully",
    "Cache miss, fetching from database",
    "Rate limit exceeded",
    "Invalid authentication token",
    "Database query timeout",
    "API request failed",
    "Background job completed",
  ]

  return Array.from({ length: count }, (_, i) => {
    const level = logLevels[Math.floor(Math.random() * logLevels.length)]
    const service = services[Math.floor(Math.random() * services.length)]
    const message = messages[Math.floor(Math.random() * messages.length)]
    const date = new Date()
    date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 60 * 24)) // Last 24 hours

    let details = {}

    if (level === "error") {
      details = {
        stack:
          "Error: " +
          message +
          "\n    at processRequest (/app/api/handler.js:42:15)\n    at async /app/api/route.js:17:20",
        code: ["ECONNREFUSED", "ETIMEDOUT", "ENOTFOUND"][Math.floor(Math.random() * 3)],
      }
    } else if (level === "warning") {
      details = {
        duration: Math.floor(Math.random() * 5000) + 1000 + "ms",
        threshold: "1000ms",
      }
    }

    return {
      id: `LOG-${1000 + i}`,
      timestamp: date.toISOString(),
      level,
      service,
      message: level === "error" ? "Error: " + message : level === "warning" ? "Warning: " + message : message,
      details,
    }
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// Generate mock alerts
const generateMockAlerts = (count = 10) => {
  const alertTypes = ["high_cpu", "high_memory", "high_disk", "high_error_rate", "service_down", "slow_response"]
  const statuses = ["active", "resolved", "acknowledged"]
  const services = ["api", "auth", "database", "web", "background"]

  return Array.from({ length: count }, (_, i) => {
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const service = services[Math.floor(Math.random() * services.length)]
    const date = new Date()
    date.setHours(date.getHours() - Math.floor(Math.random() * 72)) // Last 72 hours

    let message = ""
    let threshold = ""
    let value = ""

    switch (type) {
      case "high_cpu":
        message = "High CPU usage detected"
        threshold = "80%"
        value = `${Math.floor(Math.random() * 20) + 80}%`
        break
      case "high_memory":
        message = "High memory usage detected"
        threshold = "85%"
        value = `${Math.floor(Math.random() * 15) + 85}%`
        break
      case "high_disk":
        message = "High disk usage detected"
        threshold = "90%"
        value = `${Math.floor(Math.random() * 10) + 90}%`
        break
      case "high_error_rate":
        message = "High error rate detected"
        threshold = "5%"
        value = `${(Math.random() * 5 + 5).toFixed(2)}%`
        break
      case "service_down":
        message = `${service} service is down`
        threshold = "N/A"
        value = "Offline"
        break
      case "slow_response":
        message = "Slow response times detected"
        threshold = "500ms"
        value = `${Math.floor(Math.random() * 500) + 500}ms`
        break
    }

    let resolvedAt = null
    if (status === "resolved") {
      resolvedAt = new Date(date)
      resolvedAt.setHours(resolvedAt.getHours() + Math.floor(Math.random() * 4) + 1) // Resolved 1-5 hours later
    }

    return {
      id: `ALERT-${1000 + i}`,
      type,
      service,
      message,
      status,
      createdAt: date.toISOString(),
      resolvedAt: resolvedAt ? resolvedAt.toISOString() : null,
      threshold,
      value,
    }
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export default function MonitoringPage() {
  const { user, loading, error } = useAuth()
  const [metrics, setMetrics] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("24h")
  const [logFilter, setLogFilter] = useState("all")
  const [alertFilter, setAlertFilter] = useState("all")

  // Load monitoring data
  useEffect(() => {
    if (user) {
      // In a real app, this would fetch from an API
      const mockMetrics = generateMockMetrics()
      const mockLogs = generateMockLogs()
      const mockAlerts = generateMockAlerts()

      setMetrics(mockMetrics)
      setLogs(mockLogs)
      setAlerts(mockAlerts)
      setIsLoading(false)
    }
  }, [user])

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    if (logFilter === "all") return true
    return log.level === logFilter
  })

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    if (alertFilter === "all") return true
    return alert.status === alertFilter
  })

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    // In a real app, this would fetch fresh data from an API
    setTimeout(() => {
      const mockMetrics = generateMockMetrics()
      const mockLogs = generateMockLogs()
      const mockAlerts = generateMockAlerts()

      setMetrics(mockMetrics)
      setLogs(mockLogs)
      setAlerts(mockAlerts)
      setIsLoading(false)
    }, 1000)
  }

  // Get log level badge
  const getLogLevelBadge = (level: string) => {
    switch (level) {
      case "error":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            Error
          </span>
        )
      case "warning":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            Warning
          </span>
        )
      case "info":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            Info
          </span>
        )
      case "debug":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">
            Debug
          </span>
        )
      default:
        return null
    }
  }

  // Get alert status badge
  const getAlertStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            Active
          </span>
        )
      case "acknowledged":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            Acknowledged
          </span>
        )
      case "resolved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Resolved
          </span>
        )
      default:
        return null
    }
  }

  // Get alert icon
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "high_cpu":
        return <Cpu className="h-5 w-5 text-red-500" />
      case "high_memory":
        return <Server className="h-5 w-5 text-red-500" />
      case "high_disk":
        return <HardDrive className="h-5 w-5 text-red-500" />
      case "high_error_rate":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "service_down":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "slow_response":
        return <Clock className="h-5 w-5 text-red-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-red-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this page. This page is only accessible to administrators.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            System Monitoring
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor system performance, logs, and alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last hour</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
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

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">CPU Usage</p>
                <h3 className="text-3xl font-bold mt-1">{isLoading ? "..." : `${metrics?.currentMetrics.cpu}%`}</h3>
                <div className="mt-2 w-full">
                  <Progress value={isLoading ? 0 : metrics?.currentMetrics.cpu} className="h-1.5" />
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Cpu className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Memory Usage</p>
                <h3 className="text-3xl font-bold mt-1">{isLoading ? "..." : `${metrics?.currentMetrics.memory}%`}</h3>
                <div className="mt-2 w-full">
                  <Progress value={isLoading ? 0 : metrics?.currentMetrics.memory} className="h-1.5" />
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Server className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50 border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Response Time</p>
                <h3 className="text-3xl font-bold mt-1">
                  {isLoading ? "..." : `${metrics?.currentMetrics.responseTime}ms`}
                </h3>
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Avg. over last hour</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50 border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Error Rate</p>
                <h3 className="text-3xl font-bold mt-1">
                  {isLoading ? "..." : `${metrics?.currentMetrics.errorRate}%`}
                </h3>
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">Last 24 hours</p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <ChartContainer
                title="CPU Usage"
                description="CPU usage over time"
                type="line"
                data={metrics?.cpu || { labels: [], datasets: [] }}
                loading={isLoading}
                options={{
                  scales: {
                    y: {
                      min: 0,
                      max: 100,
                      title: {
                        display: true,
                        text: "Usage (%)",
                      },
                    },
                  },
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <ChartContainer
                title="Memory Usage"
                description="Memory usage over time"
                type="line"
                data={metrics?.memory || { labels: [], datasets: [] }}
                loading={isLoading}
                options={{
                  scales: {
                    y: {
                      min: 0,
                      max: 100,
                      title: {
                        display: true,
                        text: "Usage (%)",
                      },
                    },
                  },
                }}
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <ChartContainer
                title="API Response Time"
                description="Average response time in milliseconds"
                type="line"
                data={metrics?.responseTime || { labels: [], datasets: [] }}
                loading={isLoading}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <ChartContainer
                title="Error Rate"
                description="Percentage of requests resulting in errors"
                type="bar"
                data={metrics?.errorRate || { labels: [], datasets: [] }}
                loading={isLoading}
                options={{
                  scales: {
                    y: {
                      min: 0,
                      max: 5,
                      title: {
                        display: true,
                        text: "Error Rate (%)",
                      },
                    },
                  },
                }}
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-amber-500" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">System Uptime</span>
                    <span className="text-sm">{isLoading ? "..." : `${metrics?.currentMetrics.uptime}%`}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Users</span>
                    <span className="text-sm">{isLoading ? "..." : metrics?.currentMetrics.activeUsers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Requests/min</span>
                    <span className="text-sm">{isLoading ? "..." : metrics?.currentMetrics.requestsPerMinute}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Disk Usage</span>
                    <span className="text-sm">{isLoading ? "..." : `${metrics?.currentMetrics.disk}%`}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2 text-blue-500" />
                  Server Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">API Server</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Database</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Auth Service</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Background Jobs</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Online
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex flex-col space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6 animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alerts
                      .filter((alert) => alert.status === "active")
                      .slice(0, 3)
                      .map((alert) => (
                        <div key={alert.id} className="flex items-start space-x-3">
                          <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 mt-0.5">
                            {getAlertIcon(alert.type)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{alert.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {format(new Date(alert.createdAt), "MMM d, yyyy h:mm a")}
                            </p>
                          </div>
                        </div>
                      ))}

                    {alerts.filter((alert) => alert.status === "active").length === 0 && (
                      <div className="flex items-center justify-center py-6 text-center">
                        <div>
                          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <p className="text-sm font-medium">No active alerts</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            All systems operating normally
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>System Logs</CardTitle>
                  <CardDescription>View detailed system logs and events</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={logFilter} onValueChange={setLogFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="error">Errors</SelectItem>
                      <SelectItem value="warning">Warnings</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="debug">Debug</SelectItem>
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
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.slice(0, 20).map((log, index) => (
                        <motion.tr
                          key={log.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`group ${
                            log.level === "error"
                              ? "bg-red-50 dark:bg-red-900/10"
                              : log.level === "warning"
                                ? "bg-yellow-50 dark:bg-yellow-900/10"
                                : ""
                          }`}
                        >
                          <TableCell className="font-mono text-xs">
                            {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
                          </TableCell>
                          <TableCell>{getLogLevelBadge(log.level)}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">
                              {log.service}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-md truncate">
                            <div className="font-medium">{log.message}</div>
                            {log.details && log.details.stack && (
                              <div className="mt-1 text-xs font-mono text-gray-500 dark:text-gray-400 whitespace-pre-wrap hidden group-hover:block">
                                {log.details.stack}
                              </div>
                            )}
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredLogs.slice(0, 20).length} of {filteredLogs.length} logs
              </div>
              <Button variant="outline" size="sm">
                View All Logs
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>System Alerts</CardTitle>
                  <CardDescription>View and manage system alerts</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={alertFilter} onValueChange={setAlertFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Alerts</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="acknowledged">Acknowledged</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
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
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Alert</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Threshold</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAlerts.map((alert, index) => (
                        <motion.tr
                          key={alert.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`group ${
                            alert.status === "active"
                              ? "bg-red-50 dark:bg-red-900/10"
                              : alert.status === "acknowledged"
                                ? "bg-yellow-50 dark:bg-yellow-900/10"
                                : ""
                          }`}
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                                {getAlertIcon(alert.type)}
                              </div>
                              <div>
                                <p className="font-medium">{alert.message}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">
                              {alert.service}
                            </span>
                          </TableCell>
                          <TableCell>{getAlertStatusBadge(alert.status)}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{format(new Date(alert.createdAt), "MMM d, yyyy")}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {format(new Date(alert.createdAt), "h:mm a")}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{alert.threshold}</TableCell>
                          <TableCell>
                            <span
                              className={`font-medium ${
                                alert.status === "active" ? "text-red-600 dark:text-red-400" : ""
                              }`}
                            >
                              {alert.value}
                            </span>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">Showing {filteredAlerts.length} alerts</div>
              <Button variant="outline" size="sm">
                View All Alerts
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

