
import PublicLayout from '@/components/layouts/public-layout';
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Removido
// import { BookOpen, CalendarCheck2, Users } from 'lucide-react'; // Removido se não usado mais
// import Link from 'next/link'; // Removido se não usado mais

// const educationNavItems = [ // Removido
//   { href: '/info/education/lectures', label: 'Palestras', icon: BookOpen },
//   { href: '/info/education/events', label: 'Eventos', icon: CalendarCheck2 },
//   { href: '/info/education/how-to-participate', label: 'Como Participar', icon: Users },
// ];

export default function EnvironmentalEducationLayout({
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
