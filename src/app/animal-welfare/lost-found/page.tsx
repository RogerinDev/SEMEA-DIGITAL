
"use client";

import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PawPrint, Search, MapPin, CalendarDays, PlusCircle, BadgeHelp, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Badge } from '@/components/ui/badge';
import type { LostFoundAnimal } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import { addLostFoundPostAction, getActiveLostFoundPostsAction } from '@/app/actions/lost-found-actions';


function LostFoundForm() {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const reportFormSchema = z.object({
    reportType: z.enum(["perdido", "encontrado"], { required_error: "Selecione o tipo de registro."}),
    species: z.string().min(1, "Espécie é obrigatória."),
    breed: z.string().optional(),
    description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres."),
    lastSeenLocation: z.string().min(5, "Localização é obrigatória."),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Data inválida."}),
    contactName: z.string().min(1, "Nome para contato é obrigatório."),
    contactPhone: z.string().min(10, "Telefone para contato é obrigatório."),
  });

  const form = useForm<z.infer<typeof reportFormSchema>>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      species: "",
      breed: "",
      description: "",
      lastSeenLocation: "",
      date: new Date().toISOString().split('T')[0], // Default to today
      contactName: currentUser?.displayName || "",
      contactPhone: "",
    },
  });
  
  useEffect(() => {
    if(currentUser?.displayName) {
        form.setValue('contactName', currentUser.displayName);
    }
  }, [currentUser, form])

  async function onSubmit(values: z.infer<typeof reportFormSchema>) {
    if (!currentUser) {
        toast({ title: "Erro de Autenticação", description: "Você precisa estar logado para criar um registro.", variant: "destructive"});
        return;
    }
    setIsSubmitting(true);
    
    // In a real app, you would handle file upload to Firebase Storage here and get a URL.
    // For now, we'll use a placeholder.
    const photoUrl = 'https://placehold.co/400x300.png';

    const result = await addLostFoundPostAction({
      type: values.reportType,
      species: values.species,
      breed: values.breed,
      description: values.description,
      lastSeenLocation: values.lastSeenLocation,
      date: values.date,
      contactName: values.contactName,
      contactPhone: values.contactPhone,
      photoUrl,
      status: 'ativo',
      citizenId: currentUser.uid,
    });

    if(result.success) {
      toast({
        title: "Registro Enviado!",
        description: `Seu registro de animal ${values.reportType === 'perdido' ? 'perdido' : 'encontrado'} foi criado com sucesso.`,
      });
      form.reset();
      // Ideally, trigger a refresh of the posts list here.
    } else {
       toast({ title: "Erro", description: result.error || "Não foi possível criar o registro.", variant: "destructive"});
    }
    setIsSubmitting(false);
  }
  
  return (
     <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center"><PlusCircle className="mr-2 h-6 w-6 text-primary"/>Registrar Animal Perdido ou Encontrado</CardTitle>
            <CardDescription>Ajude um pet a voltar para casa. Os anúncios são públicos por 30 dias.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField name="reportType" control={form.control} render={({ field }) => (
                        <FormItem>
                            <Label>Tipo de Registro</Label>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Perdido ou Encontrado?" /></SelectTrigger>
                              </FormControl>
                                <SelectContent>
                                    <SelectItem value="perdido">Animal Perdido</SelectItem>
                                    <SelectItem value="encontrado">Animal Encontrado</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )} />
                     <FormField name="species" control={form.control} render={({ field }) => (
                        <FormItem>
                            <Label>Espécie</Label>
                            <FormControl>
                              <Input placeholder="Cachorro, Gato, Pássaro..." {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                </div>
                 <FormField name="breed" control={form.control} render={({ field }) => (
                    <FormItem>
                        <Label>Raça (opcional)</Label>
                         <FormControl>
                          <Input placeholder="SRD, Poodle, Siamês..." {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} />
                 <FormField name="description" control={form.control} render={({ field }) => (
                    <FormItem>
                        <Label>Descrição do Animal</Label>
                        <FormControl>
                          <Textarea placeholder="Cores, marcas, tamanho, comportamento, coleira..." {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )} />
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField name="lastSeenLocation" control={form.control} render={({ field }) => (
                        <FormItem>
                            <Label>Última Localização Visto/Encontrado</Label>
                            <FormControl>
                              <Input placeholder="Rua, Bairro, Ponto de Referência" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                    <FormField name="date" control={form.control} render={({ field }) => (
                        <FormItem>
                            <Label>Data da Ocorrência</Label>
                            <FormControl>
                             <Input type="date" {...field} />
                            </FormControl>
                             <FormMessage/>
                        </FormItem>
                    )} />
                </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <FormField name="contactName" control={form.control} render={({ field }) => (
                        <FormItem>
                            <Label>Seu Nome para Contato</Label>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                    <FormField name="contactPhone" control={form.control} render={({ field }) => (
                        <FormItem>
                            <Label>Seu Telefone para Contato</Label>
                             <FormControl>
                              <Input type="tel" placeholder="(XX) XXXXX-XXXX" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} />
                </div>
                {/* <FormItem>
                    <Label>Foto do Animal (opcional)</Label>
                    <Input type="file" accept="image/*" />
                </FormItem> */}
                <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                    Enviar Registro
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}


function AnimalCard({ animal }: { animal: LostFoundAnimal }) {
  const AnimalIcon = animal.species.toLowerCase() === 'cachorro' ? PawPrint : (animal.species.toLowerCase() === 'gato' ? PawPrint : PawPrint);
  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={animal.photoUrl || 'https://placehold.co/400x300.png'} alt={`${animal.type} - ${animal.species}`} layout="fill" objectFit="cover" data-ai-hint={`${animal.species} animal`}/>
        <Badge variant={animal.type === 'perdido' ? 'destructive' : 'secondary'} className="absolute top-2 left-2 capitalize">
          {animal.type === 'perdido' ? <AlertTriangle className="h-3 w-3 mr-1"/> : <BadgeHelp className="h-3 w-3 mr-1"/>}
          {animal.type}
        </Badge>
         {animal.status === 'resolvido' && (
            <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                <CheckCircle2 className="h-3 w-3 mr-1"/> Resolvido
            </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <AnimalIcon className="h-5 w-5 mr-2 text-primary"/>
          {animal.species} {animal.breed ? `(${animal.breed})` : ''}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-1 text-sm">
        <p className="text-muted-foreground line-clamp-3"><strong>Descrição:</strong> {animal.description}</p>
        <p><MapPin className="inline h-4 w-4 mr-1 text-muted-foreground"/> <strong>Local:</strong> {animal.lastSeenLocation}</p>
        <p><CalendarDays className="inline h-4 w-4 mr-1 text-muted-foreground"/> <strong>Data:</strong> {new Date(animal.date).toLocaleDateString()}</p>
      </CardContent>
      <CardFooter className="flex-col items-start space-y-2">
        <p className="text-xs text-muted-foreground"><strong>Contato:</strong> {animal.contactName} - {animal.contactPhone}</p>
        <Button variant="outline" size="sm" className="w-full" disabled={animal.status === 'resolvido'}>
            {animal.status === 'resolvido' ? 'Caso Resolvido' : 'Entrar em Contato'}
        </Button>
      </CardFooter>
    </Card>
  );
}


export default function LostFoundPage() {
  const [posts, setPosts] = useState<LostFoundAnimal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
        setLoading(true);
        const fetchedPosts = await getActiveLostFoundPostsAction();
        // In a real scenario with a cron job, we wouldn't need to filter by status === 'resolvido' here
        // but for now, we add them to the list to show all relevant posts.
        const allPostsToShow = fetchedPosts; // Simplified for now.
        setPosts(allPostsToShow);
        setLoading(false);
    }
    fetchPosts();
  }, []);
  
  const animaisPerdidos = posts.filter(a => a.type === 'perdido');
  const animaisEncontrados = posts.filter(a => a.type === 'encontrado');

  return (
    <>
      <PageTitle title="Animais Perdidos e Encontrados" icon={Search} description="Ajude a reunir pets com seus donos. Anúncios ativos são removidos após 30 dias." />
      
      <Tabs defaultValue="perdidos" className="w-full mb-12">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 mx-auto">
          <TabsTrigger value="perdidos">Animais Perdidos</TabsTrigger>
          <TabsTrigger value="encontrados">Animais Encontrados</TabsTrigger>
        </TabsList>
        {loading ? (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
            <>
                <TabsContent value="perdidos">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {animaisPerdidos.length > 0 ? animaisPerdidos.map(animal => <AnimalCard key={animal.id} animal={animal} />) : <p className="col-span-full text-center text-muted-foreground py-8">Nenhum animal perdido registrado no momento.</p>}
                </div>
                </TabsContent>
                <TabsContent value="encontrados">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {animaisEncontrados.length > 0 ? animaisEncontrados.map(animal => <AnimalCard key={animal.id} animal={animal} />) : <p className="col-span-full text-center text-muted-foreground py-8">Nenhum animal encontrado registrado no momento.</p>}
                </div>
                </TabsContent>
            </>
        )}
      </Tabs>

      <LostFoundForm />
    </>
  );
}
