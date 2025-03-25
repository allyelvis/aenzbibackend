"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { cn } from "@/lib/utils"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"

type ChartType = "line" | "bar" | "pie"
type TimeRange = "day" | "week" | "month" | "quarter" | "year"

interface DataPoint {
  name: string
  [key: string]: any
}

interface DataSeries {
  name: string
  key: string
  color: string
}

interface DataChartProps {
  title: string
  description?: string
  data: DataPoint[]
  series: DataSeries[]
  type?: ChartType
  timeRanges?: TimeRange[]
  defaultTimeRange?: TimeRange
  loading?: boolean
  height?: number
  className?: string
  showLegend?: boolean
  allowTypeChange?: boolean
}

export function DataChart({
  title,
  description,
  data,
  series,
  type = "line",
  timeRanges = ["week", "month", "quarter", "year"],
  defaultTimeRange = "month",
  loading = false,
  height = 300,
  className,
  showLegend = true,
  allowTypeChange = true,
}: DataChartProps) {
  const [chartType, setChartType] = useState<ChartType>(type)
  const [timeRange, setTimeRange] = useState<TimeRange>(defaultTimeRange)
  const [chartData, setChartData] = useState<DataPoint[]>(data)

  // Simulate data fetching based on time range
  useEffect(() => {
    // In a real app, this would fetch data from an API based on the time range
    // For demo purposes, we'll just use the provided data
    setChartData(data)
  }, [timeRange, data])

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex h-full items-center justify-center">
          <LoadingSpinner />
        </div>
      )
    }

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {showLegend && <Legend />}
            {series.map((s) => (
              <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} activeDot={{ r: 8 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {showLegend && <Legend />}
            {series.map((s) => (
              <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "pie") {
      // For pie charts, we need to transform the data
      // We'll use the first data point and create a pie slice for each series
      const pieData = series.map((s) => ({
        name: s.name,
        value: chartData.reduce((sum, d) => sum + (d[s.key] || 0), 0),
        color: s.color,
      }))

      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            {showLegend && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      )
    }

    return null
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <div className="flex items-center gap-2">
          {allowTypeChange && (
            <Tabs
              value={chartType}
              onValueChange={(value) => setChartType(value as ChartType)}
              className="hidden sm:block"
            >
              <TabsList className="h-8">
                <TabsTrigger value="line" className="h-8 px-3">
                  Line
                </TabsTrigger>
                <TabsTrigger value="bar" className="h-8 px-3">
                  Bar
                </TabsTrigger>
                <TabsTrigger value="pie" className="h-8 px-3">
                  Pie
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }}>{renderChart()}</div>
      </CardContent>
    </Card>
  )
}

