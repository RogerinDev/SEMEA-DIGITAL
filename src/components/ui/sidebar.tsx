
"use client"

import * as React from "react"
import { Slot, type SlotProps } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronLeft, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SidebarContextProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }

  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
  defaultCollapsed?: boolean
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
  collapsible?: boolean
}

function SidebarProvider({
  children,
  defaultOpen = true,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  collapsible = true,
  onCollapse,
}: SidebarProviderProps) {
  const [open, setOpen] = React.useState(defaultOpen)

  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

  const isUncontrolled = controlledCollapsed === undefined

  React.useEffect(() => {
    if (isUncontrolled && !collapsible) {
      setIsCollapsed(false)
    }
  }, [isUncontrolled, collapsible])

  const collapsed = isUncontrolled ? isCollapsed : controlledCollapsed

  return (
    <SidebarContext.Provider
      value={{
        open,
        setOpen,
        isCollapsed: collapsed ?? false,
        setIsCollapsed: (value) => {
          if (isUncontrolled) {
            setIsCollapsed(value)
          }
          onCollapse?.(value)
        },
      }}
    >
      <TooltipProvider>{children}</TooltipProvider>
    </SidebarContext.Provider>
  )
}

const sidebarVariants = cva(
  "fixed left-0 top-0 z-50 flex h-screen flex-col bg-sidebar-background transition-all duration-300 ease-in-out",
  {
    variants: {
      isCollapsed: {
        true: "w-14",
        false: "w-72",
      },
    },
    defaultVariants: {
      isCollapsed: false,
    },
  }
)

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, ...props }, ref) => {
    const { open } = useSidebar()
    const { isCollapsed } = useSidebar()

    return (
      <>
        {/* The overlay is only shown on mobile */}
        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out md:hidden",
            {
              "opacity-100": open,
              "pointer-events-none opacity-0": !open,
            }
          )}
          onClick={() => useSidebar().setOpen(false)}
        />
        <div
          ref={ref}
          className={cn(
            sidebarVariants({ isCollapsed }),
            "max-md:[--sidebar-width:80%]",
            "max-md:-translate-x-full",
            {
              "max-md:translate-x-0": open,
            },
            className
          )}
          {...props}
        />
      </>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-y-auto", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-auto flex items-center", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

const SidebarMenu = React.forwardRef<HTMLDivElement, SidebarMenuProps>(
  ({ className, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    return (
      <Comp
        ref={ref}
        className={cn("flex flex-col", className)}
        {...props}
      />
    )
  }
)
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("w-full", className)} {...props} />
})
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  cn(
    "group flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-sm font-medium",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50"
  ),
  {
    variants: {
      isActive: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
)

interface SidebarMenuButtonProps
  extends ButtonProps,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, variant, size, asChild, isActive, ...props }, ref) => {
  const Comp = asChild ? Slot : Button
  const { isCollapsed } = useSidebar()
  const { children, ...rest } = props

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Comp
          ref={ref}
          variant="ghost"
          size={isCollapsed ? "icon" : "default"}
          className={cn(sidebarMenuButtonVariants({ isActive }), className, {
            "justify-center": isCollapsed,
          })}
          {...rest}
        >
          {children}
        </Comp>
      </TooltipTrigger>
      <TooltipContent side="right">
        {isCollapsed && children}
      </TooltipContent>
    </Tooltip>
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

interface SidebarTriggerProps extends ButtonProps {
  asChild?: boolean
}

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarTriggerProps
>(({ asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : Button
  const { setOpen } = useSidebar()

  return (
    <Comp ref={ref} variant="ghost" size="icon" {...props} onClick={() => setOpen(true)} />
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

interface SidebarCollapseButtonProps extends ButtonProps {
  asChild?: boolean
}

const SidebarCollapseButton = React.forwardRef<
  HTMLButtonElement,
  SidebarCollapseButtonProps
>(({ asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : Button
  const { isCollapsed, setIsCollapsed } = useSidebar()

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className="absolute -right-3 top-1/2 -translate-y-1/2 rounded-full border bg-background text-foreground hover:bg-background"
      {...props}
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      <ChevronLeft
        className={cn("h-4 w-4", {
          "rotate-180": isCollapsed,
        })}
      />
    </Button>
  )
})
SidebarCollapseButton.displayName = "SidebarCollapseButton"

const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { isCollapsed } = useSidebar();
    return (
      <div
        ref={ref}
        className={cn(
          "transition-all duration-300 ease-in-out",
          {
            "md:ml-14": isCollapsed,
            "md:ml-72": !isCollapsed,
          },
          className
        )}
        {...props}
      />
    );
  }
);
SidebarInset.displayName = "SidebarInset"

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarCollapseButton,
  SidebarInset,
}