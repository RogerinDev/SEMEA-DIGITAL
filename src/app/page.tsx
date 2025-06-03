
import PublicLayout from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Leaf, PawPrint, Recycle, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      icon: Leaf,
      title: 'Solicitações de Serviços',
      description: 'Peça poda de árvores, castração de animais, coletas especiais e mais.',
      link: '/dashboard/citizen/requests/new',
      dataAiHint: 'tree service'
    },
    {
      icon: AlertTriangle,
      title: 'Registro de Ocorrências',
      description: 'Denuncie descarte irregular, maus-tratos a animais e outras infrações ambientais.',
      link: '/dashboard/citizen/incidents/new',
      dataAiHint: 'environmental problem'
    },
    {
      icon: PawPrint,
      title: 'Bem-Estar Animal',
      description: 'Encontre animais para adoção ou reporte animais perdidos e encontrados na comunidade.',
      link: '/animal-welfare/adoption',
      dataAiHint: 'happy pet'
    },
  ];

  return (
    <PublicLayout>
      <section className="py-16 md:py-24 bg-gradient-to-br from-background to-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Leaf size={64} className="text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Bem-vindo ao SEMEA Digital
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            Sua plataforma online para serviços e informações da Secretaria Municipal de Meio Ambiente de Varginha - MG.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild>
              <Link href="/dashboard/citizen">Acessar Serviços <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/info/urban-afforestation">Saber Mais</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Principais Serviços</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Adjusted to lg:grid-cols-3 */}
            {features.map((feature) => (
              <Card key={feature.title} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="items-center">
                  <feature.icon size={40} className="text-primary mb-2" />
                  <CardTitle className="text-center">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-muted-foreground text-sm mb-4 flex-grow">{feature.description}</p>
                  <Button variant="outline" className="w-full mt-auto" asChild>
                    <Link href={feature.link}>
                      Acessar <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Participe da Construção de uma Varginha Mais Verde!</h2>
              <p className="text-foreground/80 mb-4">
                Utilize nossos canais digitais para solicitar serviços, reportar problemas e se informar sobre as ações ambientais em nosso município. Sua participação é fundamental.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  'Facilidade no acesso aos serviços ambientais.',
                  'Transparência nas ações da secretaria.',
                  'Contribuição direta para um meio ambiente mais saudável.'
                ].map(item => (
                  <li key={item} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button size="lg" asChild>
                <Link href="/register">Crie sua Conta Agora</Link>
              </Button>
            </div>
            <div>
              <Image
                src="https://placehold.co/600x400.png"
                alt="Varginha Sustentável"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
                data-ai-hint="city nature"
              />
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

    