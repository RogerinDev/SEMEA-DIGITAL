/**
 * @fileoverview Este arquivo contém as Cloud Functions do Firebase para o projeto.
 * Atualmente, define uma função callable `setAdminRole` para atribuir papéis de administrador
 * aos usuários, uma operação que só pode ser executada por um 'superAdmin'.
 * Também inclui uma função de emergência para promover um usuário específico.
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Garante que o SDK do Admin seja inicializado apenas uma vez.
if (admin.apps.length === 0) {
    admin.initializeApp();
}

// Define a região padrão para todas as funções.
const regionalFunctions = functions.region("southamerica-east1");

/**
 * Função de emergência para promover um usuário específico a superAdmin.
 * Esta função é acionada por uma requisição HTTP GET e é pública, mas só atua
 * sobre um e-mail pré-definido para segurança.
 *
 * @param {functions.https.Request} request - O objeto de requisição.
 * @param {functions.Response} response - O objeto de resposta.
 */
export const emergencyPromote = regionalFunctions.https.onRequest(async (request, response) => {
    const superAdminEmail = "rogerinhootavio@hotmail.com";
    
    try {
        console.log(`Tentando promover o usuário: ${superAdminEmail}`);
        const userRecord = await admin.auth().getUserByEmail(superAdminEmail);
        const currentClaims = userRecord.customClaims || {};

        if (currentClaims.role === "superAdmin") {
            const message = `O usuário ${superAdminEmail} já é um superAdmin. Nenhuma ação foi necessária.`;
            console.log(message);
            response.status(200).send(message);
            return;
        }
        
        await admin.auth().setCustomUserClaims(userRecord.uid, { 
            role: "superAdmin",
            department: "gabinete"
        });

        const successMessage = `Sucesso! O usuário ${superAdminEmail} foi promovido a superAdmin. Por favor, faça logout e login novamente no site para ver as alterações.`;
        console.log(successMessage);
        response.status(200).send(successMessage);

    } catch (error: any) {
        console.error("Erro na função emergencyPromote:", error);
        if (error.code === 'auth/user-not-found') {
            response.status(404).send(`Erro: Usuário de emergência ${superAdminEmail} não encontrado.`);
        } else {
            response.status(500).send("Erro interno ao tentar promover o usuário. Verifique os logs da função.");
        }
    }
});


/**
 * Função Callable para definir um Custom Claim (papel e departamento) para um usuário.
 * A segurança é garantida verificando se o chamador tem o papel de 'superAdmin'.
 *
 * @param data - O objeto de dados enviado pelo cliente.
 * @param {string} data.email - O email do usuário a ser promovido.
 * @param {string} data.department - O departamento ao qual o usuário será atribuído.
 * @param {string} [data.role='admin'] - O papel a ser atribuído ('admin' ou 'superAdmin').
 * @param context - O contexto da função, contendo informações de autenticação do chamador.
 *
 * @returns {Promise<{message: string}>} Uma promessa que resolve com uma mensagem de sucesso.
 * @throws {functions.https.HttpsError} Lança um erro em caso de falha de permissão,
 * argumentos inválidos ou erros internos.
 */
export const setAdminRole = regionalFunctions.https.onCall(async (data, context) => {
  // --- Verificação de Segurança ---
  // Apenas usuários com o Custom Claim 'superAdmin' podem executar esta função.
  if (context.auth?.token.role !== "superAdmin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Apenas super-admins podem executar esta ação."
    );
  }

  // Desestruturação e validação dos dados de entrada.
  const {email, department, role = "admin"} = data;

  if (!email || !department) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "O email e o departamento são obrigatórios.",
    );
  }

  const validRoles = ["admin", "superAdmin", "citizen"];
    if (!validRoles.includes(role)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        `O papel '${role}' é inválido.`
      );
    }

  try {
    // Busca o registro do usuário no Firebase Authentication usando o e-mail.
    const userRecord = await admin.auth().getUserByEmail(email);

    // Define os Custom Claims para o usuário encontrado.
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: role,
      department: department,
    });

    const successMessage = `Sucesso! O usuário ${email} agora tem o papel '${role}' no setor '${department}'.`;
    console.log(successMessage); // Log no servidor para auditoria.
    return {message: successMessage}; // Retorna a mensagem de sucesso para o cliente.
  } catch (error) {
    console.error("Erro ao definir permissão de admin:", error);
    // Lança um erro genérico para o cliente, ocultando detalhes de implementação.
    throw new functions.https.HttpsError(
        "internal",
        "Ocorreu um erro ao processar a solicitação.",
    );
  }
});
