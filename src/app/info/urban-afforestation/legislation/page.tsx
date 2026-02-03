
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { getUrbanAfforestationSettings } from '@/app/actions/settings-actions';


export default async function ArborizationLegislationPage() {
  const settings = await getUrbanAfforestationSettings();
  const documents = settings?.downloads || [];

  return (
    <>
      <PageTitle
        title="Legislação e Documentos de Arborização"
        icon={FileText}
        description="Acesse as principais normas, leis e formulários que regem a arborização urbana em Varginha."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.map((doc, index) => (
          <Card key={doc.id || index} className="shadow-lg">
            <CardHeader>
              <CardTitle>{doc.label}</CardTitle>
              <CardDescription>{doc.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild disabled={!doc.url || doc.url === "#"}>
                <Link href={doc.url} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  {doc.url === '#' ? 'Link Indisponível' : 'Acessar Documento'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
         {documents.length === 0 && <p className="text-muted-foreground col-span-full text-center">Nenhum documento disponível no momento.</p>}
      </div>
    </>
  );
}
