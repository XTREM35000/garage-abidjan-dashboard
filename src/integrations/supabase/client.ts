import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://metssugfqsnttghfrsxx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ldHNzdWdmcXNudHRnaGZyc3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NDk5NjEsImV4cCI6MjA2ODQyNTk2MX0.Vc0yDgzSe6iAfgUHezVKQMm4qvzMRRjCIrTTndpE1k8';

export const supabase = createClient<any>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
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

export const handleRealAuth = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const clearSession = async () => {
  await supabase.auth.signOut();
};

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
    if (error) throw new Error(getFriendlyAuthError(error));
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
    if (error) throw new Error(getFriendlyAuthError(error));
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
    if (error) throw error;
    if (!session || !session.user) {
      return {
        isValid: false,
        session: null,
        user: null
      };
    }
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

// Fonction simplifiée pour créer une organisation (uniquement avec 'name')
export const createOrganizationWithEdge = async (orgData: any) => {
  try {
    console.log('🔍 Tentative création organisation avec données:', orgData);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');

    // Préparation des données
    const name = orgData.name?.trim();
    if (!name) throw new Error('Le nom de l\'organisation est requis');

    // Insérer directement dans la table organisations
    const { data: org, error: insertError } = await supabase
      .from('organisations')
      .insert({
        name: name,
        code: orgData.code || `ORG-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        slug: orgData.slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        email: orgData.email,
        subscription_type: orgData.subscription_type || 'monthly',
        is_active: true
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erreur insertion organisation:', insertError);
      throw insertError;
    }

    // Créer la relation user_organisations
    const { error: relationError } = await supabase
      .from('user_organisations')
      .insert({
        user_id: user.id,
        organisation_id: org.id,
        role: 'proprietaire'
      });

    if (relationError) {
      console.error('❌ Erreur création relation:', relationError);
      // Optionnel : supprimer l'organisation si la relation échoue
      await supabase.from('organisations').delete().eq('id', org.id);
      throw relationError;
    }

    console.log('✅ Organisation créée avec succès:', org);
    return { data: org, error: null };

  } catch (error) {
    console.error('❌ Exception lors de la création:', error);
    return { data: null, error };
  }
};

// Fonction simplifiée pour récupérer les organisations (uniquement avec 'name')
export const getOrganizationsWithEdge = async () => {
  try {
    const { data: organizations, error } = await supabase
      .from('organisations')
      .select('id, name, code, description, created_at')
      .order('name');

    console.log('🔍 Organisations brutes récupérées:', organizations);

    if (organizations && !error) {
      console.log('✅ Organisations récupérées avec succès:', organizations.length);
      // Mapper name vers nom pour la compatibilité avec le frontend
      const mappedOrganizations = organizations.map(org => ({
        ...org,
        nom: org.name // Ajouter le champ nom pour le frontend
      }));
      return { organizations: mappedOrganizations, error: null };
    }

    console.error('❌ Erreur récupération organisations:', error);
    return { organizations: [], error };

  } catch (error) {
    console.error('❌ Exception lors de la récupération d\'organisations:', error);
    return { organizations: [], error };
  }
};

// Vérifier les permissions utilisateur pour une organisation (uniquement avec 'name')
export const checkUserPermissions = async (userId: string, organizationId?: string) => {
  try {
    if (!organizationId) {
      const { data: userOrgs, error } = await supabase
        .from('user_organisations')
        .select(`
          organisation_id,
          organisations!inner(
            id,
            name,
            code,
            description
          )
        `)
        .eq('user_id', userId);

      console.log('🔍 user_organisations récupérées:', userOrgs);

      if (error) {
        console.error('❌ Erreur récupération user_organisations:', error);
        // En mode demo, retourner un tableau vide au lieu d'une erreur
        return {
          organizations: [],
          hasAccess: false,
          error: null
        };
      }

      // Mapper les organisations avec le nom correct
      const mappedOrgs = userOrgs?.map(userOrg => ({
        ...userOrg,
        organisations: userOrg.organisations ? {
          ...userOrg.organisations,
          nom: (userOrg.organisations as any).name // Ajouter nom pour compatibilité
        } : null
      })) || [];

      return {
        organizations: mappedOrgs,
        hasAccess: (userOrgs?.length || 0) > 0
      };
    }

    const { data: userOrg, error } = await supabase
      .from('user_organisations')
      .select(`
        organisations!inner(
          id,
          name,
          code,
          description
        )
      `)
      .eq('user_id', userId)
      .eq('organisation_id', organizationId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user organisation:', error);
      return {
        hasAccess: false,
        error: error.message
      };
    }

    return {
      hasAccess: !!userOrg,
      role: 'user', // Rôle par défaut car pas de colonne role
      organisation: userOrg?.organisations
    };
  } catch (error) {
    console.error('Permission check error:', error);
    return {
      hasAccess: false,
      error: error
    };
  }
};

// Vérifier si l'utilisateur est super admin
export const checkSuperAdminStatus = async (userId?: string): Promise<{ isSuperAdmin: boolean; error?: any }> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userIdToCheck = userId || userData?.user?.id;
    if (!userIdToCheck) {
      return { isSuperAdmin: false };
    }
    const { data, error }: { data: any; error: any } = await supabase
      .from('super_admins')
      .select('id, est_actif')
      .eq('user_id', userIdToCheck)
      .eq('est_actif', true)
      .single();
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    return {
      isSuperAdmin: !!data,
      error: undefined
    };
  } catch (error) {
    console.error('Super admin check error:', error);
    return {
      isSuperAdmin: false,
      error
    };
  }
};

// Récupérer les organisations disponibles avec gestion d'erreurs robuste
export const getAvailableOrganizations = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { organizations: [], error: 'Utilisateur non connecté' };
    }

    // Vérifier d'abord si l'utilisateur est super admin
    const { isSuperAdmin } = await checkSuperAdminStatus(user.id);

    if (isSuperAdmin) {
      // Super admin : récupérer toutes les organisations directement
      console.log('🔍 Super admin détecté, récupération de toutes les organisations...');
      const { organizations, error } = await getOrganizationsWithEdge();
      if (error) {
        console.error('❌ Erreur récupération organisations pour super admin:', error);
        return {
          organizations: [],
          isSuperAdmin: true,
          error: error.message
        };
      }
      console.log('✅ Organisations récupérées pour super admin:', organizations?.length || 0);
      return {
        organizations: organizations || [],
        isSuperAdmin: true
      };
    } else {
      // Utilisateur normal : essayer de récupérer via user_organisations d'abord
      console.log('🔍 Utilisateur normal, vérification des permissions...');
      try {
        const { organizations } = await checkUserPermissions(user.id);
        console.log('🔍 Organisations retournées par checkUserPermissions:', organizations);

        // Si l'utilisateur a des organisations via user_organisations
        if (organizations && organizations.length > 0) {
          // Mapper correctement les organisations
          const mappedOrganizations = organizations
            .filter((org: any) => org.organisations) // Filtrer les organisations valides
            .map((org: any) => ({
              id: org.organisations.id,
              nom: org.organisations.nom || org.organisations.name, // Utiliser nom ou name
              code: org.organisations.code,
              description: org.organisations.description
            }));

          console.log('✅ Organisations mappées pour utilisateur normal:', mappedOrganizations);
          return {
            organizations: mappedOrganizations,
            isSuperAdmin: false
          };
        }
      } catch (permError) {
        console.error('❌ Erreur permissions utilisateur:', permError);
      }

      // Mode demo : récupérer toutes les organisations si l'utilisateur n'a pas de relations
      console.log('🔄 Mode demo : utilisateur sans relations, récupération de toutes les organisations...');
      const { organizations: allOrgs, error } = await getOrganizationsWithEdge();
      if (error) {
        return {
          organizations: [],
          isSuperAdmin: false,
          error: error.message
        };
      }
      return {
        organizations: allOrgs || [],
        isSuperAdmin: false
      };
    }
  } catch (error: any) {
    console.error('❌ Erreur générale récupération organisations:', error);
    return {
      organizations: [],
      error: error.message
    };
  }
};

// Interface pour les données d'organisation
export interface OrganizationData {
  name: string;
  code: string;
  slug: string;
  email: string;
  subscription_type?: string;
}

// Fonction pour créer une organisation
export const createOrganization = async (data: {
  name: string;
  code: string;
  slug: string;
  email: string;
  subscription_type?: string;
}) => {
  const user = await supabase.auth.getUser();
  if (!user.data.user?.id) throw new Error('User not authenticated');

  try {
    // 1. Essayer avec la fonction RPC (si elle existe)
    console.log('Attempting to create organisation with RPC function...');

    const { data: org, error: rpcError } = await supabase.rpc('create_organisation_with_owner', {
      p_name: data.name,
      p_code: data.code,
      p_slug: data.slug,
      p_email: data.email,
      p_owner_id: user.data.user.id,
      p_subscription_type: data.subscription_type || 'monthly'
    });

    if (!rpcError && org) {
      console.log('Organisation created successfully via RPC function');
      return org;
    }

    if (rpcError) {
      console.log('RPC function failed, falling back to manual creation:', rpcError.message);
    }

    // 2. Fallback: création manuelle de l'organisation et de la relation utilisateur
    console.log('Creating organisation manually...');

    // Créer l'organisation directement
    const { data: newOrg, error: orgError } = await supabase
      .from('organisations')
      .insert({
        name: data.name,
        code: data.code,
        slug: data.slug,
        email: data.email,
        subscription_type: data.subscription_type || 'monthly',
        is_active: true
      })
      .select()
      .single();

    if (orgError) {
      console.error('Failed to create organisation:', orgError);
      throw new Error(`Failed to create organisation: ${orgError.message}`);
    }

    console.log('Organisation created successfully:', newOrg);

    // Créer la relation utilisateur-organisation
    const { error: userOrgError } = await supabase
      .from('user_organisations')
      .insert({
        user_id: user.data.user.id,
        organisation_id: newOrg.id,
        role: 'proprietaire' // Rôle par défaut pour le créateur
      });

    if (userOrgError) {
      console.error('Failed to create user-organisation relationship:', userOrgError);
      // Optionnel: supprimer l'organisation si la relation échoue
      // await supabase.from('organisations').delete().eq('id', newOrg.id);
      throw new Error(`Failed to create user-organisation relationship: ${userOrgError.message}`);
    }

    console.log('User-organisation relationship created successfully');
    return newOrg;
  } catch (error) {
    console.error('Error in createOrganization:', error);
    throw error;
  }
};

// Fonction de test pour vérifier les organisations disponibles
export const testOrganizations = async () => {
  try {
    console.log('🧪 Test des organisations...');

    // Test 1: Récupération directe des organisations
    const { data: directOrgs, error: directError } = await supabase
      .from('organisations')
      .select('*');

    console.log('🔍 Organisations directes:', directOrgs);
    console.log('❌ Erreur directe:', directError);

    // Test 2: Récupération via user_organisations
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: userOrgs, error: userOrgsError } = await supabase
        .from('user_organisations')
        .select(`
          organisation_id,
          organisations!inner(
            id,
            name,
            code,
            description
          )
        `)
        .eq('user_id', user.id);

      console.log('🔍 User organisations:', userOrgs);
      console.log('❌ Erreur user organisations:', userOrgsError);
    }

    // Test 3: Test de la fonction getAvailableOrganizations
    const result = await getAvailableOrganizations();
    console.log('🔍 Résultat getAvailableOrganizations:', result);

    return result;
  } catch (error) {
    console.error('❌ Erreur test organisations:', error);
    return { organizations: [], error: error.message };
  }
};

// Debug info
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
    if (session) {
      console.log('✅ Supabase connecté avec session:', session.user?.email);
    } else {
      console.log('ℹ️ Supabase initialisé - aucune session active (normal au démarrage)');
    }
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion Supabase:', error);
  });
