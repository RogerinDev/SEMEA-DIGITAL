import PublicLayout from '@/components/layouts/public-layout';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import Link from 'next/link';

const documents = [
  {
    title: "Resolução CODEMA 01/2024",
    description: "Estabelece os procedimentos e critérios para autorização de poda e corte de árvores no município.",
    link: "https://www.varginha.mg.gov.br/portal/jornal/1145",
    linkText: "Ver Jornal Oficial (p. 19-20)"
  },
  {
    title: "Deliberação Normativa nº 01/2018",
    description: "Define os critérios e diretrizes para o parcelamento do solo urbano, incluindo aspectos de arborização.",
    link: "#", // Placeholder
    linkText: "Download (Link Indisponível)"
  },
  {
    title: "Lei 5.848/2014",
    description: "Institui o projeto 'Nasce uma Criança, Plante uma Árvore' no município de Varginha.",
    link: "#", // Placeholder
    linkText: "Ver Lei (Link Indisponível)"
  },
  {
    title: "Modelo de Placa - Proibido Jogar Lixo",
    description: "Modelo oficial de placa para instalação em áreas com descarte irregular de resíduos.",
    link: "http://www.varginha.mg.gov.br/imgeditor/file/SEMEA/Modelo_placa_PROIBIDO%20JOGAR%20LIXO_COLORIDO_NOVO.pdf",
    linkText: "Baixar Modelo PDF"
  },
  {
    title: "Formulários e Requerimentos",
    description: "Acesse e baixe os formulários necessários para diversas solicitações ao setor de arborização.",
    link: "#", // Placeholder
    linkText: "Ver Formulários (Link Indisponível)"
  }
];

export default function ArborizationLegislationPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto py-12 px-4">
        <PageTitle
          title="Legislação e Documentos de Arborização"
          icon={FileText}
          description="Acesse as principais normas, leis e formulários que regem a arborização urbana em Varginha."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <CardTitle>{doc.title}</CardTitle>
                <CardDescription>{doc.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild disabled={doc.link === "#"}>
                  <Link href={doc.link} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    {doc.linkText}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
