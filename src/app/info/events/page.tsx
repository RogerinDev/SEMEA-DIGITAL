
import PublicLayout from '@/components/layouts/public-layout';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';

// This page is effectively being replaced by /info/education/events/page.tsx
// It can be deleted or redirected if needed. For now, it will show an empty state.
// The mockEvents array has been removed to clean up the file.
export default function DeprecatedEnvironmentalEventsPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto py-12 px-4">
        <PageTitle title="Eventos Ambientais" icon={CalendarDays} description="Esta página foi movida. Acesse os eventos através da seção de Educação Ambiental." />
        
        <div className="text-center py-12 col-span-full">
            <CalendarDays className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Página de Eventos Movida</h3>
            <p className="text-muted-foreground mb-4">
              Para conferir nosso calendário de eventos, por favor, acesse a seção de Educação Ambiental.
            </p>
            <Button asChild>
                <Link href="/info/education/events">
                    Ir para Eventos em Educação Ambiental
                </Link>
            </Button>
        </div>
      </div>
    </PublicLayout>
  );
}
