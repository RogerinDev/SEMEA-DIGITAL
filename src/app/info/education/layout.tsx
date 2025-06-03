
import PublicLayout from '@/components/layouts/public-layout';
import { PageTitle } from '@/components/page-title';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, BookOpen, Lightbulb, CalendarCheck2, Users } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const educationNavItems = [
  { href: '/info/education', label: 'Sobre o Programa', icon: GraduationCap },
  { href: '/info/education/projects', label: 'Projetos', icon: Lightbulb },
  { href: '/info/education/lectures', label: 'Palestras', icon: BookOpen },
  { href: '/info/education/events', label: 'Eventos', icon: CalendarCheck2 },
  { href: '/info/education/how-to-participate', label: 'Como Participar', icon: Users },
];

export default function EnvironmentalEducationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Note: A simple way to manage active tab state without client hooks for a static layout.
  // For a real app with client-side navigation, `usePathname` would be used.
  // Here, we pass down the active segment or rely on page-specific highlighting.

  return (
    <PublicLayout>
      <div className="container mx-auto py-8 px-4">
        <nav className="mb-8">
          <Tabs defaultValue="/info/education" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
              {educationNavItems.map((item) => (
                <TabsTrigger key={item.href} value={item.href} asChild>
                  <Link href={item.href} className="flex items-center justify-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </nav>
        {children}
      </div>
    </PublicLayout>
  );
}
