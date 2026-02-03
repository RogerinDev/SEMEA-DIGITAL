import { getWasteManagementSettings } from '@/app/actions/settings-actions';
import WasteClientPage from '@/components/info/waste-management-client';
import PublicLayout from '@/components/layouts/public-layout';

export const dynamic = 'force-dynamic';

export default async function WasteManagementPage() {
  const settings = await getWasteManagementSettings();

  return (
    <PublicLayout>
        <WasteClientPage
            initialEcopoints={settings.ecopoints || []}
            initialCollectionPoints={settings.collectionPoints || []}
        />
    </PublicLayout>
  );
}
