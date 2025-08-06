import { createClient } from '@supabase/supabase-js';

// Configuration de base
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Configuration Supabase manquante !');
  throw new Error('Les variables d\'environnement Supabase sont requises');
}

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

// Fonctions d'authentification
export const auth = {
  /**
   * Nouvelle méthode de connexion avec auto-confirmation en mode démo
   */
  login: async (email: string, password: string) => {
    try {
      // 1. D'abord essayer de se connecter normalement
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (error) {
        // 2. Si email non confirmé ET mode démo, contourner
        if (error.message.includes('Email not confirmed') &&
            import.meta.env.VITE_DEMO_MODE === 'true') {
          console.warn('[DEMO] Auto-confirmation email pour', email);

          // Étape magique : marquer l'email comme confirmé
          const { error: updateError } = await supabase
            .from('users')
            .update({ email_confirmed_at: new Date().toISOString() })
            .eq('email', email);

          if (updateError) throw updateError;

          // Réessayer la connexion
          return await supabase.auth.signInWithPassword({
            email,
            password
          });
        }
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Erreur auth.login:', error);
      throw error;
    }
  },
  // ... autres méthodes
};

// Export des fonctions principales (rétro-compatibilité)
export const handleLogin = auth.login;
export const handleLogout = auth.logout;
export const validateSession = auth.validateSession;
export const clearSession = auth.logout; // Alias pour logout
export const directAuthTest = auth.test;

// Initialisation et vérification au chargement
(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  console.log('État initial auth:', session ? 'connecté' : 'non connecté');
})();
