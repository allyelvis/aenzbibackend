"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SalesData {
  name: string
  revenue: number
  orders: number
}

export function SalesChart() {
  const [period, setPeriod] = useState("week")
  const [data, setData] = useState<SalesData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch data from an API
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (period === "week") {
        setData([
          { name: "Mon", revenue: 4000, orders: 24 },
          { name: "Tue", revenue: 3000, orders: 18 },
          { name: "Wed", revenue: 2000, orders: 12 },
          { name: "Thu", revenue: 2780, orders: 19 },
          { name: "Fri", revenue: 1890, orders: 14 },
          { name: "Sat", revenue: 2390, orders: 20 },
          { name: "Sun", revenue: 3490, orders: 22 },
        ])
      } else if (period === "month") {
        setData([
          { name: "Week 1", revenue: 12000, orders: 78 },
          { name: "Week 2", revenue: 9800, orders: 65 },
          { name: "Week 3", revenue: 11200, orders: 72 },
          { name: "Week 4", revenue: 14500, orders: 89 },
        ])
      } else {
        setData([
          { name: "Jan", revenue: 42000, orders: 245 },
          { name: "Feb", revenue: 38000, orders: 235 },
          { name: "Mar", revenue: 45000, orders: 267 },
          { name: "Apr", revenue: 41000, orders: 256 },
          { name: "May", revenue: 39000, orders: 243 },
          { name: "Jun", revenue: 48000, orders: 287 },
          { name: "Jul", revenue: 52000, orders: 312 },
          { name: "Aug", revenue: 49000, orders: 294 },
          { name: "Sep", revenue: 51000, orders: 305 },
          { name: "Oct", revenue: 54000, orders: 321 },
          { name: "Nov", revenue: 58000, orders: 345 },
          { name: "Dec", revenue: 63000, orders: 376 },
        ])
      }
      setLoading(false)
    }, 500)
  }, [period])

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>View revenue and order trends over time</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Loading chart data...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue ($)" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

