/**
 * @fileoverview Provedor de Contexto para gerenciamento do tema (light/dark).
 * Permite que componentes em qualquer lugar da árvore de componentes acessem
 * e modifiquem o tema atual, com persistência no `localStorage`.
 * A lógica foi ajustada para evitar erros de hidratação no Next.js.
 */

"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Define os tipos de tema possíveis.
type Theme = 'light' | 'dark';

// Define a estrutura do contexto do tema.
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
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
  const [theme, setThemeState] = useState<Theme>('light');
  // Estado para garantir que a lógica do lado do cliente só rode após a montagem.
  const [mounted, setMounted] = useState(false);

  // Efeito que roda uma vez na montagem do componente no cliente.
  useEffect(() => {
    setMounted(true); // Marca que o componente foi montado.
    try {
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      if (storedTheme && ['light', 'dark'].includes(storedTheme)) {
        setThemeState(storedTheme);
      } else {
        // Se não houver tema salvo, usa a preferência do sistema operacional.
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setThemeState(systemPrefersDark ? 'dark' : 'light');
      }
    } catch (error) {
        // Em caso de erro (ex: localStorage indisponível), mantém o padrão 'light'.
        setThemeState('light');
    }
  }, []); // O array vazio [] garante que este efeito rode apenas uma vez.

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
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  // Função para definir um tema específico.
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };
  
  // Evita renderizar o conteúdo no servidor ou antes da hidratação para prevenir o erro.
  if (!mounted) {
    return null;
  }

  // Fornece o estado e as funções para os componentes filhos.
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
