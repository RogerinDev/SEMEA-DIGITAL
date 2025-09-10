/**
 * @fileoverview Layout principal para a seção de Educação Ambiental.
 * Este layout envolve todas as páginas públicas relacionadas à educação ambiental,
 * como projetos, palestras, eventos e como participar.
 */

import PublicLayout from '@/components/layouts/public-layout';

// A navegação por abas que existia aqui foi removida para uma abordagem
// de navegação mais integrada dentro das próprias páginas, melhorando
// a experiência do usuário.
// const educationNavItems = [ ... ];

/**
 * Layout para a seção pública de Educação Ambiental.
 * @param {object} props - Propriedades do componente.
 * @param {React.ReactNode} props.children - As páginas filhas que serão renderizadas dentro deste layout.
 * @returns {React.ReactElement} O componente de layout.
 */
export default function EnvironmentalEducationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Utiliza o PublicLayout como base, que fornece o cabeçalho e rodapé padrão.
    <PublicLayout>
      <div className="container mx-auto py-8 px-4">
        {/* Renderiza o conteúdo da página específica (projetos, palestras, etc.) */}
        {children}
      </div>
    </PublicLayout>
  );
}
