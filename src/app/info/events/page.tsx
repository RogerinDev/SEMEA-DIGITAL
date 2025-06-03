import PublicLayout from '@/components/layouts/public-layout';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Users, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { EnvironmentalEvent } from '@/types';

const mockEvents: EnvironmentalEvent[] = [
  { id: '1', name: 'Semana do Meio Ambiente 2024', type: 'feira_ambiental', date: new Date(2024, 5, 5, 9, 0).toISOString(), location: 'Praça Central de Varginha', description: 'Palestras, workshops e atividades educativas para todas as idades celebrando o meio ambiente.', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'environmental fair' },
  { id: '2', name: 'Workshop de Plantio de Hortas Urbanas', type: 'workshop', date: new Date(2024, 7, 12, 14, 0).toISOString(), location: 'Parque Novo Horizonte', description: 'Aprenda técnicas de cultivo de alimentos em pequenos espaços e contribua para uma cidade mais verde.', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'urban gardening' },
  { id: '3', name: 'Trilha Ecológica Guiada no Parque São Francisco', type: 'trilha_guiada_ecologica', date: new Date(2024, 8, 3, 8, 0).toISOString(), location: 'Parque São Francisco', description: 'Explore a fauna e flora local com guias especializados. Inscrições limitadas.', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'nature trail' },
];

export default function EnvironmentalEventsPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto py-12 px-4">
        <PageTitle title="Eventos Ambientais" icon={CalendarDays} description="Participe de palestras, workshops, feiras e outras atividades promovidas pela SEMEA e parceiros." />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockEvents.map((event) => (
            <Card key={event.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              {event.imageUrl && (
                <div className="aspect-video overflow-hidden">
                  <Image src={event.imageUrl} alt={event.name} width={600} height={400} className="object-cover w-full h-full transition-transform duration-300 hover:scale-105" data-ai-hint={event.dataAiHint}/>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{event.name}</CardTitle>
                <CardDescription className="text-xs uppercase tracking-wider text-primary">{event.type.replace(/_/g, ' ')}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {new Date(event.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
                <p className="text-sm text-foreground line-clamp-3">{event.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  {/* Link to specific event page or registration form */}
                  <Link href="#"> 
                    <Users className="mr-2 h-4 w-4" />
                    Mais Informações / Inscrever-se
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
         {mockEvents.length === 0 && (
            <div className="text-center py-12 col-span-full">
                <CalendarDays className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum evento programado no momento</h3>
                <p className="text-muted-foreground">Fique de olho em nossa agenda para futuras atividades.</p>
            </div>
        )}
      </div>
    </PublicLayout>
  );
}
