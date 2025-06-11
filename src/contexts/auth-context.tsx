
"use client";

import type { User as FirebaseUser, AuthError } from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type UserCredential,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  currentUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<UserCredential | string>;
  register: (email: string, pass: string) => Promise<UserCredential | string>;
  logout: () => Promise<void>;
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

  const register = async (email: string, pass: string): Promise<UserCredential | string> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      // User will be set by onAuthStateChanged
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
      router.push("/"); // Redirect to home page after logout
    } catch (error) {
      const authError = error as AuthError;
      console.error("Error logging out:", authError);
      toast({ title: "Erro ao sair", description: authError.message, variant: "destructive" });
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
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
