"use client";

import React, { useState, useMemo } from 'react';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
    Recycle, 
    Search, 
    MapPin, 
    Clock, 
    Trash2, 
    Building, 
    Info,
    Lightbulb,
    MonitorSmartphone,
    Battery,
    Droplets,
    Pill,
    Hammer,
    CircleDot,
    Construction,
    Leaf,
    Sofa,
    Container,
    Unplug,
    Sparkles,
    GlassWater,
    Book,
    Footprints
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { CollectionPoint, Ecopoint } from '@/types';

interface WasteClientPageProps {
    initialEcopoints: Ecopoint[];
    initialCollectionPoints: CollectionPoint[];
}

export default function WasteClientPage({ initialEcopoints, initialCollectionPoints }: WasteClientPageProps) {
  const [searchTermEcopontos, setSearchTermEcopontos] = useState('');
  const [searchTermBairro, setSearchTermBairro] = useState('');
  
  const getMaterialIcon = (material: string): React.ElementType => {
    const lowerMaterial = material.toLowerCase();
    if (lowerMaterial.includes('esponja')) return Sparkles;
    if (lowerMaterial.includes('lâmpada')) return Lightbulb;
    if (lowerMaterial.includes('eletrônico')) return MonitorSmartphone;
    if (lowerMaterial.includes('pilha') || lowerMaterial.includes('bateria')) return Battery;
    if (lowerMaterial.includes('óleo')) return Droplets;
    if (lowerMaterial.includes('medicamento') || lowerMaterial.includes('remédio') || lowerMaterial.includes('blister')) return Pill;
    if (lowerMaterial.includes('ferro-velho')) return Hammer;
    if (lowerMaterial.includes('pneu')) return CircleDot;
    if (lowerMaterial.includes('construção')) return Construction;
    if (lowerMaterial.includes('poda') || lowerMaterial.includes('capim')) return Leaf;
    if (lowerMaterial.includes('móveis') || lowerMaterial.includes('sofá')) return Sofa;
    if (lowerMaterial.includes('cosmético')) return Container;
    if (lowerMaterial.includes('lacre')) return Unplug;
    if (lowerMaterial.includes('papel') || lowerMaterial.includes('plástico') || lowerMaterial.includes('tampinha')) return Recycle;
    if (lowerMaterial.includes('vidro')) return GlassWater;
    if (lowerMaterial.includes('meias')) return Footprints;
    return Book;
  };

  const filteredEcopontos = useMemo(() => {
    if (!searchTermEcopontos) {
      return initialEcopoints.filter(e => e.active);
    }
    return initialEcopoints.filter(ecoponto =>
      ecoponto.active && (
        ecoponto.material.toLowerCase().includes(searchTermEcopontos.toLowerCase()) ||
        ecoponto.name.toLowerCase().includes(searchTermEcopontos.toLowerCase())
      )
    );
  }, [searchTermEcopontos, initialEcopoints]);

  const resultadosColeta = useMemo(() => {
    const activePoints = initialCollectionPoints.filter(p => p.active);
    if (!searchTermBairro) {
      return [];
    }
    const searchLower = searchTermBairro.toLowerCase();
    
    const exactMatches = activePoints.filter(item => item.neighborhood.toLowerCase() === searchLower);
    if (exactMatches.length > 0) {
      return exactMatches;
    }
    
    return activePoints.filter(item => item.neighborhood.toLowerCase().includes(searchLower));
  }, [searchTermBairro, initialCollectionPoints]);

  return (
      <div className="container mx-auto py-12 px-4">
        <PageTitle 
            title="Coleta e Descarte Consciente" 
            icon={Recycle} 
            description="Encontre locais para descarte e horários da coleta de lixo em Varginha." 
        />

        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
                <Search className="mr-3 h-7 w-7 text-primary"/>
                Ecopontos: Encontre o local certo para seu descarte
            </CardTitle>
            <CardDescription>
              Você pode separar alguns tipos de resíduos e realizar a entrega voluntária em alguns locais específicos - os chamados ECOPONTOS.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Digite o material ou nome do ecoponto..."
              value={searchTermEcopontos}
              onChange={(e) => setSearchTermEcopontos(e.target.value)}
              className="mb-6 text-base"
            />
            <ScrollArea className="h-[400px] w-full rounded-md border">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="font-semibold">Material</TableHead>
                    <TableHead className="font-semibold">Ecoponto</TableHead>
                    <TableHead className="font-semibold">Endereço</TableHead>
                    <TableHead className="font-semibold">Telefone</TableHead>
                    <TableHead className="font-semibold">Observação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEcopontos.length > 0 ? (
                    filteredEcopontos.map((ecoponto, index) => {
                      const Icon = getMaterialIcon(ecoponto.material);
                      return (
                      <TableRow key={ecoponto.id || index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                            <span>{ecoponto.material}</span>
                          </div>
                        </TableCell>
                        <TableCell>{ecoponto.name}</TableCell>
                        <TableCell>{ecoponto.address}</TableCell>
                        <TableCell>{ecoponto.phone}</TableCell>
                        <TableCell>{ecoponto.observation || '-'}</TableCell>
                      </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        Nenhum ecoponto encontrado para "{searchTermEcopontos}".
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
             <CardTitle className="flex items-center text-2xl">
                <Trash2 className="mr-3 h-7 w-7 text-primary"/>
                Coleta de Lixo: Confira a programação
            </CardTitle>
            <CardDescription>
              Para saber quando o caminhão de lixo passa na sua rua, digite o nome do seu bairro ou estabelecimento. Solicitamos que os moradores coloquem o lixo uma hora antes do caminhão coletor passar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Digite o nome do seu bairro ou estabelecimento..."
              value={searchTermBairro}
              onChange={(e) => setSearchTermBairro(e.target.value)}
              className="mb-6 text-base"
            />
            <div className="space-y-4">
                {searchTermBairro && resultadosColeta.length > 0 ? (
                    resultadosColeta.map((resultado, index) => (
                        <Card key={resultado.id || index} className="bg-muted/50">
                            <CardHeader>
                            <CardTitle className="flex items-center"><Building className="mr-2 h-6 w-6 text-primary"/> {resultado.neighborhood}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                            <div className="flex items-center">
                                <MapPin className="mr-2 h-5 w-5 text-muted-foreground"/>
                                <p><strong>Dias da Coleta:</strong> {resultado.days}</p>
                            </div>
                            <div className="flex items-center">
                                <Clock className="mr-2 h-5 w-5 text-muted-foreground"/>
                                <p><strong>Período:</strong> {resultado.period}</p>
                            </div>
                            <div className="flex items-center">
                                <Clock className="mr-2 h-5 w-5 text-muted-foreground"/>
                                <p><strong>Horário Aproximado:</strong> {resultado.schedule}</p>
                            </div>
                             {resultado.observation && (
                                <div className="flex items-start text-sm mt-2">
                                    <Info className="mr-2 h-4 w-4 text-muted-foreground shrink-0 mt-0.5"/>
                                    <p><strong className="font-medium">Atenção:</strong> {resultado.observation}</p>
                                </div>
                            )}
                            </CardContent>
                        </Card>
                    ))
                ) : searchTermBairro ? (
                <Card className="bg-muted/30">
                    <CardContent className="py-6 text-center">
                    <Info className="mx-auto h-8 w-8 text-muted-foreground mb-2"/>
                    <p className="text-muted-foreground">Nenhum resultado encontrado para "{searchTermBairro}". Verifique a digitação ou tente um nome mais genérico.</p>
                    </CardContent>
                </Card>
                ) : (
                    <Card className="bg-muted/30">
                        <CardContent className="py-6 text-center">
                            <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2"/>
                            <p className="text-muted-foreground">Digite o nome do seu bairro para ver os horários de coleta.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
