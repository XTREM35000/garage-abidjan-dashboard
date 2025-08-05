import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || 'https://metssugfqsnttghfrsxx.supabase.co';
const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_SERVICE_KEY || import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.warn('⚠️ Clé Supabase manquante. Utilisez VITE_PUBLIC_SUPABASE_SERVICE_KEY ou VITE_PUBLIC_SUPABASE_ANON_KEY');
}

// Configuration Supabase pour production avec vraie validation email
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Activé pour gérer les redirections email
    flowType: 'pkce'
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'garage-abidjan-dashboard/production',
    }
  }
});

// Types pour les réponses d'authentification
export interface AuthResponse {
  user: any;
  session: any;
  error?: string;
}

export interface ValidationResponse {
  isValid: boolean;
  session: any;
  user: any;
  error?: any;
}

// Messages d'erreur conviviaux
const getFriendlyAuthError = (error: any): string => {
  const message = error.message?.toLowerCase() || '';
  
  if (message.includes('email not confirmed')) {
    return 'Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte mail.';
  }
  if (message.includes('invalid login credentials')) {
    return 'Email ou mot de passe incorrect.';
  }
  if (message.includes('user already registered')) {
    return 'Un compte existe déjà avec cet email.';
  }
  if (message.includes('password')) {
    return 'Le mot de passe doit contenir au moins 8 caractères.';
  }
  if (message.includes('email')) {
    return 'Format d\'email invalide.';
  }
  if (message.includes('too many requests')) {
    return 'Trop de tentatives. Veuillez réessayer dans quelques minutes.';
  }
  
  return error.message || 'Une erreur inattendue s\'est produite.';
};

// Inscription avec vraie validation email
export const signUpWithEmail = async (email: string, password: string, userData?: any): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
        data: userData
      }
    });

    if (error) {
      throw new Error(getFriendlyAuthError(error));
    }

    return {
      user: data.user,
      session: data.session
    };
  } catch (error: any) {
    return {
      user: null,
      session: null,
      error: error.message
    };
  }
};

// Connexion avec vérification email confirmé
export const signInWithEmail = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(getFriendlyAuthError(error));
    }

    // Vérifier que l'email est confirmé
    if (data.user && !data.user.email_confirmed_at) {
      throw new Error('Email non confirmé. Vérifiez votre boîte mail et cliquez sur le lien de confirmation.');
    }

    return {
      user: data.user,
      session: data.session
    };
  } catch (error: any) {
    return {
      user: null,
      session: null,
      error: error.message
    };
  }
};

// Validation de session avec vérification RLS
export const validateSession = async (): Promise<ValidationResponse> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }

    if (!session || !session.user) {
      return {
        isValid: false,
        session: null,
        user: null
      };
    }

    // Vérifier que l'email est toujours confirmé
    if (!session.user.email_confirmed_at) {
      return {
        isValid: false,
        session: null,
        user: null,
        error: 'Email non confirmé'
      };
    }

    return {
      isValid: true,
      session: session,
      user: session.user
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return {
      isValid: false,
      session: null,
      user: null,
      error: error
    };
  }
};

// Déconnexion
export const signOut = async (): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return {};
  } catch (error: any) {
    return { error: error.message };
  }
};

// Renvoyer email de confirmation
export const resendConfirmation = async (email: string): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`
      }
    });
    
    if (error) throw error;
    return {};
  } catch (error: any) {
    return { error: getFriendlyAuthError(error) };
  }
};

// Réinitialisation de mot de passe
export const resetPassword = async (email: string): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    
    if (error) throw error;
    return {};
  } catch (error: any) {
    return { error: getFriendlyAuthError(error) };
  }
};

// Mise à jour du mot de passe
export const updatePassword = async (newPassword: string): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    return {};
  } catch (error: any) {
    return { error: getFriendlyAuthError(error) };
  }
};

// Vérifier les permissions utilisateur pour une organisation
export const checkUserPermissions = async (userId: string, organizationId?: string) => {
  try {
    if (!organizationId) {
      // Récupérer les organisations de l'utilisateur
      const { data: userOrgs, error } = await supabase
        .from('user_organizations')
        .select(`
          organization_id, 
          role, 
          organisations!inner(
            id,
            nom,
            code,
            description
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      return {
        organizations: userOrgs || [],
        hasAccess: (userOrgs?.length || 0) > 0
      };
    }

    // Vérifier l'accès à une organisation spécifique
    const { data: userOrg, error } = await supabase
      .from('user_organizations')
      .select(`
        role, 
        organisations!inner(
          id,
          nom,
          code,
          description
        )
      `)
      .eq('user_id', userId)
      .eq('organization_id', organizationId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return {
      hasAccess: !!userOrg,
      role: userOrg?.role,
      organization: userOrg?.organisations
    };
  } catch (error) {
    console.error('Permission check error:', error);
    return {
      hasAccess: false,
      error: error
    };
  }
};

// Vérifier si l'utilisateur est un super admin
export const checkSuperAdminStatus = async (userId?: string): Promise<{ isSuperAdmin: boolean, error?: any }> => {
  try {
    const userIdToCheck = userId || (await supabase.auth.getUser()).data.user?.id;
    
    if (!userIdToCheck) {
      return { isSuperAdmin: false };
    }

    const { data, error } = await supabase
      .from('super_admins')
      .select('id, est_actif')
      .eq('user_id', userIdToCheck)
      .eq('est_actif', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return {
      isSuperAdmin: !!data
    };
  } catch (error) {
    console.error('Super admin check error:', error);
    return {
      isSuperAdmin: false,
      error: error
    };
  }
};

// Fonction pour récupérer les organisations disponibles
export const getAvailableOrganizations = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { organizations: [], error: 'Utilisateur non connecté' };
    }

    // Vérifier si c'est un super admin
    const { isSuperAdmin } = await checkSuperAdminStatus(user.id);
    
    if (isSuperAdmin) {
      // Super admin peut voir toutes les organisations
      const { data: allOrgs, error } = await supabase
        .from('organisations')
        .select('id, nom, code, description, created_at')
        .order('nom');

      if (error) throw error;
      
      return {
        organizations: allOrgs || [],
        isSuperAdmin: true
      };
    } else {
      // Utilisateur normal ne voit que ses organisations
      const { organizations } = await checkUserPermissions(user.id);
      
      return {
        organizations: organizations.map(org => org.organisations),
        isSuperAdmin: false
      };
    }
  } catch (error) {
    console.error('Error getting organizations:', error);
    return {
      organizations: [],
      error: error.message
    };
  }
};

// Debug function (conservée pour développement)
export const getSupabaseDebugInfo = async () => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const { data: user } = await supabase.auth.getUser();
    
    return {
      session: session.session,
      user: user.user,
      isConnected: !!session.session,
      supabaseUrl: supabaseUrl,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting Supabase debug info:', error);
    return {
      session: null,
      user: null,
      isConnected: false,
      error: error,
      timestamp: new Date().toISOString()
    };
  }
};

// Logging pour production (désactivé par défaut)
const enableLogging = import.meta.env.VITE_DEBUG === 'true';
if (enableLogging) {
  supabase
    .channel('system')
    .on('system', { event: '*' }, (payload) => {
      console.log('[Supabase Event]', payload);
    })
    .subscribe();
}

// Vérification initiale de connexion
supabase.auth.getSession()
  .then(({ data: { session } }) => {
    if (enableLogging) {
      console.log('Session initiale:', session);
    }
  })
  .catch((error) => {
    console.error('Erreur vérification session:', error);
  });
