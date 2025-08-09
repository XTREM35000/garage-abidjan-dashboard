import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOrganization } from '@/hooks/useOrganization';
import { supabase } from '@/integrations/supabase/client';
import SplashScreen from './SplashScreen';
import InitializationWizard from './InitializationWizard';

interface WorkflowGuardProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

type WorkflowState = 'loading' | 'needs-init' | 'needs-auth' | 'ready';

export function WorkflowGuard({ requireOnboarding = true, children }: WorkflowGuardProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { currentOrg, isLoading: orgLoading } = useOrganization();
  const [workflowState, setWorkflowState] = useState<WorkflowState>('loading');
  const [initStep, setInitStep] = useState<'super-admin' | 'pricing' | 'organization-admin'>('super-admin');
  const navigate = useNavigate();

  useEffect(() => {
    const checkInitialSetup = async () => {
      // Vérifier si c'est le premier lancement de l'application
      const { count: superAdminCount } = await supabase
        .from('super_admins')
        .select('*', { count: 'exact', head: true });

      if (!superAdminCount) {
        setWorkflowState('needs-init');
        setInitStep('super-admin');
        return;
      }

      // 2. Vérifier si une organisation existe
      const { count: orgCount, error: orgError } = await supabase
        .from('organisations')
        .select('*', { count: 'exact', head: true });

      if (orgError) {
        console.error('❌ Erreur vérification organisations:', orgError);
        // If table doesn't exist or has issues, start with pricing
        setWorkflowState('needs-init');
        setInitStep('pricing');
        return;
      }

      if (!orgCount || orgCount === 0) {
        console.log('⚠️ Aucune organisation trouvée - AFFICHER PRICING');
        setWorkflowState('needs-init');
        setInitStep('pricing');
        return;
      }

      console.log('✅ Organisation trouvée');

      // 3. Vérifier si des utilisateurs admin existent
      const { count: adminCount, error: adminError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      if (adminError) {
        console.error('❌ Erreur vérification admins:', adminError);
        setWorkflowState('needs-init');
        setInitStep('organization-admin');
        return;
      }

      if (!adminCount || adminCount === 0) {
        console.log('⚠️ Aucun admin trouvé - CRÉER ADMIN');
        setWorkflowState('needs-init');
        setInitStep('organization-admin');
        return;
      }

      console.log('✅ Admins trouvés');

      // 4. Vérifier la session utilisateur (seulement si tout le reste est OK)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('❌ Erreur session:', sessionError);
        setWorkflowState('needs-auth');
        return;
      }

      if (!session) {
        console.log('⚠️ Aucune session, redirection vers auth');
        setWorkflowState('needs-auth');
        return;
      }

      console.log('✅ Session utilisateur valide');

      // 5. Vérifier si l'utilisateur a une organisation sélectionnée
      const storedOrg = localStorage.getItem('current_org');
      const storedOrgCode = localStorage.getItem('org_code');

      if (!storedOrg || !storedOrgCode) {
        console.log('⚠️ Aucune organisation sélectionnée, affichage sélection');
        // Ne pas rediriger vers auth mais afficher la sélection d'organisation
        setWorkflowState('ready'); // Permettre l'accès à OrganizationSelect
        return;
      }

      // Vérifier la validité de l'organisation
      try {
        const { data: org, error: orgError } = await supabase
          .from('organisations')
          .select('id, code')
          .eq('id', storedOrg)
          .eq('code', storedOrgCode)
          .single();

        if (orgError || !org) {
          console.log('⚠️ Organisation invalide, nettoyage et affichage sélection');
          localStorage.removeItem('current_org');
          localStorage.removeItem('org_code');
          setWorkflowState('ready'); // Permettre l'accès à OrganizationSelect
          return;
        }

        console.log('✅ Organisation valide sélectionnée');
      } catch (error) {
        console.error('❌ Erreur validation organisation:', error);
        localStorage.removeItem('current_org');
        localStorage.removeItem('org_code');
        setWorkflowState('ready'); // Permettre l'accès à OrganizationSelect
        return;
      }

      // Tout est prêt
      console.log('🎉 Workflow complet, application prête');
      setWorkflowState('ready');

    };

    if (!authLoading && !orgLoading) {
      checkInitialSetup();
    }
  }, [authLoading, orgLoading, navigate]);

  const handleInitComplete = () => {
    console.log('✅ Initialisation terminée');
    setWorkflowState('ready');
    // Rediriger vers auth pour que l'utilisateur se connecte
    navigate('/auth');
  };

  // État de chargement
  if (workflowState === 'loading' || authLoading || orgLoading) {
    return <SplashScreen onComplete={() => { }} />;
  }

  // Besoin d'initialisation (PRIORITÉ ABSOLUE)
  if (workflowState === 'needs-init') {
    console.log('🚀 Lancement du workflow d\'initialisation - Étape:', initStep);
    return (
      <InitializationWizard
        isOpen={true}
        onComplete={handleInitComplete}
        startStep={initStep}
      />
    );
  }

  // Besoin d'authentification (seulement après initialisation complète)
  if (workflowState === 'needs-auth') {
    console.log('🔐 Redirection vers l\'authentification');
    navigate('/auth');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirection vers la page de connexion...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers l'onboarding si nécessaire
  if (requireOnboarding && !currentOrg?.setup_complete) {
    return <Navigate to="/onboarding" replace />;
  }

  // Rediriger vers la sélection d'organisation si aucune n'est sélectionnée
  if (!currentOrg && user.role !== 'super_admin') {
    return <Navigate to="/select-organization" replace />;
  }

  // Prêt - afficher le contenu
  return <>{children}</>;
}

export default WorkflowGuard;
