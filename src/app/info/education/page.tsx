import PublicLayout from '@/components/layouts/public-layout';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Download, BookOpen, ExternalLink, Youtube, Mic } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { EducationalMaterial } from '@/types';

const mockMaterials: EducationalMaterial[] = [
  { id: '1', title: 'Guia Completo de Reciclagem Doméstica', type: 'pdf_cartilha', description: 'Aprenda como separar corretamente seu lixo e contribuir para um ambiente mais limpo.', url: '#', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'recycling guide' },
  { id: '2', title: 'A Importância das Árvores Urbanas', type: 'artigo_blog', description: 'Descubra os benefícios das árvores para a cidade e como ajudar na arborização.', url: '#', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'city trees' },
  { id: '3', title: 'Vídeo Aula: Compostagem Caseira Fácil', type: 'video_aula', description: 'Tutorial passo a passo para transformar resíduos orgânicos em adubo.', url: 'https://www.youtube.com', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'composting tutorial' },
  { id: '4', title: 'Podcast: Fauna Local de Varginha', type: 'podcast', description: 'Conheça os animais silvestres da nossa região e como protegê-los.', url: '#', imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'local wildlife' },
];

const getIconForMaterialType = (type: EducationalMaterial['type']) => {
  switch (type) {
    case 'pdf_cartilha': return Download;
    case 'artigo_blog': return BookOpen;
    case 'video_aula': return Youtube;
    case 'podcast': return Mic;
    default: return ExternalLink;
  }
};

export default function EnvironmentalEducationPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto py-12 px-4">
        <PageTitle title="Educação Ambiental" icon={GraduationCap} description="Materiais educativos, cartilhas, vídeos e informações para você aprender mais sobre o meio ambiente e como preservá-lo." />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockMaterials.map((material) => {
            const Icon = getIconForMaterialType(material.type);
            return (
              <Card key={material.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                {material.imageUrl && (
                  <div className="aspect-video overflow-hidden">
                    <Image src={material.imageUrl} alt={material.title} width={600} height={400} className="object-cover w-full h-full transition-transform duration-300 hover:scale-105" data-ai-hint={material.dataAiHint}/>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{material.title}</CardTitle>
                  <CardDescription className="text-xs uppercase tracking-wider text-primary">{material.type.replace(/_/g, ' ')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">{material.description}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={material.url} target={material.type === 'link_externo' || material.type === 'video_aula' ? '_blank' : '_self'}>
                      <Icon className="mr-2 h-4 w-4" />
                      Acessar Material
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        {mockMaterials.length === 0 && (
            <div className="text-center py-12 col-span-full">
                <GraduationCap className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum material disponível no momento</h3>
                <p className="text-muted-foreground">Volte em breve para conferir nossos conteúdos educativos.</p>
            </div>
        )}
      </div>
    </PublicLayout>
  );
}
