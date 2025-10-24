
import { Suspense } from 'react';
import { PageTitle } from '@/components/page-title';
import { AlertTriangle, Loader2 } from 'lucide-react';
import IncidentsClientPage from '@/components/dashboard/admin/incidents-client-page';

function LoadingFallback() {
    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <PageTitle title="Gerenciar Denúncias" icon={AlertTriangle} className="mb-0" />
            </div>
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        </>
    )
}

export default function AdminIncidentsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <IncidentsClientPage />
    </Suspense>
  );
}
