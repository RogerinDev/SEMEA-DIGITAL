
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
  useContext,
  createContext,
  useState,
  useCallback,
  useMemo,
} from "react"
import {
  Bar,
  Line,
  Chart,
  Pie,
  Doughnut,
  PolarArea,
  Radar,
  Bubble,
  Scatter,
} from "react-chartjs-2"
import {
  chartjs,
  ChartOptions,
  ChartProps,
  ChartData,
  ChartType,
  ChartContainerProps,
} from "@genkit-ai/react-chartjs-components"
import { cva, VariantProps } from "class-variance-authority"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

const chartVariants = cva("grid gap-4 sm:grid-cols-2 xl:grid-cols-2", {
  variants: {
    variant: {
      default: "",
    },
    size: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  ChartContainerProps & VariantProps<typeof chartVariants>
>(({ className, variant, size, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(chartVariants({ variant, size, className }))}
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
  chartjs,
}
