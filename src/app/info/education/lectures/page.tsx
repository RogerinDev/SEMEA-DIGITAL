
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, Users } from 'lucide-react';
import Link from 'next/link';
import { thematicLectures } from '@/lib/education-data';

export default function ThematicLecturesPage() {
  const odsLectures = thematicLectures.filter(l => l.category === 'ODS');
  const projectLectures = thematicLectures.filter(l => l.category === 'Projetos');
  const otherLectures = thematicLectures.filter(l => !l.category);

  return (
    <>
      <PageTitle
        title="Palestras Temáticas"
        icon={BookOpen}
        description="A SEMEA oferece um conjunto de palestras temáticas sobre os Objetivos de Desenvolvimento Sustentável (ODS) e outros temas relevantes, adaptadas conforme a faixa etária do público."
      />
      
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle>Sobre Nossas Palestras</CardTitle>
          <CardDescription>
            Nossas palestras são desenvolvidas para informar e engajar diversos públicos sobre a importância da sustentabilidade e do cuidado com o meio ambiente. 
            Elas podem ser adaptadas para diferentes faixas etárias e contextos, desde escolas até empresas e comunidades.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground mb-4">
                Além das palestras associadas diretamente aos nossos <Link href="/info/education/projects" className="text-primary hover:underline">projetos educacionais</Link>, 
                oferecemos uma gama de apresentações focadas nos Objetivos de Desenvolvimento Sustentável (ODS) e outros temas cruciais para a conscientização ambiental.
            </p>
            <Button asChild>
                <Link href="/info/education/how-to-participate">
                  <span className="flex items-center">
                    <Users className="mr-2 h-4 w-4" /> Solicitar Palestra
                  </span>
                </Link>
            </Button>
        </CardContent>
      </Card>

      <Accordion type="multiple" className="w-full space-y-4">
        {odsLectures.length > 0 && (
          <AccordionItem value="ods-lectures" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="bg-muted/50 px-6 py-4 text-lg font-semibold hover:bg-muted">
              Palestras sobre os Objetivos de Desenvolvimento Sustentável (ODS)
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
              <ul className="space-y-3">
                {odsLectures.map((lecture) => (
                  <li key={lecture.id} className="flex items-center p-3 bg-card rounded-md shadow-sm">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 shrink-0" />
                    <span className="text-foreground">{lecture.title}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}

        {projectLectures.length > 0 && (
            <AccordionItem value="project-lectures" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="bg-muted/50 px-6 py-4 text-lg font-semibold hover:bg-muted">
                Palestras Vinculadas aos Projetos Educacionais
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
                <p className="text-sm text-muted-foreground mb-4">Estas palestras são parte integrante de nossos projetos, mas também podem ser solicitadas individualmente.</p>
                <ul className="space-y-3">
                {projectLectures.map((lecture) => (
                    <li key={lecture.id} className="flex items-center p-3 bg-card rounded-md shadow-sm">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 shrink-0" />
                    <span className="text-foreground">{lecture.title}</span>
                    </li>
                ))}
                </ul>
            </AccordionContent>
            </AccordionItem>
        )}

        {otherLectures.length > 0 && (
            <AccordionItem value="other-lectures" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="bg-muted/50 px-6 py-4 text-lg font-semibold hover:bg-muted">
                Outras Palestras Temáticas
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
                <ul className="space-y-3">
                {otherLectures.map((lecture) => (
                    <li key={lecture.id} className="flex items-center p-3 bg-card rounded-md shadow-sm">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 shrink-0" />
                    <span className="text-foreground">{lecture.title}</span>
                    </li>
                ))}
                </ul>
            </AccordionContent>
            </AccordionItem>
        )}
      </Accordion>
      {thematicLectures.length === 0 && (
        <div className="text-center py-12">
            <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma palestra temática disponível no momento</h3>
            <p className="text-muted-foreground">Consulte novamente em breve ou entre em contato para mais informações.</p>
        </div>
      )}
    </>
  );
}
