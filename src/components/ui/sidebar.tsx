"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "./button";
import { ChevronLeft } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, isCollapsed, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          "fixed left-0 top-0 z-50 h-screen flex flex-col bg-sidebar-background transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-72",
          className
        )}
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
  <div ref={ref} className={cn("mt-auto border-t border-sidebar-border p-2", className)} {...props} />
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

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
    label: string;
    isCollapsed: boolean;
}

const SidebarMenuItem = React.forwardRef<HTMLLIElement, SidebarMenuItemProps>(
    ({ className, children, label, isCollapsed, ...props }, ref) => {
    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <li ref={ref} className={cn("w-full", className)} {...props}>
                        {children}
                    </li>
                </TooltipTrigger>
                {isCollapsed && (
                    <TooltipContent side="right" className="ml-2">
                        <p>{label}</p>
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    )
})
SidebarMenuItem.displayName = "SidebarMenuItem"


interface SidebarCollapseButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  isCollapsed: boolean;
  onToggle: () => void;
}

const SidebarCollapseButton = React.forwardRef<HTMLButtonElement, SidebarCollapseButtonProps>(
  ({ isCollapsed, onToggle, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn(
          "absolute -right-5 top-1/2 -translate-y-1/2 rounded-full border bg-background text-foreground hover:bg-background z-50",
          className
        )}
        onClick={onToggle}
        {...props}
      >
        <ChevronLeft
          className={cn("h-4 w-4 transition-transform", {
            "rotate-180": isCollapsed,
          })}
        />
      </Button>
    )
  }
)
SidebarCollapseButton.displayName = "SidebarCollapseButton"


export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarCollapseButton
}