
import PublicLayout from '@/components/layouts/public-layout';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Users, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { EnvironmentalEvent } from '@/types';

// This data will now come from lib/education-data.ts via the new /info/education/events page
const mockEvents: EnvironmentalEvent[] = [
  // { id: '1', name: 'Semana do Meio Ambiente 2024', type: 'feira_ambiental', date: new Date(2024, 5, 5, 9, 0).toISOString(), location: 'Praça Central de Varginha', description: 'Palestras, workshops e atividades educativas para todas as idades celebrando o meio ambiente.', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'environmental fair' },
  // { id: '2', name: 'Workshop de Plantio de Hortas Urbanas', type: 'workshop', date: new Date(2024, 7, 12, 14, 0).toISOString(), location: 'Parque Novo Horizonte', description: 'Aprenda técnicas de cultivo de alimentos em pequenos espaços e contribua para uma cidade mais verde.', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'urban gardening' },
  // { id: '3', name: 'Trilha Ecológica Guiada no Parque São Francisco', type: 'trilha_guiada_ecologica', date: new Date(2024, 8, 3, 8, 0).toISOString(), location: 'Parque São Francisco', description: 'Explore a fauna e flora local com guias especializados. Inscrições limitadas.', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'nature trail' },
];

// This page is effectively being replaced by /info/education/events/page.tsx
// It can be deleted or redirected if needed. For now, it will show an empty state.
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
