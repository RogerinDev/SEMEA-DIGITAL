
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, ArrowRight, Award, Recycle, Leaf, ShieldCheck, Gavel, Baby, Phone, Sprout, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { getUrbanAfforestationSettings } from '@/app/actions/settings-actions';
import { notFound } from 'next/navigation';
import React from 'react';

const projectIcons: { [key: string]: React.ElementType } = {
  'plantar': Sprout,
  'regenerar': Recycle,
  'pomar-urbano': Leaf,
  'cuidar': ShieldCheck,
  'normatizar': Gavel,
  'fito-inventariar': ClipboardList,
  'tele-arvore': Phone,
  'nasce-uma-crianca-plante-uma-arvore': Baby,
};


export default async function ArborizationProjectsPage() {
    const settings = await getUrbanAfforestationSettings();

    if (!settings) {
        return <div className="container mx-auto py-12 px-4 text-center">Conteúdo de Arborização Urbana não encontrado.</div>
    }

    const activeProjects = settings.projects.filter(p => p.active);

  return (
    <>
      <PageTitle
        title="Projetos de Arborização Urbana"
        icon={Lightbulb}
        description="Conheça as iniciativas do Programa Desenvolver para uma Varginha mais verde e sustentável."
      />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {activeProjects.map((project) => {
            const Icon = projectIcons[project.slug] || Award;
            return (
                <Card key={project.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                    <div className="flex items-start gap-3">
                        <Icon className="h-8 w-8 text-primary shrink-0 mt-1" />
                        <CardTitle className="text-xl text-primary">{project.title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-4">{project.description}</p>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href={`/info/urban-afforestation/projects/${project.slug}`}>
                        <span className="flex items-center justify-center">
                            Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                        </Link>
                    </Button>
                </CardFooter>
                </Card>
            )
            })}
        </div>

      {activeProjects.length === 0 && (
        <div className="text-center py-12">
            <Lightbulb className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum projeto disponível no momento</h3>
            <p className="text-muted-foreground">Volte em breve para conferir nossos projetos.</p>
        </div>
      )}
    </>
  );
}
