
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
              className="flex items-center gap-1 text-primary/90 transition-colors hover:text-primary"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/login" passHref legacyBehavior>
                <Button as="a" variant="secondary" size="icon" aria-label="Entrar">
                  <LogIn className="h-4 w-4" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Entrar</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/register" passHref legacyBehavior>
                <Button as="a" variant="default" size="icon" aria-label="Registrar">
                  <UserPlus className="h-4 w-4" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Registrar</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
