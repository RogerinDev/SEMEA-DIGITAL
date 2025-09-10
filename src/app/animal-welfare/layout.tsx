/**
 * @fileoverview Layout principal para a seção de Bem-Estar Animal.
 * Este layout envolve todas as páginas públicas relacionadas ao bem-estar animal,
 * como adoção, perdidos e achados, etc., garantindo uma estrutura consistente.
 */

import PublicLayout from '@/components/layouts/public-layout';

// A navegação por abas que existia aqui foi removida e movida para
// um componente de navegação mais geral para simplificar a estrutura.
// const animalWelfareNavItems = [ ... ]

/**
 * Layout para a seção pública de Bem-Estar Animal.
 * @param {object} props - Propriedades do componente.
 * @param {React.ReactNode} props.children - As páginas filhas que serão renderizadas dentro deste layout.
 * @returns {React.ReactElement} O componente de layout.
 */
export default function AnimalWelfareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Usa o PublicLayout como base, que já inclui o cabeçalho e rodapé públicos.
    <PublicLayout>
      <div className="container mx-auto py-8 px-4">
        {/* Renderiza o conteúdo da página específica (ex: Adoção, Perdidos e Achados). */}
        {children}
      </div>
    </PublicLayout>
  );
}
