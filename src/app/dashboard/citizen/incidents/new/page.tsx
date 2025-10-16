
"use client";

import Link from 'next/link';
import React, { useState, useRef } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from 'next/navigation';
import { PawPrint, Recycle, TreePine, AlertTriangle as AlertTriangleIcon, Loader2, ArrowLeft, Upload, X, File, Video, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

import { Button } from "@/components/ui/button";
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { INCIDENT_TYPES, type IncidentType, type IncidentCategory } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { addIncidentAction } from "@/app/actions/incidents-actions";
import { storage } from '@/lib/firebase/client';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { cn } from '@/lib/utils';

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const formSchema = z.object({
  incidentType: z.custom<IncidentType>(val => INCIDENT_TYPES.map(it => it.value).includes(val as IncidentType), {
    message: "Tipo de denúncia inválido",
  }),
  description: z.string().min(20, {
    message: "A descrição deve ter pelo menos 20 caracteres.",
  }).max(1500, {
    message: "A descrição não pode exceder 1500 caracteres."
  }),
  location: z.string().min(5, {
    message: "A localização deve ter pelo menos 5 caracteres.",
  }),
  locationReference: z.string().optional(),
  anonymous: z.boolean().default(false).optional(),
  evidenceFiles: z.array(z.any())
    .max(MAX_FILES, `Você pode enviar no máximo ${MAX_FILES} arquivos.`)
    .refine(files => files.every(file => !file || (file.size && file.size <= MAX_FILE_SIZE_BYTES)), `Cada arquivo deve ter no máximo ${MAX_FILE_SIZE_MB}MB.`)
    .optional(),
});

const categories: { [key in IncidentCategory]: { label: string; icon: React.ElementType } } = {
  residuos_poluicao: { label: 'Resíduos e Poluição', icon: Recycle },
  animais: { label: 'Maus Tratos e Animais', icon: PawPrint },
  flora_areas_protegidas: { label: 'Flora e Áreas Protegidas', icon: TreePine },
  outras: { label: 'Outras Infrações', icon: AlertTriangleIcon },
};


export default function NewIncidentReportPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategory | null>(null);
  const [previewFiles, setPreviewFiles] = useState<{ url: string; type: string; name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      location: "",
      locationReference: "",
      anonymous: false,
      evidenceFiles: [],
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const currentFiles = form.getValues('evidenceFiles') || [];
    
    if (files.length + currentFiles.length > MAX_FILES) {
      toast({ title: "Limite de arquivos excedido", description: `Você só pode anexar até ${MAX_FILES} arquivos.`, variant: "destructive" });
      return;
    }

    const newFiles = files.filter(file => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast({ title: "Arquivo muito grande", description: `O arquivo "${file.name}" excede o limite de ${MAX_FILE_SIZE_MB}MB.`, variant: "destructive" });
        return false;
      }
      return true;
    });

    const updatedFiles = [...currentFiles, ...newFiles];
    form.setValue('evidenceFiles', updatedFiles, { shouldValidate: true });

    const newPreviews = newFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type,
      name: file.name
    }));
    setPreviewFiles(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (fileName: string) => {
    const updatedFiles = (form.getValues('evidenceFiles') || []).filter(file => file.name !== fileName);
    form.setValue('evidenceFiles', updatedFiles, { shouldValidate: true });

    setPreviewFiles(prev => {
      const previewToRemove = prev.find(p => p.name === fileName);
      if (previewToRemove) URL.revokeObjectURL(previewToRemove.url);
      return prev.filter(p => p.name !== fileName);
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentUser) {
      toast({ title: "Erro", description: "Você precisa estar logado para enviar uma denúncia.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    const evidenceUrls: string[] = [];
    try {
      if (values.evidenceFiles && values.evidenceFiles.length > 0) {
        toast({ title: "Enviando evidências...", description: `Anexando ${values.evidenceFiles.length} arquivo(s).`});
        
        for (const file of values.evidenceFiles) {
          const storageRef = ref(storage, `incident_evidence/${currentUser.uid}-${Date.now()}-${file.name}`);
          const uploadResult = await uploadBytes(storageRef, file);
          const downloadUrl = await getDownloadURL(uploadResult.ref);
          evidenceUrls.push(downloadUrl);
        }
        toast({ title: "Evidências enviadas!", description: "Seus arquivos foram anexados com sucesso." });
      }

      const result = await addIncidentAction({
        incidentType: values.incidentType,
        description: values.description,
        location: `${values.location}${values.locationReference ? ` (${values.locationReference})` : ''}`,
        isAnonymous: values.anonymous || false,
        citizenId: currentUser.uid,
        citizenName: currentUser.displayName || currentUser.email || 'Cidadão',
        evidenceUrls: evidenceUrls,
      });
      
      if (result.success) {
          toast({
              title: "Denúncia Registrada!",
              description: `Sua denúncia foi registrada com sucesso. Protocolo: ${result.protocol}`,
              variant: "default",
          });
          router.push('/dashboard/citizen/incidents');
      } else {
          toast({
              title: "Erro ao Registrar",
              description: result.error || "Não foi possível registrar a denúncia. Tente novamente.",
              variant: "destructive",
          });
      }
    } catch (error) {
        console.error("Error during submission:", error);
        toast({ title: "Erro no Upload", description: "Não foi possível enviar um ou mais arquivos. Tente novamente.", variant: "destructive"});
    } finally {
        setIsSubmitting(false);
    }
  }
  
  const handleCategorySelect = (category: IncidentCategory) => {
    setSelectedCategory(category);
    form.resetField('incidentType');
  }
  
  const handleBackToCategories = () => {
      setSelectedCategory(null);
      form.resetField('incidentType');
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/citizen/incidents">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <PageTitle title="Registrar Nova Denúncia" icon={AlertTriangleIcon} className="mb-0 flex-grow" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Denúncia</CardTitle>
          <CardDescription>Descreva a situação que você gostaria de denunciar. Sua colaboração é importante.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {!selectedCategory ? (
                  <FormItem>
                    <FormLabel className="text-base">Tipo de Denúncia</FormLabel>
                    <FormDescription>Primeiro, selecione a categoria da denúncia.</FormDescription>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {Object.entries(categories).map(([key, { label, icon: Icon }]) => (
                            <Button
                                key={key}
                                type="button"
                                variant="outline"
                                className="h-auto justify-start p-4 text-left group"
                                onClick={() => handleCategorySelect(key as IncidentCategory)}
                            >
                                <Icon className="mr-4 h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                                <span className="font-semibold text-base">{label}</span>
                            </Button>
                        ))}
                    </div>
                  </FormItem>
              ) : (
                  <div className="p-4 border rounded-md bg-card space-y-4 shadow-sm">
                      <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                              {React.createElement(categories[selectedCategory].icon, { className: "h-6 w-6 text-primary"})}
                              <h3 className="text-lg font-semibold text-foreground">Categoria: {categories[selectedCategory].label}</h3>
                          </div>
                          <Button type="button" variant="link" onClick={handleBackToCategories} className="text-sm">
                              Trocar Categoria
                          </Button>
                      </div>
                      <FormField
                        control={form.control}
                        name="incidentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Denúncia Específica</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo de denúncia" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {INCIDENT_TYPES
                                  .filter(type => type.category === selectedCategory)
                                  .map(type => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>
              )}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do Fato</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o que aconteceu, quando, e quem estava envolvido (se souber)..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização da Ocorrência</FormLabel>
                    <FormControl>
                      <Input placeholder="Endereço completo ou o mais próximo possível" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationReference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ponto de Referência (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Próximo à padaria, em frente ao poste X" {...field} />
                    </FormControl>
                    <FormDescription>Ajude-nos a localizar a ocorrência com mais precisão.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="evidenceFiles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anexar Evidências (Fotos/Vídeos)</FormLabel>
                      <FormDescription>
                        Envie até {MAX_FILES} arquivos (imagens ou vídeos) com no máximo {MAX_FILE_SIZE_MB}MB cada.
                      </FormDescription>
                      <FormControl>
                        <div>
                          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                            <Upload className="mr-2 h-4 w-4" />
                            Adicionar Arquivos
                          </Button>
                          <Input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                      {previewFiles.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {previewFiles.map((file, index) => (
                            <div key={index} className="relative group aspect-square border rounded-md overflow-hidden">
                              {file.type.startsWith('image/') ? (
                                <Image src={file.url} alt={file.name} layout="fill" objectFit="cover" />
                              ) : (
                                <div className="w-full h-full bg-muted flex flex-col items-center justify-center p-2">
                                  <Video className="h-8 w-8 text-muted-foreground" />
                                  <p className="text-xs text-center text-muted-foreground mt-1 truncate">{file.name}</p>
                                </div>
                              )}
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                onClick={() => removeFile(file.name)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          ))}
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="anonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Reportar anonimamente
                      </FormLabel>
                      <FormDescription>
                        Se marcado, seus dados pessoais não serão vinculados a esta denúncia.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/citizen/incidents">Cancelar</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enviar Denúncia
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
