
"use client"

import * as React from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip as ChartJSTooltip,
  Legend,
  Filler,
  TimeScale,
  TimeSeriesScale,
} from "chart.js"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartJSTooltip,
  Legend,
  Filler,
  TimeScale,
  TimeSeriesScale
)

const Chart = ChartJS

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-2", className)}
      {...props}
    />
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = Tooltip
const ChartTooltipTrigger = TooltipTrigger
const ChartTooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipContent>,
  React.ComponentPropsWithoutRef<typeof TooltipContent>
>(({ className, ...props }, ref) => (
  <TooltipContent
    ref={ref}
    className={cn("bg-card text-card-foreground", className)}
    {...props}
  />
))
ChartTooltipContent.displayName = "ChartTooltipContent"

export {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipTrigger,
  ChartTooltipContent,
}
