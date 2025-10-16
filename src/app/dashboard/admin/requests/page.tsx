
import { Suspense } from 'react';
import { PageTitle } from '@/components/page-title';
import { FileText, Loader2 } from 'lucide-react';
import RequestsClientPage from '@/components/dashboard/admin/requests-client-page';

function LoadingFallback() {
    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <PageTitle title="Gerenciar Solicitações" icon={FileText} className="mb-0" />
            </div>
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        </>
    )
}

export default function AdminRequestsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RequestsClientPage />
    </Suspense>
  );
}
