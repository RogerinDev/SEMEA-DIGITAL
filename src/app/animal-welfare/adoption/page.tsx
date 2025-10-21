
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PawPrint, Dog, Cat, Heart, Info, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { AnimalForAdoption, AnimalSpecies } from '@/types';
import { Badge } from '@/components/ui/badge';
import { getAnimalsForAdoptionAction } from '@/app/actions/adoption-actions';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';


const getAnimalIcon = (species: AnimalSpecies) => {
  if (species === 'cao') return Dog;
  if (species === 'gato') return Cat;
  return PawPrint;
};

const statusTranslations: Record<AnimalForAdoption['status'], string> = {
    disponivel: 'Disponível',
    processo_adocao_em_andamento: 'Em Adoção',
    adotado: 'Adotado'
};

const getStatusBadgeVariant = (status: AnimalForAdoption['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
        case 'disponivel':
            return 'secondary';
        case 'processo_adocao_em_andamento':
            return 'outline';
        case 'adotado':
            return 'default';
    }
}

export default function AnimalAdoptionPage() {
  const [filter, setFilter] = useState<"all" | AnimalSpecies>('all');
  const [animals, setAnimals] = useState<AnimalForAdoption[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function fetchAnimals() {
        setLoading(true);
        const fetchedAnimals = await getAnimalsForAdoptionAction();
        setAnimals(fetchedAnimals);
        setLoading(false);
    }
    fetchAnimals();
  }, []);
  
  const handleInterestClick = (path: string) => {
    if (currentUser) {
      router.push(path);
    } else {
      router.push('/register');
    }
  };


  const filteredAnimals = animals.filter(animal => {
    if (filter === 'all') return true;
    return animal.species === filter;
  });

  return (
    <>
      <PageTitle title="Adoção Responsável" icon={PawPrint} description="Encontre um novo amigo! Conheça os cães e gatos que esperam por um lar amoroso em Varginha." />

      <div className="flex justify-center items-center gap-2 sm:gap-4 mb-8 flex-wrap">
        <Button onClick={() => setFilter('all')} variant={filter === 'all' ? 'secondary' : 'outline'}>
          <PawPrint className="mr-2 h-4 w-4" /> Ver Todos
        </Button>
        <Button onClick={() => setFilter('cao')} variant={filter === 'cao' ? 'secondary' : 'outline'}>
          <Dog className="mr-2 h-4 w-4" /> Apenas Cães
        </Button>
        <Button onClick={() => setFilter('gato')} variant={filter === 'gato' ? 'secondary' : 'outline'}>
          <Cat className="mr-2 h-4 w-4" /> Apenas Gatos
        </Button>
      </div>
      
      <div className="mb-8 text-center">
          <Button size="lg" onClick={() => handleInterestClick('/dashboard/citizen/requests/new?type=solicitacao_adocao_animal')}>
              <span className="flex items-center"><Heart className="mr-2 h-5 w-5"/> Quero Adotar! (Formulário de Interesse)</span>
          </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : animals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAnimals.map((animal) => {
            const AnimalIcon = getAnimalIcon(animal.species);
            const interestPath = `/dashboard/citizen/requests/new?type=solicitacao_adocao_animal&animal_name=${encodeURIComponent(animal.name)}`;
            
            return (
            <Card key={animal.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {animal.photoUrl ? (
                        <Image src={animal.photoUrl} alt={animal.name} layout="fill" objectFit="cover" className="transition-transform duration-300 hover:scale-105" data-ai-hint={`${animal.species} ${animal.breed}`}/>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <PawPrint className="w-16 h-16 text-muted-foreground" />
                        </div>
                    )}
                    <Badge variant={getStatusBadgeVariant(animal.status)} className="absolute top-2 right-2">
                      {statusTranslations[animal.status]}
                    </Badge>
                </div>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{animal.name}</CardTitle>
                        <AnimalIcon className="h-6 w-6 text-primary" />
                    </div>
                    <CardDescription>{animal.breed} - {animal.age}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{animal.description}</p>
                </CardContent>
                <CardFooter>
                <Button 
                    className="w-full" 
                    disabled={animal.status !== 'disponivel'} 
                    onClick={() => animal.status === 'disponivel' && handleInterestClick(interestPath)}
                >
                    <span className="flex items-center"> <Info className="mr-2 h-4 w-4" />
                      {animal.status === 'disponivel' ? 'Tenho Interesse' : 'Indisponível'}
                    </span>
                </Button>
                </CardFooter>
            </Card>
            );
          })}
        </div>
      ) : (
          <div className="text-center py-16 col-span-full bg-muted rounded-lg">
              <PawPrint className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum Animal Disponível no Momento</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                  No momento não temos animais cadastrados para adoção. Fique de olho em nossas redes sociais ou volte em breve!
              </p>
          </div>
      )}
    </>
  );
}
