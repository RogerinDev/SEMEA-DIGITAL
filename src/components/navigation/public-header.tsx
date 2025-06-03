
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Briefcase, Info, LogIn, UserPlus, TreePine, Droplets, CalendarDays, GraduationCap, PawPrint } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function PublicHeader() {
  const navItems = [
    { href: '/info/urban-afforestation', label: 'Arborização', icon: TreePine },
    { href: '/info/waste-management', label: 'Resíduos', icon: Droplets },
    { href: '/info/education', label: 'Educação Ambiental', icon: GraduationCap },
    { href: '/animal-welfare/adoption', label: 'Adoção', icon: PawPrint },
    { href: '/dashboard/citizen', label: 'Serviços', icon: Briefcase },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-1 text-foreground/80 transition-colors hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" asChild aria-label="Entrar">
                  <Link href="/login">
                    <LogIn className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Entrar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" asChild aria-label="Registrar">
                  <Link href="/register">
                    <UserPlus className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Registrar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}
