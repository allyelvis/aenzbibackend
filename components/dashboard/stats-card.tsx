import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  description?: React.ReactNode
  icon?: React.ReactNode
  trend?: {
    value: string | number
    positive: boolean
  }
  loading?: boolean
  className?: string
}

export function StatsCard({ title, value, description, icon, trend, loading = false, className }: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="h-7 w-3/4 animate-pulse rounded-md bg-muted"></div>
            {trend && <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted"></div>}
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">
              {typeof value === "number" && !isNaN(value) ? value.toLocaleString() : value}
            </div>
            {trend && (
              <p className={cn("text-xs", trend.positive ? "text-green-500" : "text-red-500")}>
                {trend.positive ? "+" : ""}
                {trend.value} from previous period
              </p>
            )}
            {description && <p className="mt-2 text-xs text-muted-foreground">{description}</p>}
          </>
        )}
      </CardContent>
    </Card>
  )
}

