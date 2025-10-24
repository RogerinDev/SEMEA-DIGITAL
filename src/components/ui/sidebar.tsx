
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

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
          isCollapsed ? "w-[5.5rem]" : "w-72",
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

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
    ({ className, children, isCollapsed, ...props }, ref) => (
  <div ref={ref} className={cn(
    "flex items-center h-16 px-4", 
    isCollapsed ? "justify-center" : "justify-between",
    className
    )} 
    {...props}>
    {children}
  </div>
))
SidebarHeader.displayName = "SidebarHeader"


const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-1 overflow-y-auto overflow-x-hidden", className)} {...props} />
))
SidebarContent.displayName = "SidebarContent"

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
}
const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
    ({ className, isCollapsed, ...props }, ref) => (
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

interface SidebarMenuItemProps extends React.LiHTMLAttributes<HTMLLIElement> {}

const SidebarMenuItem = React.forwardRef<HTMLLIElement, SidebarMenuItemProps>(
    ({ className, children, ...props }, ref) => {
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
