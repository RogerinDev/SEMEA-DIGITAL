/**
 * @fileoverview Configuração do Firebase Admin SDK para o lado do servidor.
 * Este arquivo inicializa o SDK de administrador, que é usado em Server Actions
 * e API Routes para interagir com os serviços do Firebase com privilégios de administrador
 * (por exemplo, para acessar o Firestore sem passar pelas regras de segurança do cliente).
 */

import admin from 'firebase-admin';

// Garante que a inicialização do Firebase Admin ocorra apenas uma vez.
// Em ambientes de servidor (como Next.js Server Actions ou Vercel/Firebase Functions),
// o código pode ser recarregado, e tentar inicializar o app múltiplas vezes causaria um erro.
// Este `if` verifica se já existe algum app inicializado no array `admin.apps`.
if (!admin.apps.length) {
  // Inicializa o SDK. Em ambientes de hospedagem do Google (como App Hosting ou Cloud Functions),
  // as credenciais da conta de serviço são descobertas automaticamente, então não é
  // necessário passar um objeto de configuração.
  admin.initializeApp({
  });
}

// Obtém e exporta a instância do serviço Firestore do Admin SDK.
// Esta instância `db` terá acesso total de leitura e escrita ao banco de dados,
// ignorando as regras de segurança do cliente.
const db = admin.firestore();

// Obtém e exporta a instância do serviço de Autenticação do Admin SDK.
// `auth` é usado para gerenciar usuários, como criar, deletar ou modificar Custom Claims.
const auth = admin.auth();

export { db, auth };
