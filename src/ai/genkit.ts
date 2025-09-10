/**
 * @fileoverview Este arquivo é o ponto central de configuração do Genkit.
 * Ele inicializa o framework Genkit com os plugins necessários (como o googleAI)
 * e define um modelo padrão a ser usado em toda a aplicação.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Exporta a instância 'ai' configurada do Genkit.
// Esta instância será usada para definir todos os fluxos (flows), prompts e ferramentas.
export const ai = genkit({
  // Lista de plugins a serem usados. O plugin 'googleAI' habilita o acesso
  // aos modelos de IA do Google, como Gemini.
  plugins: [googleAI()],
  // Define o modelo de linguagem padrão para todas as chamadas `ai.generate()`
  // que não especificarem um modelo diferente.
  // 'gemini-2.0-flash' é um modelo rápido e eficiente.
  model: 'googleai/gemini-2.0-flash',
});
