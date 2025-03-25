"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface InventoryStatusData {
  name: string
  value: number
  color: string
}

export function InventoryStatus() {
  const [data, setData] = useState<InventoryStatusData[]>([])
  const [loading, setLoading] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)

  useEffect(() => {
    // In a real app, this would fetch data from an API
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const statusData = [
        { name: "In Stock", value: 1245, color: "#10b981" },
        { name: "Low Stock", value: 32, color: "#f59e0b" },
        { name: "Out of Stock", value: 15, color: "#ef4444" },
      ]

      setData(statusData)
      setTotalProducts(statusData.reduce((sum, item) => sum + item.value, 0))
      setLoading(false)
    }, 500)
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Inventory Status</CardTitle>
        <CardDescription>Current inventory levels by status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Loading inventory data...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} products`, "Count"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          {data.map((item) => (
            <div key={item.name} className="space-y-1">
              <Badge
                variant="outline"
                className="w-full"
                style={{
                  borderColor: item.color,
                  backgroundColor: `${item.color}10`,
                  color: item.color,
                }}
              >
                {item.name}
              </Badge>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground">
                {((item.value / totalProducts) * 100).toFixed(1)}% of total
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

