/**
 * @fileoverview Utilitários gerais para a aplicação.
 * Contém a função `cn` para mesclar classes do Tailwind CSS de forma inteligente.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Função `cn` (class names).
 * Combina múltiplas classes CSS em uma única string, resolvendo conflitos do Tailwind CSS.
 * Por exemplo, `cn('p-2', 'p-4')` resultará em `'p-4'`, pois `p-4` sobrepõe `p-2`.
 * Útil para construir componentes com variantes de estilo.
 *
 * @param {...ClassValue[]} inputs - Uma sequência de classes CSS (strings, objetos, arrays).
 * @returns {string} A string de classes CSS mesclada e otimizada.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
