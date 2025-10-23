
/**
 * @fileoverview Arquivo de configuração do Tailwind CSS.
 * Este arquivo estende o tema padrão do Tailwind, definindo cores customizadas,
 * fontes, animações e outras propriedades de design para a aplicação,
 * alinhado com as variáveis CSS definidas em `src/app/globals.css`.
 */
import type {Config} from 'tailwindcss';

export default {
  // Habilita o modo escuro baseado na classe 'dark' no elemento <html>.
  darkMode: ['class'],
  // Define os arquivos que o Tailwind deve analisar para encontrar classes CSS utilizadas.
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Estende o tema padrão do Tailwind.
    extend: {
      // Define as famílias de fontes customizadas.
      fontFamily: {
        body: ['PT Sans', 'sans-serif'], // Fonte principal para o corpo do texto.
        headline: ['PT Sans', 'sans-serif'], // Fonte para títulos.
        code: ['monospace'], // Fonte para blocos de código.
      },
      // Mapeia as variáveis CSS para as classes de cor do Tailwind.
      // Isso permite que o tema seja alterado dinamicamente (light/dark).
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Cores específicas para gráficos.
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      // Define os raios de borda customizados.
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // Define os keyframes para animações customizadas.
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      // Registra as animações para serem usadas como classes.
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  // Adiciona o plugin `tailwindcss-animate` para animações prontas.
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
