
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TreePine, Sprout, ArrowRight, CheckCircle, ClipboardList, FileText, Phone, Award } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

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
  
  const sections = [
    {
      title: 'Nossos Projetos',
      description: 'Conheça as iniciativas do Programa Desenvolver, do plantio de mudas à criação de pomares urbanos.',
      link: '/info/urban-afforestation/projects',
      icon: Award
    },
    {
      title: 'Serviços de Arborização',
      description: 'Solicite poda ou corte de árvores, e saiba como submeter projetos para análise técnica.',
      link: '/info/urban-afforestation/services',
      icon: ClipboardList
    },
    {
      title: 'Legislação Ambiental',
      description: 'Acesse as resoluções, leis e normas que orientam a arborização urbana em Varginha.',
      link: '/info/urban-afforestation/legislation',
      icon: FileText
    },
    {
      title: 'Fale com o Setor',
      description: 'Entre em contato com a equipe de engenheiros e técnicos para dúvidas e agendamentos.',
      link: '/info/urban-afforestation/contact',
      icon: Phone
    },
  ];

  return (
    <>
      <PageTitle title="Arborização Urbana - Programa Desenvolver" icon={TreePine} description="Este setor é o responsável pelo gerenciamento da arborização de Varginha, compreendendo o planejamento e execução de programas, emissão de autorizações para poda/corte e vistorias, visando a proteção ambiental e a qualidade da arborização urbana." />

      <div className="grid md:grid-cols-2 gap-8 mb-12 items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-primary">Por que a Arborização Urbana é Importante?</h2>
          <p className="text-muted-foreground mb-6">
            As árvores desempenham um papel crucial no ambiente urbano, trazendo inúmeros benefícios para a qualidade de vida dos cidadãos e para o equilíbrio ecológico da cidade.
          </p>
          <ul className="space-y-2 mb-6">
            {benefits.map(benefit => (
              <li key={benefit} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                <span className="text-foreground">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
            <Image src="/arborizacao-urbana-importancia.png" data-ai-hint="city trees" alt="Parque urbano com árvores" layout="fill" objectFit="cover" priority />
        </div>
      </div>
      
      <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary">Explore Nossos Recursos</h2>
          <p className="text-muted-foreground mt-2">Navegue pelas seções para encontrar o que precisa.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="flex flex-col text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="items-center">
                <Icon className="h-10 w-10 text-primary mb-3"/>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button asChild className="w-full">
                  <Link href={section.link}>
                    <span className="flex items-center">Acessar <ArrowRight className="ml-2 h-4 w-4"/></span>
                  </Link>
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </>
  );
}
