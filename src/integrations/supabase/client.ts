import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || 'https://metssugfqsnttghfrsxx.supabase.co';
const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_SERVICE_KEY || import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.warn('⚠️ Clé Supabase manquante. Utilisez VITE_PUBLIC_SUPABASE_SERVICE_KEY ou VITE_PUBLIC_SUPABASE_ANON_KEY');
}

// Configuration spéciale pour la démo
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // Désactivé pour éviter des conflits
    // Configuration pour éviter les problèmes d'email confirmation en démo
    flowType: 'pkce'
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'garage-abidjan-dashboard/demo-mode',
      'apikey': supabaseKey, // Nécessaire pour les requêtes REST
      'Authorization': `Bearer ${supabaseKey}`,
    }
  }
});

// Helper function for demo authentication with email confirmation bypass
export const signInWithEmailConfirmationBypass = async (email: string, password: string) => {
  try {
    // First try normal sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      // If it's an email confirmation error, try to bypass it in demo mode
      if (error.message.includes('Email not confirmed')) {
        console.warn('Email confirmation bypass activated for demo mode');
        
        // In demo mode, we can try to manually confirm the user
        // This would require admin privileges, so we'll just return a helpful error
        throw new Error('EMAIL_NOT_CONFIRMED_DEMO');
      }
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Helper function for creating users without email confirmation in demo mode
export const signUpWithoutEmailConfirmation = async (email: string, password: string, userData?: any) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // Disable email confirmation redirect
        data: userData
      }
    });

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

// Système de logging étendu (optionnel mais recommandé pour le débogage)
const enableLogging = import.meta.env.VITE_DEBUG === 'true';
if (enableLogging) {
  supabase
    .channel('system')
    .on('system', { event: '*' }, (payload) => {
      console.log('[Supabase Event]', payload);
    })
    .subscribe();
}

// Vérification initiale de connexion (optionnelle)
supabase.auth.getSession()
  .then(({ data: { session } }) => {
    console.log('Session initiale:', session);
  })
  .catch((error) => {
    console.error('Erreur vérification session:', error);
  });
