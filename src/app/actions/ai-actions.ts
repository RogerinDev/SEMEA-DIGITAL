'use server';
import { suggestSimilarTickets as suggestSimilarTicketsFlow, type SuggestSimilarTicketsInput, type SuggestSimilarTicketsOutput } from '@/ai/flows/suggest-similar-tickets';
import type { ResolvedTicket } from '@/types';

// NOTE: In a real app, the available resolved tickets would be fetched from a database
// based on the context of the current ticket (e.g., its type, department, etc.).
// This action is now a pass-through to the Genkit flow, expecting the caller
// (e.g., a server component) to provide the relevant resolved tickets.

export async function suggestSimilarTicketsAction(input: SuggestSimilarTicketsInput): Promise<SuggestSimilarTicketsOutput> {
  // Ensure that if the caller doesn't provide resolvedTickets, an empty array is passed to the flow.
  const inputWithResolvedTickets: SuggestSimilarTicketsInput = {
    ...input,
    resolvedTickets: input.resolvedTickets || [],
  };

  if (inputWithResolvedTickets.resolvedTickets.length === 0) {
    console.warn("Warning: suggestSimilarTicketsAction called with no resolved tickets. AI suggestions will be limited.");
    // Return empty array directly if no tickets are available to compare against.
    return [];
  }

  try {
    console.log("Calling suggestSimilarTicketsFlow with input:", JSON.stringify(inputWithResolvedTickets, null, 2));
    const suggestions = await suggestSimilarTicketsFlow(inputWithResolvedTickets);
    console.log("Received suggestions from AI flow:", JSON.stringify(suggestions, null, 2));
    return suggestions;
  } catch (error) {
    console.error("Error calling suggestSimilarTicketsFlow:", error);
    // Return an empty array in case of an error to prevent the UI from breaking.
    return [];
  }
}
