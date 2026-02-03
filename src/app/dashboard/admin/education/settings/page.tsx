'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { getEnvironmentalEducationSettings, updateEnvironmentalEducationSettings } from '@/app/actions/settings-actions';
import type { SectorSettings } from '@/types';
import { GraduationCap, Loader2, PlusCircle, ShieldAlert, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const projectSchema = z.object({
  id: z.string(),
  slug: z.string().min(1, 'Slug é obrigatório'),
  title: z.string().min(3, 'Título é obrigatório'),
  description: z.string().min(10, 'Descrição é obrigatória'),
  active: z.boolean(),
});

const downloadSchema = z.object({
  id: z.string(),
  label: z.string().min(3, 'Rótulo é obrigatório'),
  description: z.string().min(5, 'Descrição é obrigatória'),
  url: z.string().url('URL inválida').or(z.literal('#')),
});

const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string().min(3, 'Nome é obrigatório'),
  role: z.string().min(3, 'Cargo é obrigatório'),
  email: z.string().email('Email inválido').or(z.literal('')),
});

const settingsSchema = z.object({
  contactInfo: z.object({
    phone: z.string().min(10, 'Telefone é obrigatório'),
    address: z.string().min(10, 'Endereço é obrigatório'),
    schedule: z.string().min(10, 'Horário é obrigatório'),
    emails: z.array(z.string()).optional(),
  }),
  team: z.array(teamMemberSchema),
  downloads: z.array(downloadSchema),
  projects: z.array(projectSchema),
});


export default function EnvironmentalEducationSettingsPage() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      contactInfo: { phone: '', address: '', schedule: '', emails: [] },
      team: [],
      downloads: [],
      projects: [],
    },
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({ control: form.control, name: "projects" });
  const { fields: downloadFields, append: appendDownload, remove: removeDownload } = useFieldArray({ control: form.control, name: "downloads" });
  const { fields: teamFields, append: appendTeam, remove: removeTeam } = useFieldArray({ control: form.control, name: "team" });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const settings = await getEnvironmentalEducationSettings();
        form.reset(settings);
      } catch (error) {
        toast({
            title: "Erro ao carregar",
            description: "Não foi possível buscar as configurações do servidor.",
            variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [form, toast]);

  async function onSubmit(data: z.infer<typeof settingsSchema>) {
    setIsSubmitting(true);
    const result = await updateEnvironmentalEducationSettings(data);
    if (result.success) {
      toast({ title: "Sucesso!", description: "Conteúdo atualizado." });
    } else {
      toast({ title: "Erro ao Salvar", description: result.error || "Acesso negado ou falha ao salvar as configurações.", variant: "destructive" });
    }
    setIsSubmitting(false);
  }
  
  const isAuthorized = currentUser?.role === 'superAdmin' || (currentUser?.role === 'admin' && currentUser?.department === 'educacao_ambiental');
  
  if (loading) {
    return (
        <div>
            <PageTitle title="Gerenciar Conteúdo de Educação Ambiental" icon={GraduationCap} />
            <div className="space-y-8">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    )
  }

  if (!isAuthorized) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
            <h1 className="text-2xl font-bold">Acesso Negado</h1>
            <p className="text-muted-foreground max-w-md">Você não tem permissão para gerenciar este conteúdo.</p>
        </div>
    );
  }

  return (
    <>
      <PageTitle title="Gerenciar Conteúdo de Educação Ambiental" icon={GraduationCap} description="Edite as informações que aparecem nas páginas públicas do setor."/>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <Card>
            <CardHeader>
              <CardTitle>Projetos</CardTitle>
              <CardDescription>Gerencie os projetos de educação ambiental exibidos na página pública.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectFields.map((field, index) => (
                <Card key={field.id} className="p-4 bg-muted/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name={`projects.${index}.title`} render={({ field }) => (<FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name={`projects.${index}.slug`} render={({ field }) => (<FormItem><FormLabel>Slug (URL)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    </div>
                    <FormField control={form.control} name={`projects.${index}.description`} render={({ field }) => (<FormItem className="mt-4"><FormLabel>Descrição</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    <div className="flex items-center justify-between mt-4">
                        <FormField control={form.control} name={`projects.${index}.active`} render={({ field }) => (<FormItem className="flex flex-row items-center gap-2 space-y-0"><FormLabel>Ativo</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)}/>
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeProject(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                </Card>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendProject({ id: crypto.randomUUID(), slug: '', title: '', description: '', active: true })}><PlusCircle className="mr-2 h-4 w-4" /> Adicionar Projeto</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Links de Download</CardTitle><CardDescription>Gerencie documentos e formulários para o público.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {downloadFields.map((field, index) => (
                <Card key={field.id} className="p-4 bg-muted/50">
                    <FormField control={form.control} name={`downloads.${index}.label`} render={({ field }) => (<FormItem><FormLabel>Rótulo do Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    <FormField control={form.control} name={`downloads.${index}.description`} render={({ field }) => (<FormItem className="mt-4"><FormLabel>Descrição Breve</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    <FormField control={form.control} name={`downloads.${index}.url`} render={({ field }) => (<FormItem className="mt-4"><FormLabel>URL Completa</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    <div className="flex justify-end mt-4">
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeDownload(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                </Card>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendDownload({ id: crypto.randomUUID(), label: '', description: '', url: '#' })}><PlusCircle className="mr-2 h-4 w-4" /> Adicionar Link</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Equipe e Informações de Contato</CardTitle><CardDescription>Atualize os detalhes de contato e os membros da equipe.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="contactInfo.phone" render={({ field }) => (<FormItem><FormLabel>Telefone Principal</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    <FormField control={form.control} name="contactInfo.schedule" render={({ field }) => (<FormItem><FormLabel>Horário de Funcionamento</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                </div>
                <FormField control={form.control} name="contactInfo.address" render={({ field }) => (<FormItem><FormLabel>Endereço Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="contactInfo.emails" render={({ field }) => (<FormItem><FormLabel>E-mails/Contatos Adicionais</FormLabel><FormControl><Input placeholder="Separados por vírgula" {...field} onChange={e => field.onChange(e.target.value.split(',').map(email => email.trim()))} value={Array.isArray(field.value) ? field.value.join(', ') : ''} /></FormControl><FormMessage /></FormItem>)}/>
                
                <Separator/>
                <h3 className="text-lg font-medium">Membros da Equipe</h3>
                {teamFields.map((field, index) => (
                    <Card key={field.id} className="p-4 bg-muted/50">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <FormField control={form.control} name={`team.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name={`team.${index}.role`} render={({ field }) => (<FormItem><FormLabel>Cargo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        </div>
                        <FormField control={form.control} name={`team.${index}.email`} render={({ field }) => (<FormItem className="mt-4"><FormLabel>Email (opcional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <div className="flex justify-end mt-4">
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeTeam(index)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </Card>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendTeam({ id: crypto.randomUUID(), name: '', role: '', email: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Adicionar Membro</Button>
            </CardContent>
          </Card>


          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Todas as Alterações
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
