"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { savePost, deletePost } from "@/app/actions/posts-actions";
import type { Post, Department } from "@/types";

import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2, Save, Trash2, Newspaper } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const postFormSchema = z.object({
  title: z.string().min(5, "O título deve ter no mínimo 5 caracteres."),
  content: z.string().min(20, "O conteúdo deve ter no mínimo 20 caracteres."),
  imageUrl: z.string().url("URL da imagem inválida."),
  videoUrl: z.string().url("URL do vídeo inválida.").optional().or(z.literal("")),
  sector: z.custom<Department>(),
  active: z.boolean().default(true),
});

const departmentOptions: { value: Department, label: string }[] = [
    { value: 'general', label: 'Geral' },
    { value: 'arborizacao', label: 'Arborização Urbana' },
    { value: 'bem_estar_animal', label: 'Bem-Estar Animal' },
    { value: 'educacao_ambiental', label: 'Educação Ambiental' },
    { value: 'residuos', label: 'Gestão de Resíduos' },
    { value: 'gabinete', label: 'Gabinete' },
];

interface PostFormProps {
  initialData?: Post;
}

export function PostForm({ initialData }: PostFormProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isSuperAdmin = currentUser?.role === 'superAdmin';
  const userDepartment = currentUser?.department;

  const form = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
      imageUrl: "",
      videoUrl: "",
      sector: isSuperAdmin ? "general" : userDepartment,
      active: true,
    },
  });

  async function onSubmit(data: z.infer<typeof postFormSchema>) {
    setIsSubmitting(true);
    
    // Segurança no cliente (a regra principal está no Firestore)
    if (!isSuperAdmin && data.sector !== userDepartment) {
        toast({ title: "Erro de Permissão", description: "Você não pode criar uma notícia para este setor.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }

    const result = await savePost({ id: initialData?.id, ...data });

    if (result.success) {
      toast({ title: "Sucesso!", description: `Notícia ${initialData ? 'atualizada' : 'criada'} com sucesso.` });
      router.push('/dashboard/admin/posts');
      router.refresh();
    } else {
      toast({ title: "Erro ao Salvar", description: result.error, variant: "destructive" });
    }
    setIsSubmitting(false);
  }

  async function handleDelete() {
    if (!initialData) return;
    setIsDeleting(true);
    const result = await deletePost(initialData.id);
     if (result.success) {
      toast({ title: "Sucesso!", description: "Notícia deletada." });
      router.push('/dashboard/admin/posts');
      router.refresh();
    } else {
      toast({ title: "Erro ao Deletar", description: result.error, variant: "destructive" });
    }
    setIsDeleting(false);
  }

  const pageTitle = initialData ? "Editar Notícia" : "Criar Nova Notícia";

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
             <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard/admin/posts">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            </Button>
            <PageTitle title={pageTitle} icon={Newspaper} className="mb-0"/>
        </div>
        {initialData && (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isDeleting}>
                        <Trash2 className="mr-2 h-4 w-4" /> Deletar
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>Esta ação é irreversível e irá apagar a notícia permanentemente.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                           {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )}
      </div>

       <Card>
        <CardHeader>
            <CardTitle>Conteúdo da Notícia</CardTitle>
            <CardDescription>Preencha os campos abaixo. O campo de slug será gerado automaticamente a partir do título.</CardDescription>
        </CardHeader>
        <CardContent>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField name="title" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Título</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField name="content" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Conteúdo</FormLabel>
                            <FormControl><Textarea className="min-h-[250px]" {...field} /></FormControl>
                            <FormDescription>Você pode usar markdown para formatação.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField name="imageUrl" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL da Imagem de Capa</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="videoUrl" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL do Vídeo (Opcional)</FormLabel>
                                <FormControl><Input placeholder="Link do YouTube, etc." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                     <FormField name="sector" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Setor</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={!isSuperAdmin}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {departmentOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {!isSuperAdmin && <FormDescription>Admins de setor só podem postar em seu próprio setor.</FormDescription>}
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField name="active" control={form.control} render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Publicar Notícia</FormLabel>
                                <FormDescription>Desative para salvar como rascunho. Notícias inativas não aparecem no site público.</FormDescription>
                            </div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl>
                        </FormItem>
                    )} />
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            <Save className="mr-2 h-4 w-4" /> Salvar Notícia
                        </Button>
                    </div>
                </form>
             </Form>
        </CardContent>
       </Card>
    </>
  )
}
