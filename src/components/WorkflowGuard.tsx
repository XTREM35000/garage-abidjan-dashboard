import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '@/components/SplashScreen';
import SuperAdminSetupModal from '@/components/SuperAdminSetupModal';
import { OrganisationOnboarding } from '@/components/OrganisationOnboarding';
import BrandSetupWizard from '@/components/BrandSetupWizard';
import { toast } from 'sonner';

interface WorkflowGuardProps {
  children: React.ReactNode;
}

type WorkflowStep = 
  | 'loading'
  | 'super-admin-setup' 
  | 'organisation-setup'
  | 'admin-setup'
  | 'redirect-auth'
  | 'complete';

const WorkflowGuard: React.FC<WorkflowGuardProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('loading');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkWorkflowConditions();
  }, []);

  const checkWorkflowConditions = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Démarrage du workflow de vérification...');
      
      // 1. Vérifier si des organisations existent (critère principal)
      const organisationExists = await checkOrganisationExists();
      if (!organisationExists) {
        console.log('⚠️ Aucune organisation trouvée, affichage du pricing modal');
        setCurrentStep('organisation-setup');
        setIsLoading(false);
        return;
      }
      
      // 2. Vérifier si Super-Admin existe (uniquement si organisations existent)
      const superAdminExists = await checkSuperAdminExists();
      if (!superAdminExists) {
        setCurrentStep('super-admin-setup');
        setIsLoading(false);
        return;
      }
      
      // 3. Vérifier si admin existe
      const adminExists = await checkAdminExists();
      if (!adminExists) {
        setCurrentStep('admin-setup');
        setIsLoading(false);
        return;
      }
      
      // 4. Vérifier si utilisateur connecté
      const userConnected = await checkUserConnection();
      if (!userConnected) {
        setCurrentStep('redirect-auth');
        setIsLoading(false);
        return;
      }
      
      // Workflow complet
      console.log('🎉 Workflow complet, accès au Dashboard autorisé');
      setCurrentStep('complete');

    } catch (error) {
      console.error('❌ Erreur générale lors de la vérification:', error);
      toast.error('Erreur lors de la vérification du système');
      setCurrentStep('super-admin-setup');
    } finally {
      setIsLoading(false);
    }
  };

  const checkSuperAdminExists = async () => {
    console.log('🔍 Vérification Super-Admin...');
    try {
      const { count, error } = await supabase
        .from('super_admins')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('❌ Erreur Super-Admin:', error);
        return false;
      }

      const exists = count && count > 0;
      console.log(exists ? `✅ ${count} Super-Admin(s) trouvé(s)` : '⚠️ Aucun Super-Admin trouvé');
      return exists;
    } catch (error) {
      console.error('❌ Erreur lors de la vérification Super-Admin:', error);
      return false;
    }
  };

  const checkOrganisationExists = async () => {
    console.log('🔍 Vérification Organisations...');
    try {
      const { count, error } = await supabase
        .from('organisations')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('❌ Erreur Organisations:', error);
        return false;
      }

      const exists = count && count > 0;
      console.log(exists ? `✅ ${count} organisation(s) trouvée(s)` : '⚠️ Aucune organisation trouvée');
      return exists;
    } catch (error) {
      console.error('❌ Erreur lors de la vérification Organisations:', error);
      return false;
    }
  };

  const checkAdminExists = async () => {
    console.log('🔍 Vérification Utilisateurs Admin...');
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      if (error) {
        console.error('❌ Erreur Utilisateurs Admin:', error);
        return false;
      }

      const exists = count && count > 0;
      console.log(exists ? `✅ ${count} admin(s) trouvé(s)` : '⚠️ Aucun admin trouvé');
      return exists;
    } catch (error) {
      console.error('❌ Erreur lors de la vérification Admin:', error);
      return false;
    }
  };

  const checkUserConnection = async () => {
    console.log('🔍 Vérification Connexion Utilisateur...');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('⚠️ Aucun utilisateur connecté');
        return false;
      }

      console.log(`✅ Utilisateur connecté: ${user.email}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la vérification connexion:', error);
      return false;
    }
  };

  const handleSuperAdminCreated = () => {
    console.log('✅ Super-Admin créé, passage à l\'étape suivante');
    toast.success('Super-Admin créé avec succès!');
    setCurrentStep('organisation-setup');
  };

  const handleOrganisationCreated = () => {
    console.log('✅ Organisation créée, redirection vers page d\'inscription');
    toast.success('Organisation créée avec succès! Créez maintenant votre compte administrateur.');
    setCurrentStep('redirect-auth');
  };

  const handleAdminSetupComplete = () => {
    console.log('✅ Configuration admin terminée, vérification connexion');
    toast.success('Configuration terminée!');
    setCurrentStep('redirect-auth');
  };

  // Loading state
  if (isLoading) {
    return <SplashScreen onComplete={() => {}} />;
  }

  // Rendu selon l'étape
  switch (currentStep) {
    case 'super-admin-setup':
      return (
        <SuperAdminSetupModal
          isOpen={true}
          onComplete={handleSuperAdminCreated}
        />
      );

    case 'organisation-setup':
      return (
        <OrganisationOnboarding
          isOpen={true}
          onComplete={handleOrganisationCreated}
          showPricingFirst={true}
        />
      );

    case 'admin-setup':
      return (
        <BrandSetupWizard
          isOpen={true}
          onComplete={handleAdminSetupComplete}
        />
      );

    case 'redirect-auth':
      // Redirection immédiate vers /auth  
      navigate('/auth');
      return <SplashScreen onComplete={() => {}} />;

    case 'complete':
    default:
      return <>{children}</>;
  }
};

export default WorkflowGuard;