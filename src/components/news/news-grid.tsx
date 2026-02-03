import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CalendarDays, Video } from 'lucide-react';
import type { Post, Department } from '@/types';

const departmentLabels: Record<Department, string> = {
    arborizacao: "Arborização",
    residuos: "Resíduos",
    bem_estar_animal: "Bem-Estar Animal",
    educacao_ambiental: "Educação Ambiental",
    gabinete: "Gabinete",
    general: "Geral"
};

interface NewsGridProps {
  posts: Post[];
  className?: string;
}

export function NewsGrid({ posts, className }: NewsGridProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
      {posts.map(post => (
        <Link key={post.id} href={`/news/${post.slug}`} className="group block">
          <Card className="h-full flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative aspect-video overflow-hidden">
              <Image 
                src={post.imageUrl}
                alt={post.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              />
              {post.videoUrl && (
                 <div className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full">
                    <Video className="h-4 w-4" />
                </div>
              )}
            </div>
            <CardHeader>
              <Badge variant="secondary" className="mb-2 w-fit">{departmentLabels[post.sector] || 'Notícia'}</Badge>
              <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
               <div className="flex items-center text-xs text-muted-foreground">
                    <CalendarDays className="mr-1.5 h-4 w-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
            </CardContent>
            <CardFooter>
              <span className="text-sm font-semibold text-primary flex items-center group-hover:underline">
                Ler mais <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
