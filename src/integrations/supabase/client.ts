import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || 'https://metssugfqsnttghfrsxx.supabase.co';
const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_SERVICE_KEY || import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.warn('⚠️ Clé Supabase manquante. Utilisez VITE_PUBLIC_SUPABASE_SERVICE_KEY ou VITE_PUBLIC_SUPABASE_ANON_KEY');
}
/*
if (!supabaseUrl || !supabaseKey) {
  throw new Error(`
    Configuration Supabase manquante. Vérifiez que :
    1. VITE_PUBLIC_SUPABASE_URL est défini
    2. VITE_PUBLIC_SUPABASE_SERVICE_KEY est défini
    3. Le fichier .env.local contient ces variables
    4. Le préfixe VITE_ correspond à votre environnement
  `);
} */

// Configuration spéciale pour la démo
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // Désactivé pour éviter des conflits
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

// Système de logging étendu (optionnel mais recommandé pour le débogage)
const enableLogging = import.meta.env.VITE_DEBUG === 'true';
if (enableLogging) {
  supabase
    .channel('system')
    .on('system', { event: '*' }, (payload) => {
      console.log('[Supabase Event]', payload);
    })
    .subscribe();
/*
  // Log les requêtes importantes
  supabase.hook('request', (event) => {
    console.log('[Supabase Request]', event.method, event.url);
    return event;
  });

  supabase.hook('response', (event) => {
    console.log('[Supabase Response]', event.status, event.method, event.url);
    return event;
  });
} */
  }
// Vérification initiale de connexion (optionnelle)
supabase.auth.getSession()
  .then(({ data: { session } }) => {
    console.log('Session initiale:', session);
  })
  .catch((error) => {
    console.error('Erreur vérification session:', error);
  });
