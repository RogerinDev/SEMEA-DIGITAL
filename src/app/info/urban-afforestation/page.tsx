
import PublicLayout from '@/components/layouts/public-layout';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TreePine, Sprout, ArrowRight, CheckCircle, Recycle, Grape, HandHeart, FileText, ClipboardList, Smartphone, Baby } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const arborizationProjects = [
  {
    id: 'plantar',
    icon: Sprout,
    title: 'PLANTAR',
    description: 'Plantio de árvores nativas e exóticas em praças e vias públicas.',
    buttonText: 'Saiba Mais',
    isFeatured: false,
    linkHref: '#',
  },
  {
    id: 'regenerar',
    icon: Recycle,
    title: 'REGENERAR',
    description: 'Restauração ecológica e científica de áreas degradadas.',
    buttonText: 'Saiba Mais',
    isFeatured: false,
    linkHref: '#',
  },
  {
    id: 'pomar-urbano',
    icon: Grape,
    title: 'POMAR URBANO',
    description: 'Plantio de árvores frutíferas em áreas públicas estratégicas.',
    buttonText: 'Saiba Mais',
    isFeatured: false,
    linkHref: '#',
  },
  {
    id: 'cuidar',
    icon: HandHeart,
    title: 'CUIDAR',
    description: 'Ações de manejo, podas, irrigações e emissão de autorizações.',
    buttonText: 'Saiba Mais',
    isFeatured: false,
    linkHref: '#',
  },
  {
    id: 'normatizar',
    icon: FileText,
    title: 'NORMATIZAR',
    description: 'Atualização e criação de leis e normas ambientais para Varginha.',
    buttonText: 'Saiba Mais',
    isFeatured: false,
    linkHref: '#',
  },
  {
    id: 'fito-inventariar',
    icon: ClipboardList,
    title: 'FITO-INVENTARIAR',
    description: 'Catalogação e mapeamento das árvores da cidade.',
    buttonText: 'Saiba Mais',
    isFeatured: false,
    linkHref: '#',
  },
  {
    id: 'tele-arvore',
    icon: Smartphone,
    title: 'TELE-ÁRVORE',
    description: 'Solicite o plantio na sua calçada via WhatsApp e participe!',
    buttonText: 'Participe Agora!',
    isFeatured: true,
    ctaHref: 'https://wa.me/5535000000000?text=Olá!%20Gostaria%20de%20solicitar%20o%20plantio%20de%20uma%20árvore%20pelo%20Tele-Árvore.', // Substituir pelo número correto
  },
  {
    id: 'nasce-crianca',
    icon: Baby,
    title: 'NASCE UMA CRIANÇA...',
    description: 'Plante uma árvore em homenagem ao nascimento do seu filho.',
    buttonText: 'Quero Participar',
    isFeatured: true,
    linkHref: '#', // Placeholder, could link to a specific form or info page
  },
];


export default function UrbanAfforestationPage() {
  const benefits = [
    "Melhora da qualidade do ar",
    "Redução da temperatura ambiente",
    "Aumento da umidade do ar",
    "Redução da poluição sonora",
    "Embelezamento da cidade",
    "Abrigo e alimento para a fauna local",
    "Valorização dos imóveis",
    "Bem-estar físico e mental para a população"
  ];

  return (
    <PublicLayout>
      <div className="container mx-auto py-12 px-4">
        <PageTitle title="Arborização Urbana" icon={TreePine} description="Conheça a importância das árvores na cidade, como solicitar plantio, poda e remoção, e as diretrizes para uma Varginha mais verde." />

        <div className="grid md:grid-cols-2 gap-8 mb-12 items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Por que a Arborização Urbana é Importante?</h2>
            <p className="text-muted-foreground mb-6">
              As árvores desempenham um papel crucial no ambiente urbano, trazendo inúmeros benefícios para a qualidade de vida dos cidadãos e para o equilíbrio ecológico da cidade.
            </p>
            <ul className="space-y-2 mb-6">
              {benefits.map(benefit => (
                <li key={benefit} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
             <Image src="/arborizacao-urbana-importancia.png" data-ai-hint="city trees" alt="Parque urbano com árvores" layout="fill" objectFit="cover" priority />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader className="items-center text-center">
                    <Sprout className="h-10 w-10 text-primary mb-3"/>
                    <CardTitle>Solicitar Plantio de Árvore</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-4 text-center">Quer uma árvore na sua calçada ou em uma área pública próxima? Veja como solicitar.</p>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button className="w-full sm:w-auto" asChild>
                        <Link href="/dashboard/citizen/requests/new?type=plantio_arvore_area_publica">
                          <span className="flex items-center justify-center">
                            Fazer Solicitação <ArrowRight className="ml-2 h-4 w-4"/>
                          </span>
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
             <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader className="items-center text-center">
                    <TreePine className="h-10 w-10 text-primary mb-3"/>
                    <CardTitle>Solicitar Poda ou Remoção</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-4 text-center">Árvores em risco, doentes, ou necessitando de poda? Saiba como proceder.</p>
                </CardContent>
                <CardFooter className="justify-center">
                     <Button className="w-full sm:w-auto" asChild>
                        <Link href="/dashboard/citizen/requests/new?type=poda_arvore">
                          <span className="flex items-center justify-center">
                            Solicitar Poda/Remoção <ArrowRight className="ml-2 h-4 w-4"/>
                          </span>
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>

        {/* Nova Seção de Projetos */}
        <section className="arborizacao-projetos py-16 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">Conheça Nossos Projetos</h2>
            <p className="text-md md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Clique em um projeto para saber mais e veja como você pode participar.
            </p>

            <div className="projetos-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {arborizationProjects.map((project) => {
                const IconComponent = project.icon;
                return (
                  <Card 
                    key={project.id} 
                    className={`flex flex-col text-center shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out hover:transform hover:-translate-y-2 rounded-xl
                                ${project.isFeatured ? 'bg-primary/10 border-2 border-primary/50' : 'bg-card'}`}
                  >
                    <CardHeader className="items-center pt-8">
                      <IconComponent className="h-14 w-14 text-primary mb-5" strokeWidth={1.5} />
                      <CardTitle className="text-xl font-semibold text-primary">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow px-6 pb-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                    </CardContent>
                    <CardFooter className="justify-center pb-8 pt-2">
                      {project.ctaHref ? (
                         <Button 
                            asChild 
                            className={`${project.isFeatured ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-primary hover:text-primary/80'}`}
                            variant={project.isFeatured ? 'default' : 'link'}
                          >
                          <Link href={project.ctaHref} target="_blank" rel="noopener noreferrer">{project.buttonText}</Link>
                        </Button>
                      ) : (
                        <Button 
                          variant="link" 
                          className="font-semibold text-primary hover:text-primary/80"
                          asChild
                        >
                          <Link href={project.linkHref || '#'}>{project.buttonText}</Link>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
