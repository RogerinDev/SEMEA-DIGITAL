
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { educationalProjects } from '@/lib/education-data';
import { GENERAL_SEMEA_FOCUS_NOTE } from '@/types';

export default function EducationProjectsPage() {
  return (
    <>
      <PageTitle
        title="Projetos de Educação Ambiental"
        icon={Lightbulb}
        description="Conheça os projetos desenvolvidos pela SEMEA para engajar escolas, comunidades e empresas na construção de um futuro mais sustentável."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {educationalProjects.map((project) => (
          <Card key={project.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative aspect-video">
              <Image
                src={project.imageUrl}
                alt={project.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
                data-ai-hint={project.dataAiHint}
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{project.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-3">{project.introduction}</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/info/education/projects/${project.slug}`}>
                  Ver Detalhes do Projeto <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {educationalProjects.length === 0 && (
        <div className="text-center py-12">
            <Lightbulb className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum projeto disponível no momento</h3>
            <p className="text-muted-foreground">Volte em breve para conferir nossos projetos educativos.</p>
        </div>
      )}

      <Card className="mt-12 bg-secondary/30">
        <CardHeader>
            <CardTitle>Foco Abrangente da SEMEA</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{GENERAL_SEMEA_FOCUS_NOTE}</p>
        </CardContent>
      </Card>
    </>
  );
}
