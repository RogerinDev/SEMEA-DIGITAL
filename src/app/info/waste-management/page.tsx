import PublicLayout from '@/components/layouts/public-layout';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Recycle, Trash2, MapPin, Phone, Info } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function WasteManagementPage() {
  const coletaSeletivaPontos = [
    { id: '1', nome: 'Ponto Central', endereco: 'Praça da Matriz, Centro', horarios: 'Seg-Sex: 8h-18h', tipos: ['Papel', 'Plástico', 'Vidro', 'Metal'] },
    { id: '2', nome: 'EcoPonto Bairro Alegre', endereco: 'Rua das Flores, 123, B. Alegre', horarios: 'Sáb: 9h-13h', tipos: ['Papel', 'Plástico', 'Óleo de Cozinha'] },
    { id: '3', nome: 'Supermercado Parceiro', endereco: 'Av. Principal, 500', horarios: 'Diariamente: 8h-20h', tipos: ['Pilhas', 'Baterias'] },
  ];

  return (
    <PublicLayout>
      <div className="container mx-auto py-12 px-4">
        <PageTitle title="Gestão de Resíduos Sólidos" icon={Recycle} description="Informações sobre coleta seletiva, descarte correto, pontos de entrega e programas de reciclagem em Varginha." />

        <div className="grid md:grid-cols-2 gap-8 mb-12 items-start">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center"><Trash2 className="mr-2 h-6 w-6 text-primary"/>Coleta Domiciliar Comum</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-2">Saiba os dias e horários da coleta de lixo comum no seu bairro.</p>
                    <Image src="https://placehold.co/600x300.png" data-ai-hint="garbage truck" alt="Caminhão de coleta" width={600} height={300} className="rounded-md mb-4 w-full" />
                    <Button variant="outline" asChild>
                        <Link href="#"> {/* Link to calendar or PDF */}
                          <span className="flex items-center">
                            <Info className="mr-2 h-4 w-4"/> Consultar Cronograma de Coleta
                          </span>
                        </Link>
                    </Button>
                </CardContent>
            </Card>
             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center"><Recycle className="mr-2 h-6 w-6 text-primary"/>Coleta Seletiva</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">A coleta seletiva é fundamental para a reciclagem e preservação ambiental. Separe seus resíduos recicláveis (papel, plástico, vidro, metal) e descarte nos locais corretos.</p>
                    <Image src="https://placehold.co/600x300.png" data-ai-hint="recycling bins" alt="Coleta Seletiva" width={600} height={300} className="rounded-md mb-4 w-full" />
                     <Button asChild>
                        <Link href="/dashboard/citizen/requests/new?type=coleta_especial_residuos">
                          <span className="flex items-center">
                           <Trash2 className="mr-2 h-4 w-4"/> Solicitar Coleta Especial (Grandes Volumes)
                          </span>
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
        
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><MapPin className="mr-2 h-6 w-6 text-primary"/>Pontos de Coleta Seletiva e Especiais</CardTitle>
            <CardDescription>Encontre o local mais próximo para descartar seus recicláveis, óleo de cozinha, pilhas, baterias e outros resíduos especiais.</CardDescription>
          </CardHeader>
          <CardContent>
            {coletaSeletivaPontos.map(ponto => (
              <div key={ponto.id} className="border-b py-4 last:border-b-0">
                <h3 className="font-semibold text-lg">{ponto.nome}</h3>
                <p className="text-sm text-muted-foreground">{ponto.endereco}</p>
                <p className="text-sm"><strong>Horários:</strong> {ponto.horarios}</p>
                <p className="text-sm"><strong>Aceita:</strong> {ponto.tipos.join(', ')}</p>
              </div>
            ))}
             {coletaSeletivaPontos.length === 0 && <p className="text-muted-foreground">Nenhum ponto de coleta cadastrado no momento.</p>}
             <div className="mt-6">
                <Image src="https://placehold.co/800x400.png" data-ai-hint="city map points" alt="Mapa dos pontos de coleta" width={800} height={400} className="rounded-md w-full" />
                <p className="text-xs text-muted-foreground mt-1 text-center">Mapa ilustrativo dos pontos de coleta (placeholder).</p>
             </div>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold">O que é reciclável?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-2">
              <p><strong>Papéis:</strong> Jornais, revistas, caixas de papelão, embalagens longa vida (limpas), papéis de escritório. Evite: Papel carbono, fitas adesivas, fotografias, papéis sujos ou engordurados.</p>
              <p><strong>Plásticos:</strong> Garrafas PET, embalagens de produtos de limpeza e higiene, potes, sacos e sacolas. Evite: Cabos de panela, tomadas, espuma, acrílico.</p>
              <p><strong>Vidros:</strong> Garrafas, potes de conserva, frascos de perfume. Lave-os e, se possível, retire as tampas. Evite: Espelhos, vidros planos, lâmpadas, tubos de TV.</p>
              <p><strong>Metais:</strong> Latas de alumínio e aço, arames, pregos, tampas de metal. Evite: Clipes, grampos, esponjas de aço, pilhas e baterias (descarte especial).</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold">Descarte de Resíduos Especiais</AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-2">
              <p><strong>Óleo de Cozinha:</strong> Armazene em garrafas PET e leve a um ponto de coleta. Nunca descarte no ralo.</p>
              <p><strong>Pilhas e Baterias:</strong> Contêm metais pesados. Devem ser descartadas em coletores específicos (supermercados, lojas de eletrônicos).</p>
              <p><strong>Lixo Eletrônico:</strong> Computadores, celulares, etc. Procure por campanhas de coleta ou pontos de descarte específicos.</p>
              <p><strong>Medicamentos Vencidos:</strong> Entregue em farmácias que possuam programa de coleta.</p>
              <p><strong>Pneus:</strong> Procure borracharias ou pontos de coleta específicos.</p>
            </AccordionContent>
          </AccordionItem>
           <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold">Contato para Dúvidas</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p>Para mais informações sobre a gestão de resíduos em Varginha, entre em contato com a Secretaria Municipal de Meio Ambiente:</p>
              <p className="mt-2"><Phone className="inline mr-2 h-4 w-4"/> (XX) XXXX-XXXX</p>
              {/* <p><Mail className="inline mr-2 h-4 w-4"/> meioambiente@varginha.mg.gov.br</p> */}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </PublicLayout>
  );
}
