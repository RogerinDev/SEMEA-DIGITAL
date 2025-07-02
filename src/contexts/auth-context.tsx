
"use client";

import type { User as FirebaseUser, AuthError } from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  onIdTokenChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type UserCredential,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import type { AppUser } from "@/types";

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<AppUser | string>;
  register: (name: string, email: string, pass:string) => Promise<UserCredential | string>;
  logout: () => Promise<void>;
  changeUserPassword: (currentPass: string, newPass: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        const claims = idTokenResult.claims;
        
        // This is a safe way to add properties to the user object without breaking its prototype chain
        const appUser = user as AppUser;
        appUser.role = claims.role as AppUser['role'];
        appUser.department = claims.department as AppUser['department'];
        
        setCurrentUser(appUser);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<AppUser | string> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;

      // Force refresh to get latest claims. Important after promotion.
      const idTokenResult = await user.getIdTokenResult(true); 
      const claims = idTokenResult.claims;
      const appUser = user as AppUser;
      appUser.role = claims.role as AppUser['role'];
      appUser.department = claims.department as AppUser['department'];

      setCurrentUser(appUser); // Update context state immediately
      
      toast({ title: "Login realizado com sucesso!" });
      return appUser;
    } catch (error) {
      const authError = error as AuthError;
      
      let description = "Ocorreu um erro inesperado. Por favor, tente novamente.";

      if (authError.code === 'auth/invalid-credential' || authError.code === 'auth/wrong-password' || authError.code === 'auth/user-not-found') {
        description = "E-mail ou senha incorretos. Por favor, verifique seus dados e tente novamente.";
      } else if (authError.code === 'auth/too-many-requests') {
        description = "Acesso à conta temporariamente desativado devido a muitas tentativas de login. Tente novamente mais tarde.";
      } else {
        // For other, unexpected errors, it's still good to log them.
        console.error("Unhandled login error:", authError);
      }


      toast({ title: "Erro no Login", description, variant: "destructive" });
      return authError.code;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string): Promise<UserCredential | string> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(userCredential.user, { displayName: name });
      
      const appUser = userCredential.user as AppUser;
      appUser.role = 'citizen';

      setCurrentUser(appUser);

      toast({ title: "Cadastro realizado com sucesso!" });
      return userCredential;
    } catch (error) {
      const authError = error as AuthError;
      console.error("Error registering:", authError);
      toast({ title: "Erro no Cadastro", description: authError.message, variant: "destructive" });
      return authError.code;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setCurrentUser(null);
      toast({ title: "Logout realizado com sucesso." });
      router.push("/");
    } catch (error) {
      const authError = error as AuthError;
      console.error("Error logging out:", authError);
      toast({ title: "Erro ao sair", description: authError.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const changeUserPassword = async (currentPass: string, newPass: string): Promise<boolean> => {
    if (!currentUser || !currentUser.email) return false;
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPass);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPass);
      toast({ title: "Sucesso!", description: "Sua senha foi alterada." });
      return true;
    } catch (error) {
       const authError = error as AuthError;
       console.error("Error changing password:", authError);
       const description = authError.code === 'auth/wrong-password' 
          ? "A senha atual está incorreta."
          : authError.message;
       toast({ title: "Erro ao alterar senha", description, variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const resetPassword = async (email: string): Promise<boolean> => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: "Link Enviado!", description: "Verifique sua caixa de entrada para o link de redefinição de senha." });
      return true;
    } catch (error) {
      const authError = error as AuthError;
      console.error("Error sending password reset email:", authError);
      let description = "Não foi possível enviar o email. Verifique se o email está correto e tente novamente.";
      if (authError.code === 'auth/user-not-found') {
        description = "Nenhuma conta encontrada com este endereço de e-mail.";
      }
      toast({ title: "Erro ao Redefinir Senha", description, variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };


  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    changeUserPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
