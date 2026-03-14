import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, AuthResponse, AuthTokenResponse, AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signUp: (email: string, pass: string, metadata: Record<string, string>) => Promise<AuthResponse>;
  signIn: (email: string, pass: string) => Promise<AuthTokenResponse>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérification session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Écoute des changements de connexion
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = (email: string, pass: string, metadata: Record<string, string>) => 
    supabase.auth.signUp({ email, password: pass, options: { data: metadata } });

  const signIn = (email: string, pass: string) => 
    supabase.auth.signInWithPassword({ email, password: pass });

  const signOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
};