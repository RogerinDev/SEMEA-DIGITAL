/**
 * @fileoverview Lógica de administração movida para o componente de cliente.
 * As Server Actions não estavam propagando a autenticação do cliente corretamente
 * para as Cloud Functions, resultando em erros de permissão. A chamada agora
 * é feita diretamente do componente /dashboard/admin/users/page.tsx.
 */

'use server';

// A lógica foi movida para o lado do cliente para garantir a passagem correta do token de autenticação.
// Este arquivo pode ser removido ou mantido vazio.
