import admin from 'firebase-admin';

// Garante que a inicialização ocorra apenas uma vez.
if (!admin.apps.length) {
  admin.initializeApp({
    // As credenciais são descobertas automaticamente no ambiente do App Hosting.
  });
}

const dbAdmin = admin.firestore();
const authAdmin = admin.auth();

export { dbAdmin, authAdmin };
