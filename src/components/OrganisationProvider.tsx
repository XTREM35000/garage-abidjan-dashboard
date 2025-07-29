import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Organisation {
  id: string;
  nom: string;
  slug: string;
  logo_url?: string;
  plan_abonnement: string;
  est_actif: boolean;
}

interface OrganisationContextType {
  currentOrg: Organisation | null;
  organisations: Organisation[];
  isLoading: boolean;
  needsOnboarding: boolean;
  selectOrganisation: (orgId: string) => void;
  refreshOrganisations: () => Promise<void>;
  completeOnboarding: (orgId: string) => void;
}

const OrganisationContext = createContext<OrganisationContextType | undefined>(undefined);

export const useOrganisation = () => {
  const context = useContext(OrganisationContext);
  if (!context) {
    throw new Error('useOrganisation must be used within OrganisationProvider');
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const OrganisationProvider: React.FC<Props> = ({ children }) => {
  const [currentOrg, setCurrentOrg] = useState<Organisation | null>(null);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const { profile, isAuthenticated } = useAuth();

  const fetchOrganisations = async () => {
    try {
      console.log('[OrganisationProvider] Chargement des organisations...');

      // Si l'utilisateur a une organisation_id, charger seulement celle-ci
      if (profile?.organisation_id) {
        console.log('[OrganisationProvider] Utilisateur avec organisation_id:', profile.organisation_id);

        const { data, error } = await supabase
          .from('organisations')
          .select('id, nom, slug, logo_url, plan_abonnement, est_actif')
          .eq('id', profile.organisation_id)
          .single();

        if (error) {
          console.error('[OrganisationProvider] Erreur lors du chargement de l\'organisation:', error);
          throw error;
        }

        if (data) {
          console.log('[OrganisationProvider] Organisation chargée:', data.nom);
          setOrganisations([data]);
          setCurrentOrg(data);
          localStorage.setItem('currentOrgId', data.id);

          // Définir le contexte Supabase
          try {
            await supabase.functions.invoke('set-organisation-context', {
              body: { organisationId: data.id }
            });
            console.log('[OrganisationProvider] Contexte organisationnel défini');
          } catch (contextError) {
            console.warn('[OrganisationProvider] Erreur lors de la définition du contexte:', contextError);
          }
        }
      } else if (profile?.role === 'superadmin') {
        console.log('[OrganisationProvider] Superadmin - chargement de toutes les organisations');

        // Les superadmin peuvent voir toutes les organisations
        const { data, error } = await supabase
          .from('organisations')
          .select('id, nom, slug, logo_url, plan_abonnement, est_actif')
          .eq('est_actif', true)
          .order('nom');

        if (error) {
          console.error('[OrganisationProvider] Erreur lors du chargement des organisations:', error);
          throw error;
        }

        console.log('[OrganisationProvider] Organisations chargées:', data?.length || 0);
        setOrganisations(data || []);

        // Ne pas auto-sélectionner, laisser currentOrg à null pour forcer le choix explicite
      } else if (isAuthenticated && !profile?.organisation_id) {
        console.log('[OrganisationProvider] Utilisateur connecté sans organisation - onboarding requis');
        setNeedsOnboarding(true);
      } else {
        console.log('[OrganisationProvider] Aucune organisation à charger');
      }
    } catch (error) {
      console.error('[OrganisationProvider] Erreur lors du chargement des organisations:', error);
    } finally {
      setIsLoading(false);
      console.log('[OrganisationProvider] Chargement terminé');
    }
  };

  const selectOrganisation = (orgId: string) => {
    console.log('[OrganisationProvider] Sélection de l\'organisation:', orgId);
    const org = organisations.find(o => o.id === orgId);
    if (org) {
      setCurrentOrg(org);
      localStorage.setItem('currentOrgId', orgId);

      // Définir le contexte Supabase
      supabase.functions.invoke('set-organisation-context', {
        body: { organisationId: orgId }
      }).then(() => {
        console.log('[OrganisationProvider] Contexte organisationnel mis à jour');
      }).catch((error) => {
        console.warn('[OrganisationProvider] Erreur lors de la mise à jour du contexte:', error);
      });
    }
  };

  const refreshOrganisations = async () => {
    console.log('[OrganisationProvider] Actualisation des organisations...');
    setIsLoading(true);
    await fetchOrganisations();
  };

  const completeOnboarding = (orgId: string) => {
    console.log('[OrganisationProvider] Onboarding terminé pour:', orgId);
    setNeedsOnboarding(false);
    // Forcer le rechargement pour récupérer la nouvelle organisation
    refreshOrganisations();
  };

  useEffect(() => {
    if (profile) {
      console.log('[OrganisationProvider] Profil détecté, chargement des organisations...');
      fetchOrganisations();
    } else if (!isAuthenticated) {
      console.log('[OrganisationProvider] Utilisateur non authentifié, arrêt du chargement');
      setIsLoading(false);
    }
    // Si des organisations existent mais aucune sélectionnée, currentOrg reste null
    // Le sélecteur d'organisation sera affiché côté UI
  }, [profile, isAuthenticated]);

  return (
    <OrganisationContext.Provider
      value={{
        currentOrg,
        organisations,
        isLoading,
        needsOnboarding,
        selectOrganisation,
        refreshOrganisations,
        completeOnboarding,
      }}
    >
      {children}
    </OrganisationContext.Provider>
  );
};
