import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useOrganisation } from '@/components/OrganisationProvider';
import { testDatabaseConnection } from '@/utils/databaseTest';

export interface SetupState {
  step: 'checking' | 'super-admin' | 'pricing' | 'organisation' | 'admin' | 'auth' | 'complete';
  isLoading: boolean;
  error: string | null;
  hasSuperAdmin: boolean;
  hasOrganisations: boolean;
  selectedPlan: string | null;
  organisationData: any | null;
}

export const useMultiInstanceSetup = () => {
  const [setupState, setSetupState] = useState<SetupState>({
    step: 'checking',
    isLoading: true,
    error: null,
    hasSuperAdmin: false,
    hasOrganisations: false,
    selectedPlan: null,
    organisationData: null
  });

  const { isAuthenticated, profile, isLoading: authLoading } = useAuth();
  const { organisations, isLoading: orgLoading } = useOrganisation();

  // Vérifier l'état initial de l'application
  const checkInitialState = async () => {
    try {
      setSetupState(prev => ({ ...prev, isLoading: true, error: null }));

      // 0. Test de connectivité à la base de données
      console.log('🔍 Test de connectivité à la base de données...');
      const dbTest = await testDatabaseConnection();

      if (!dbTest.success) {
        console.error('❌ Échec du test de connectivité:', dbTest.error);
        setSetupState(prev => ({
          ...prev,
          error: `Erreur de connexion: ${dbTest.error}`,
          isLoading: false,
          hasSuperAdmin: false,
          hasOrganisations: false
        }));
        determineNextStep(false, false);
        return;
      }

      console.log('✅ Connectivité OK, tables disponibles:', dbTest.tables);

      // 1. Vérifier s'il y a un Super-Admin (avec gestion d'erreur de table)
      let hasSuperAdmin = false;
      if (dbTest.tables.super_admins) {
        try {
          const { data: superAdmins, error: superAdminError } = await supabase
            .from('super_admins')
            .select('id')
            .limit(1);

          if (superAdminError) {
            console.warn('Erreur lors de la vérification des super_admins:', superAdminError);
            hasSuperAdmin = false;
          } else {
            hasSuperAdmin = superAdmins && superAdmins.length > 0;
          }
        } catch (error) {
          console.warn('Exception lors de la vérification des super_admins:', error);
          hasSuperAdmin = false;
        }
      } else {
        console.warn('⚠️ Table super_admins non disponible');
        hasSuperAdmin = false;
      }

      // 2. Vérifier s'il y a des organisations
      let hasOrganisations = false;
      if (dbTest.tables.organisations) {
        try {
          const { data: orgs, error: orgsError } = await supabase
            .from('organisations')
            .select('id')
            .limit(1);

          if (orgsError) {
            console.warn('Erreur lors de la vérification des organisations:', orgsError);
            hasOrganisations = false;
          } else {
            hasOrganisations = orgs && orgs.length > 0;
          }
        } catch (error) {
          console.warn('Exception lors de la vérification des organisations:', error);
          hasOrganisations = false;
        }
      } else {
        console.warn('⚠️ Table organisations non disponible');
        hasOrganisations = false;
      }

      console.log('État initial:', { hasSuperAdmin, hasOrganisations });

      setSetupState(prev => ({
        ...prev,
        hasSuperAdmin,
        hasOrganisations,
        isLoading: false
      }));

      // Déterminer la prochaine étape
      determineNextStep(hasSuperAdmin, hasOrganisations);

    } catch (error: any) {
      console.error('Erreur lors de la vérification de l\'état initial:', error);
      setSetupState(prev => ({
        ...prev,
        error: error.message || 'Erreur lors de la vérification',
        isLoading: false,
        hasSuperAdmin: false,
        hasOrganisations: false
      }));

      // En cas d'erreur, rediriger vers l'authentification
      determineNextStep(false, false);
    }
  };

  // Déterminer la prochaine étape du workflow
  const determineNextStep = (hasSuperAdmin: boolean, hasOrganisations: boolean) => {
    if (!hasSuperAdmin) {
      setSetupState(prev => ({ ...prev, step: 'super-admin' }));
    } else if (!hasOrganisations) {
      setSetupState(prev => ({ ...prev, step: 'pricing' }));
    } else if (!isAuthenticated) {
      setSetupState(prev => ({ ...prev, step: 'auth' }));
    } else {
      setSetupState(prev => ({ ...prev, step: 'complete' }));
    }
  };

  // Gérer la création du Super-Admin
  const handleSuperAdminComplete = (adminData: any) => {
    setSetupState(prev => ({
      ...prev,
      step: 'pricing',
      hasSuperAdmin: true
    }));
  };

  // Gérer la sélection du plan
  const handlePlanSelect = (planId: string) => {
    setSetupState(prev => ({
      ...prev,
      step: 'organisation',
      selectedPlan: planId
    }));
  };

  // Gérer la création de l'organisation
  const handleOrganisationComplete = (orgData: any) => {
    setSetupState(prev => ({
      ...prev,
      step: 'admin',
      organisationData: orgData,
      hasOrganisations: true
    }));
  };

  // Gérer la création de l'admin
  const handleAdminComplete = (adminData: any) => {
    setSetupState(prev => ({
      ...prev,
      step: 'auth'
    }));
  };

  // Gérer l'authentification complète
  const handleAuthComplete = () => {
    setSetupState(prev => ({
      ...prev,
      step: 'complete'
    }));
  };

  // Réinitialiser l'état
  const resetSetup = () => {
    setSetupState({
      step: 'checking',
      isLoading: true,
      error: null,
      hasSuperAdmin: false,
      hasOrganisations: false,
      selectedPlan: null,
      organisationData: null
    });
  };

  // Vérifier l'état initial au montage
  useEffect(() => {
    if (!authLoading && !orgLoading) {
      checkInitialState();
    }
  }, [authLoading, orgLoading]);

  // Mettre à jour l'étape quand l'authentification change
  useEffect(() => {
    if (setupState.step === 'auth' && isAuthenticated) {
      setSetupState(prev => ({ ...prev, step: 'complete' }));
    }
  }, [isAuthenticated, setupState.step]);

  return {
    setupState,
    checkInitialState,
    handleSuperAdminComplete,
    handlePlanSelect,
    handleOrganisationComplete,
    handleAdminComplete,
    handleAuthComplete,
    resetSetup
  };
};
