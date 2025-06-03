
import { PageTitle } from '@/components/page-title';
import { educationalProjects } from '@/lib/education-data';
import { GENERAL_SEMEA_FOCUS_NOTE } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Users, Target, BookOpen, Settings, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export async function generateStaticParams() {
  return educationalProjects.map((project) => ({
    slug: project.slug,
  }));
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = educationalProjects.find((p) => p.slug === params.slug);

  if (!project) {
    return (
        <div className="container mx-auto py-12 px-4 text-center">
            <PageTitle title="Projeto Não Encontrado" />
            <p className="mb-4">O projeto que você está procurando não foi encontrado.</p>
            <Button asChild>
                <Link href="/info/education/projects">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Projetos
                </Link>
            </Button>
        </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/info/education/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageTitle title={project.title} className="mb-0 flex-grow" />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Sobre o Projeto</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="relative aspect-video mb-6 rounded-lg overflow-hidden">
                    <Image src={project.imageUrl} alt={project.title} layout="fill" objectFit="cover" data-ai-hint={project.dataAiHint} />
                </div>
                <p className="text-muted-foreground whitespace-pre-wrap">{project.introduction}</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><Target className="mr-2 h-5 w-5 text-primary"/>Objetivos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {project.objectives.map((obj, index) => (
                  <li key={index}>{obj}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {project.methodology && project.methodology.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center"><Settings className="mr-2 h-5 w-5 text-primary"/>Metodologia e Ações</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  {project.methodology.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/>Público-Alvo</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{project.targetAudience}</p>
            </CardContent>
          </Card>

          {project.associatedLectures && project.associatedLectures.length > 0 && (
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><BookOpen className="mr-2 h-5 w-5 text-primary"/>Palestras Associadas</CardTitle>
                    <CardDescription>Disponíveis mediante solicitação</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                        {project.associatedLectures.map((lecture, index) =>(
                            <li key={index} className="flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2 text-primary/70"/> {lecture}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
          )}
          {project.duration && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><Clock className="mr-2 h-5 w-5 text-primary"/>Duração Prevista</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{project.duration}</p>
                </CardContent>
            </Card>
          )}
          {project.observations && project.observations.length > 0 && (
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><AlertTriangle className="mr-2 h-5 w-5 text-primary"/>Observações</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        {project.observations.map((obs, index) =>(
                            <li key={index}>{obs}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
          )}
        </div>
      </div>
      {project.generalNote && (
        <Card className="mt-8 bg-secondary/30">
            <CardHeader>
                <CardTitle>Nota Geral da SEMEA</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{GENERAL_SEMEA_FOCUS_NOTE}</p>
            </CardContent>
        </Card>
      )}
      <div className="mt-8 text-center">
        <Button asChild>
            <Link href="/info/education/how-to-participate">
                Saiba Como Participar
            </Link>
        </Button>
      </div>
    </>
  );
}
