import { PublicHeader } from '@/components/navigation/public-header';
import { Footer } from '@/components/navigation/footer';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
