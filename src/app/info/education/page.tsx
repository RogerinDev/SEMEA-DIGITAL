
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GraduationCap, Lightbulb, Recycle, Sprout, HeartHandshake, Mail, Phone, CalendarIcon, Send, Loader2 } from 'lucide-react';

const projects = [
  { id: 'escola-verde', title: 'Escola Verde - Educação Climática', description: 'Destaca a importância das árvores e amplia a arborização nas escolas.', audience: 'Infantil ao Médio', icon: Lightbulb },
  { id: 'educacao-lixo-zero', title: 'Educação Lixo Zero', description: 'Capacitação sobre descarte correto e consumo consciente.', audience: 'Educadores e Lideranças', icon: Recycle },
  { id: 'botanica-no-parque', title: 'Botânica no Parque', description: 'Aulas práticas nos Parques Novo Horizonte ou Centenário com identificação de árvores. Duração de 2h.', audience: 'Fundamental e Médio', icon: Sprout },
  { id: 'conexao-animal', title: 'Conexão Animal', description: 'Estimula boas práticas de bem-estar animal, adoção e convivência com animais silvestres.', audience: 'Todos', icon: HeartHandshake },
];

const lectures = [
  { id: 'importancia-arvores', label: 'A Importância das Árvores' },
  { id: 'historia-lixo', label: 'História do Lixo' },
  { id: 'bichos-mato-mata', label: 'Bichos do Mato e da Mata' },
  { id: 'bichos-lixo', label: 'Os Bichos e o Lixo' },
  { id: 'cuidar-animais', label: 'Como cuidar dos animais de estimação' },
  { id: 'lixo-luxo', label: 'O Lixo que é Luxo' },
  { id: 'bicho-chama-bicho', label: 'Bicho que chama Bicho (Contação de Estória)' },
  { id: 'panorama-varginha', label: 'Panorama Ambiental de Varginha' },
  { id: 'ods', label: 'ODS (Temas Diversos)' },
];


export default function EnvironmentalEducationPage() {
  
  return (
    <>
      <PageTitle
        title="Programa Varginha Sustentável"
        icon={GraduationCap}
        description="Construir ações de Educação Ambiental de maneira contínua e integrada, fomentando a Sustentabilidade no Município de Varginha."
      />

      <section className="mb-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center items-center">
              <Image
                  src="/educacao-ambiental-missao.png"
                  alt="Logo do Programa Varginha Sustentável"
                  width={400}
                  height={400}
                  className="object-contain"
                  data-ai-hint="program logo"
                  priority
              />
          </div>
          <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">Nossa Missão</h2>
              <p className="text-muted-foreground">
                  O Programa Varginha Sustentável de Educação Ambiental visa engajar cidadãos, escolas e instituições na construção de um futuro mais verde e consciente. Através de projetos inovadores, palestras informativas e eventos participativos, buscamos semear o conhecimento e as práticas sustentáveis em toda a comunidade.
              </p>
              <p className="text-muted-foreground">
                  Explore nossos projetos e descubra como sua instituição pode solicitar uma ação educativa!
              </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Projetos Contínuos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <project.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="text-xl text-primary">{project.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <p className="text-sm text-muted-foreground">{project.description}</p>
                <p className="text-xs font-semibold text-foreground">Público-Alvo: <span className="font-normal text-muted-foreground">{project.audience}</span></p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-12" />

      <div className="mb-8">
            <Card>
                <CardHeader>
                    <CardTitle>Cardápio de Palestras e Temas (ODS)</CardTitle>
                    <CardDescription>Palestras disponíveis que podem ser solicitadas no formulário de agendamento.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-muted-foreground">
                        {lectures.map((lecture) => (
                        <li key={lecture.id} className="flex items-center">
                            <GraduationCap className="h-4 w-4 mr-2 text-primary/70" />
                            {lecture.label}
                        </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>

       <section className="my-12 text-center">
         <Button size="lg" asChild>
            <Link href="/info/education/how-to-participate">
                <CalendarIcon className="mr-2 h-5 w-5"/>
                Solicitar um Projeto ou Palestra
            </Link>
        </Button>
      </section>

      <Separator className="my-12" />
      
      <Card>
        <CardHeader>
            <CardTitle>Contato do Setor de Educação Ambiental</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <p><strong>Bióloga:</strong> Jaara Alvarenga Cardoso Tavares</p>
            <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>(35) 3690-2529</span>
            </div>
             <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>(35) 8429-9795 (WhatsApp)</span>
            </div>
        </CardContent>
    </Card>
    </>
  );
}
