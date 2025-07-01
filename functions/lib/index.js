"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAdminRole = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// Inicializa o app do Admin SDK
admin.initializeApp();
// Define a região padrão para todas as funções
const regionalFunctions = functions.region("southamerica-east1");
/**
 * Função Callable para definir um usuário como admin de um setor.
 * Apenas um 'superAdmin' pode executar esta função.
 * @param {string} data.email - O email do usuário a ser promovido.
 * @param {string} data.department - O departamento ao qual o usuário será atribuído (ex: 'arborizacao').
 * @param {string} [data.role] - Opcional. O papel a ser atribuído (ex: 'admin' ou 'superAdmin'). Padrão é 'admin'.
 */
exports.setAdminRole = regionalFunctions.https.onCall(async (data, context) => {
    // --- Verificação de Segurança ---
    // Apenas um superAdmin pode promover outros.
    // Bloco comentado temporariamente para permitir a criação do primeiro Super Admin.
    /*
    if (context.auth?.token.role !== "superAdmin") {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Apenas super-admins podem executar esta ação."
      );
    }
    */
    const { email, department, role = "admin" } = data;
    if (!email || !department) {
        throw new functions.https.HttpsError("invalid-argument", "O email e o departamento são obrigatórios.");
    }
    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        await admin.auth().setCustomUserClaims(userRecord.uid, {
            role: role,
            department: department,
        });
        const successMessage = `Sucesso! O usuário ${email} agora tem o papel '${role}' no setor '${department}'.`;
        console.log(successMessage);
        return { message: successMessage };
    }
    catch (error) {
        console.error("Erro ao definir permissão de admin:", error);
        throw new functions.https.HttpsError("internal", "Ocorreu um erro ao processar a solicitação.");
    }
});
//# sourceMappingURL=index.js.map