import { getWasteManagementSettings } from '@/app/actions/settings-actions';
import { getPosts } from '@/app/actions/posts-actions';
import WasteClientPage from '@/components/info/waste-management-client';
import PublicLayout from '@/components/layouts/public-layout';
import { NewsGrid } from '@/components/news/news-grid';
import { Newspaper } from 'lucide-react';


export const dynamic = 'force-dynamic';

export default async function WasteManagementPage() {
  const settings = await getWasteManagementSettings();
  const posts = await getPosts({ sector: 'residuos', limit: 3 });

  return (
    <PublicLayout>
        <WasteClientPage
            initialEcopoints={settings.ecopoints || []}
            initialCollectionPoints={settings.collectionPoints || []}
        />
        {posts.length > 0 && (
         <section className="bg-muted/50 py-12 px-4 mt-12">
            <div className="container mx-auto">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-primary flex items-center justify-center gap-3">
                        <Newspaper className="h-8 w-8"/>
                        Notícias do Setor
                    </h2>
                </div>
                <NewsGrid posts={posts} />
            </div>
         </section>
      )}
    </PublicLayout>
  );
}
