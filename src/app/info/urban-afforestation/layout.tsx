/**
 * @fileoverview Layout principal para a seção de Arborização Urbana.
 * Este componente de layout envolve todas as páginas públicas relacionadas
 * à arborização, como projetos, serviços e legislação.
 */

import PublicLayout from '@/components/layouts/public-layout';
import React from 'react';

/**
 * Layout para a seção pública de Arborização Urbana.
 * @param {object} props - Propriedades do componente.
 * @param {React.ReactNode} props.children - As páginas filhas que serão renderizadas dentro deste layout.
 * @returns {React.ReactElement} O componente de layout.
 */
export default function UrbanAfforestationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Utiliza o PublicLayout como base, que já inclui o cabeçalho e rodapé públicos.
    <PublicLayout>
      {/* Container principal para o conteúdo da seção */}
      <div className="container mx-auto py-12 px-4">
        {children}
      </div>
    </PublicLayout>
  );
}
