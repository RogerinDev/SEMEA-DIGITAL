
"use client";

import React, { useState, useRef } from 'react';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GraduationCap, Lightbulb, Recycle, Sprout, HeartHandshake, ArrowRight, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import { EducationBookingForm } from '@/components/info/education-booking-form';
import type { EducationalProject as EducationalProjectType } from '@/types';
import { educationalProjects } from '@/lib/education-data';

const mainProjects: EducationalProjectType[] = educationalProjects.slice(0, 4); // Assuming first 4 are the main ones

const projectIcons: { [key: string]: React.ElementType } = {
  'escola-verde-educacao-climatica': Lightbulb,
  'educacao-lixo-zero': Recycle,
  'botanica-no-parque': Sprout,
  'conexao-animal': HeartHandshake,
};

export default function EnvironmentalEducationPage() {
  const [selectedProjectForForm, setSelectedProjectForForm] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleScheduleProjectClick = (projectName: string) => {
    setSelectedProjectForForm(projectName);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100); // Short delay to ensure state update before scroll
  };
  
  const getProjectSpecificNote = (slug: string): string | null => {
    if (slug === 'botanica-no-parque') {
      const project = educationalProjects.find(p => p.slug === 'botanica-no-parque');
      if (project) {
        let note = "Metodologia: ";
        if (project.methodology && project.methodology.length > 0) {
          note += project.methodology.join(' ');
        }
        if (project.duration) {
          note += ` Duração: ${project.duration}.`;
        }
        if (project.observations && project.observations.length > 0) {
           note += ` ${project.observations.join(' ')}`;
        }
        return note.replace("SEMEA não oferece transporte até os parques.", "Transporte não incluso.");

      }
    }
    return null;
  }

  return (
    <>
      <PageTitle
        title="Programa Varginha Sustentável de Educação Ambiental"
        icon={GraduationCap}
        description="Construir ações de Educação Ambiental de maneira contínua e integrada, fomentando a Sustentabilidade no Município de Varginha."
      />
      <div className="grid md:grid-cols-2 gap-8 mb-12 items-center">
        <div>
            <Image
                src="https://placehold.co/600x400.png"
                alt="Educação Ambiental em Varginha"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
                data-ai-hint="environmental education"
            />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary">Nossa Missão</h2>
          <p className="text-lg text-muted-foreground">
            O Programa Varginha Sustentável de Educação Ambiental visa engajar cidadãos, escolas e instituições na construção de um futuro mais verde e consciente. Através de projetos inovadores, palestras informativas e eventos participativos, buscamos semear o conhecimento e as práticas sustentáveis em toda a comunidade.
          </p>
          <p className="text-muted-foreground">
            Explore nossos projetos e descubra como sua instituição pode solicitar uma ação educativa!
          </p>
        </div>
      </div>

      <Separator className="my-12" />

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-2 text-primary">Conheça os Projetos do Programa Varginha Sustentável</h2>
        <p className="text-center text-muted-foreground mb-10">Clique em "Quero Agendar este Projeto" para solicitar uma ação para sua instituição.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mainProjects.map((project) => {
            const Icon = projectIcons[project.slug] || Lightbulb;
            const specificNote = getProjectSpecificNote(project.slug);
            return (
            <Card key={project.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl text-primary">{project.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <div>
                    <h4 className="font-semibold text-foreground mb-1">Objetivos:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
                        {project.objectives.map((obj, index) => <li key={index}>{obj}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-foreground mb-1">Público-Alvo:</h4>
                    <p className="text-sm text-muted-foreground">{project.targetAudience}</p>
                </div>
                {project.associatedLectures && project.associatedLectures.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-foreground mb-1">Palestras Associadas:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
                            {project.associatedLectures.map((lecture, index) => <li key={index}>{lecture}</li>)}
                        </ul>
                    </div>
                )}
                {specificNote && (
                     <div>
                        <h4 className="font-semibold text-foreground mb-1">Observação:</h4>
                        <p className="text-sm text-muted-foreground">{specificNote}</p>
                    </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleScheduleProjectClick(project.title)}>
                    <span className="flex items-center">Quero Agendar este Projeto <ArrowRight className="ml-2 h-4 w-4"/></span>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
        </div>
      </section>

      <Separator className="my-12" />
      
      <section ref={formRef} className="mb-16 scroll-mt-20">
        <h2 className="text-3xl font-bold text-center mb-10 text-primary">Faça seu Agendamento</h2>
        <Card className="max-w-3xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>Formulário de Solicitação de Ação Educativa</CardTitle>
                <CardDescription>Preencha os campos abaixo para solicitar um projeto ou palestra para sua instituição. Entraremos em contato para confirmar o agendamento.</CardDescription>
            </CardHeader>
            <CardContent>
                <EducationBookingForm preselectedProject={selectedProjectForForm} />
            </CardContent>
        </Card>
      </section>

      <Separator className="my-12" />

      <section className="text-center">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Dúvidas ou mais informações?</h2>
        <Card className="max-w-md mx-auto bg-muted/50 p-6">
            <p className="font-semibold">Contato: Bióloga Jaara Alvarenga Cardoso Tavares</p>
            <div className="flex items-center justify-center gap-2 mt-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href="mailto:jaara.cardoso@varginha.mg.gov.br" className="hover:text-primary">jaara.cardoso@varginha.mg.gov.br</a>
            </div>
            <div className="flex items-center justify-center gap-2 mt-1 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>(35) 3690-2529</span>
            </div>
        </Card>
      </section>
    </>
  );
}
