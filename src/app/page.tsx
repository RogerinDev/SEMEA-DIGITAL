
"use client";

import PublicLayout from '@/components/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, TreePine, Recycle, PawPrint, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function HomePage() {
  const { currentUser } = useAuth();
  
  const services = [
    {
      icon: TreePine,
      title: 'Arborização Urbana',
      description: 'Solicite podas, remoção de árvores em risco e plantio de novas mudas.',
      link: '/info/urban-afforestation',
    },
    {
      icon: Recycle,
      title: 'Gestão de Resíduos',
      description: 'Informe-se sobre a coleta seletiva e o descarte correto de resíduos.',
      link: '/info/waste-management',
    },
    {
      icon: PawPrint,
      title: 'Bem-Estar Animal',
      description: 'Encontre um amigo para adoção, solicite castração e ajude animais perdidos.',
      link: '/animal-welfare',
    },
    {
      icon: GraduationCap,
      title: 'Educação Ambiental',
      description: 'Participe de palestras, oficinas e projetos de conscientização.',
      link: '/info/education',
    },
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
            <Button size="lg" variant="primary" asChild>
              <Link href="/dashboard/citizen">
                <span className="flex items-center">Acessar Serviços <ArrowRight className="ml-2 h-5 w-5" /></span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 text-white hover:bg-white/10" asChild>
              <Link href="/info/sobre"><span>Saber Mais</span></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">Nossos Principais Serviços</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
                <Card key={service.title} className="flex flex-col text-center items-center shadow-lg hover:shadow-primary/20 hover:-translate-y-2 transition-transform duration-300 bg-card">
                  <CardHeader>
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <service.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </CardContent>
                  <div className="p-6 pt-0 w-full">
                    <Button variant="link" className="text-primary" asChild>
                      <Link href={service.link}>
                        <span className="flex items-center">
                          Saiba Mais <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
