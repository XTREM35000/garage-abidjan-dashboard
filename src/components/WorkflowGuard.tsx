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
      
      // 1. Vérifier si Super-Admin existe
      console.log('🔍 Vérification Super-Admin...');
      const { count: superAdminCount, error: superAdminError } = await supabase
        .from('super_admins')
        .select('*', { count: 'exact', head: true });

      if (superAdminError) {
        console.error('❌ Erreur Super-Admin:', superAdminError);
        // Si erreur RLS ou autre, on affiche le modal de création
        setCurrentStep('super-admin-setup');
        setIsLoading(false);
        return;
      }

      if (!superAdminCount || superAdminCount === 0) {
        console.log('⚠️ Aucun Super-Admin trouvé, création nécessaire');
        setCurrentStep('super-admin-setup');
        setIsLoading(false);
        return;
      }

      console.log(`✅ ${superAdminCount} Super-Admin(s) trouvé(s)`);

      // 2. Vérifier si au moins une organisation existe
      console.log('🔍 Vérification Organisations...');
      const { count: orgCount, error: orgError } = await supabase
        .from('organisations')
        .select('*', { count: 'exact', head: true });

      if (orgError) {
        console.error('❌ Erreur Organisations:', orgError);
        if (orgError.code === '42P01') { // Table doesn't exist
          setCurrentStep('organisation-setup');
          setIsLoading(false);
          return;
        }
      }

      if (!orgCount || orgCount === 0) {
        console.log('⚠️ Aucune organisation trouvée, création nécessaire');
        setCurrentStep('organisation-setup');
        setIsLoading(false);
        return;
      }

      console.log(`✅ ${orgCount} organisation(s) trouvée(s)`);

      // 3. Vérifier si au moins un utilisateur Admin existe dans users
      console.log('🔍 Vérification Utilisateurs Admin...');
      const { count: adminCount, error: userAdminError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      if (userAdminError) {
        console.error('❌ Erreur Utilisateurs Admin:', userAdminError);
        // Si erreur 403 ou table inexistante, on passe à l'étape suivante
      }

      if (!adminCount || adminCount === 0) {
        console.log('⚠️ Aucun admin trouvé dans users, création nécessaire');
        setCurrentStep('admin-setup');
        setIsLoading(false);
        return;
      }

      console.log(`✅ ${adminCount} admin(s) trouvé(s) dans users`);

      // 4. Vérifier si au moins un utilisateur existe dans users
      console.log('🔍 Vérification Utilisateurs...');
      const { count: userCount, error: userError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (userError) {
        console.error('❌ Erreur Utilisateurs:', userError);
        // Si erreur, rediriger vers auth
        setCurrentStep('redirect-auth');
        setIsLoading(false);
        return;
      }

      if (!userCount || userCount === 0) {
        console.log('⚠️ Aucun utilisateur trouvé, redirection vers auth');
        setCurrentStep('redirect-auth');
        setIsLoading(false);
        return;
      }

      console.log(`✅ ${userCount} utilisateur(s) trouvé(s)`);

      // Tous les checks sont OK, workflow complet
      console.log('🎉 Workflow complet, accès autorisé');
      setCurrentStep('complete');

    } catch (error) {
      console.error('❌ Erreur générale lors de la vérification:', error);
      toast.error('Erreur lors de la vérification du système');
      setCurrentStep('super-admin-setup'); // Fallback vers le début
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuperAdminCreated = (adminData: any) => {
    console.log('✅ Super-Admin créé:', adminData);
    toast.success('Super-Admin créé avec succès!');
    // Relancer la vérification du workflow
    checkWorkflowConditions();
  };

  const handleOrganisationCreated = (orgId: string) => {
    console.log('✅ Organisation créée:', orgId);
    toast.success('Organisation créée avec succès!');
    // Relancer la vérification du workflow
    checkWorkflowConditions();
  };

  const handleAdminSetupComplete = () => {
    console.log('✅ Configuration admin terminée');
    toast.success('Configuration terminée!');
    // Relancer la vérification du workflow
    checkWorkflowConditions();
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
      React.useEffect(() => {
        navigate('/auth');
      }, []);
      return <SplashScreen onComplete={() => {}} />;

    case 'complete':
    default:
      return <>{children}</>;
  }
};

export default WorkflowGuard;