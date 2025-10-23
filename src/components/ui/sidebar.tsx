
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Separator } from "./separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
import { ChevronRight } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, isCollapsed, onMouseEnter, onMouseLeave, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          "fixed left-0 top-0 z-50 h-screen flex flex-col bg-sidebar-background border-r border-sidebar-border transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-72",
          className
        )}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...props}
      >
        {children}
      </aside>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center border-b border-sidebar-border p-4 h-16", className)} {...props} />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-1 overflow-y-auto overflow-x-hidden", className)} {...props} />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mt-auto p-2", className)} {...props} />
))
SidebarFooter.displayName = "SidebarFooter"

interface SidebarMenuProps extends React.HTMLAttributes<HTMLUListElement> {}

const SidebarMenu = React.forwardRef<HTMLUListElement, SidebarMenuProps>(
  ({ className, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn("flex flex-col gap-1 p-4 pt-2", className)}
        {...props}
      />
    )
  }
)
SidebarMenu.displayName = "SidebarMenu"

interface SidebarMenuItemProps extends Omit<React.HTMLAttributes<HTMLLIElement>, 'label'> {
    label: string;
}

const SidebarMenuItem = React.forwardRef<HTMLLIElement, SidebarMenuItemProps>(
    ({ className, children, label, ...props }, ref) => {
    return (
        <li ref={ref} className={cn("w-full", className)} {...props}>
            {children}
        </li>
    )
})
SidebarMenuItem.displayName = "SidebarMenuItem"


export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
}
