
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GraduationCap, Lightbulb, Recycle, Sprout, HeartHandshake, Mail, Phone, CalendarIcon, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addEducationRequestAction } from '@/app/actions/requests-actions';

const projects = [
  { id: 'escola-verde', title: 'Escola Verde - Educação Climática', description: 'Destaca a importância das árvores e amplia a arborização nas escolas.', audience: 'Infantil ao Médio', icon: Lightbulb },
  { id: 'educacao-lixo-zero', title: 'Educação Lixo Zero', description: 'Capacitação sobre descarte correto e consumo consciente.', audience: 'Educadores e Lideranças', icon: Recycle },
  { id: 'botanica-no-parque', title: 'Botânica no Parque', description: 'Aulas práticas nos Parques Novo Horizonte ou Centenário com identificação de árvores. Duração de 2h.', audience: 'Fundamental e Médio', icon: Sprout },
  { id: 'conexao-animal', title: 'Conexão Animal', description: 'Estimula boas práticas de bem-estar animal, adoção e convivência com animais silvestres.', audience: 'Todos', icon: HeartHandshake },
];

const lectures = [
  { id: 'importancia-arvores', label: 'A Importância das Árvores' },
  { id: 'historia-lixo', label: 'História do Lixo' },
  { id: 'bichos-mato-mata', label: 'Bichos do Mato e da Mata' },
  { id: 'bichos-lixo', label: 'Os Bichos e o Lixo' },
  { id: 'cuidar-animais', label: 'Como cuidar dos animais de estimação' },
  { id: 'lixo-luxo', label: 'O Lixo que é Luxo' },
  { id: 'bicho-chama-bicho', label: 'Bicho que chama Bicho (Contação de Estória)' },
  { id: 'panorama-varginha', label: 'Panorama Ambiental de Varginha' },
  { id: 'ods', label: 'ODS (Temas Diversos)' },
];

const formSchema = z.object({
  responsibleName: z.string().min(3, "Nome do responsável é obrigatório."),
  contactPhone: z.string().min(10, "Telefone / WhatsApp é obrigatório."),
  institutionName: z.string().min(3, "Nome da instituição é obrigatório."),
  projects: z.array(z.string()),
  lectures: z.array(z.string()),
  eventDate: z.date({ required_error: "A data pretendida é obrigatória." }),
  eventTime: z.string().min(1, "Horário é obrigatório."),
  estimatedAudience: z.coerce.number().min(1, "Público estimado é obrigatório."),
  ageGroup: z.enum(['3-10', '11-15', '16-24', 'adults'], { required_error: "Selecione a faixa etária." }),
  observations: z.string().optional(),
});

export default function EnvironmentalEducationPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const formRef = React.useRef<HTMLDivElement>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            responsibleName: "",
            contactPhone: "",
            institutionName: "",
            projects: [],
            lectures: [],
            eventTime: "",
            observations: "",
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const result = await addEducationRequestAction({
                ...data,
                eventDate: data.eventDate.toISOString(),
            });

            if (result.success) {
                toast({
                    title: "Solicitação Enviada!",
                    description: "Sua solicitação de agendamento foi registrada. Entraremos em contato em breve para confirmar.",
                });
                form.reset();
                 // Scroll to top after successful submission
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                throw new Error(result.error || "Não foi possível enviar a solicitação.");
            }
        } catch (error: any) {
            toast({
                title: "Erro ao Enviar",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    const handleScrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

  return (
    <>
      <PageTitle
        title="Programa Varginha Sustentável"
        icon={GraduationCap}
        description="Construir ações de Educação Ambiental de maneira contínua e integrada, fomentando a Sustentabilidade no Município de Varginha."
      />

      <section className="mb-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center items-center">
              <Image
                  src="/educacao-ambiental-missao.png"
                  alt="Logo do Programa Varginha Sustentável"
                  width={400}
                  height={400}
                  className="object-contain"
                  data-ai-hint="program logo"
                  priority
              />
          </div>
          <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">Nossa Missão</h2>
              <p className="text-muted-foreground">
                  O Programa Varginha Sustentável de Educação Ambiental visa engajar cidadãos, escolas e instituições na construção de um futuro mais verde e consciente. Através de projetos inovadores, palestras informativas e eventos participativos, buscamos semear o conhecimento e as práticas sustentáveis em toda a comunidade.
              </p>
              <p className="text-muted-foreground">
                  Explore nossos projetos e descubra como sua instituição pode solicitar uma ação educativa!
              </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Projetos Contínuos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <project.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="text-xl text-primary">{project.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <p className="text-sm text-muted-foreground">{project.description}</p>
                <p className="text-xs font-semibold text-foreground">Público-Alvo: <span className="font-normal text-muted-foreground">{project.audience}</span></p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12 text-center">
         <Button size="lg" onClick={handleScrollToForm}>
            <CalendarIcon className="mr-2 h-5 w-5"/>
            Solicitar um Projeto ou Palestra
        </Button>
      </section>

      <Separator className="my-12" />

      <div className="mb-8">
            <Card>
                <CardHeader>
                    <CardTitle>Cardápio de Palestras e Temas (ODS)</CardTitle>
                    <CardDescription>Palestras disponíveis que podem ser solicitadas no formulário abaixo.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-muted-foreground">
                        {lectures.map((lecture) => (
                        <li key={lecture.id} className="flex items-center">
                            <GraduationCap className="h-4 w-4 mr-2 text-primary/70" />
                            {lecture.label}
                        </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>


      <Separator className="my-12" />

      <section ref={formRef} className="mb-16 scroll-mt-20">
        <h2 className="text-3xl font-bold text-center mb-10 text-primary">Formulário de Solicitação</h2>
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Solicitar Agendamento de Ação Educativa</CardTitle>
            <CardDescription>Preencha os campos abaixo. Entraremos em contato para confirmar o agendamento. Este formulário é aberto ao público.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-6">
                    <FormField control={form.control} name="responsibleName" render={({ field }) => (
                        <FormItem><FormLabel>Nome do Responsável</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="contactPhone" render={({ field }) => (
                        <FormItem><FormLabel>Telefone / WhatsApp</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="institutionName" render={({ field }) => (
                    <FormItem><FormLabel>Nome da Instituição</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <div className="grid sm:grid-cols-2 gap-8">
                  <FormField control={form.control} name="projects" render={() => (
                    <FormItem>
                      <div className="mb-4"><FormLabel className="text-base">Ação ou Projeto de Interesse</FormLabel></div>
                      {projects.map((item) => (
                        <FormField key={item.id} control={form.control} name="projects" render={({ field }) => (
                          <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl><Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                return checked ? field.onChange([...field.value, item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                            }} /></FormControl>
                            <FormLabel className="font-normal">{item.title}</FormLabel>
                          </FormItem>
                        )} />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="lectures" render={() => (
                    <FormItem>
                      <div className="mb-4"><FormLabel className="text-base">Cardápio de Palestras</FormLabel></div>
                      {lectures.map((item) => (
                        <FormField key={item.id} control={form.control} name="lectures" render={({ field }) => (
                          <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl><Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                return checked ? field.onChange([...field.value, item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                            }} /></FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                          </FormItem>
                        )} />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField control={form.control} name="eventDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Data Pretendida</FormLabel>
                      <Popover><PopoverTrigger asChild>
                          <FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                              {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button></FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} initialFocus />
                        </PopoverContent>
                      </Popover><FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="eventTime" render={({ field }) => (
                    <FormItem><FormLabel>Horário Pretendido</FormLabel><FormControl><Input placeholder="Ex: 14:00" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField control={form.control} name="estimatedAudience" render={({ field }) => (
                    <FormItem><FormLabel>Público Estimado</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="ageGroup" render={({ field }) => (
                    <FormItem><FormLabel>Faixa Etária</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="3-10" /></FormControl><FormLabel className="font-normal">Crianças (3 a 10 anos)</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="11-15" /></FormControl><FormLabel className="font-normal">Adolescentes (11 a 15 anos)</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="16-24" /></FormControl><FormLabel className="font-normal">Jovens (16 a 24 anos)</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="adults" /></FormControl><FormLabel className="font-normal">Adultos/Misto</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                
                <FormField control={form.control} name="observations" render={({ field }) => (
                  <FormItem><FormLabel>Observações / Mais Informações</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 h-4 w-4" />}
                    Solicitar Agendamento
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-12" />

      <Card>
        <CardHeader>
            <CardTitle>Contato do Setor de Educação Ambiental</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <p><strong>Bióloga:</strong> Jaara Alvarenga Cardoso Tavares</p>
            <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>(35) 3690-2529</span>
            </div>
             <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>(35) 8429-9795 (WhatsApp)</span>
            </div>
        </CardContent>
    </Card>
    </>
  );
}
