
import { PageTitle } from '@/components/page-title';
import { getUrbanAfforestationSettings } from '@/app/actions/settings-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Target, Info, Check, Phone, Send } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { notFound } from 'next/navigation';

// Gera os parâmetros estáticos para as páginas de projeto com base nos dados do Firestore.
export async function generateStaticParams() {
  const settings = await getUrbanAfforestationSettings();
  if (!settings || !settings.projects) {
    return [];
  }
  
  // Mapeia apenas os projetos ativos que têm um slug.
  return settings.projects
    .filter(p => p.active && p.slug)
    .map((project) => ({
      slug: project.slug,
    }));
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const settings = await getUrbanAfforestationSettings();
  
  // Encontra o projeto com base no slug da URL.
  const project = settings.projects.find((p) => p.slug === params.slug);

  // Se o projeto não for encontrado, exibe a página 404.
  if (!project) {
    notFound();
  }

  return (
    <>
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
                        <CardTitle className="flex items-center"><Target className="mr-2 h-5 w-5 text-primary"/>Sobre o Projeto</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Exibe a descrição vinda do Firestore */}
                        <p className="text-muted-foreground whitespace-pre-wrap">{project.description}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="md:col-span-1 space-y-6">
                <Card className="shadow-lg bg-secondary/30">
                    <CardHeader>
                        <CardTitle>Participe Agora!</CardTitle>
                        <CardDescription>
                            Entre em contato com a SEMEA para participar deste projeto.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Botão de CTA padrão */}
                        <Button asChild>
                            <Link href="/info/urban-afforestation/contact">
                                <span className="flex items-center">
                                    <Phone className="mr-2 h-5 w-5"/>
                                    Entrar em Contato
                                </span>
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </>
  );
}
