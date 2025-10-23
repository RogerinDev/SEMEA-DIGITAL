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
  // Estado para armazenar o tema atual. Inicializa como null para evitar renderização incorreta no servidor.
  const [theme, setTheme] = useState<Theme | null>(null);

  // Efeito que roda uma vez na montagem do componente no cliente.
  useEffect(() => {
    // Busca o tema salvo no localStorage.
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    // Verifica a preferência do sistema operacional do usuário.
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Define o tema com base na seguinte prioridade:
    // 1. Tema salvo no localStorage.
    // 2. Preferência do sistema operacional.
    // 3. Fallback para 'light' se nenhuma das anteriores for definida.
    setTheme(storedTheme || (systemPrefersDark ? 'dark' : 'light'));
  }, []); // O array vazio garante que este efeito rode apenas uma vez, na montagem do componente.

  // Efeito que roda sempre que o estado `theme` muda.
  useEffect(() => {
    // Não faz nada se o tema ainda não foi determinado (estado inicial `null`).
    if (theme === null) return;
    
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark'); // Remove classes de tema antigas para evitar conflitos.
    root.classList.add(theme); // Adiciona a classe correspondente ao tema atual.
    localStorage.setItem('theme', theme); // Salva a preferência atual no localStorage.
  }, [theme]);

  // Função para alternar entre os temas 'light' e 'dark'.
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  // Não renderiza os componentes filhos até que o tema inicial tenha sido determinado.
  // Isso evita o "flash" do tema incorreto (FOUC - Flash of Unstyled Content) durante o carregamento inicial.
  if (theme === null) {
      return null; 
  }

  // Fornece o tema atual e a função de alternância para todos os componentes filhos.
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
