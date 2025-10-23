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
  // Estado para armazenar o tema atual. Inicializa como null.
  const [theme, setTheme] = useState<Theme | null>(null);

  // Efeito que roda uma vez na montagem do componente no cliente.
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Define o tema com base na prioridade: localStorage > preferência do sistema > fallback para 'light'
    const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  // Efeito que roda sempre que o estado `theme` muda.
  useEffect(() => {
    // Não faz nada se o tema ainda não foi determinado.
    if (theme === null) return;
    
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark'); // Remove classes antigas
    root.classList.add(theme); // Adiciona a classe do tema atual
    localStorage.setItem('theme', theme); // Salva a preferência no localStorage
  }, [theme]);

  // Função para alternar entre os temas.
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  // Não renderiza os componentes filhos até que o tema inicial tenha sido definido,
  // evitando o "flash" do tema incorreto.
  if (theme === null) {
      return null;
  }

  // O `value` do provider agora só precisa fornecer o tema atual e a função de alternância.
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
