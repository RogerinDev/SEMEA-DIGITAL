
import PublicLayout from '@/components/layouts/public-layout';
import React from 'react';

export default function UrbanAfforestationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicLayout>
      <div className="container mx-auto py-12 px-4">
        {children}
      </div>
    </PublicLayout>
  );
}
