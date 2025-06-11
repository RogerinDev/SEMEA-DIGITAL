
import PublicLayout from '@/components/layouts/public-layout';
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Removido
// import { PawPrint, Info, Search, HandHeart } from 'lucide-react'; // Removido se não usado mais
// import Link from 'next/link'; // Removido se não usado mais

// const animalWelfareNavItems = [ // Removido
//   { href: '/animal-welfare', label: 'Informações Gerais', icon: Info },
//   { href: '/animal-welfare/adoption', label: 'Adoção Responsável', icon: HandHeart },
//   { href: '/animal-welfare/lost-found', label: 'Perdidos e Achados', icon: Search },
// ];

export default function AnimalWelfareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicLayout>
      <div className="container mx-auto py-8 px-4">
        {/* A navegação por abas foi removida daqui */}
        {children}
      </div>
    </PublicLayout>
  );
}
