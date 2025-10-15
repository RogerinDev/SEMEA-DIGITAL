
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lightbulb, AlertTriangle, FileText } from 'lucide-react';
import { suggestSimilarTicketsAction } from '@/app/actions/ai-actions';
import type { SuggestSimilarTicketsOutput } from '@/ai/flows/suggest-similar-tickets';
import type { ResolvedTicket } from '@/types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SimilarTicketsSuggestionsProps {
  currentTicket: {
    description: string;
    type: string;
  };
  availableResolvedTickets: ResolvedTicket[];
}

export function SimilarTicketsSuggestions({ currentTicket, availableResolvedTickets }: SimilarTicketsSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SuggestSimilarTicketsOutput>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSuggestions() {
      if (!currentTicket.description || availableResolvedTickets.length === 0) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const result = await suggestSimilarTicketsAction({
          ticketDescription: currentTicket.description,
          ticketType: currentTicket.type,
          resolvedTickets: availableResolvedTickets,
        });
        setSuggestions(result);
      } catch (err) {
        setError("Não foi possível carregar as sugestões da IA.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSuggestions();
  }, [currentTicket, availableResolvedTickets]);

  const getSuggestionDetails = (ticketId: string) => {
    return availableResolvedTickets.find(ticket => ticket.ticketId === ticketId);
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Analisando tickets similares...</span>
        </div>
      );
    }

    if (error) {
       return (
        <div className="flex items-center justify-center p-4 text-destructive">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      );
    }
    
    if (suggestions.length === 0) {
        return <p className="text-center text-sm text-muted-foreground p-4">Nenhum ticket similar encontrado para sugestão.</p>
    }

    return (
        <ScrollArea className="h-[250px] pr-4">
            <div className="space-y-3">
                {suggestions.map(({ ticketId, similarityScore }) => {
                    const ticketDetails = getSuggestionDetails(ticketId);
                    if (!ticketDetails) return null;

                    return (
                        <div key={ticketId} className="p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="font-semibold text-sm flex items-center">
                                    <FileText className="h-4 w-4 mr-2 text-primary" />
                                    Protocolo: {ticketId}
                                </h4>
                                <Badge variant="secondary" title={`Similaridade: ${(similarityScore * 100).toFixed(0)}%`}>
                                    {(similarityScore * 100).toFixed(0)}%
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2"><strong>Descrição:</strong> {ticketDetails.description}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1"><strong>Resolução:</strong> {ticketDetails.resolution}</p>
                        </div>
                    );
                })}
            </div>
        </ScrollArea>
    );

  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-primary"/> Sugestões da IA
        </CardTitle>
        <CardDescription>
          Com base na descrição, encontramos tickets resolvidos que podem ajudar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
