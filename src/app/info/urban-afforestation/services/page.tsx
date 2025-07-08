"use client";

import { PageTitle } from '@/components/page-title';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ClipboardList, CheckCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

function FormSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-10 w-1/3 ml-auto" />
    </div>
  );
}

const PruningRequestForm = dynamic(
  () => import('@/components/arborization/pruning-request-form'),
  { 
    ssr: false,
    loading: () => <FormSkeleton /> 
  }
);


export default function ArborizationServicesPage() {
  return (
    <>
      <PageTitle
        title="Serviços de Arborização"
        icon={ClipboardList}
        description="Informações sobre poda, corte, análise de projetos e outras solicitações."
      />

      <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="item-1">
        <AccordionItem value="item-1" className="border rounded-lg">
          <AccordionTrigger className="bg-muted/50 px-6 py-4 text-lg font-semibold hover:bg-muted">
            Solicitação de Poda ou Corte de Árvore
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <p className="text-muted-foreground mb-4">
              O serviço de poda e corte de árvores em áreas públicas e particulares é regido pela Resolução CODEMA 01/2024. 
              Para solicitar, preencha o formulário abaixo e anexe os documentos necessários. Após o envio, você receberá um protocolo para acompanhar o andamento da sua solicitação.
            </p>
            <PruningRequestForm />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border rounded-lg">
          <AccordionTrigger className="bg-muted/50 px-6 py-4 text-lg font-semibold hover:bg-muted">
            Análise de Projetos (Paisagístico e de Compensação)
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <p className="text-muted-foreground">
              Profissionais que precisam submeter relatórios de implantação de projetos paisagísticos ou de compensação ambiental para análise e aprovação da SEMEA devem seguir os seguintes passos:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2 text-muted-foreground">
              <li>Prepare toda a documentação conforme as diretrizes da SEMEA e a legislação vigente.</li>
              <li>Entregue o relatório completo e os documentos associados no Protocolo Central da Prefeitura de Varginha.</li>
              <li>Aguarde o contato do setor de arborização para o acompanhamento e parecer técnico.</li>
            </ul>
            <Card className="mt-6 bg-secondary/20">
              <CardHeader>
                  <CardTitle className="text-lg">Funcionalidade Futura</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-sm text-foreground">
                      Em breve, planejamos implementar uma área de upload diretamente no aplicativo para que profissionais possam submeter esses relatórios e documentos de forma digital.
                  </p>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="border rounded-lg">
          <AccordionTrigger className="bg-muted/50 px-6 py-4 text-lg font-semibold hover:bg-muted">
            Informações Importantes
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 space-y-4">
              <Card>
                  <CardHeader className="flex flex-row items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-primary"/>
                      <CardTitle className="text-lg">Compensação Ambiental</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-sm text-muted-foreground">Para realização de corte de árvore será obrigatoriamente solicitado o cumprimento de compensação ambiental, conforme previsto na Resolução CODEMA 01/2024.</p>
                  </CardContent>
              </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-primary"/>
                      <CardTitle className="text-lg">Execução do Serviço</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-sm text-muted-foreground">A execução pela Prefeitura ocorre apenas em áreas públicas. Em áreas particulares, a execução é de responsabilidade e custo do solicitante, após a emissão da autorização pela SEMEA.</p>
                  </CardContent>
              </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center gap-3">
                      <AlertTriangle className="h-6 w-6 text-yellow-500"/>
                      <CardTitle className="text-lg">Risco e Rede Elétrica</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-sm text-muted-foreground">Casos de risco iminente têm prioridade de atendimento. Em situações de conflito com a rede elétrica, a execução do serviço depende de uma intervenção prévia da CEMIG para garantir a segurança.</p>
                  </CardContent>
              </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
