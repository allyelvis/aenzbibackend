import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface ActivityItem {
  id: string
  title: string
  description: string
  timestamp: string
  icon?: React.ReactNode
  status?: "success" | "warning" | "error" | "info"
}

interface ActivityTimelineProps {
  items: ActivityItem[]
  title?: string
  description?: string
  loading?: boolean
  maxItems?: number
  className?: string
}

export function ActivityTimeline({
  items,
  title = "Recent Activity",
  description = "Latest updates and actions",
  loading = false,
  maxItems = 5,
  className,
}: ActivityTimelineProps) {
  const displayItems = maxItems ? items.slice(0, maxItems) : items

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted"></div>
                  <div className="h-3 w-1/2 animate-pulse rounded-md bg-muted"></div>
                </div>
              </div>
            ))}
          </div>
        ) : displayItems.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-center text-sm text-muted-foreground">
            <p>No activity to display.</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-3.5 top-0 bottom-0 w-px bg-muted"></div>

              <div className="space-y-6">
                {displayItems.map((item) => (
                  <div key={item.id} className="relative flex gap-4">
                    {/* Timeline dot */}
                    <div
                      className={cn(
                        "relative z-10 mt-1 h-2 w-2 rounded-full border-2 border-background",
                        item.status === "success"
                          ? "bg-green-500"
                          : item.status === "warning"
                            ? "bg-yellow-500"
                            : item.status === "error"
                              ? "bg-red-500"
                              : "bg-primary",
                      )}
                    ></div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="whitespace-nowrap text-xs text-muted-foreground">{item.timestamp}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.description}</p>

                      {item.status && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "mt-1 text-xs",
                            item.status === "success" && "border-green-500 bg-green-500/10 text-green-700",
                            item.status === "warning" && "border-yellow-500 bg-yellow-500/10 text-yellow-700",
                            item.status === "error" && "border-red-500 bg-red-500/10 text-red-700",
                            item.status === "info" && "border-blue-500 bg-blue-500/10 text-blue-700",
                          )}
                        >
                          {item.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

