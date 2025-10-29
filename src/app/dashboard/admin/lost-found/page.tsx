
"use client";

import { useEffect, useState, useCallback } from 'react';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, ShieldAlert, Check, X, Undo, Trash2, PawPrint } from 'lucide-react';
import Image from 'next/image';
import type { LostFoundAnimal, LostFoundStatus } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/auth-context';
import { getLostFoundPostsForAdminAction, updateLostFoundPostStatusAction } from '@/app/actions/lost-found-actions';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


function getStatusVariant(status: LostFoundStatus): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
        case 'aprovado': return 'default';
        case 'pendente': return 'secondary';
        case 'rejeitado': return 'destructive';
        case 'concluido': return 'outline';
        default: return 'outline';
    }
}

function PostModerationCard({ post, onStatusChange }: { post: LostFoundAnimal, onStatusChange: (postId: string, newStatus: LostFoundStatus) => void }) {
    const { toast } = useToast();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateStatus = async (newStatus: LostFoundStatus) => {
        setIsUpdating(true);
        await onStatusChange(post.id, newStatus);
        setIsUpdating(false);
    }
    
    return (
        <Card className="flex flex-col md:flex-row gap-4 p-4">
            <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                 <Avatar className="w-full h-full rounded-md">
                    <AvatarImage src={post.photoUrl} alt={post.species} objectFit="cover"/>
                    <AvatarFallback className="text-3xl rounded-md"><PawPrint /></AvatarFallback>
                </Avatar>
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <Badge variant={post.type === 'perdido' ? 'destructive' : 'secondary'} className="capitalize mb-2">{post.type}</Badge>
                     <Badge variant={getStatusVariant(post.status)} className="capitalize">{post.status}</Badge>
                </div>
                <h3 className="font-bold text-lg">{post.species} ({post.breed || 'SRD'})</h3>
                <p className="text-sm text-muted-foreground mt-1">Local: {post.lastSeenLocation}</p>
                <p className="text-sm text-muted-foreground">Data: {new Date(post.date).toLocaleDateString()}</p>
                <p className="text-sm mt-2 line-clamp-3">Descrição: {post.description}</p>
                <p className="text-xs text-muted-foreground mt-2 border-t pt-2">Enviado por: {post.contactName} ({post.contactPhone}) em {new Date(post.dateCreated).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-col md:w-40 justify-center gap-2 flex-shrink-0">
                {post.status === 'pendente' && (
                    <>
                        <Button size="sm" onClick={() => handleUpdateStatus('aprovado')} disabled={isUpdating}>
                            <Check className="mr-2 h-4 w-4"/> Aprovar
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus('rejeitado')} disabled={isUpdating}>
                            <X className="mr-2 h-4 w-4"/> Rejeitar
                        </Button>
                    </>
                )}
                 {post.status === 'aprovado' && (
                    <Button size="sm" variant="outline" onClick={() => handleUpdateStatus('concluido')} disabled={isUpdating}>
                       <Check className="mr-2 h-4 w-4"/> Marcar como Concluído
                    </Button>
                )}
                 {post.status === 'rejeitado' && (
                     <Button size="sm" variant="outline" onClick={() => handleUpdateStatus('pendente')} disabled={isUpdating}>
                       <Undo className="mr-2 h-4 w-4"/> Mover para Pendente
                    </Button>
                )}
                 {post.status === 'concluido' && (
                     <Button size="sm" variant="outline" onClick={() => handleUpdateStatus('aprovado')} disabled={isUpdating}>
                       <Undo className="mr-2 h-4 w-4"/> Reativar Anúncio
                    </Button>
                )}
                 {(post.status === 'rejeitado' || post.status === 'concluido') && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button size="sm" variant="destructive" className="mt-4" disabled={isUpdating}><Trash2 className="mr-2 h-4 w-4"/> Apagar</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Apagar Permanentemente?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita. O post será removido do banco de dados.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleUpdateStatus('rejeitado')} className="bg-destructive hover:bg-destructive/90">Apagar</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                 )}
            </div>
        </Card>
    )
}

export default function LostFoundModerationPage() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<LostFoundAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<LostFoundStatus>('pendente');
  
  const isAuthorized = currentUser?.role === 'superAdmin' || (currentUser?.role === 'admin' && currentUser?.department === 'bem_estar_animal');

  const fetchPosts = useCallback(async (status: LostFoundStatus) => {
    if (!isAuthorized) {
        setLoading(false);
        return;
    };
    setLoading(true);
    const fetchedPosts = await getLostFoundPostsForAdminAction({ status });
    setPosts(fetchedPosts);
    setLoading(false);
  }, [isAuthorized]);

  useEffect(() => {
    fetchPosts(activeTab);
  }, [activeTab, fetchPosts]);

  const handleStatusChange = async (postId: string, newStatus: LostFoundStatus) => {
    const result = await updateLostFoundPostStatusAction(postId, newStatus);
    if (result.success) {
      toast({ title: "Sucesso!", description: "O status do post foi atualizado." });
      fetchPosts(activeTab); // Refresh the list
    } else {
      toast({ title: "Erro", description: result.error || "Não foi possível atualizar o status.", variant: "destructive" });
    }
  };

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Acesso Negado</h1>
        <p className="text-muted-foreground max-w-md">Você não tem permissão para moderar publicações. Esta seção é restrita.</p>
      </div>
    );
  }

  return (
    <>
      <PageTitle title="Moderar Publicações (Perdidos/Achados)" icon={Search} description="Aprove, rejeite ou gerencie os posts enviados pelos cidadãos." />
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as LostFoundStatus)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pendente">Pendentes</TabsTrigger>
          <TabsTrigger value="aprovado">Aprovados</TabsTrigger>
          <TabsTrigger value="concluido">Concluídos</TabsTrigger>
          <TabsTrigger value="rejeitado">Rejeitados</TabsTrigger>
        </TabsList>
        
        <div className="mt-4">
            {loading ? (
                 <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>
            ) : posts.length > 0 ? (
                <div className="space-y-4">
                    {posts.map(post => <PostModerationCard key={post.id} post={post} onStatusChange={handleStatusChange} />)}
                </div>
            ) : (
                <Card className="flex flex-col items-center justify-center text-center py-12">
                     <CardContent>
                        <h3 className="text-xl font-semibold">Nenhum post aqui</h3>
                        <p className="text-muted-foreground">Não há posts com o status '{activeTab}' no momento.</p>
                    </CardContent>
                </Card>
            )}
        </div>
      </Tabs>
    </>
  );
}