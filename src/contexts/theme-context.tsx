/**
 * @fileoverview Provedor de Contexto para gerenciamento do tema (light/dark).
 * Permite que componentes em qualquer lugar da árvore de componentes acessem
 * e modifiquem o tema atual, com persistência no `localStorage`.
 */

"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Define os tipos de tema possíveis.
type Theme = 'light' | 'dark';

// Define a estrutura do contexto do tema.
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Cria o contexto com um valor inicial indefinido.
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Componente Provedor que envolve a aplicação ou parte dela.
 * @param {object} props - Propriedades do componente.
 * @param {ReactNode} props.children - Os componentes filhos que terão acesso ao contexto.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Estado para armazenar o tema atual.
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'light'; // Padrão no servidor para evitar erros.
    }
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      return storedTheme;
    }
    // Se não houver tema salvo, usa a preferência do sistema operacional.
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Efeito que roda sempre que o estado `theme` muda no cliente.
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Função para alternar entre os temas 'light' e 'dark'.
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Fornece o estado e as funções para os componentes filhos.
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook customizado para consumir o contexto do tema.
 * Simplifica o uso do `useContext(ThemeContext)` nos componentes.
 * @returns {ThemeContextType} O valor do contexto do tema.
 * @throws {Error} Se usado fora de um `ThemeProvider`.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
