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
      // Si l'utilisateur a une organisation_id, charger seulement celle-ci
      if (profile?.organisation_id) {
        const { data, error } = await supabase
          .from('organisations')
          .select('id, nom, slug, logo_url, plan_abonnement, est_actif')
          .eq('id', profile.organisation_id)
          .single();

        if (error) throw error;
        
        if (data) {
          setOrganisations([data]);
          setCurrentOrg(data);
          localStorage.setItem('currentOrgId', data.id);
          
          // Définir le contexte Supabase
          await supabase.functions.invoke('set-organisation-context', {
            body: { organisationId: data.id }
          });
        }
      } else if (profile?.role === 'superadmin') {
        // Les superadmin peuvent voir toutes les organisations
        const { data, error } = await supabase
          .from('organisations')
          .select('id, nom, slug, logo_url, plan_abonnement, est_actif')
          .eq('est_actif', true)
          .order('nom');

        if (error) throw error;
        setOrganisations(data || []);
        
        // Auto-select première org si aucune sélectionnée
        if (data?.length && !currentOrg) {
          setCurrentOrg(data[0]);
          localStorage.setItem('currentOrgId', data[0].id);
        }
      } else if (isAuthenticated && !profile?.organisation_id) {
        // L'utilisateur est connecté mais n'a pas d'organisation
        setNeedsOnboarding(true);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des organisations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectOrganisation = (orgId: string) => {
    const org = organisations.find(o => o.id === orgId);
    if (org) {
      setCurrentOrg(org);
      localStorage.setItem('currentOrgId', orgId);
      
      // Définir le contexte Supabase
      supabase.functions.invoke('set-organisation-context', {
        body: { organisationId: orgId }
      });
    }
  };

  const refreshOrganisations = async () => {
    setIsLoading(true);
    await fetchOrganisations();
  };

  const completeOnboarding = (orgId: string) => {
    setNeedsOnboarding(false);
    // Forcer le rechargement pour récupérer la nouvelle organisation
    refreshOrganisations();
  };

  useEffect(() => {
    if (profile) {
      fetchOrganisations();
    }
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