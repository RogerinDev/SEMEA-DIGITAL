
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, ArrowRight, Phone, Sprout, Recycle, Leaf, ShieldCheck, Gavel, ClipboardList, Baby } from 'lucide-react';
import Link from 'next/link';
import { arborizationProjects } from '@/lib/arborization-data';
import { Separator } from '@/components/ui/separator';
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


export default function ArborizationProjectsPage() {
  return (
    <>
      <PageTitle
        title="Nossos Projetos de Arborização"
        icon={Award}
        description="Conheça as iniciativas do Programa Desenvolver para uma Varginha mais verde e sustentável."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {arborizationProjects.map((project) => {
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
                <p className="text-sm text-muted-foreground line-clamp-4">{project.objective}</p>
              </CardContent>
              <CardFooter>
                {project.detailsPage ? (
                  <Button asChild className="w-full">
                    <Link href={`/info/urban-afforestation/projects/${project.slug}`}>
                      <span className="flex items-center justify-center">
                        Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </Link>
                  </Button>
                ) : (
                    <Button variant="secondary" className="w-full">
                      Mais informações em breve
                    </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <Separator className="my-12"/>

      <Card className="mt-12 bg-secondary/30">
          <CardHeader>
              <CardTitle className="flex items-center"><Phone className="mr-3"/>Fale Conosco</CardTitle>
          </CardHeader>
          <CardContent>
              <p className="text-muted-foreground mb-4">Tem dúvidas sobre algum projeto ou quer sugerir uma área para plantio? Entre em contato com o setor de arborização.</p>
              <Button asChild>
                  <Link href="/info/urban-afforestation/contact">Ver Contatos</Link>
              </Button>
          </CardContent>
    </Card>
    </>
  );
}
