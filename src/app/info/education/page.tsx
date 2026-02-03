import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GraduationCap, Lightbulb, Recycle, Sprout, HeartHandshake, Mail, Phone, CalendarIcon, Newspaper } from 'lucide-react';
import { getEnvironmentalEducationSettings } from '@/app/actions/settings-actions';
import { getPosts } from '@/app/actions/posts-actions';
import { NewsGrid } from '@/components/news/news-grid';


export const dynamic = 'force-dynamic';

const projectIcons: { [key: string]: React.ElementType } = {
  'escola-verde': Lightbulb,
  'educacao-lixo-zero': Recycle,
  'botanica-no-parque': Sprout,
  'conexao-animal': HeartHandshake,
};

export default async function EnvironmentalEducationPage() {
  const settings = await getEnvironmentalEducationSettings();
  const posts = await getPosts({ sector: 'educacao_ambiental', limit: 3 });

  const activeProjects = settings.projects.filter(p => p.active);
  const contact = settings.team[0] || {};
  const contactInfo = settings.contactInfo;

  return (
    <>
      <PageTitle
        title="Programa Varginha Sustentável"
        icon={GraduationCap}
        description="Construir ações de Educação Ambiental de maneira contínua e integrada, fomentando a Sustentabilidade no Município de Varginha."
      />

      <section className="mb-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center items-center">
              <Image
                  src="/educacao-ambiental-missao.png"
                  alt="Logo do Programa Varginha Sustentável"
                  width={400}
                  height={400}
                  className="object-contain"
                  data-ai-hint="program logo"
                  priority
              />
          </div>
          <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">Nossa Missão</h2>
              <p className="text-muted-foreground">
                  O Programa Varginha Sustentável de Educação Ambiental visa engajar cidadãos, escolas e instituições na construção de um futuro mais verde e consciente. Através de projetos inovadores, palestras informativas e eventos participativos, buscamos semear o conhecimento e as práticas sustentáveis em toda a comunidade.
              </p>
              <p className="text-muted-foreground">
                  Explore nossos projetos e descubra como sua instituição pode solicitar uma ação educativa!
              </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Projetos Contínuos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeProjects.map((project) => {
            const Icon = projectIcons[project.slug] || Lightbulb;
            return (
                <Card key={project.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl text-primary">{project.title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                </CardContent>
                </Card>
            )
            })}
        </div>
      </section>

       <section className="my-12 text-center">
         <Button size="lg" asChild>
            <Link href="/info/education/how-to-participate">
                <CalendarIcon className="mr-2 h-5 w-5"/>
                Solicitar um Projeto ou Palestra
            </Link>
        </Button>
      </section>

      <Separator className="my-12" />
      
      <Card className="mb-12">
        <CardHeader>
            <CardTitle>Contato do Setor de Educação Ambiental</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <p><strong>{contact.role}:</strong> {contact.name}</p>
            <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>{contactInfo.phone}</span>
            </div>
             <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>{contactInfo.emails.join(' / ')}</span>
            </div>
        </CardContent>
    </Card>

    {posts.length > 0 && (
        <section className="bg-muted/50 py-12 -mx-4 px-4 mt-16 rounded-lg">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-primary flex items-center justify-center gap-3">
                        <Newspaper className="h-8 w-8"/>
                        Notícias do Setor
                    </h2>
                </div>
                <NewsGrid posts={posts} />
            </div>
        </section>
      )}
    </>
  );
}
