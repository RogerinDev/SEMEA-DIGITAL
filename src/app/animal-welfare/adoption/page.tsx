
"use client";

import { useState } from 'react';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PawPrint, Dog, Cat, Heart, Info, Construction } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Animal } from '@/types';
import { Badge } from '@/components/ui/badge';

// Mock data has been removed. The component will now display a "work in progress" message.
// In a future implementation, this array would be populated by a server action fetching data from Firestore.
const animalsForAdoption: Animal[] = [];

const getAnimalIcon = (species: Animal['species']) => {
  if (species === 'cao') return Dog;
  if (species === 'gato') return Cat;
  return PawPrint;
};

export default function AnimalAdoptionPage() {
  const [filter, setFilter] = useState<'all' | 'cao' | 'gato'>('all');

  const filteredAnimals = animalsForAdoption.filter(animal => {
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
          <Button size="lg" asChild>
              <Link href="/dashboard/citizen/requests/new?type=solicitacao_adocao_animal">
                  <span className="flex items-center"><Heart className="mr-2 h-5 w-5"/> Quero Adotar! (Formulário de Interesse)</span>
              </Link>
          </Button>
      </div>

      {animalsForAdoption.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAnimals.map((animal) => {
            const AnimalIcon = getAnimalIcon(animal.species);
            return (
            <Card key={animal.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={animal.photoUrl} alt={animal.name} layout="fill" objectFit="cover" className="transition-transform duration-300 hover:scale-105" data-ai-hint={`${animal.species} ${animal.breed}`}/>
                {animal.statusAdocao !== 'disponivel' && (
                    <Badge variant={animal.statusAdocao === 'adotado' ? 'default' : 'secondary'} className="absolute top-2 right-2">
                    {animal.statusAdocao === 'adotado' ? 'Adotado!' : 'Em Adoção'}
                    </Badge>
                )}
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
                <Button asChild className="w-full" disabled={animal.statusAdocao !== 'disponivel'}>
                    <Link href={animal.statusAdocao === 'disponivel' ? `/animal-welfare/adoption/${animal.id}` : '#'}>
                    <span className="flex items-center"> <Info className="mr-2 h-4 w-4" />
                      {animal.statusAdocao === 'disponivel' ? 'Saber Mais / Adotar' : (animal.statusAdocao === 'adotado' ? 'Já Adotado' : 'Em Processo')}
                    </span>
                    </Link>
                </Button>
                </CardFooter>
            </Card>
            );
          })}
        </div>
      ) : (
          <div className="text-center py-16 col-span-full bg-muted rounded-lg">
              <Construction className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Funcionalidade em Desenvolvimento</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                  Estamos trabalhando para trazer o catálogo de animais para adoção diretamente para o site. 
                  Por enquanto, entre em contato com o setor de Bem-Estar Animal para mais informações.
              </p>
          </div>
      )}
    </>
  );
}
