
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PawPrint, Dog, Cat, Heart, Info } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Animal } from '@/types';
import { Badge } from '@/components/ui/badge';

const mockAnimals: Animal[] = [
  { id: '1', name: 'Rex', species: 'cao', breed: 'SRD (Sem Raça Definida)', age: '2 anos', photoUrl: 'https://placehold.co/400x300.png', description: 'Rex é um cão muito brincalhão e carinhoso. Adora passear e se dá bem com crianças. Vacinado e castrado.', statusAdocao: 'disponivel' },
  { id: '2', name: 'Mia', species: 'gato', breed: 'Siamês (mistura)', age: '1 ano', photoUrl: 'https://placehold.co/400x300.png', description: 'Mia é uma gatinha tranquila e afetuosa. Gosta de um colo e ronrona muito. Castrada e vermifugada.', statusAdocao: 'disponivel' },
  { id: '3', name: 'Bolinha', species: 'cao', breed: 'Poodle', age: '5 anos', photoUrl: 'https://placehold.co/400x300.png', description: 'Bolinha é um senhorzinho calmo e companheiro. Perfeito para quem busca um amigo tranquilo. Precisa de cuidados especiais com a visão.', statusAdocao: 'processo_adocao_em_andamento' },
  { id: '4', name: 'Frajola', species: 'gato', breed: 'SRD (Sem Raça Definida)', age: '6 meses', photoUrl: 'https://placehold.co/400x300.png', description: 'Frajola é um filhote curioso e cheio de energia. Adora brincar com bolinhas de papel. Precisa de um lar com muito amor.', statusAdocao: 'disponivel' },
];

const getAnimalIcon = (species: Animal['species']) => {
  if (species === 'cao') return Dog;
  if (species === 'gato') return Cat;
  return PawPrint;
};

export default function AnimalAdoptionPage() {
  return (
    <>
      <PageTitle title="Adoção Responsável" icon={PawPrint} description="Encontre um novo amigo! Conheça os cães e gatos que esperam por um lar amoroso em Varginha." />

      <div className="mb-8 text-center">
          <Button size="lg" asChild>
              <Link href="/dashboard/citizen/requests/new?type=solicitacao_adocao_animal">
                  <span className="flex items-center"><Heart className="mr-2 h-5 w-5"/> Quero Adotar! (Formulário de Interesse)</span>
              </Link>
          </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockAnimals.map((animal) => {
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
                  {/* Link to specific animal detail page or pre-fill adoption form */}
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
      {mockAnimals.length === 0 && (
          <div className="text-center py-12 col-span-full">
              <PawPrint className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum animal disponível para adoção no momento</h3>
              <p className="text-muted-foreground">Por favor, verifique novamente mais tarde. Muitos anjinhos esperam por um lar!</p>
          </div>
      )}
    </>
  );
}
