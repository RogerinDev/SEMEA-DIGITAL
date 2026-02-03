// Arquivo: src/app/seed/page.tsx
'use client';

import { useState } from 'react';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Loader2, AlertTriangle, CheckCircle, Sprout, GraduationCap } from 'lucide-react';
import { seedDatabaseAction } from '@/app/actions/seed-database';
import { seedUrbanAfforestationDataAction, seedEnvironmentalEducationDataAction } from '../actions/seed-actions';


function ResultMessage({ result }: { result: { success: boolean; message: string } | null }) {
    if (!result) return null;

    return (
        <div className={`mt-6 p-4 rounded-md text-left ${result.success ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
            <div className="flex items-start gap-3">
            {result.success ? (
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mt-1" />
            ) : (
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 mt-1" />
            )}
            <div>
                <h4 className={`font-semibold ${result.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                {result.success ? 'Sucesso!' : 'Falha na Operação'}
                </h4>
                <p className={`text-sm ${result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                {result.message}
                </p>
                {!result.success && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                    (Verifique os logs do servidor no Firebase Studio para o erro detalhado)
                </p>
                )}
            </div>
            </div>
        </div>
    )
}

/**
 * Página de teste para popular o banco de dados com dados de exemplo.
 * Esta é uma ferramenta de desenvolvimento.
 */
export default function SeedDatabasePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [generalResult, setGeneralResult] = useState<{ success: boolean; message: string } | null>(null);
  const [urbanAfforestationResult, setUrbanAfforestationResult] = useState<{ success: boolean; message: string } | null>(null);
  const [environmentalEducationResult, setEnvironmentalEducationResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSeedGeneralData = async () => {
    setLoading('general');
    setGeneralResult(null);
    try {
      const response = await seedDatabaseAction();
      setGeneralResult(response);
    } catch (error: any) {
      setGeneralResult({ success: false, message: error.message || 'Um erro desconhecido ocorreu.' });
    } finally {
      setLoading(null);
    }
  };

  const handleSeedUrbanAfforestation = async () => {
    setLoading('urban_afforestation');
    setUrbanAfforestationResult(null);
     try {
      const response = await seedUrbanAfforestationDataAction();
      setUrbanAfforestationResult(response);
    } catch (error: any) {
      setUrbanAfforestationResult({ success: false, message: error.message || 'Um erro desconhecido ocorreu.' });
    } finally {
      setLoading(null);
    }
  }
  
  const handleSeedEnvironmentalEducation = async () => {
    setLoading('environmental_education');
    setEnvironmentalEducationResult(null);
     try {
      const response = await seedEnvironmentalEducationDataAction();
      setEnvironmentalEducationResult(response);
    } catch (error: any) {
      setEnvironmentalEducationResult({ success: false, message: error.message || 'Um erro desconhecido ocorreu.' });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-start">
      <div className="w-full max-w-xl space-y-8">
        <Card className="shadow-lg">
            <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Database className="h-6 w-6 text-primary" />
                <span>Popular Dados Operacionais</span>
            </CardTitle>
            <CardDescription>
                Clique para inserir dados de exemplo (solicitações e denúncias) no Firestore.
                Isso ajuda a testar as listagens e painéis.
            </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
            <Button onClick={handleSeedGeneralData} disabled={loading === 'general'} size="lg">
                {loading === 'general' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                Adicionar Dados de Exemplo
            </Button>
            <ResultMessage result={generalResult} />
            </CardContent>
        </Card>
        
        <Card className="shadow-lg">
            <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Sprout className="h-6 w-6 text-primary" />
                <span>Popular Conteúdo (Arborização Urbana)</span>
            </CardTitle>
            <CardDescription>
                Clique para inserir o conteúdo inicial (projetos, contatos, etc.) para o setor de Arborização Urbana.
            </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
            <Button onClick={handleSeedUrbanAfforestation} disabled={loading === 'urban_afforestation'} size="lg">
                {loading === 'urban_afforestation' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                Adicionar Conteúdo de Arborização
            </Button>
            <ResultMessage result={urbanAfforestationResult} />
            </CardContent>
        </Card>

        <Card className="shadow-lg">
            <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span>Popular Conteúdo (Educação Ambiental)</span>
            </CardTitle>
            <CardDescription>
                Clique para inserir o conteúdo inicial para o setor de Educação Ambiental.
            </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
            <Button onClick={handleSeedEnvironmentalEducation} disabled={loading === 'environmental_education'} size="lg">
                {loading === 'environmental_education' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                Adicionar Conteúdo de Educação Amb.
            </Button>
            <ResultMessage result={environmentalEducationResult} />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
