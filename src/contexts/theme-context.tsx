/**
 * @fileoverview Provedor de Contexto para gerenciamento do tema (light/dark).
 * Permite que componentes em qualquer lugar da árvore de componentes acessem
 * e modifiquem o tema atual, com persistência no `localStorage` e de forma
 * segura para Server-Side Rendering (SSR) e hidratação.
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
 * Componente Provedor que envolve a aplicação.
 * @param {object} props - Propriedades do componente.
 * @param {ReactNode} props.children - Os componentes filhos que terão acesso ao contexto.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark'); // Padrão escuro
  const [mounted, setMounted] = useState(false);

  // Efeito que roda uma vez na montagem do componente no cliente.
  useEffect(() => {
    setMounted(true);
    try {
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        // Se não houver tema salvo, define o escuro como padrão.
        setTheme('dark');
      }
    } catch (error) {
        // Em caso de erro ao acessar o localStorage, usa 'dark' como fallback.
        setTheme('dark');
    }
  }, []);

  // Efeito que roda sempre que o estado `theme` muda.
  useEffect(() => {
    if (mounted) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try {
        localStorage.setItem('theme', theme);
      } catch (error) {
        console.error("Failed to save theme to localStorage", error);
      }
    }
  }, [theme, mounted]);

  // Função para alternar entre os temas 'light' e 'dark'.
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Previne a renderização de componentes que dependem do tema antes da hidratação.
  if (!mounted) {
    return null;
  }

  // Fornece o estado e as funções para os componentes filhos.
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
