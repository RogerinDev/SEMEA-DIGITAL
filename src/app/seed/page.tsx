
// Arquivo: src/app/seed/page.tsx
'use client';

import { useState } from 'react';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Loader2, AlertTriangle, CheckCircle, Sprout } from 'lucide-react';
import { seedDatabaseAction } from '@/app/actions/seed-database';
import { seedUrbanAfforestationDataAction } from '../actions/seed-actions';


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
  const [contentResult, setContentResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSeedGeneralData = async () => {
    setLoading('general');
    setGeneralResult(null);
    try {
      const response = await seedDatabaseAction();
      setGeneralResult(response);
    } catch (error: any) {
      setGeneralResult({
        success: false,
        message: error.message || 'Um erro desconhecido ocorreu ao chamar a ação.',
      });
    } finally {
      setLoading(null);
    }
  };

  const handleSeedContentData = async () => {
    setLoading('content');
    setContentResult(null);
     try {
      const response = await seedUrbanAfforestationDataAction();
      setContentResult(response);
    } catch (error: any) {
      setContentResult({
        success: false,
        message: error.message || 'Um erro desconhecido ocorreu ao chamar a ação.',
      });
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
                {loading === 'general' ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Populando...
                </>
                ) : (
                'Adicionar Dados de Exemplo'
                )}
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
                Isso é necessário para as páginas dinâmicas funcionarem.
            </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
            <Button onClick={handleSeedContentData} disabled={loading === 'content'} size="lg">
                {loading === 'content' ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Populando...
                </>
                ) : (
                'Adicionar Conteúdo de Arborização'
                )}
            </Button>
            <ResultMessage result={contentResult} />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

