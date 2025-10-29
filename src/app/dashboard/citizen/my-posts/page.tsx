
"use client";

import { useState, useEffect } from 'react';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PawPrint, PlusCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { LostFoundAnimal, LostFoundStatus } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { getLostFoundPostsByCitizenAction } from '@/app/actions/lost-found-actions';
import Image from 'next/image';

function getStatusVariant(status: LostFoundStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'aprovado': return 'default';
    case 'pendente': return 'secondary';
    case 'rejeitado': return 'destructive';
    case 'concluido': return 'outline';
    default: return 'outline';
  }
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<LostFoundAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, loading: authLoading } = useAuth();

  useEffect(() => {
    async function fetchPosts() {
      if (currentUser?.uid) {
        setLoading(true);
        const fetchedPosts = await getLostFoundPostsByCitizenAction(currentUser.uid);
        setPosts(fetchedPosts);
        setLoading(false);
      } else if (!authLoading) {
        setLoading(false);
        setPosts([]);
      }
    }
    fetchPosts();
  }, [currentUser, authLoading]);

  const isLoading = authLoading || loading;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <PageTitle title="Minhas Publicações de Animais" icon={PawPrint} className="mb-0" />
        <Button asChild>
          <Link href="/dashboard/citizen/requests/new?type=registro_animal_perdido_encontrado">
            <span className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" /> Novo Registro
            </span>
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
         <Card className="text-center py-12">
          <CardHeader>
            <PawPrint className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle>Nenhuma publicação encontrada</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Você ainda não registrou nenhum animal perdido ou encontrado.</CardDescription>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/dashboard/citizen/requests/new?type=registro_animal_perdido_encontrado">
                Fazer meu primeiro registro
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col">
              <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                <Image src={post.photoUrl || 'https://picsum.photos/seed/placeholder/300/200'} alt={post.species} layout="fill" objectFit="cover" />
              </div>
              <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="capitalize">{post.type}: {post.species}</CardTitle>
                    <Badge variant={getStatusVariant(post.status)} className="capitalize">{post.status}</Badge>
                </div>
                <CardDescription>Registrado em: {new Date(post.dateCreated).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{post.description}</p>
              </CardContent>
              <CardFooter>
                 <p className="text-xs text-muted-foreground">
                    {post.status === 'pendente' && 'Aguardando aprovação da nossa equipe.'}
                    {post.status === 'aprovado' && 'Seu post está visível para o público.'}
                    {post.status === 'rejeitado' && 'Seu post não foi aprovado. Verifique as diretrizes.'}
                    {post.status === 'concluido' && 'Este caso foi marcado como concluído.'}
                 </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
