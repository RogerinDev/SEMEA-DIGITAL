
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { educationalProjects, thematicLectures } from "@/lib/education-data";

const projectEnumValues = educationalProjects.map(p => p.title);
const ageEnumValues = ["Crianças (3 a 10 anos)", "Adolescentes (11 a 15 anos)", "Jovens (16 a 24 anos)"];

// Ensure there's at least one value for z.enum, using a fallback if necessary (though current data is non-empty)
const safeProjectTitles = projectEnumValues.length > 0 ? projectEnumValues : [""]; 
const safeAgeRanges = ageEnumValues.length > 0 ? ageEnumValues : [""];


const bookingFormSchema = z.object({
  responsibleName: z.string().min(3, "Nome do responsável é obrigatório."),
  contactPhone: z.string().min(10, "Telefone inválido. Inclua o DDD."),
  institutionName: z.string().min(3, "Nome da instituição é obrigatório."),
  projectOfInterest: z.enum(safeProjectTitles as [string, ...string[]], { required_error: "Selecione um projeto de interesse." }),
  selectedLectures: z.array(z.string()).optional(),
  requestedDate: z.date({ required_error: "Data pretendida é obrigatória." }),
  requestedTime: z.string().min(1, "Horário pretendido é obrigatório."),
  estimatedAudience: z.coerce.number().min(1, "Público estimado deve ser no mínimo 1."),
  audienceAgeRange: z.enum(safeAgeRanges as [string, ...string[]], { required_error: "Selecione a faixa etária." }),
  additionalInfo: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface EducationBookingFormProps {
  preselectedProject: string | null;
}

export function EducationBookingForm({ preselectedProject }: EducationBookingFormProps) {
  const { toast } = useToast();
  
  const initialProjectOfInterest = (preselectedProject && safeProjectTitles.includes(preselectedProject) 
                                      ? preselectedProject 
                                      : (safeProjectTitles[0] || undefined)) as (typeof safeProjectTitles)[number] | undefined;

  const initialAudienceAgeRange = (safeAgeRanges[0] || undefined) as (typeof safeAgeRanges)[number] | undefined;


  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      responsibleName: "",
      contactPhone: "",
      institutionName: "",
      projectOfInterest: initialProjectOfInterest,
      selectedLectures: [],
      requestedDate: undefined, // Calendar component handles undefined well
      requestedTime: "",
      estimatedAudience: undefined, // Input type number handles undefined (becomes empty)
      audienceAgeRange: initialAudienceAgeRange,
      additionalInfo: "",
    },
  });

  useEffect(() => {
    if (preselectedProject && safeProjectTitles.includes(preselectedProject)) {
      form.setValue('projectOfInterest', preselectedProject as (typeof safeProjectTitles)[number]);
    } else if (safeProjectTitles.length > 0 && !form.getValues('projectOfInterest')) {
       // If no valid preselection and current value is falsy, set to first default
       // form.setValue('projectOfInterest', safeProjectTitles[0] as typeof safeProjectTitles[number]); // Already handled by defaultValues
    }
  }, [preselectedProject, form, safeProjectTitles]);

  function onSubmit(data: BookingFormValues) {
    console.log("Solicitação de Agendamento Enviada:", data);
    toast({
      title: "Solicitação de Agendamento Enviada!",
      description: `Obrigado, ${data.responsibleName}. Sua solicitação para o projeto "${data.projectOfInterest}" foi registrada. Entraremos em contato em breve.`,
      variant: "default",
    });
    
    const resetProjectOfInterest = (preselectedProject && safeProjectTitles.includes(preselectedProject)
                                  ? preselectedProject
                                  : (safeProjectTitles[0] || undefined)) as (typeof safeProjectTitles)[number] | undefined;
    
    form.reset({
        responsibleName: "",
        contactPhone: "",
        institutionName: "",
        projectOfInterest: resetProjectOfInterest,
        selectedLectures: [],
        requestedDate: undefined,
        requestedTime: "",
        estimatedAudience: undefined,
        audienceAgeRange: (safeAgeRanges[0] || undefined) as typeof safeAgeRanges[number] | undefined,
        additionalInfo: "",
    });
  }
  
  const watchedProject = form.watch("projectOfInterest");
  const lecturesForCheckboxes = thematicLectures; 

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
            <FormField control={form.control} name="responsibleName" render={({ field }) => (
                <FormItem>
                    <FormLabel>Nome do Responsável pelo Agendamento</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="contactPhone" render={({ field }) => (
                <FormItem>
                    <FormLabel>Telefone (WhatsApp)</FormLabel>
                    <FormControl><Input type="tel" placeholder="(XX) XXXXX-XXXX" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
        <FormField control={form.control} name="institutionName" render={({ field }) => (
            <FormItem>
                <FormLabel>Nome da Instituição</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />

        <FormField control={form.control} name="projectOfInterest" render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Ação ou Projeto de Interesse</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                value={field.value || ""} // Ensure string value for RadioGroup
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {(safeProjectTitles[0] === "" ? [] : safeProjectTitles).map((projectTitle) => ( // Avoid rendering if fallback "" is the only option
                  <FormItem key={projectTitle} className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={projectTitle} />
                    </FormControl>
                    <FormLabel className="font-normal">{projectTitle}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        
        <FormItem>
            <FormLabel>Cardápio de Palestras (selecione as desejadas)</FormLabel>
            <FormDescription>
              {watchedProject 
                ? `Palestras sugeridas para ${watchedProject}: ${educationalProjects.find(p=>p.title === watchedProject)?.associatedLectures?.join(', ') || 'Nenhuma específica.'}`
                : "Selecione um projeto acima para ver sugestões ou escolha da lista completa."}
            </FormDescription>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mt-2 max-h-60 overflow-y-auto border p-3 rounded-md">
                {(lecturesForCheckboxes || []).map((lecture) => {
                    const isAssociated = watchedProject && educationalProjects.find(p=>p.title === watchedProject)?.associatedLectures?.includes(lecture.title);
                    return (
                    <FormField
                        key={lecture.id}
                        control={form.control}
                        name="selectedLectures"
                        render={({ field }) => {
                        return (
                            <FormItem className={cn("flex flex-row items-start space-x-3 space-y-0", isAssociated && "font-semibold")}>
                            <FormControl>
                                <Checkbox
                                checked={field.value?.includes(lecture.title)}
                                onCheckedChange={(checked) => {
                                    return checked
                                    ? field.onChange([...(field.value || []), lecture.title])
                                    : field.onChange(
                                        (field.value || []).filter((value) => value !== lecture.title)
                                    );
                                }}
                                />
                            </FormControl>
                            <FormLabel className={cn("text-sm font-normal", isAssociated && "text-primary")}>
                                {lecture.title}
                            </FormLabel>
                            </FormItem>
                        );
                        }}
                    />
                    );
                })}
            </div>
            <FormMessage {...form.getFieldState("selectedLectures")} />
        </FormItem>

        <div className="grid md:grid-cols-2 gap-6">
            <FormField control={form.control} name="requestedDate" render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Data Pretendida</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus locale={ptBR} disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1 )) } />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="requestedTime" render={({ field }) => (
                <FormItem>
                    <FormLabel>Horário Pretendido</FormLabel>
                    <FormControl><Input placeholder="Ex: 09:00 às 11:00 ou Tarde" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </div>

        <FormField control={form.control} name="estimatedAudience" render={({ field }) => (
            <FormItem>
                <FormLabel>Público Estimado (Número)</FormLabel>
                <FormControl><Input type="number" {...field} onChange={event => field.onChange(event.target.value === '' ? undefined : +event.target.value)} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />

        <FormField control={form.control} name="audienceAgeRange" render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Faixa Etária do Público</FormLabel>
            <FormControl>
              <RadioGroup 
                onValueChange={field.onChange} 
                value={field.value || ""}  // Ensure string value for RadioGroup
                className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-4"
              >
                {(safeAgeRanges[0] === "" ? [] : safeAgeRanges).map((range) => ( // Avoid rendering if fallback "" is only option
                  <FormItem key={range} className="flex items-center space-x-3 space-y-0">
                    <FormControl><RadioGroupItem value={range} /></FormControl>
                    <FormLabel className="font-normal">{range}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="additionalInfo" render={({ field }) => (
            <FormItem>
                <FormLabel>Complemente com mais informações sobre a ação desejada (opcional)</FormLabel>
                <FormControl><Textarea placeholder="Detalhes sobre o público, infraestrutura disponível, expectativas, etc." className="min-h-[100px]" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
        )} />

        <div className="flex justify-end">
          <Button type="submit">Enviar Solicitação de Agendamento</Button>
        </div>
      </form>
    </Form>
  );
}
