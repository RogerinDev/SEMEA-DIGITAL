import PublicLayout from '@/components/layouts/public-layout';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TreePine, Sprout, Info, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function UrbanAfforestationPage() {
  const benefits = [
    "Melhora da qualidade do ar",
    "Redução da temperatura ambiente",
    "Aumento da umidade do ar",
    "Redução da poluição sonora",
    "Embelezamento da cidade",
    "Abrigo e alimento para a fauna local",
    "Valorização dos imóveis",
    "Bem-estar físico e mental para a população"
  ];

  return (
    <PublicLayout>
      <div className="container mx-auto py-12 px-4">
        <PageTitle title="Arborização Urbana" icon={TreePine} description="Conheça a importância das árvores na cidade, como solicitar plantio, poda e remoção, e as diretrizes para uma Varginha mais verde." />

        <div className="grid md:grid-cols-2 gap-8 mb-12 items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Por que a Arborização Urbana é Importante?</h2>
            <p className="text-muted-foreground mb-6">
              As árvores desempenham um papel crucial no ambiente urbano, trazendo inúmeros benefícios para a qualidade de vida dos cidadãos e para o equilíbrio ecológico da cidade.
            </p>
            <ul className="space-y-2 mb-6">
              {benefits.map(benefit => (
                <li key={benefit} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
             <Image src="https://placehold.co/600x400.png" data-ai-hint="city park" alt="Parque urbano com árvores" layout="fill" objectFit="cover" />
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                    <Sprout className="h-10 w-10 text-primary mb-2"/>
                    <CardTitle>Solicitar Plantio de Árvore</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Quer uma árvore na sua calçada ou em uma área pública próxima? Veja como solicitar.</p>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" asChild>
                        <Link href="/dashboard/citizen/requests/new?type=plantio_arvore_area_publica">Fazer Solicitação <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                </CardFooter>
            </Card>
             <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                    <TreePine className="h-10 w-10 text-primary mb-2"/>
                    <CardTitle>Solicitar Poda ou Remoção</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Árvores em risco, doentes, ou necessitando de poda? Saiba como proceder.</p>
                </CardContent>
                <CardFooter>
                     <Button className="w-full" asChild>
                        <Link href="/dashboard/citizen/requests/new?type=poda_arvore">Solicitar Poda/Remoção <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                </CardFooter>
            </Card>
             <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                    <Info className="h-10 w-10 text-primary mb-2"/>
                    <CardTitle>Diretrizes e Cuidados</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Conheça as espécies adequadas, como cuidar das árvores e a legislação municipal.</p>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="#">Ler Diretrizes <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Inventário de Árvores (Em Breve)</CardTitle>
                <CardDescription>Em breve, você poderá consultar informações sobre as árvores em áreas públicas da cidade através de um mapa interativo.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <TreePine className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Estamos trabalhando para disponibilizar o inventário arbóreo municipal online.</p>
            </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
