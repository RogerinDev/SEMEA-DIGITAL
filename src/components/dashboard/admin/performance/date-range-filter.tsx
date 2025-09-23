
"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { addDays, format, subDays } from "date-fns"
import { ptBR } from 'date-fns/locale'
import { DateRange as ReactDateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangeFilterProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  className?: string;
}

export function DateRangeFilter({
  dateRange,
  setDateRange,
  className,
}: DateRangeFilterProps) {

  const handlePresetChange = (value: string) => {
    const now = new Date();
    switch (value) {
      case 'last_7_days':
        setDateRange({ from: subDays(now, 6), to: now });
        break;
      case 'last_30_days':
        setDateRange({ from: subDays(now, 29), to: now });
        break;
      case 'last_90_days':
        setDateRange({ from: subDays(now, 89), to: now });
        break;
      case 'this_month':
        setDateRange({ from: new Date(now.getFullYear(), now.getMonth(), 1), to: now });
        break;
      case 'last_month':
        const lastMonth = subDays(now, now.getDate());
        setDateRange({ from: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1), to: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0) });
        break;
    }
  };

  return (
    <div className={cn("grid gap-2 sm:flex sm:items-center", className)}>
        <Select onValueChange={handlePresetChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Selecionar período" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="last_7_days">Últimos 7 dias</SelectItem>
                <SelectItem value="last_30_days">Últimos 30 dias</SelectItem>
                <SelectItem value="last_90_days">Últimos 90 dias</SelectItem>
                <SelectItem value="this_month">Este Mês</SelectItem>
                <SelectItem value="last_month">Mês Passado</SelectItem>
            </SelectContent>
        </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal sm:w-auto",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y", {locale: ptBR})} -{" "}
                  {format(dateRange.to, "LLL dd, y", {locale: ptBR})}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y", {locale: ptBR})
              )
            ) : (
              <span>Escolha uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(range) => range && range.from && range.to && setDateRange(range)}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
