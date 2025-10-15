
"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  Moon,
  Sun,
  User,
  LogOut,
  ChevronDown,
  Lock
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/contexts/theme-context';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';


export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  matchExact?: boolean;
}

interface NavLinkProps {
  item: NavItem;
  isCollapsed: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ item, isCollapsed }) => {
  const pathname = usePathname();
  const isActive = item.matchExact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          asChild
          variant={isActive ? 'secondary' : 'ghost'}
          className={cn(
            'w-full justify-start',
            isCollapsed && 'justify-center',
            isActive && 'text-sidebar-primary-foreground bg-sidebar-primary'
          )}
          aria-label={item.label}
        >
          <Link href={item.href} className="flex items-center gap-3">
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span className="text-base">{item.label}</span>}
          </Link>
        </Button>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right">
          {item.label}
        </TooltipContent>
      )}
    </Tooltip>
  );
};

interface UserMenuProps {
  userName: string;
  userRole: string;
  userPhotoUrl?: string | null;
  logout: () => void;
  isMobile?: boolean;
  baseProfilePath?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ userName, userRole, userPhotoUrl, logout, isMobile, baseProfilePath }) => {
    const { loading } = useAuth();

    if (loading) {
        return <div className="flex items-center gap-2"><Skeleton className="h-8 w-8 rounded-full" /><Skeleton className="h-6 w-24" /></div>
    }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'flex items-center gap-2 w-full p-2 h-auto',
            isMobile ? 'justify-start' : 'justify-center'
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={userPhotoUrl || undefined} alt={userName} />
            <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          {!isMobile && (
              <div className="flex flex-col items-start">
                <span className="font-semibold text-sm">{userName}</span>
                <span className="text-xs text-muted-foreground">{userRole}</span>
              </div>
          )}
          {!isMobile && <ChevronDown className="h-4 w-4 ml-auto" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">{userRole}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={baseProfilePath || '/dashboard/citizen/profile'}>
            <User className="mr-2 h-4 w-4" />
            <span>Meu Perfil</span>
          </Link>
        </DropdownMenuItem>
         <DropdownMenuItem asChild>
          <Link href={`${baseProfilePath || '/dashboard/citizen/profile'}/change-password`}>
            <Lock className="mr-2 h-4 w-4" />
            <span>Alterar Senha</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  userName: string;
  userRole: string;
  sidebarActions?: React.ReactNode;
}

export default function DashboardLayout({ children, navItems, userName, userRole, sidebarActions }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { logout, currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  
  const baseProfilePath = pathname.startsWith('/dashboard/admin') ? '/dashboard/admin/profile' : '/dashboard/citizen/profile';

  const userMenuProps = {
    userName,
    userRole,
    userPhotoUrl: currentUser?.photoURL,
    logout,
    baseProfilePath
  };


  if (isMobile) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col p-0 bg-sidebar text-sidebar-foreground">
                        <div className="p-4 border-b border-sidebar-border">
                            <Logo className="text-sidebar-foreground" />
                        </div>
                        <nav className="flex-grow p-4 space-y-2">
                             {navItems.map((item) => <NavLink key={item.href} item={item} isCollapsed={false} />)}
                        </nav>
                        <div className="p-4 border-t border-sidebar-border">
                           <UserMenu {...userMenuProps} isMobile={false} />
                        </div>
                    </SheetContent>
                </Sheet>
                 <Logo iconSize={24} textSize="text-lg"/>
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
            </header>
            <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <aside className={cn(
        "hidden lg:flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
        isCollapsed ? 'lg:w-20' : 'lg:w-72'
      )}>
        <div className={cn(
            "flex items-center h-16 px-6 border-b border-sidebar-border",
            isCollapsed && "px-2 justify-center"
        )}>
          <Logo className="text-sidebar-foreground" iconSize={isCollapsed ? 32 : 24}/>
        </div>
         {sidebarActions && (
             <div className={cn(isCollapsed && 'hidden')}>{sidebarActions}</div>
         )}
        <nav className="flex-grow px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} isCollapsed={isCollapsed} />
          ))}
        </nav>
        <div className={cn(
            "mt-auto p-4 border-t border-sidebar-border",
             isCollapsed && 'px-2'
        )}>
           <UserMenu {...userMenuProps} isMobile={isCollapsed} />
        </div>
      </aside>
      <div className="flex flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6 sticky top-0 z-30">
          {/* <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setIsCollapsed(!isCollapsed)}>
              <PanelLeftOpen className="h-4 w-4" />
          </Button> */}
           <div className="flex-1">
               {/* Search bar could go here */}
           </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </header>
        <main className="flex-1 p-6 bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
