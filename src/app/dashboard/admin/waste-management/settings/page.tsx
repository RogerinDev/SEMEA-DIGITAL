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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { getWasteManagementSettings, updateWasteManagementSettings } from '@/app/actions/settings-actions';
import type { SectorSettings } from '@/types';
import { Recycle, Loader2, PlusCircle, ShieldAlert, Trash2, Cog } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ecopointSchema = z.object({
  id: z.string(),
  material: z.string().min(1, 'Material é obrigatório'),
  name: z.string().min(1, 'Nome do ecoponto é obrigatório'),
  address: z.string().min(5, 'Endereço é obrigatório'),
  phone: z.string().min(8, 'Telefone é obrigatório'),
  observation: z.string().optional(),
  active: z.boolean(),
});

const collectionPointSchema = z.object({
  id: z.string(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  days: z.string().min(1, 'Dias são obrigatórios'),
  period: z.string().min(1, 'Período é obrigatório'),
  schedule: z.string().min(1, 'Horário é obrigatório'),
  observation: z.string().optional(),
  active: z.boolean(),
});

const settingsSchema = z.object({
  ecopoints: z.array(ecopointSchema),
  collectionPoints: z.array(collectionPointSchema),
});


export default function WasteManagementSettingsPage() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      ecopoints: [],
      collectionPoints: [],
    },
  });

  const { fields: ecopointFields, append: appendEcopoint, remove: removeEcopoint } = useFieldArray({ control: form.control, name: "ecopoints" });
  const { fields: collectionPointFields, append: appendCollectionPoint, remove: removeCollectionPoint } = useFieldArray({ control: form.control, name: "collectionPoints" });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const settings = await getWasteManagementSettings();
        form.reset(settings as z.infer<typeof settingsSchema>);
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
    const result = await updateWasteManagementSettings(data);
    if (result.success) {
      toast({ title: "Sucesso!", description: "Conteúdo atualizado." });
    } else {
      toast({ title: "Erro ao Salvar", description: result.error || "Acesso negado ou falha ao salvar as configurações.", variant: "destructive" });
    }
    setIsSubmitting(false);
  }
  
  const isAuthorized = currentUser?.role === 'superAdmin' || (currentUser?.role === 'admin' && currentUser?.department === 'residuos');
  
  if (loading) {
    return (
        <div>
            <PageTitle title="Gerenciar Conteúdo de Gestão de Resíduos" icon={Cog} />
            <div className="space-y-8">
                <Skeleton className="h-96 w-full" />
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
      <PageTitle title="Gerenciar Conteúdo de Gestão de Resíduos" icon={Recycle} description="Edite as informações da página de Coleta e Descarte Consciente."/>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="ecopoints">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ecopoints">Ecopontos</TabsTrigger>
                <TabsTrigger value="collectionPoints">Coleta nos Bairros</TabsTrigger>
            </TabsList>
            <TabsContent value="ecopoints">
                <Card>
                    <CardHeader>
                        <CardTitle>Ecopontos</CardTitle>
                        <CardDescription>Gerencie os pontos de coleta de materiais específicos.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {ecopointFields.map((field, index) => (
                            <Card key={field.id} className="p-4 bg-muted/50">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField control={form.control} name={`ecopoints.${index}.material`} render={({ field }) => (<FormItem><FormLabel>Material</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                    <FormField control={form.control} name={`ecopoints.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Nome do Ecoponto</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                    <FormField control={form.control} name={`ecopoints.${index}.address`} render={({ field }) => (<FormItem><FormLabel>Endereço</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                    <FormField control={form.control} name={`ecopoints.${index}.phone`} render={({ field }) => (<FormItem><FormLabel>Telefone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                </div>
                                <FormField control={form.control} name={`ecopoints.${index}.observation`} render={({ field }) => (<FormItem className="mt-4"><FormLabel>Observação (opcional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <div className="flex items-center justify-between mt-4">
                                    <FormField control={form.control} name={`ecopoints.${index}.active`} render={({ field }) => (<FormItem className="flex flex-row items-center gap-2 space-y-0"><FormLabel>Ativo</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)}/>
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeEcopoint(index)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </Card>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => appendEcopoint({ id: crypto.randomUUID(), material: '', name: '', address: '', phone: '', observation: '', active: true })}><PlusCircle className="mr-2 h-4 w-4" /> Adicionar Ecoponto</Button>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="collectionPoints">
                 <Card>
                    <CardHeader>
                        <CardTitle>Pontos de Coleta (Bairros)</CardTitle>
                        <CardDescription>Gerencie a programação da coleta de lixo convencional nos bairros.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {collectionPointFields.map((field, index) => (
                            <Card key={field.id} className="p-4 bg-muted/50">
                                <FormField control={form.control} name={`collectionPoints.${index}.neighborhood`} render={({ field }) => (<FormItem><FormLabel>Bairro</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                    <FormField control={form.control} name={`collectionPoints.${index}.days`} render={({ field }) => (<FormItem><FormLabel>Dias</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                    <FormField control={form.control} name={`collectionPoints.${index}.period`} render={({ field }) => (<FormItem><FormLabel>Período</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                    <FormField control={form.control} name={`collectionPoints.${index}.schedule`} render={({ field }) => (<FormItem><FormLabel>Horário</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                </div>
                                <FormField control={form.control} name={`collectionPoints.${index}.observation`} render={({ field }) => (<FormItem className="mt-4"><FormLabel>Observação (opcional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>

                                <div className="flex items-center justify-between mt-4">
                                    <FormField control={form.control} name={`collectionPoints.${index}.active`} render={({ field }) => (<FormItem className="flex flex-row items-center gap-2 space-y-0"><FormLabel>Ativo</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)}/>
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeCollectionPoint(index)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </Card>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => appendCollectionPoint({ id: crypto.randomUUID(), neighborhood: '', days: '', period: '', schedule: '', observation: '', active: true })}><PlusCircle className="mr-2 h-4 w-4" /> Adicionar Bairro</Button>
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4">
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
