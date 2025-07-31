import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import SplashScreen from '@/components/SplashScreen';
import PricingModal from '@/components/PricingModal';
import SuperAdminSetupModal from '@/components/SuperAdminSetupModal';
import { OrganisationOnboarding } from '@/components/OrganisationOnboarding';
import BrandSetupWizard from '@/components/BrandSetupWizard';

interface MultiInstanceSetupProps {
  onComplete: () => void;
  children: React.ReactNode;
}

export type SetupStep = 'splash' | 'pricing' | 'super-admin' | 'organisation' | 'brand' | 'complete';

const MultiInstanceSetup: React.FC<MultiInstanceSetupProps> = ({ onComplete, children }) => {
  const [currentStep, setCurrentStep] = useState<SetupStep>('splash');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [superAdminData, setSuperAdminData] = useState<any>(null);
  const [organisationId, setOrganisationId] = useState<string>('');

  useEffect(() => {
    checkExistingSetup();
  }, []);

  const checkExistingSetup = async () => {
    try {
      // Vérifier s'il y a des super-admins
      const { data: superAdmins, error: superAdminError } = await supabase
        .from('super_admins')
        .select('id')
        .limit(1);

      if (superAdminError) {
        console.error('Erreur lors de la vérification des super-admins:', superAdminError);
        // En cas d'erreur, on continue avec le workflow normal
        setTimeout(() => setCurrentStep('pricing'), 2000);
        return;
      }

      // Si des super-admins existent, vérifier s'il y a des organisations
      if (superAdmins && superAdmins.length > 0) {
        const { data: organisations, error: orgError } = await supabase
          .from('organisations')
          .select('id')
          .limit(1);

        if (orgError) {
          console.error('Erreur lors de la vérification des organisations:', orgError);
          setTimeout(() => setCurrentStep('pricing'), 2000);
          return;
        }

        // Si des organisations existent, l'app est déjà configurée
        if (organisations && organisations.length > 0) {
          setCurrentStep('complete');
          onComplete();
          return;
        }
      }

      // Si aucun super-admin ou organisation, commencer le workflow
      setTimeout(() => setCurrentStep('pricing'), 2000);
    } catch (error) {
      console.error('Erreur lors de la vérification de la configuration:', error);
      setTimeout(() => setCurrentStep('pricing'), 2000);
    }
  };

  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
    setCurrentStep('super-admin');
  };

  const handleSuperAdminCreated = (adminData: any) => {
    setSuperAdminData(adminData);
    setCurrentStep('organisation');
  };

  const handleOrganisationCreated = (orgId: string) => {
    setOrganisationId(orgId);
    setCurrentStep('brand');
  };

  const handleBrandSetupComplete = () => {
    setCurrentStep('complete');
    onComplete();
  };

  // Render selon l'étape actuelle
  switch (currentStep) {
    case 'splash':
      return <SplashScreen onComplete={() => setCurrentStep('pricing')} />;

    case 'pricing':
      return (
        <PricingModal 
          isOpen={true} 
          onSelectPlan={handlePlanSelection}
        />
      );

    case 'super-admin':
      return (
        <SuperAdminSetupModal
          isOpen={true}
          onComplete={handleSuperAdminCreated}
        />
      );

    case 'organisation':
      return (
        <OrganisationOnboarding
          isOpen={true}
          onComplete={handleOrganisationCreated}
          plan={selectedPlan}
        />
      );

    case 'brand':
      return (
        <BrandSetupWizard
          isOpen={true}
          onComplete={handleBrandSetupComplete}
        />
      );

    case 'complete':
    default:
      return <>{children}</>;
  }
};

export default MultiInstanceSetup;