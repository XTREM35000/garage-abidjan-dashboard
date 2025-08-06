import { createClient } from '@supabase/supabase-js';

// Configuration de base
const supabaseUrl = 'https://metssugfqsnttghfrsxx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ldHNzdWdmcXNudHRnaGZyc3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NDk5NjEsImV4cCI6MjA2ODQyNTk2MX0.Vc0yDgzSe6iAfgUHezVKQMm4qvzMRRjCIrTTndpE1k8';

// Client Supabase configuré
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    flowType: 'pkce' // Meilleure sécurité pour les SPA
  },
  global: {
    headers: {
      'X-Client-Info': 'garage-abidjan-dashboard'
    }
  }
});

// Fonctions d'authentification réelles
export const handleRealAuth = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: { 
        emailRedirectTo: `${window.location.origin}/auth/confirm` 
      }
    });
    if (error) throw new Error(formatAuthError(error));
    return data;
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: email.trim(), 
      password: password.trim() 
    });
    
    if (error?.status === 400 && error.message.includes("Email not confirmed")) {
      throw new Error("CONFIRM_EMAIL");
    }
    if (error) throw new Error(formatAuthError(error));
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(formatAuthError(error));
  },

  validateSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw new Error(formatAuthError(error));
    return session;
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/reset-password` 
    });
    if (error) throw new Error(formatAuthError(error));
  }
};

// Helper pour formater les erreurs d'auth
const formatAuthError = (error: any): string => {
  if (error.message?.includes('Invalid login credentials')) {
    return 'Email ou mot de passe incorrect';
  }
  if (error.message?.includes('Email not confirmed')) {
    return 'Email non confirmé. Vérifiez votre boîte mail.';
  }
  if (error.message?.includes('User already registered')) {
    return 'Un compte existe déjà avec cet email';
  }
  if (error.message?.includes('Password should be at least')) {
    return 'Le mot de passe doit contenir au moins 6 caractères';
  }
  return error.message || 'Erreur d\'authentification';
};

// Export des fonctions principales (rétro-compatibilité)
export const handleLogin = handleRealAuth.signIn;
export const handleLogout = handleRealAuth.signOut;
export const validateSession = handleRealAuth.validateSession;
export const clearSession = handleRealAuth.signOut;

// Initialisation et vérification au chargement
(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  console.log('État initial auth:', session ? 'connecté' : 'non connecté');
})();
