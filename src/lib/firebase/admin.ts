
import admin from 'firebase-admin';

// Garante que a inicialização ocorra apenas uma vez.
if (!admin.apps.length) {
  admin.initializeApp({
    // As credenciais são descobertas automaticamente no ambiente do App Hosting.
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
