"use client"

import { useState, useEffect } from "react"
import { ChartContainer } from "@/components/charts/chart-container"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, LineChart, Activity, TrendingUp, Users, Calendar, Download, RefreshCw } from "lucide-react"
import { format, subDays, subMonths } from "date-fns"
import { motion } from "framer-motion"

// Mock data for charts
const generateMockData = () => {
  // User activity data (last 7 days)
  const userActivityLabels = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), 6 - i), "MMM dd"))

  const userActivityData = {
    labels: userActivityLabels,
    datasets: [
      {
        label: "Active Users",
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100) + 50),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
      },
      {
        label: "New Users",
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 30) + 10),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        tension: 0.3,
      },
    ],
  }

  // Revenue data (last 6 months)
  const revenueLabels = Array.from({ length: 6 }, (_, i) => format(subMonths(new Date(), 5 - i), "MMM yyyy"))

  const revenueData = {
    labels: revenueLabels,
    datasets: [
      {
        label: "Revenue",
        data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 10000) + 5000),
        backgroundColor: "rgba(99, 102, 241, 0.8)",
      },
    ],
  }

  // User distribution by role
  const userRoleData = {
    labels: ["Admin", "Manager", "User"],
    datasets: [
      {
        data: [5, 15, 80],
        backgroundColor: ["rgba(239, 68, 68, 0.8)", "rgba(59, 130, 246, 0.8)", "rgba(16, 185, 129, 0.8)"],
        borderColor: ["rgba(239, 68, 68, 1)", "rgba(59, 130, 246, 1)", "rgba(16, 185, 129, 1)"],
        borderWidth: 1,
      },
    ],
  }

  // System performance data
  const performanceData = {
    labels: ["Response Time", "Uptime", "Error Rate", "CPU Usage", "Memory Usage"],
    datasets: [
      {
        label: "Current",
        data: [85, 98, 15, 65, 70],
        backgroundColor: "rgba(99, 102, 241, 0.5)",
        borderColor: "rgba(99, 102, 241, 1)",
        pointBackgroundColor: "rgba(99, 102, 241, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(99, 102, 241, 1)",
      },
      {
        label: "Target",
        data: [90, 99, 10, 60, 65],
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgba(16, 185, 129, 1)",
        pointBackgroundColor: "rgba(16, 185, 129, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(16, 185, 129, 1)",
      },
    ],
  }

  return {
    userActivity: userActivityData,
    revenue: revenueData,
    userRole: userRoleData,
    performance: performanceData,
  }
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7d")
  const [chartData, setChartData] = useState(generateMockData())

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Refresh data
  const refreshData = () => {
    setLoading(true)
    setTimeout(() => {
      setChartData(generateMockData())
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Analytics Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Visualize and analyze your business data</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={refreshData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                <h3 className="text-3xl font-bold mt-1">1,284</h3>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% from last month
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Sessions</p>
                <h3 className="text-3xl font-bold mt-1">243</h3>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5.3% from yesterday
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50 border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Response Time</p>
                <h3 className="text-3xl font-bold mt-1">125ms</h3>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  -15ms from last week
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <LineChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50 border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Uptime</p>
                <h3 className="text-3xl font-bold mt-1">99.9%</h3>
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Last 30 days
                </p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <ChartContainer
                title="User Activity"
                description="Daily active and new users"
                type="line"
                data={chartData.userActivity}
                loading={loading}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <ChartContainer
                title="Revenue"
                description="Monthly revenue in USD"
                type="bar"
                data={chartData.revenue}
                loading={loading}
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
                title="User Distribution by Role"
                description="Percentage of users by role"
                type="doughnut"
                data={chartData.userRole}
                loading={loading}
                options={{
                  plugins: {
                    legend: {
                      position: "right",
                    },
                  },
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <ChartContainer
                title="System Performance"
                description="Current vs target metrics"
                type="radar"
                data={chartData.performance}
                loading={loading}
              />
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartContainer
              title="User Growth"
              description="New user registrations over time"
              type="line"
              data={{
                labels: Array.from({ length: 12 }, (_, i) => format(subMonths(new Date(), 11 - i), "MMM yyyy")),
                datasets: [
                  {
                    label: "New Users",
                    data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 50) + 10),
                    borderColor: "rgb(16, 185, 129)",
                    backgroundColor: "rgba(16, 185, 129, 0.5)",
                    tension: 0.3,
                  },
                ],
              }}
              loading={loading}
            />

            <ChartContainer
              title="User Retention"
              description="Monthly user retention rate"
              type="bar"
              data={{
                labels: Array.from({ length: 6 }, (_, i) => format(subMonths(new Date(), 5 - i), "MMM yyyy")),
                datasets: [
                  {
                    label: "Retention Rate (%)",
                    data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 30) + 60),
                    backgroundColor: "rgba(99, 102, 241, 0.8)",
                  },
                ],
              }}
              loading={loading}
            />
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartContainer
              title="API Response Time"
              description="Average response time in milliseconds"
              type="line"
              data={{
                labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
                datasets: [
                  {
                    label: "Response Time (ms)",
                    data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100) + 50),
                    borderColor: "rgb(239, 68, 68)",
                    backgroundColor: "rgba(239, 68, 68, 0.5)",
                    tension: 0.3,
                  },
                ],
              }}
              loading={loading}
            />

            <ChartContainer
              title="Error Rate"
              description="Percentage of requests resulting in errors"
              type="bar"
              data={{
                labels: Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), 6 - i), "MMM dd")),
                datasets: [
                  {
                    label: "Error Rate (%)",
                    data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 2) + 0.5),
                    backgroundColor: "rgba(239, 68, 68, 0.8)",
                  },
                ],
              }}
              loading={loading}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

