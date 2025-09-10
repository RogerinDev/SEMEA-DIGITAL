/**
 * @fileoverview Configuração do Firebase Admin SDK para o lado do servidor.
 * Este arquivo inicializa o SDK de administrador, que é usado em Server Actions
 * e API Routes para interagir com os serviços do Firebase com privilégios de administrador
 * (por exemplo, para acessar o Firestore sem passar pelas regras de segurança do cliente).
 *
 * Esta implementação utiliza uma função para garantir que o Firebase seja inicializado
 * apenas uma vez e sob demanda, evitando erros em ambientes de servidor Next.js.
 */
import admin from 'firebase-admin';

/**
 * Retorna a instância inicializada do App do Firebase Admin.
 * A função garante que a inicialização ocorra apenas uma vez.
 * @returns {admin.app.App} A instância do app do Firebase Admin.
 */
function getAdminApp() {
  if (admin.apps.length > 0) {
    return admin.apps[0] as admin.app.App;
  }

  // Em ambientes de hospedagem do Google, as credenciais são descobertas automaticamente.
  const app = admin.initializeApp();
  return app;
}

/**
 * Obtém e exporta as instâncias dos serviços do Firebase Admin (Firestore e Auth).
 * @returns {{db: admin.firestore.Firestore, auth: admin.auth.Auth}} Um objeto contendo as instâncias dos serviços.
 */
function getFirebaseAdmin() {
  const app = getAdminApp();
  return {
    db: admin.firestore(app),
    auth: admin.auth(app),
  };
}

// Exporta a função para ser usada pelas Server Actions.
export { getFirebaseAdmin };
