import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'superadmin' | 'admin' | 'manager' | 'technicien' | 'employe';
  organisation_id?: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasOrganisation: boolean;
  role: string;
  organisation_id?: string;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    hasOrganisation: false,
    role: 'employe'
  });

  useEffect(() => {
    console.log('[useAuth] Initialisation du hook d\'authentification');

    // Get initial session avec timeout
    const initAuth = async () => {
      try {
        console.log('[useAuth] Récupération de la session initiale...');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('[useAuth] Erreur lors de la récupération de la session:', error);
        }

        if (session?.user) {
          console.log('[useAuth] Session trouvée pour:', session.user.email);
          setAuthState(prev => ({
            ...prev,
            user: session.user,
            isAuthenticated: true,
            isLoading: true
          }));
          await fetchProfile(session.user.email!);
        } else {
          console.log('[useAuth] Aucune session trouvée');
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('[useAuth] Erreur lors de l\'initialisation:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[useAuth] Changement d\'état auth:', event, session?.user?.email);

        if (session?.user) {
          setAuthState(prev => ({
            ...prev,
            user: session.user,
            isAuthenticated: true,
            isLoading: true
          }));
          await fetchProfile(session.user.email!);
        } else {
          setAuthState({
            user: null,
            profile: null,
            isLoading: false,
            isAuthenticated: false,
            hasOrganisation: false,
            role: 'employe'
          });
          // Nettoyer le localStorage
          localStorage.removeItem('currentOrgId');
          localStorage.removeItem('selectedOrganisationSlug');
          console.log('[useAuth] Session supprimée, localStorage nettoyé');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userEmail: string) => {
    try {
      console.log('[useAuth] Récupération du profil pour:', userEmail);

      const { data, error } = await supabase
        .from('users')
        .select('id, email, nom, prenom, role, organisation_id')
        .eq('email', userEmail)
        .single();

      if (error) {
        console.warn('[useAuth] Profil utilisateur non trouvé en base:', error);
        setAuthState(prev => ({
          ...prev,
          profile: null,
          hasOrganisation: false,
          isLoading: false
        }));
      } else {
        console.log('[useAuth] Profil récupéré:', data);
        setAuthState(prev => ({
          ...prev,
          profile: data,
          hasOrganisation: !!data.organisation_id,
          role: data.role || 'employe',
          organisation_id: data.organisation_id,
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('[useAuth] Erreur lors de la récupération du profil:', error);
      setAuthState(prev => ({
        ...prev,
        profile: null,
        hasOrganisation: false,
        isLoading: false
      }));
    }
  };

  const signOut = async () => {
    try {
      console.log('[useAuth] Déconnexion en cours...');
      await supabase.auth.signOut();
      // Le nettoyage du state est géré par onAuthStateChange
    } catch (error) {
      console.error('[useAuth] Erreur lors de la déconnexion:', error);
    }
  };

  const checkOrganisationAccess = async () => {
    try {
      console.log('[useAuth] Vérification de l\'accès aux organisations...');
      const { data, error } = await supabase
        .from('organisations')
        .select('id, nom, slug, est_actif')
        .eq('est_actif', true)
        .limit(1);

      if (error) throw error;

      const hasAccess = data && data.length > 0;
      console.log('[useAuth] Accès aux organisations:', hasAccess);
      return hasAccess;
    } catch (error) {
      console.error('[useAuth] Erreur lors de la vérification de l\'accès aux organisations:', error);
      return false;
    }
  };

  return {
    ...authState,
    signOut,
    checkOrganisationAccess
  };
};
