/**
 * @fileoverview Provedor de Contexto para gerenciamento do tema (light/dark).
 * Este arquivo foi esvaziado pois o tema foi fixado como 'dark' no layout principal.
 * Pode ser reativado no futuro se a funcionalidade de alternância de tema for necessária.
 */

"use client";

import React, { createContext, useContext, type ReactNode } from 'react';

// Define os tipos de tema possíveis.
type Theme = 'light' | 'dark';

// Define a estrutura do contexto do tema.
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// Cria o contexto com um valor inicial mockado, já que a funcionalidade foi removida.
const ThemeContext = createContext<ThemeContextType | undefined>({
    theme: 'dark',
    setTheme: () => {},
    toggleTheme: () => {},
});

/**
 * Componente Provedor que envolve a aplicação.
 * @param {object} props - Propriedades do componente.
 * @param {ReactNode} props.children - Os componentes filhos.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // A lógica de estado e efeitos foi removida. O provedor agora apenas passa um valor estático.
  const value = {
      theme: 'dark' as Theme,
      setTheme: () => console.warn("Theme toggling is disabled."),
      toggleTheme: () => console.warn("Theme toggling is disabled."),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook customizado para consumir o contexto do tema.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Este erro não deve ocorrer, pois o provedor ainda existe.
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
