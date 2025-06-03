
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Lightbulb, BookOpen, CalendarCheck2, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const subSections = [
  { title: 'Projetos de Educação Ambiental', description: 'Conheça os projetos desenvolvidos pela SEMEA para escolas e comunidades.', href: '/info/education/projects', icon: Lightbulb, dataAiHint: 'environmental project' },
  { title: 'Palestras Temáticas', description: 'Solicite palestras sobre sustentabilidade, ODS e outros temas ambientais relevantes.', href: '/info/education/lectures', icon: BookOpen, dataAiHint: 'lecture presentation' },
  { title: 'Eventos Ambientais', description: 'Fique por dentro do nosso calendário de eventos, workshops e atividades especiais.', href: '/info/education/events', icon: CalendarCheck2, dataAiHint: 'community event' },
  { title: 'Como Participar', description: 'Saiba como sua instituição pode solicitar projetos e palestras da SEMEA.', href: '/info/education/how-to-participate', icon: Users, dataAiHint: 'community participation' },
];

export default function EnvironmentalEducationPage() {
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
            Explore nossas iniciativas e descubra como você e sua organização podem fazer parte desta transformação!
          </p>
        </div>
      </div>

      <h3 className="text-2xl font-semibold mb-6 text-center">Explore Nossas Seções</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {subSections.map((section) => (
          <Card key={section.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <CardHeader className="items-center text-center">
              <section.icon className="h-10 w-10 text-primary mb-3" />
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground text-center">{section.description}</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={section.href}>
                  Saber Mais <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
