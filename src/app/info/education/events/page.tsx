
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Users, Info } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { environmentalEvents } from '@/lib/education-data'; // Using centralized data
import type { EnvironmentalEvent } from '@/types';

export default function EnvironmentalEducationEventsPage() {
  // For a real calendar, you'd likely fetch events and might have more complex filtering/display logic.
  // For this prototype, we'll display a list of mock events.
  const upcomingEvents = environmentalEvents
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = environmentalEvents
    .filter(event => new Date(event.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  return (
    <>
      <PageTitle
        title="Eventos Ambientais"
        icon={CalendarDays}
        description="A SEMEA realiza eventos temáticos ao longo do ano, baseados em um calendário anual de eventos e datas ambientais. Participe!"
      />
      
      {/* Placeholder for a more interactive calendar component if developed later */}
      {/* <Card className="mb-8">
        <CardHeader><CardTitle>Calendário Interativo (Em Desenvolvimento)</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Em breve, um calendário interativo para visualizar os eventos.</p>
          <div className="aspect-video bg-muted rounded-md flex items-center justify-center mt-4">
            <CalendarDays className="h-16 w-16 text-muted-foreground/50"/>
          </div>
        </CardContent>
      </Card> */}

      {upcomingEvents.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Próximos Eventos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
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
                      <Info className="mr-2 h-4 w-4" />
                      Mais Informações
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}
       {upcomingEvents.length === 0 && environmentalEvents.length > 0 && (
         <div className="text-center py-12 col-span-full mb-8">
            <CalendarDays className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum próximo evento agendado no momento</h3>
            <p className="text-muted-foreground">Fique de olho em nossa agenda para futuras atividades.</p>
        </div>
      )}


      {pastEvents.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-6">Eventos Realizados</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event) => (
              <Card key={event.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 opacity-75">
                {event.imageUrl && (
                  <div className="aspect-video overflow-hidden">
                    <Image src={event.imageUrl} alt={event.name} width={600} height={400} className="object-cover w-full h-full" data-ai-hint={event.dataAiHint}/>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-md">{event.name}</CardTitle>
                  <CardDescription className="text-xs uppercase tracking-wider text-primary/80">{event.type.replace(/_/g, ' ')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-1">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3 mr-1.5" />
                    {new Date(event.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1.5" />
                    {event.location}
                  </div>
                  <p className="text-xs text-foreground/80 line-clamp-2">{event.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" disabled className="w-full">
                    Evento Concluído
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

      {environmentalEvents.length === 0 && (
            <div className="text-center py-12 col-span-full">
                <CalendarDays className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum evento cadastrado no momento</h3>
                <p className="text-muted-foreground">Fique de olho em nossa agenda para futuras atividades.</p>
            </div>
        )}
    </>
  );
}
