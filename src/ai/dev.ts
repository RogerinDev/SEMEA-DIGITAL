/**
 * @fileoverview Ponto de entrada para o ambiente de desenvolvimento do Genkit.
 * Este arquivo é usado para iniciar o servidor de desenvolvimento do Genkit
 * com o comando `genkit start`. Ele carrega as variáveis de ambiente e
 * importa os fluxos (flows) que devem ser inspecionados e testados na UI de desenvolvimento.
 */

// Importa e configura o `dotenv` para carregar variáveis de ambiente
// do arquivo `.env` para o processo do Node.js.
import { config } from 'dotenv';
config();

// Importa os fluxos (flows) do Genkit que serão disponibilizados na
// UI de desenvolvimento do Genkit. Adicione aqui qualquer novo fluxo
// que você queira testar.
import '@/ai/flows/suggest-similar-tickets.ts';
