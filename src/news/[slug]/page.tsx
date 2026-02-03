import { getPostBySlug } from "@/app/actions/posts-actions";
import { PageTitle } from "@/components/page-title";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Newspaper } from "lucide-react";
import PublicLayout from "@/components/layouts/public-layout";
import { Department } from "@/types";

export const dynamic = 'force-dynamic';

const departmentLabels: Record<Department, string> = {
    arborizacao: "Arborização",
    residuos: "Resíduos",
    bem_estar_animal: "Bem-Estar Animal",
    educacao_ambiental: "Educação Ambiental",
    gabinete: "Gabinete",
    general: "Geral"
};

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <PublicLayout>
            <article className="container mx-auto max-w-4xl py-12 px-4">
                <header className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Badge variant="secondary">{departmentLabels[post.sector] || 'Notícia'}</Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            <span>{new Date(post.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>
                    <PageTitle title={post.title} icon={Newspaper} className="mb-0" />
                </header>

                <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden shadow-lg">
                    <Image src={post.imageUrl} alt={post.title} layout="fill" objectFit="cover" priority />
                </div>
                
                {/* Simple markdown-like renderer */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    {post.content.split('\n').map((paragraph, index) => {
                        if (paragraph.trim() === '') return <br key={index} />;
                        return <p key={index}>{paragraph}</p>;
                    })}
                </div>

                {post.videoUrl && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-4">Vídeo Relacionado</h2>
                        <div className="aspect-video">
                            <iframe 
                                className="w-full h-full rounded-lg"
                                src={post.videoUrl.replace("watch?v=", "embed/")} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen>
                            </iframe>
                        </div>
                    </div>
                )}
            </article>
        </PublicLayout>
    );
}
