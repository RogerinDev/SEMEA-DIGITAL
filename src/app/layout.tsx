/**
 * @fileoverview Layout raiz da aplicação.
 * Este é o layout principal que envolve todas as páginas do site.
 * Ele é responsável por definir a estrutura HTML base, importar fontes,
 * e prover os contextos globais como Autenticação e Tema.
 */

import type { Metadata } from 'next';
import './globals.css'; // Importa os estilos globais (Tailwind CSS).
import { Toaster } from "@/components/ui/toaster"; // Componente para exibir notificações (toasts).
import { TooltipProvider } from "@/components/ui/tooltip"; // Provedor para habilitar tooltips em toda a aplicação.
import { AuthProvider } from "@/contexts/auth-context"; // Provedor de contexto para autenticação.
import { ThemeProvider } from '@/contexts/theme-context'; // Provedor de contexto para o tema.

// Metadados da página, importantes para SEO e para o navegador.
export const metadata: Metadata = {
  title: 'SEMEA Digital',
  description: 'Plataforma digital da Secretaria Municipal de Meio Ambiente de Varginha - MG.',
  icons: {
    icon: '/favicon.png?v=2',
  },
};

/**
 * Componente de layout raiz.
 * @param {object} props - Propriedades do componente.
 * @param {React.ReactNode} props.children - O conteúdo da página atual a ser renderizado.
 * @returns {React.ReactElement} A estrutura HTML base da aplicação.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Define o idioma da página e remove a classe estática 'dark'.
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Importação das fontes do Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        
        {/* Reforço do Favicon com cache-busting */}
        <link rel="icon" href="/favicon.png?v=2" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png?v=2" type="image/png" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
            <AuthProvider>
                <TooltipProvider>
                    {children}
                </TooltipProvider>
            </AuthProvider>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
