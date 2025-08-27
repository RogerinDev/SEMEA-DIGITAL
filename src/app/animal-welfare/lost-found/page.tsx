
"use client";

import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PawPrint, Search, MapPin, CalendarDays, PlusCircle, BadgeHelp, AlertTriangle, CheckCircle2, Loader2, Upload, X } from 'lucide-react';
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
import { useEffect, useState, useRef } from 'react';
import { addLostFoundPostAction, getActiveLostFoundPostsAction } from '@/app/actions/lost-found-actions';
import { storage } from '@/lib/firebase/client';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { cn } from '@/lib/utils';


function LostFoundForm({ onPostCreated }: { onPostCreated: () => void }) {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const reportFormSchema = z.object({
    reportType: z.enum(["perdido", "encontrado"], { required_error: "Selecione o tipo de registro."}),
    species: z.string().min(1, "Espécie é obrigatória."),
    breed: z.string().optional(),
    description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres."),
    lastSeenLocation: z.string().min(5, "Localização é obrigatória."),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Data inválida."}),
    contactName: z.string().min(1, "Nome para contato é obrigatório."),
    contactPhone: z.string().min(10, "Telefone para contato é obrigatório."),
    photoFile: z.instanceof(File).optional().refine(file => !file || file.size <= 2 * 1024 * 1024, 'A imagem deve ter no máximo 2MB.'),
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
  }, [currentUser, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
          toast({ title: "Imagem muito grande", description: "Por favor, selecione uma imagem com até 2MB.", variant: "destructive" });
          return;
      }
      form.setValue('photoFile', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    form.setValue('photoFile', undefined);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };


  async function onSubmit(values: z.infer<typeof reportFormSchema>) {
    if (!currentUser) {
        toast({ title: "Erro de Autenticação", description: "Você precisa estar logado para criar um registro.", variant: "destructive"});
        return;
    }
    setIsSubmitting(true);
    
    let photoUrl = '';
    
    try {
      if (values.photoFile) {
          toast({ title: "Enviando Imagem...", description: "Aguarde enquanto sua foto é enviada." });
          const storageRef = ref(storage, `lost_found_images/${currentUser.uid}-${Date.now()}-${values.photoFile.name}`);
          const uploadResult = await uploadBytes(storageRef, values.photoFile);
          photoUrl = await getDownloadURL(uploadResult.ref);
          toast({ title: "Imagem Enviada!", description: "Sua foto foi enviada com sucesso." });
      }

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
        removeImage();
        onPostCreated(); // Trigger a refresh of the posts list
      } else {
         toast({ title: "Erro", description: result.error || "Não foi possível criar o registro.", variant: "destructive"});
      }

    } catch (error) {
      console.error("Error during submission:", error);
      toast({ title: "Erro no Upload", description: "Não foi possível enviar a imagem. Tente novamente.", variant: "destructive"});
    } finally {
        setIsSubmitting(false);
    }
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
                 <FormField
                  control={form.control}
                  name="photoFile"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Foto do Animal</FormLabel>
                      <FormControl>
                          <div className={cn("w-full border-2 border-dashed rounded-lg p-4 text-center", previewImage && 'border-solid')}>
                              {previewImage ? (
                                  <div className="relative group w-48 h-48 mx-auto">
                                      <Image src={previewImage} alt="Pré-visualização da imagem" layout="fill" objectFit="cover" className="rounded-md"/>
                                      <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={removeImage}>
                                          <X className="h-4 w-4"/>
                                      </Button>
                                  </div>
                              ) : (
                                  <div className="flex flex-col items-center space-y-2 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                      <Upload className="h-10 w-10 text-muted-foreground"/>
                                      <p className="text-sm text-muted-foreground">Clique para enviar uma foto (Max 2MB)</p>
                                  </div>
                              )}
                              <Input
                                  type="file"
                                  accept="image/png, image/jpeg, image/gif"
                                  className="hidden"
                                  ref={fileInputRef}
                                  onChange={handleFileChange}
                              />
                          </div>
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
                />

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
      <div className="relative aspect-[4/3] overflow-hidden bg-muted flex items-center justify-center">
        {animal.photoUrl ? (
          <Image src={animal.photoUrl} alt={`${animal.type} - ${animal.species}`} layout="fill" objectFit="cover" data-ai-hint={`${animal.species} animal`}/>
        ) : (
          <PawPrint className="w-16 h-16 text-muted-foreground" />
        )}
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
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchPosts = async () => {
      setLoading(true);
      const fetchedPosts = await getActiveLostFoundPostsAction();
      setPosts(fetchedPosts);
      setLoading(false);
  }

  useEffect(() => {
    fetchPosts();
  }, [refreshKey]);
  
  const handlePostCreated = () => {
      setRefreshKey(prevKey => prevKey + 1);
  };
  
  const animaisPerdidos = posts.filter(a => a.type === 'perdido');
  const animaisEncontrados = posts.filter(a => a.type === 'encontrado');

  return (
    <>
      <PageTitle title="Animais Perdidos e Encontrados" icon={Search} description="Ajude a reunir pets com seus donos. Os anúncios são públicos por 30 dias." />
      
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

      <LostFoundForm onPostCreated={handlePostCreated} />
    </>
  );
}
