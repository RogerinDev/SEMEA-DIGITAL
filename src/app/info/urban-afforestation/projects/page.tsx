import PublicLayout from '@/components/layouts/public-layout';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, ArrowRight, Phone } from 'lucide-react';
import Link from 'next/link';
import { arborizationProjects } from '@/lib/arborization-data';
import { Separator } from '@/components/ui/separator';

export default function ArborizationProjectsPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto py-12 px-4">
        <PageTitle
          title="Nossos Projetos de Arborização"
          icon={Award}
          description="Conheça as iniciativas do Programa Desenvolver para uma Varginha mais verde e sustentável."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {arborizationProjects.map((project) => (
            <Card key={project.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-primary">{project.title}</CardTitle>
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
          ))}
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
      </div>
    </PublicLayout>
  );
}
