'use server';
import { suggestSimilarTickets as suggestSimilarTicketsFlow, type SuggestSimilarTicketsInput, type SuggestSimilarTicketsOutput } from '@/ai/flows/suggest-similar-tickets';
import type { ResolvedTicket } from '@/types';

// Mocking some resolved tickets for demonstration purposes
const mockResolvedTickets: ResolvedTicket[] = [
  {
    ticketId: "R001",
    description: "Árvore grande na calçada com galhos secos e risco de queda sobre pedestres. Espécie flamboyant.",
    resolution: "Realizada vistoria, constatado risco. Poda de segurança efetuada e galhos removidos."
  },
  {
    ticketId: "R002",
    description: "Solicito corte de árvore morta na praça central. Está completamente seca.",
    resolution: "Equipe verificou, árvore realmente morta. Remoção completa realizada e plantio de nova muda no local agendado."
  },
  {
    ticketId: "R003",
    description: "Poda de galhos baixos de uma mangueira na Rua das Acácias que estão atrapalhando a passagem de ônibus.",
    resolution: "Poda de levantamento de copa executada, liberando a via para tráfego de veículos altos."
  },
  {
    ticketId: "R004",
    description: "Cachorro de rua encontrado muito doente e magro perto da escola.",
    resolution: "Animal recolhido pela equipe de bem-estar animal, encaminhado para veterinário e tratamento iniciado. Aguardando recuperação para possível adoção."
  },
  {
    ticketId: "R005",
    description: "Necessito de castração para minha gata, SRD, de aproximadamente 2 anos.",
    resolution: "Agendamento para castração realizado no centro de zoonoses. Cirurgia bem-sucedida."
  }
];

export async function suggestSimilarTicketsAction(input: SuggestSimilarTicketsInput): Promise<SuggestSimilarTicketsOutput> {
  try {
    // In a real app, you might filter mockResolvedTickets based on input.ticketType or fetch from DB.
    // For this example, we pass all mock resolved tickets. The AI should ideally filter/rank them.
    const inputWithResolvedTickets: SuggestSimilarTicketsInput = {
      ...input,
      resolvedTickets: input.resolvedTickets.length > 0 ? input.resolvedTickets : mockResolvedTickets, // Use provided or default mock
    };
    
    console.log("Calling suggestSimilarTicketsFlow with input:", JSON.stringify(inputWithResolvedTickets, null, 2));
    const suggestions = await suggestSimilarTicketsFlow(inputWithResolvedTickets);
    console.log("Received suggestions from AI flow:", JSON.stringify(suggestions, null, 2));
    return suggestions;
  } catch (error) {
    console.error("Error calling suggestSimilarTicketsFlow:", error);
    return [];
  }
}
