
import PublicLayout from '@/components/layouts/public-layout';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TreePine, Sprout, ArrowRight, CheckCircle } from 'lucide-react';
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

        <div className="grid md:grid-cols-2 gap-6 mb-12"> {/* Updated from md:grid-cols-3 */}
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
                        <Link href="/dashboard/citizen/requests/new?type=plantio_arvore_area_publica">
                          <span className="flex items-center justify-center">
                            Fazer Solicitação <ArrowRight className="ml-2 h-4 w-4"/>
                          </span>
                        </Link>
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
                        <Link href="/dashboard/citizen/requests/new?type=poda_arvore">
                          <span className="flex items-center justify-center">
                            Solicitar Poda/Remoção <ArrowRight className="ml-2 h-4 w-4"/>
                          </span>
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
            {/* Card "Diretrizes e Cuidados" removido daqui */}
        </div>

        {/* Card "Inventário de Árvores (Em Breve)" removido daqui */}
      </div>
    </PublicLayout>
  );
}
