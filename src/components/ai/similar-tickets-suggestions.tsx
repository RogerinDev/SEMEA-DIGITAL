"use client";

import { useEffect, useState } from 'react';
import { suggestSimilarTicketsAction } from '@/app/actions/ai-actions';
import type { ServiceRequest, ResolvedTicket } from '@/types';
import type { SuggestSimilarTicketsOutput, SuggestSimilarTicketsInput } from '@/ai/flows/suggest-similar-tickets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles, Lightbulb, ExternalLink, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SimilarTicketsSuggestionsProps {
  currentTicket: Pick<ServiceRequest, 'description' | 'type'>;
  // In a real app, you'd fetch these based on ticket type or context
  availableResolvedTickets?: ResolvedTicket[]; 
}

export function SimilarTicketsSuggestions({ currentTicket, availableResolvedTickets = [] }: SimilarTicketsSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SuggestSimilarTicketsOutput>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSuggestions() {
      if (!currentTicket.description || !currentTicket.type) {
        setError("Dados insuficientes do ticket atual para buscar sugestões.");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      try {
        const input: SuggestSimilarTicketsInput = {
          ticketDescription: currentTicket.description,
          ticketType: currentTicket.type,
          resolvedTickets: availableResolvedTickets, 
        };
        const result = await suggestSimilarTicketsAction(input);
        setSuggestions(result);
      } catch (err) {
        console.error("Failed to fetch similar tickets:", err);
        setError("Não foi possível carregar sugestões. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSuggestions();
  }, [currentTicket, availableResolvedTickets]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Erro!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <CardTitle>Sugestões de Casos Similares (IA)</CardTitle>
        </div>
        <CardDescription>
          Casos resolvidos anteriormente que podem ajudar na tratativa desta solicitação.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-4 border rounded-md space-y-2">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-1/3 mt-2" />
              </div>
            ))}
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-8">
            <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma sugestão similar encontrada no momento.</p>
            <p className="text-xs text-muted-foreground mt-1">A IA não identificou casos parecidos na base de conhecimento.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {suggestions.map((suggestion) => {
              const resolvedTicketDetails = availableResolvedTickets.find(rt => rt.ticketId === suggestion.ticketId);
              return (
                <li key={suggestion.ticketId} className="p-4 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-md mb-1">
                      <FileText className="inline h-5 w-5 mr-2 text-muted-foreground" />
                      Ticket Resolvido: {suggestion.ticketId}
                    </h4>
                    <span className="text-xs font-mono px-2 py-1 bg-primary/10 text-primary rounded-full">
                      Similaridade: {(suggestion.similarityScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  {resolvedTicketDetails && (
                    <>
                      <p className="text-sm text-muted-foreground mt-1 mb-2 line-clamp-2" title={resolvedTicketDetails.description}>
                        <strong>Descrição Antiga:</strong> {resolvedTicketDetails.description}
                      </p>
                      <p className="text-sm text-foreground bg-secondary/50 p-2 rounded-md line-clamp-3" title={resolvedTicketDetails.resolution}>
                        <strong>Resolução Aplicada:</strong> {resolvedTicketDetails.resolution}
                      </p>
                    </>
                  )}
                  <Button variant="link" size="sm" className="mt-3 px-0 text-primary">
                    Ver Detalhes do Caso #{suggestion.ticketId} {/* This would link to the actual resolved ticket */}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
