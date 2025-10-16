
import { Suspense } from 'react';
import NewRequestForm from '@/components/requests/new-request-form';
import { PageTitle } from '@/components/page-title';
import { PlusCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function LoadingFallback() {
    return (
        <>
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard/citizen/requests">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Voltar</span>
                </Link>
                </Button>
                <PageTitle title="Nova Solicitação de Serviço" icon={PlusCircle} className="mb-0 flex-grow" />
            </div>
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        </>
    )
}

export default function NewServiceRequestPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewRequestForm />
    </Suspense>
  );
}
