/**
 * @fileoverview Este arquivo contém as Cloud Functions do Firebase para o projeto.
 * Atualmente, define uma função callable `setAdminRole` para atribuir papéis de administrador
 * aos usuários, uma operação que só pode ser executada por um 'superAdmin'.
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Garante que o SDK do Admin seja inicializado apenas uma vez.
// Em um ambiente de Cloud Functions, a inicialização ocorre automaticamente.
// Este 'if' garante a inicialização caso o código seja executado em outro contexto.
if (admin.apps.length === 0) {
    admin.initializeApp();
}

// Define a região padrão para todas as funções neste arquivo,
// otimizando a latência para a localização dos usuários.
const regionalFunctions = functions.region("southamerica-east1");

/**
 * Função Callable para definir um Custom Claim (papel e departamento) para um usuário.
 * Esta função é projetada para ser chamada a partir do aplicativo cliente (front-end).
 * A segurança é garantida verificando se o chamador tem o papel de 'superAdmin' ou 'Dev'.
 *
 * @param data - O objeto de dados enviado pelo cliente.
 * @param {string} data.email - O email do usuário a ser promovido.
 * @param {string} data.department - O departamento ao qual o usuário será atribuído.
 * @param {string} [data.role='admin'] - O papel a ser atribuído ('admin', 'superAdmin', 'Dev').
 * @param context - O contexto da função, contendo informações de autenticação do chamador.
 *
 * @returns {Promise<{message: string}>} Uma promessa que resolve com uma mensagem de sucesso.
 * @throws {functions.https.HttpsError} Lança um erro em caso de falha de permissão,
 * argumentos inválidos ou erros internos.
 */
export const setAdminRole = regionalFunctions.https.onCall(async (data, context) => {
  // --- Verificação de Segurança ---
  // Apenas usuários com o Custom Claim 'superAdmin' ou 'Dev' podem executar esta função.
  const callerRole = context.auth?.token.role;
  if (callerRole !== "superAdmin" && callerRole !== "Dev") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Apenas Super Admins ou Desenvolvedores podem executar esta ação."
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

  // Valida o papel que está sendo atribuído
  const validRoles = ["admin", "superAdmin", "Dev", "citizen"];
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
