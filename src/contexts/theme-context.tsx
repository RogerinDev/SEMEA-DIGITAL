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
  setTheme: (theme: Theme) => void; // Permite definir um tema diretamente.
  toggleTheme: () => void; // Alterna entre os temas.
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
  const [theme, setThemeState] = useState<Theme | null>(null);

  // Efeito que roda uma vez na montagem do componente no cliente.
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setThemeState(storedTheme);
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  // Efeito que roda sempre que o estado `theme` muda.
  useEffect(() => {
    if (theme === null) return;
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };
  
  if (theme === null) {
      return null;
  }


  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
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
