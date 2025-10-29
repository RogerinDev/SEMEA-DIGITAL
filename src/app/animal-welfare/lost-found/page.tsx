
"use client";

import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PawPrint, Search, MapPin, CalendarDays, PlusCircle, BadgeHelp, AlertTriangle, CheckCircle2, Loader2, Info } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import type { LostFoundAnimal } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import { getApprovedLostFoundPostsAction } from '@/app/actions/lost-found-actions';
import { useRouter } from 'next/navigation';

function AnimalCard({ animal }: { animal: LostFoundAnimal }) {
  const AnimalIcon = animal.species.toLowerCase() === 'cachorro' ? PawPrint : (animal.species.toLowerCase() === 'gato' ? PawPrint : PawPrint);
  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted flex items-center justify-center">
        {animal.photoUrl ? (
          <Image src={animal.photoUrl} alt={`${animal.type} - ${animal.species}`} layout="fill" objectFit="cover" data-ai-hint={`${animal.species} animal`}/>
        ) : (
          <PawPrint className="w-16 h-16 text-muted-foreground" />
        )}
        <Badge variant={animal.type === 'perdido' ? 'destructive' : 'secondary'} className="absolute top-2 left-2 capitalize">
          {animal.type === 'perdido' ? <AlertTriangle className="h-3 w-3 mr-1"/> : <BadgeHelp className="h-3 w-3 mr-1"/>}
          {animal.type}
        </Badge>
         {animal.status === 'resolvido' && (
            <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                <CheckCircle2 className="h-3 w-3 mr-1"/> Resolvido
            </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <AnimalIcon className="h-5 w-5 mr-2 text-primary"/>
          {animal.species} {animal.breed ? `(${animal.breed})` : ''}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-1 text-sm">
        <p className="text-muted-foreground line-clamp-3"><strong>Descrição:</strong> {animal.description}</p>
        <p><MapPin className="inline h-4 w-4 mr-1 text-muted-foreground"/> <strong>Local:</strong> {animal.lastSeenLocation}</p>
        <p><CalendarDays className="inline h-4 w-4 mr-1 text-muted-foreground"/> <strong>Data:</strong> {new Date(animal.date).toLocaleDateString()}</p>
      </CardContent>
      <CardFooter className="flex-col items-start space-y-2">
        <p className="text-xs text-muted-foreground"><strong>Contato:</strong> {animal.contactName} - {animal.contactPhone}</p>
        <Button variant="outline" size="sm" className="w-full" asChild>
            <a href={`tel:${animal.contactPhone}`}>Entrar em Contato</a>
        </Button>
      </CardFooter>
    </Card>
  );
}


export default function LostFoundPage() {
  const [posts, setPosts] = useState<LostFoundAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      // CORRIGIDO: Busca apenas os posts aprovados
      const fetchedPosts = await getApprovedLostFoundPostsAction();
      setPosts(fetchedPosts);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const handleRegisterClick = () => {
    if (currentUser) {
        router.push('/dashboard/citizen/requests/new?type=registro_animal_perdido_encontrado');
    } else {
        router.push('/login');
    }
  }
  
  const animaisPerdidos = posts.filter(a => a.type === 'perdido');
  const animaisEncontrados = posts.filter(a => a.type === 'encontrado');

  return (
    <>
      <PageTitle title="Animais Perdidos e Encontrados" icon={Search} description="Ajude a reunir pets com seus donos. Os anúncios publicados foram aprovados pela nossa equipe." />
      
        <div className="mb-8 text-center">
            <Button size="lg" onClick={handleRegisterClick}>
                <span className="flex items-center"><PlusCircle className="mr-2 h-5 w-5"/> Registrar Animal Perdido ou Encontrado</span>
            </Button>
        </div>

      <Tabs defaultValue="perdidos" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 mx-auto">
          <TabsTrigger value="perdidos">Animais Perdidos</TabsTrigger>
          <TabsTrigger value="encontrados">Animais Encontrados</TabsTrigger>
        </TabsList>
        {loading ? (
            <div className="flex justify-center items-center py-24">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        ) : (
            <>
                <TabsContent value="perdidos">
                    {animaisPerdidos.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {animaisPerdidos.map(animal => <AnimalCard key={animal.id} animal={animal} />)}
                        </div>
                    ) : (
                         <div className="text-center py-16 col-span-full bg-muted rounded-lg">
                            <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Nenhum Animal Perdido</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                No momento não há registros de animais perdidos.
                            </p>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="encontrados">
                     {animaisEncontrados.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {animaisEncontrados.map(animal => <AnimalCard key={animal.id} animal={animal} />)}
                        </div>
                     ) : (
                        <div className="text-center py-16 col-span-full bg-muted rounded-lg">
                           <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                           <h3 className="text-xl font-semibold mb-2">Nenhum Animal Encontrado</h3>
                           <p className="text-muted-foreground max-w-md mx-auto">
                               No momento não há registros de animais encontrados.
                           </p>
                       </div>
                     )}
                </TabsContent>
            </>
        )}
      </Tabs>
    </>
  );
}
