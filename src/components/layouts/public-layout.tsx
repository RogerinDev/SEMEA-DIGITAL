/**
 * @fileoverview Layout público padrão para as páginas do site.
 * Este componente define a estrutura básica para páginas que não fazem
 * parte de um painel de controle (dashboard), incluindo o cabeçalho público
 * e o rodapé padrão.
 */

import { PublicHeader } from '@/components/navigation/public-header';
import { Footer } from '@/components/navigation/footer';

// Propriedades do componente PublicLayout.
interface PublicLayoutProps {
  children: React.ReactNode; // O conteúdo da página a ser renderizado.
}

/**
 * Componente de layout para páginas públicas.
 * @param {PublicLayoutProps} props - As propriedades do componente.
 * @returns {React.ReactElement} Um layout com cabeçalho, conteúdo principal e rodapé.
 */
export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Renderiza o cabeçalho público no topo da página. */}
      <PublicHeader />
      
      {/* A área principal que irá conter o conteúdo específico da página. */}
      <main className="flex-grow">{children}</main>
      
      {/* Renderiza o rodapé no final da página. */}
      <Footer />
    </div>
  );
}
