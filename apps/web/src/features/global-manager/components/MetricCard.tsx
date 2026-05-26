import { Card } from "@/shared/ui/Card"
import { cn } from "@/shared/lib/utils"
import type { ReactNode } from "react"

interface MetricCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: string
  trendUp?: boolean
  className?: string
}

export function MetricCard({ title, value, icon, trend, trendUp, className }: MetricCardProps) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-neutral-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{value}</p>
          {trend && (
            <p className={cn("mt-1 text-xs font-medium", trendUp ? "text-emerald-600" : "text-rose-500")}>
              {trend}
            </p>
          )}
        </div>
        <div className="rounded-xl bg-neutral-100 p-2.5 text-neutral-600">{icon}</div>
      </div>
    </Card>
  )
}
