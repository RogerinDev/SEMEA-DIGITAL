/**
 * @fileoverview Server Action para interagir com os fluxos de IA (Genkit).
 * Este arquivo serve como uma ponte entre os componentes do lado do servidor
 * e os fluxos de IA, encapsulando a lógica de chamada e tratamento de erros.
 */
'use server';

// Importa a função do fluxo Genkit, bem como seus tipos de entrada e saída.
import { suggestSimilarTickets as suggestSimilarTicketsFlow, type SuggestSimilarTicketsInput, type SuggestSimilarTicketsOutput } from '@/ai/flows/suggest-similar-tickets';
import type { ResolvedTicket } from '@/types';

// NOTA: Em uma aplicação real, os tickets resolvidos disponíveis seriam buscados
// de um banco de dados com base no contexto do ticket atual (ex: tipo, departamento, etc.).
// Esta ação agora atua como um simples repassador para o fluxo Genkit, esperando que
// o chamador (ex: um Server Component) forneça os tickets resolvidos relevantes.

/**
 * Server Action que chama o fluxo de IA para sugerir tickets similares.
 * @param input Os dados de entrada para a sugestão, incluindo a descrição do ticket atual
 * e uma lista de tickets resolvidos para comparação.
 * @returns Uma promessa que resolve com um array de sugestões de tickets.
 */
export async function suggestSimilarTicketsAction(input: SuggestSimilarTicketsInput): Promise<SuggestSimilarTicketsOutput> {
  // Garante que, se o chamador não fornecer `resolvedTickets`, um array vazio seja passado para o fluxo.
  const inputWithResolvedTickets: SuggestSimilarTicketsInput = {
    ...input,
    resolvedTickets: input.resolvedTickets || [],
  };

  // Se não houver tickets para comparar, a IA não tem como gerar sugestões.
  // Retorna um array vazio diretamente para evitar uma chamada desnecessária à API.
  if (inputWithResolvedTickets.resolvedTickets.length === 0) {
    console.warn("Aviso: suggestSimilarTicketsAction foi chamada sem tickets resolvidos. As sugestões da IA serão limitadas.");
    return [];
  }

  try {
    // Log para depuração: mostra os dados que estão sendo enviados para o fluxo de IA.
    console.log("Chamando suggestSimilarTicketsFlow com a entrada:", JSON.stringify(inputWithResolvedTickets, null, 2));
    
    // Chama o fluxo de IA com os dados de entrada.
    const suggestions = await suggestSimilarTicketsFlow(inputWithResolvedTickets);
    
    // Log para depuração: mostra as sugestões recebidas do fluxo.
    console.log("Sugestões recebidas do fluxo de IA:", JSON.stringify(suggestions, null, 2));
    
    return suggestions;
  } catch (error) {
    console.error("Erro ao chamar suggestSimilarTicketsFlow:", error);
    // Retorna um array vazio em caso de erro para evitar que a UI quebre.
    return [];
  }
}
