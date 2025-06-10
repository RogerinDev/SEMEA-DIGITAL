
import PublicLayout from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Leaf, PawPrint, Recycle, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/logo';

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
      title: 'Denúncias Ambientais',
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
      <section
        className="relative py-16 md:py-24 bg-cover bg-center"
        style={{ backgroundImage: 'url(/hero-background.png)' }}
      >
        <div className="absolute inset-0 bg-black/60 z-0"></div> {/* Sobreposição escura */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/semea-hero-logo.png"
              alt="SEMEA Varginha Logo Principal"
              width={128}
              height={128}
              data-ai-hint="brand logo"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white"> {/* Cor do texto alterada */}
            Bem-vindo ao SEMEA Digital
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto"> {/* Cor do texto alterada */}
            Sua plataforma online para serviços e informações da Secretaria Municipal de Meio Ambiente de Varginha - MG.
          </p>
          <div className="space-x-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/dashboard/citizen">
                <span className="flex items-center">Acessar Serviços <ArrowRight className="ml-2 h-5 w-5" /></span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 hover:bg-white/10" asChild>
              <Link href="/info/sobre"><span className="text-black">Saber Mais</span></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">Nossos Principais Serviços</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              let iconColorClass = 'text-primary';
              if (feature.title === 'Denúncias Ambientais') { // Updated title check
                iconColorClass = 'text-accent';
              } else if (feature.title === 'Bem-Estar Animal') {
                iconColorClass = 'text-secondary';
              }
              return (
                <Card key={feature.title} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="items-center">
                    <feature.icon size={40} className={`${iconColorClass} mb-2`} />
                    <CardTitle className="text-center text-primary">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <p className="text-muted-foreground text-sm mb-4 flex-grow">{feature.description}</p>
                    <Button variant="outline" className="w-full mt-auto border-primary text-primary hover:bg-primary/10 hover:text-primary" asChild>
                      <Link href={feature.link}>
                        <span className="flex items-center justify-center">
                        Acessar <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary">Participe da Construção de uma Varginha Mais Verde!</h2>
              <p className="text-foreground/80 mb-4">
                Utilize nossos canais digitais para solicitar serviços, registrar denúncias e se informar sobre as ações ambientais em nosso município. Sua participação é fundamental.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  'Facilidade no acesso aos serviços ambientais.',
                  'Transparência nas ações da secretaria.',
                  'Contribuição direta para um meio ambiente mais saudável.'
                ].map(item => (
                  <li key={item} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">
                  <span className="flex items-center justify-center">Crie sua Conta Agora</span>
                </Link>
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
