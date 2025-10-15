
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Menu, Sun, Moon, TreePine, Recycle, PawPrint, GraduationCap, Building, LogIn, UserPlus } from 'lucide-react';
import { Logo } from '@/components/logo';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/contexts/theme-context';
import { Skeleton } from "../ui/skeleton";

const infoComponents: { title: string; href: string; description: string, icon: React.ElementType }[] = [
  {
    title: "Sobre a SEMEA",
    href: "/info/sobre",
    description: "Conheça a estrutura, equipe e contato da Secretaria de Meio Ambiente.",
    icon: Building
  },
  {
    title: "Arborização Urbana",
    href: "/info/urban-afforestation",
    description: "Projetos, serviços de poda/corte e legislação sobre as árvores da cidade.",
     icon: TreePine
  },
  {
    title: "Coleta e Resíduos",
    href: "/info/waste-management",
    description: "Consulte horários da coleta de lixo e encontre ecopontos para descarte.",
    icon: Recycle
  },
];

const welfareComponents: { title: string; href: string; description: string, icon: React.ElementType }[] = [
  {
    title: "Bem-Estar Animal",
    href: "/animal-welfare",
    description: "Conheça o setor e os serviços de cuidado e proteção animal em Varginha.",
    icon: PawPrint
  },
  {
    title: "Adoção Responsável",
    href: "/animal-welfare/adoption",
    description: "Encontre um novo amigo. Cães e gatos que esperam por um lar amoroso.",
    icon: PawPrint
  },
  {
    title: "Perdidos e Achados",
    href: "/animal-welfare/lost-found",
    description: "Anuncie um animal perdido ou encontrado e ajude a reunir pets e donos.",
    icon: PawPrint
  },
   {
    title: "Agendar Consulta",
    href: "/animal-welfare/consultations",
    description: "Solicite um pré-agendamento de consulta veterinária básica.",
    icon: PawPrint
  },
];

const educationComponents: { title: string; href: string; description: string, icon: React.ElementType }[] = [
  {
    title: "Educação Ambiental",
    href: "/info/education",
    description: "Conheça o programa Varginha Sustentável e suas frentes de atuação.",
    icon: GraduationCap
  },
  {
    title: "Nossos Projetos",
    href: "/info/education/projects",
    description: "Projetos para escolas, empresas e comunidades. Solicite uma ação.",
    icon: GraduationCap
  },
  {
    title: "Palestras Temáticas",
    href: "/info/education/lectures",
    description: "Veja os temas disponíveis e solicite uma palestra para sua instituição.",
    icon: GraduationCap
  },
  {
    title: "Como Participar",
    href: "/info/education/how-to-participate",
    description: "Preencha o formulário e solicite uma ação de educação ambiental.",
    icon: GraduationCap
  },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ElementType }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-primary" />}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";


const AuthButtons = () => {
    const { currentUser, loading, logout } = useAuth();
    const pathname = usePathname();
    const baseProfilePath = pathname.startsWith('/dashboard/admin') ? '/dashboard/admin' : '/dashboard/citizen';

    if (loading) {
        return (
            <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-8 w-24" />
            </div>
        )
    }

    if (currentUser) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                         <Avatar className="h-8 w-8">
                            <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || ''}/>
                            <AvatarFallback>{currentUser.displayName?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{currentUser.displayName || 'Painel'}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>{currentUser.displayName || currentUser.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href={currentUser.role === 'admin' || currentUser.role === 'superAdmin' ? '/dashboard/admin' : '/dashboard/citizen'}>
                            Meu Painel
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`${baseProfilePath}/profile`}>
                            Editar Perfil
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                        Sair
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
                <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Entrar
                </Link>
            </Button>
            <Button asChild>
                <Link href="/register">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Criar Conta
                </Link>
            </Button>
        </div>
    )
}

export function PublicHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <NavigationMenu className="hidden lg:flex flex-1 justify-center">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Informações</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {infoComponents.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                      icon={component.icon}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Bem-Estar Animal</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {welfareComponents.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                       icon={component.icon}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
             <NavigationMenuItem>
              <NavigationMenuTrigger>Educação Ambiental</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {educationComponents.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                      icon={component.icon}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex flex-1 items-center justify-end space-x-4">
           <div className="hidden lg:flex items-center gap-2">
             <AuthButtons />
           </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <div className="p-4">
                    <Logo />
                </div>
                <div className="flex flex-col space-y-2 p-4">
                    <Link href="/info/sobre" className={buttonVariants({ variant: "ghost" })}>Sobre a SEMEA</Link>
                    <Link href="/info/urban-afforestation" className={buttonVariants({ variant: "ghost" })}>Arborização Urbana</Link>
                    <Link href="/info/waste-management" className={buttonVariants({ variant: "ghost" })}>Coleta e Resíduos</Link>
                    <Link href="/animal-welfare" className={buttonVariants({ variant: "ghost" })}>Bem-Estar Animal</Link>
                    <Link href="/info/education" className={buttonVariants({ variant: "ghost" })}>Educação Ambiental</Link>
                </div>
                <div className="p-4 border-t">
                  <AuthButtons />
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
