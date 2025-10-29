
"use client";

import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSearchParams, useRouter } from 'next/navigation';
import { TreePine, Droplets, GraduationCap, PawPrint, Loader2, ArrowLeft, PlusCircle, Upload, X, Video } from 'lucide-react';
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
import { SERVICE_REQUEST_TYPES, type ServiceRequestType, type ServiceCategory } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { addRequestAction } from "@/app/actions/requests-actions";
import { addLostFoundPostAction } from '@/app/actions/lost-found-actions';
import { storage } from '@/lib/firebase/client';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { cn } from '@/lib/utils';

// Esquema para solicitações de serviço gerais
const serviceRequestFormSchema = z.object({
  requestType: z.custom<ServiceRequestType>(val => SERVICE_REQUEST_TYPES.map(it => it.value).includes(val as ServiceRequestType), {
    message: "Tipo de solicitação inválido",
  }),
  description: z.string().min(10, { message: "A descrição deve ter pelo menos 10 caracteres." }),
  address: z.string().optional(),
  contactPhone: z.string().optional(),
});

// Esquema específico para registro de animal perdido/encontrado
const lostFoundFormSchema = z.object({
  reportType: z.enum(["perdido", "encontrado"], { required_error: "Selecione o tipo de registro."}),
  species: z.string().min(1, "Espécie é obrigatória."),
  breed: z.string().optional(),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres."),
  lastSeenLocation: z.string().min(5, "Localização é obrigatória."),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Data inválida."}),
  contactName: z.string().min(1, "Nome para contato é obrigatório."),
  contactPhone: z.string().min(10, "Telefone para contato é obrigatório."),
  photoFile: z.any().optional().refine(file => !file || (file.size && file.size <= 5 * 1024 * 1024), 'A imagem deve ter no máximo 5MB.'),
});


const categories: { [key in ServiceCategory]: { label: string; icon: React.ElementType } } = {
  arborizacao: { label: 'Arborização', icon: TreePine },
  residuos: { label: 'Resíduos', icon: Droplets },
  bem_estar_animal: { label: 'Bem-Estar Animal', icon: PawPrint },
  educacao_ambiental: { label: 'Educação Ambiental e Outros', icon: GraduationCap },
};

// --- Formulário de Registro de Animal Perdido/Encontrado ---
function LostFoundRequestForm() {
    const { toast } = useToast();
    const { currentUser } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof lostFoundFormSchema>>({
        resolver: zodResolver(lostFoundFormSchema),
        defaultValues: {
            species: "",
            breed: "",
            description: "",
            lastSeenLocation: "",
            date: new Date().toISOString().split('T')[0],
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
            if (file.size > 5 * 1024 * 1024) {
                toast({ title: "Imagem muito grande", description: "Por favor, selecione uma imagem com até 5MB.", variant: "destructive" });
                return;
            }
            form.setValue('photoFile', file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setPreviewImage(null);
        form.setValue('photoFile', undefined);
        if(fileInputRef.current) fileInputRef.current.value = "";
    };

    async function onSubmit(values: z.infer<typeof lostFoundFormSchema>) {
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
                citizenId: currentUser.uid,
            });

            if(result.success) {
                toast({
                    title: "Registro Enviado para Moderação!",
                    description: `Seu registro de animal ${values.reportType === 'perdido' ? 'perdido' : 'encontrado'} foi criado e aguarda aprovação.`,
                });
                form.reset();
                removeImage();
                router.push('/dashboard/citizen/my-posts');
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="photoFile" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Foto do Animal</FormLabel>
                        <FormControl>
                            <div className={cn("w-full border-2 border-dashed rounded-lg p-4 text-center", previewImage && 'border-solid')}>
                                {previewImage ? (
                                    <div className="relative group w-48 h-48 mx-auto">
                                        <Image src={previewImage} alt="Pré-visualização" layout="fill" objectFit="cover" className="rounded-md"/>
                                        <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100" onClick={removeImage}>
                                            <X className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center space-y-2 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="h-10 w-10 text-muted-foreground"/>
                                        <p className="text-sm text-muted-foreground">Clique para enviar uma foto (Max 5MB)</p>
                                    </div>
                                )}
                                <Input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange}/>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField name="reportType" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Tipo de Registro</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Perdido ou Encontrado?" /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="perdido">Animal Perdido</SelectItem><SelectItem value="encontrado">Animal Encontrado</SelectItem></SelectContent>
                        </Select><FormMessage/>
                    </FormItem>
                )} />
                <FormField name="species" control={form.control} render={({ field }) => (<FormItem><FormLabel>Espécie</FormLabel><FormControl><Input placeholder="Cachorro, Gato, Pássaro..." {...field} /></FormControl><FormMessage/></FormItem>)} />
                <FormField name="description" control={form.control} render={({ field }) => (<FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea placeholder="Cores, marcas, coleira..." {...field} /></FormControl><FormMessage/></FormItem>)} />
                <FormField name="lastSeenLocation" control={form.control} render={({ field }) => (<FormItem><FormLabel>Localização</FormLabel><FormControl><Input placeholder="Último local visto ou encontrado" {...field} /></FormControl><FormMessage/></FormItem>)} />
                <FormField name="date" control={form.control} render={({ field }) => (<FormItem><FormLabel>Data da Ocorrência</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage/></FormItem>)} />
                <FormField name="contactName" control={form.control} render={({ field }) => (<FormItem><FormLabel>Seu Nome para Contato</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>)} />
                <FormField name="contactPhone" control={form.control} render={({ field }) => (<FormItem><FormLabel>Seu Telefone para Contato</FormLabel><FormControl><Input type="tel" placeholder="(XX) XXXXX-XXXX" {...field} /></FormControl><FormMessage/></FormItem>)} />
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" asChild><Link href="/dashboard/citizen">Cancelar</Link></Button>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Enviar para Análise</Button>
                </div>
            </form>
        </Form>
    )
}


// --- Formulário de Solicitação de Serviço Padrão ---
function DefaultServiceRequestForm({ preselectedCategory, preselectedType }: { preselectedCategory: ServiceCategory | null, preselectedType: ServiceRequestType | null}) {
    const { toast } = useToast();
    const router = useRouter();
    const { currentUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(preselectedCategory);

    const form = useForm<z.infer<typeof serviceRequestFormSchema>>({
        resolver: zodResolver(serviceRequestFormSchema),
        defaultValues: {
            requestType: preselectedType || undefined,
            description: "",
            address: "",
            contactPhone: "",
        },
    });

    useEffect(() => {
        const typeInfo = SERVICE_REQUEST_TYPES.find(rt => rt.value === preselectedType);
        if (typeInfo) {
            setSelectedCategory(typeInfo.category);
            form.setValue('requestType', typeInfo.value);
        }
    }, [preselectedType, form]);

    async function onSubmit(values: z.infer<typeof serviceRequestFormSchema>) {
        if (!currentUser) {
            toast({ title: "Erro", description: "Você precisa estar logado para enviar uma solicitação.", variant: "destructive" });
            return;
        }
        setIsSubmitting(true);
        
        const result = await addRequestAction({
            requestType: values.requestType,
            description: values.description,
            address: values.address,
            contactPhone: values.contactPhone,
            citizenId: currentUser.uid,
            citizenName: currentUser.displayName || currentUser.email || 'Cidadão',
        });

        if (result.success) {
            toast({
                title: "Solicitação Enviada!",
                description: `Sua solicitação de ${SERVICE_REQUEST_TYPES.find(s => s.value === values.requestType)?.label} foi registrada com sucesso. Protocolo: ${result.protocol}`,
                variant: "default",
            });
            router.push('/dashboard/citizen/requests');
        } else {
            toast({
                title: "Erro ao Enviar",
                description: result.error || "Não foi possível registrar a solicitação. Tente novamente.",
                variant: "destructive",
            });
        }
        setIsSubmitting(false);
    }
    
    const handleCategorySelect = (category: ServiceCategory) => {
        setSelectedCategory(category);
        form.resetField('requestType');
    }
    
    const handleBackToCategories = () => {
        setSelectedCategory(null);
        form.resetField('requestType');
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {!selectedCategory ? (
                    <FormItem>
                        <FormLabel className="text-base">Tipo de Solicitação</FormLabel>
                        <FormDescription>Primeiro, selecione a categoria do serviço desejado.</FormDescription>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            {Object.entries(categories).map(([key, { label, icon: Icon }]) => (
                                <Button key={key} type="button" variant="outline" className="h-auto justify-start p-4 text-left group" onClick={() => handleCategorySelect(key as ServiceCategory)}>
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
                            <Button type="button" variant="link" onClick={handleBackToCategories} className="text-sm">Trocar Categoria</Button>
                        </div>
                        <FormField control={form.control} name="requestType" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Serviço Específico</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || ""} >
                                <FormControl><SelectTrigger><SelectValue placeholder="Selecione o serviço desejado" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {SERVICE_REQUEST_TYPES.filter(type => type.category === selectedCategory).map(type => (
                                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                )}
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Descrição Detalhada</FormLabel>
                        <FormControl><Textarea placeholder="Descreva sua solicitação..." className="min-h-[120px]" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Endereço (se aplicável)</FormLabel>
                        <FormControl><Input placeholder="Rua Exemplo, 123, Bairro" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="contactPhone" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Telefone para Contato (opcional)</FormLabel>
                        <FormControl><Input type="tel" placeholder="(XX) XXXXX-XXXX" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" asChild><Link href="/dashboard/citizen/requests">Cancelar</Link></Button>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Enviar Solicitação</Button>
                </div>
            </form>
        </Form>
    );
}

// --- Componente Principal que decide qual formulário renderizar ---
export default function NewRequestForm() {
    const searchParams = useSearchParams();
    const preselectedType = searchParams.get('type') as ServiceRequestType | null;
    const initialTypeInfo = SERVICE_REQUEST_TYPES.find(rt => rt.value === preselectedType);

    const isLostFoundRequest = preselectedType === 'registro_animal_perdido_encontrado';

    const title = isLostFoundRequest ? "Registrar Animal Perdido/Encontrado" : "Nova Solicitação de Serviço";
    const description = isLostFoundRequest 
        ? "Preencha os dados do animal para que ele possa ser encontrado."
        : "Preencha o formulário abaixo para abrir uma nova solicitação de serviço.";

    return (
         <>
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard/citizen/requests">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Voltar</span>
                </Link>
                </Button>
                <PageTitle title={title} icon={PlusCircle} className="mb-0 flex-grow" />
            </div>

            <Card>
                <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLostFoundRequest ? (
                        <LostFoundRequestForm />
                    ) : (
                        <DefaultServiceRequestForm 
                            preselectedCategory={initialTypeInfo?.category || null} 
                            preselectedType={preselectedType} 
                        />
                    )}
                </CardContent>
            </Card>
        </>
    )
}
