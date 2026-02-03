import Link from 'next/link';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Newspaper, PlusCircle } from 'lucide-react';
import { getPosts } from '@/app/actions/posts-actions';
import { Department } from '@/types';

export const dynamic = 'force-dynamic';

const departmentLabels: Record<Department, string> = {
    arborizacao: "Arborização",
    residuos: "Resíduos",
    bem_estar_animal: "Bem-Estar Animal",
    educacao_ambiental: "Educação Ambiental",
    gabinete: "Gabinete",
    general: "Geral"
};

export default async function AdminPostsPage() {
  const posts = await getPosts({});

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <PageTitle title="Gerenciar Notícias" icon={Newspaper} />
        <Button asChild>
          <Link href="/dashboard/admin/posts/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Notícia
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notícias e Comunicados</CardTitle>
          <CardDescription>Crie, edite e gerencie todas as notícias publicadas no portal.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length > 0 ? posts.map(post => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-xs truncate">{post.title}</TableCell>
                  <TableCell>{departmentLabels[post.sector] || 'N/A'}</TableCell>
                  <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={post.active ? 'default' : 'outline'}>
                      {post.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/admin/posts/${post.id}`}>
                            <Eye className="mr-2 h-4 w-4"/> Editar
                        </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">Nenhuma notícia encontrada.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
