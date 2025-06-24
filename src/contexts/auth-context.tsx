
"use client";

import type { User as FirebaseUser, AuthError } from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type UserCredential,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  currentUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<UserCredential | string>;
  register: (name: string, email: string, pass:string) => Promise<UserCredential | string>;
  logout: () => Promise<void>;
  updateUserProfile: (name: string) => Promise<boolean>;
  changeUserPassword: (currentPass: string, newPass: string) => Promise<boolean>;
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
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<UserCredential | string> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      setCurrentUser(userCredential.user);
      toast({ title: "Login realizado com sucesso!" });
      return userCredential;
    } catch (error) {
      const authError = error as AuthError;
      console.error("Error logging in:", authError);
      toast({ title: "Erro no Login", description: authError.message, variant: "destructive" });
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
      
      setCurrentUser({ ...userCredential.user, displayName: name });

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
  
  const updateUserProfile = async (name: string): Promise<boolean> => {
    if (!currentUser) return false;
    setLoading(true);
    try {
      await updateProfile(currentUser, { displayName: name });
      setCurrentUser({ ...currentUser, displayName: name }); // Update local state immediately
      toast({ title: "Sucesso!", description: "Seu nome foi atualizado." });
      return true;
    } catch (error) {
      const authError = error as AuthError;
      console.error("Error updating profile:", authError);
      toast({ title: "Erro ao atualizar", description: authError.message, variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changeUserPassword = async (currentPass: string, newPass: string): Promise<boolean> => {
    if (!currentUser || !currentUser.email) return false;
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPass);
      // Re-authenticate before changing password for security
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

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
    changeUserPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
