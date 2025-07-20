import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  selectOrganisation: (orgId: string) => void;
  refreshOrganisations: () => Promise<void>;
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

  const fetchOrganisations = async () => {
    try {
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

  useEffect(() => {
    fetchOrganisations();
    
    // Restaurer org depuis localStorage
    const savedOrgId = localStorage.getItem('currentOrgId');
    if (savedOrgId) {
      const org = organisations.find(o => o.id === savedOrgId);
      if (org) setCurrentOrg(org);
    }
  }, []);

  return (
    <OrganisationContext.Provider
      value={{
        currentOrg,
        organisations,
        isLoading,
        selectOrganisation,
        refreshOrganisations,
      }}
    >
      {children}
    </OrganisationContext.Provider>
  );
};