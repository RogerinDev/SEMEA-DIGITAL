
import PublicLayout from '@/components/layouts/public-layout';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PawPrint, Info, Search, HandHeart } from 'lucide-react';
import Link from 'next/link';

const animalWelfareNavItems = [
  { href: '/animal-welfare', label: 'Informações Gerais', icon: Info },
  { href: '/animal-welfare/adoption', label: 'Adoção Responsável', icon: HandHeart },
  { href: '/animal-welfare/lost-found', label: 'Perdidos e Achados', icon: Search },
];

export default function AnimalWelfareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicLayout>
      <div className="container mx-auto py-8 px-4">
        <nav className="mb-8">
          <Tabs defaultValue="/animal-welfare" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
              {animalWelfareNavItems.map((item) => (
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
