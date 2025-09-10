// Arquivo: src/app/seed/page.tsx
'use client';

import { useState } from 'react';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { seedDatabaseAction } from '@/app/actions/seed-database';

/**
 * Página de teste para popular o banco de dados com dados de exemplo.
 * Esta é uma ferramenta de desenvolvimento.
 */
export default function SeedDatabasePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await seedDatabaseAction();
      setResult(response);
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'Um erro desconhecido ocorreu ao chamar a ação.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Database className="h-6 w-6 text-primary" />
            <span>Testar e Popular o Banco de Dados</span>
          </CardTitle>
          <CardDescription>
            Clique no botão abaixo para tentar inserir dados de exemplo (2 solicitações e 2 denúncias)
            no seu banco de dados Firestore. Isso ajudará a diagnosticar problemas de conexão do lado do servidor.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={handleSeed} disabled={loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Populando...
              </>
            ) : (
              'Adicionar Dados de Exemplo'
            )}
          </Button>

          {result && (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
