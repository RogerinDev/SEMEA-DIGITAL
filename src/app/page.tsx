
import PublicLayout from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, TreePine, Recycle, PawPrint, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export default function HomePage() {
  const services = [
    {
      icon: TreePine,
      title: 'Arborização Urbana',
      description: 'Solicite podas, remoção de árvores em risco e plantio de novas mudas. Cuidamos do verde da nossa cidade para um ambiente mais saudável e agradável para todos.',
      link: '/info/urban-afforestation',
      buttonLabel: 'Acessar Serviços',
      iconColorClass: 'text-primary',
    },
    {
      icon: Recycle,
      title: 'Gestão de Resíduos',
      description: 'Informe-se sobre a coleta seletiva, descarte corretamente seus resíduos e denuncie o descarte irregular. Juntos, mantemos nossa cidade limpa e sustentável.',
      link: '/info/waste-management',
      buttonLabel: 'Ver Coletas',
      iconColorClass: 'text-primary',
    },
    {
      icon: PawPrint,
      title: 'Bem-Estar Animal',
      description: 'Encontre um amigo para adoção, solicite a castração gratuita de cães e gatos, e ajude a reportar animais perdidos ou casos de maus-tratos.',
      link: '/animal-welfare',
      buttonLabel: 'Conhecer',
      iconColorClass: 'text-primary',
    },
    {
      icon: GraduationCap,
      title: 'Educação Ambiental',
      description: 'Participe de nossas palestras, oficinas e projetos de conscientização. Aprenda sobre práticas sustentáveis e ajude a construir um futuro mais verde para nossa comunidade.',
      link: '/info/education',
      buttonLabel: 'Saiba Mais',
      iconColorClass: 'text-primary',
    },
  ];

  return (
    <PublicLayout>
      <section
        className="relative py-16 md:py-24 bg-cover bg-center"
        style={{ backgroundImage: 'url(/hero-principal-semea.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/60 z-0"></div>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Bem-vindo ao SEMEA Digital
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Sua plataforma online para serviços e informações da Secretaria Municipal de Meio Ambiente de Varginha - MG.
          </p>
          <div className="space-x-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/dashboard/citizen">
                <span className="flex items-center">Acessar Serviços <ArrowRight className="ml-2 h-5 w-5" /></span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 text-black hover:bg-white/10" asChild>
              <Link href="/info/sobre"><span>Saber Mais</span></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">Nossos Principais Serviços</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
                <Card key={service.title} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
                  <CardHeader className="items-center">
                    <service.icon size={40} className={`${service.iconColorClass} mb-2`} />
                    <CardTitle className="text-center text-primary">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <p className="text-muted-foreground text-sm mb-4 flex-grow">{service.description}</p>
                    <Button variant="outline" className="w-full mt-auto border-primary text-primary hover:bg-primary/10 hover:text-primary" asChild>
                      <Link href={service.link}>
                        <span className="flex items-center justify-center">
                          {service.buttonLabel} <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
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
                    <span className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2" />
                      {item}
                    </span>
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
