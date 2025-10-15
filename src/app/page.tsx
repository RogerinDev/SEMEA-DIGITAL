
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
            <Button size="lg" asChild>
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

      <section className="bg-[#0a0f0a] text-white py-16 px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-400">Nossos Principais Serviços</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.title} className="bg-[#101810] rounded-xl p-8 text-center flex flex-col hover:shadow-lg hover:shadow-green-400/10 transition">
                <div className="flex-grow">
                  <div className="flex justify-center mb-4">
                    <Icon className="text-green-400 h-10 w-10" />
                  </div>
                  <h3 className="text-green-400 text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-300 text-sm mb-6">
                    {service.description}
                  </p>
                </div>
                <div className="mt-auto">
                    <Button asChild variant="outline" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black">
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
    </PublicLayout>
  );
}
