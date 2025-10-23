
"use client";

import PublicLayout from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, TreePine, Recycle, PawPrint, GraduationCap, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function HomePage() {
  const { currentUser } = useAuth();
  
  const services = [
    {
      icon: TreePine,
      title: 'Arborização Urbana',
      description: 'Solicite podas, remoção de árvores em risco e plantio de novas mudas. Cuidamos do verde da nossa cidade para um ambiente mais saudável e agradável para todos.',
      link: '/info/urban-afforestation',
      buttonText: 'Acessar Serviços',
    },
    {
      icon: Recycle,
      title: 'Gestão de Resíduos',
      description: 'Informe-se sobre a coleta seletiva, descarte corretamente seus resíduos e denuncie o descarte irregular. Juntos, mantemos nossa cidade limpa e sustentável.',
      link: '/info/waste-management',
      buttonText: 'Ver Coletas',
    },
    {
      icon: PawPrint,
      title: 'Bem-Estar Animal',
      description: 'Encontre um amigo para adoção, solicite castração gratuita de cães e gatos e ajude a reportar casos de maus-tratos.',
      link: '/animal-welfare',
      buttonText: 'Conhecer',
    },
    {
      icon: GraduationCap,
      title: 'Educação Ambiental',
      description: 'Participe de palestras, oficinas e projetos de conscientização. Aprenda práticas sustentáveis e ajude a construir um futuro mais verde.',
      link: '/info/education',
      buttonText: 'Saiba Mais',
    },
  ];

  const benefits = [
    "Facilidade no acesso aos serviços ambientais.",
    "Transparência nas ações da secretaria.",
    "Contribuição direta para um meio ambiente mais saudável."
  ];

  return (
    <PublicLayout>
      <section
        className="relative py-20 md:py-32 bg-cover bg-center"
        style={{ backgroundImage: 'url(/hero-background.png)' }}
      >
        <div className="absolute inset-0 bg-black/70 z-0"></div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="flex justify-center mb-6">
            <Image
              src="/semea-hero-logo.png?v=2"
              alt="SEMEA Varginha Logo"
              width={140}
              height={140}
              priority
              data-ai-hint="brand logo semea"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Bem-vindo à SEMEA Digital
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Sua plataforma online para serviços e informações da Secretaria Municipal de Meio Ambiente de Varginha - MG.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href={currentUser ? "/dashboard/citizen" : "/register"}>
                <span className="flex items-center">Acessar Serviços <ArrowRight className="ml-2 h-5 w-5" /></span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 text-white hover:bg-white/20 dark:hover:bg-white/10 dark:text-white" asChild>
              <Link href="/info/sobre"><span>Saber Mais</span></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-background text-foreground py-16 px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary">Nossos Principais Serviços</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.title} className="bg-card rounded-xl p-8 text-center flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex-grow">
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-xl">
                      <Icon className="text-primary h-10 w-10" />
                    </div>
                  </div>
                  <h3 className="text-primary text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {service.description}
                  </p>
                </div>
                <div className="mt-auto">
                    <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                        <Link href={service.link}>
                            {service.buttonText} <span className="ml-2">→</span>
                        </Link>
                    </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {!currentUser && (
        <section className="bg-muted/50 py-16 px-6">
          <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-primary">
                Participe da Construção de uma Varginha Mais Verde!
              </h2>
              <p className="text-muted-foreground">
                Utilize nossos canais digitais para solicitar serviços, registrar denúncias e se informar sobre as ações ambientais em nosso município. Sua participação é fundamental.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Button size="lg" asChild>
                  <Link href="/register">Crie sua Conta Agora</Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-square md:aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
              <Image 
                src="/varginha-verde.png" 
                alt="Participe da Construção de uma Varginha mais verde!" 
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
