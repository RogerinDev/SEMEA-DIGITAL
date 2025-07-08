import PublicLayout from '@/components/layouts/public-layout';
import { PageTitle } from '@/components/page-title';
import { arborizationProjects } from '@/lib/arborization-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Target, Info, Check, Phone, Send } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  return arborizationProjects
    .filter(p => p.detailsPage)
    .map((project) => ({
      slug: project.slug,
    }));
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = arborizationProjects.find((p) => p.slug === params.slug);

  if (!project) {
    return (
        <PublicLayout>
            <div className="container mx-auto py-12 px-4 text-center">
                <PageTitle title="Projeto Não Encontrado" />
                <p className="mb-4">O projeto que você está procurando não foi encontrado.</p>
                <Button asChild>
                    <Link href="/info/urban-afforestation/projects">
                    <span className="flex items-center">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Projetos
                    </span>
                    </Link>
                </Button>
            </div>
        </PublicLayout>
    );
  }

  const ctaButton = project.cta ? (
      <Button asChild size="lg">
          <Link href={project.cta.link} target={project.cta.type === 'whatsapp' || project.cta.type === 'external' ? '_blank' : '_self'}>
              <span className="flex items-center">
                  {project.cta.type === 'whatsapp' ? <Send className="mr-2 h-5 w-5"/> : <Check className="mr-2 h-5 w-5"/>}
                  {project.cta.text}
              </span>
          </Link>
      </Button>
  ) : (
       <Button asChild>
            <Link href="/info/urban-afforestation/contact">
                <span className="flex items-center">
                    <Phone className="mr-2 h-5 w-5"/>
                    Entrar em Contato
                </span>
            </Link>
        </Button>
  );

  return (
    <PublicLayout>
        <div className="container mx-auto py-12 px-4">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" asChild>
                <Link href="/info/urban-afforestation/projects">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                </Button>
                <PageTitle title={project.title} className="mb-0 flex-grow" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center"><Target className="mr-2 h-5 w-5 text-primary"/>Objetivo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{project.objective}</p>
                        </CardContent>
                    </Card>

                    {project.howToParticipate && (
                        <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center"><Info className="mr-2 h-5 w-5 text-primary"/>Como Participar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-wrap">{project.howToParticipate}</p>
                        </CardContent>
                        </Card>
                    )}
                </div>

                <div className="md:col-span-1 space-y-6">
                    <Card className="shadow-lg bg-secondary/30">
                        <CardHeader>
                            <CardTitle>Participe Agora!</CardTitle>
                            <CardDescription>
                                {project.cta ? "Clique no botão abaixo para participar ou saber mais." : "Entre em contato com a SEMEA para participar deste projeto."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {ctaButton}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </PublicLayout>
  );
}
