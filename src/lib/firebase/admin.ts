/**
 * @fileoverview Configuração do Firebase Admin SDK para o lado do servidor.
 * Este arquivo utiliza um padrão singleton para inicializar o SDK de administrador,
 * garantindo que a conexão seja estabelecida apenas uma vez, mesmo em um ambiente
 * serverless como o do Next.js, onde os módulos podem ser recarregados.
 */
import admin from 'firebase-admin';

// Interface para definir a estrutura do retorno da função de inicialização.
interface FirebaseAdminServices {
  db: admin.firestore.Firestore;
  auth: admin.auth.Auth;
}

/**
 * Garante que o Firebase Admin seja inicializado apenas uma vez e retorna os serviços.
 * Se o app já estiver inicializado, retorna a instância existente.
 * Caso contrário, inicializa um novo app com as credenciais do ambiente.
 * @returns {FirebaseAdminServices} Um objeto contendo as instâncias dos serviços Firestore e Auth.
 */
function getFirebaseAdmin(): FirebaseAdminServices {
  // Verifica se o app padrão já foi inicializado.
  if (!admin.apps.length) {
    // Se não foi, inicializa o app. Em ambientes de servidor do Google
    // (como App Hosting, Cloud Functions), as credenciais são detectadas
    // automaticamente quando nenhum argumento é passado.
    admin.initializeApp();
  }

  // Retorna as instâncias dos serviços do Firebase Admin.
  return {
    db: admin.firestore(), // Instância do Cloud Firestore.
    auth: admin.auth(),      // Instância do Firebase Authentication.
  };
}

// Exporta a função que fornece acesso aos serviços do admin.
export { getFirebaseAdmin };
