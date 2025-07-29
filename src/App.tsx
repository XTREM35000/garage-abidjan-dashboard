import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Connexion from '@/pages/Connexion';
import Dashboard from '@/pages/Dashboard';
import ClientsListe from '@/pages/ClientsListe';
import ClientsAjouter from '@/pages/ClientsAjouter';
import ClientsHistorique from '@/pages/ClientsHistorique';
import Vehicules from '@/pages/Vehicules';
import Reparations from '@/pages/Reparations';
import Stock from '@/pages/Stock';
import Settings from '@/pages/Settings';
import Profil from '@/pages/Profil';
import APropos from '@/pages/APropos';
import Aide from '@/pages/Aide';
import NotFound from '@/pages/NotFound';
import ThirdPartyDemo from '@/pages/ThirdPartyDemo';

// Security Components
import OrganisationGuard from '@/components/OrganisationGuard';
import CreateOrganisationForm from '@/components/CreateOrganisationForm';
import UnifiedSplashScreen from '@/components/UnifiedSplashScreen';
import AuthStatusDebug from '@/components/AuthStatusDebug';
import ErrorBoundary from '@/components/ErrorBoundary';
import AdminOnboardingModal from '@/components/AdminOnboardingModal';
import { OrganisationOnboarding } from '@/components/OrganisationOnboarding';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

// Layout
import UnifiedLayout from '@/layout/UnifiedLayout';

// Legacy Components (pour compatibilité)
import PrivateRoute from '@/routes/PrivateRoute';
import AuthRedirect from '@/routes/AuthRedirect';
import { OrganisationProvider } from '@/components/OrganisationProvider';

// Créer une instance QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Composant principal de contenu de l'app
const AppContent = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [checking, setChecking] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showOrgOnboarding, setShowOrgOnboarding] = useState(false);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('starter');
  const [adminCompleted, setAdminCompleted] = useState(false);
  const [orgCompleted, setOrgCompleted] = useState(false);

  // Vérification initiale Super-Admin et Organisation
  React.useEffect(() => {
    const checkInitialState = async () => {
      // Vérifier Super-Admin
      const { data: superAdmins, error: superAdminError } = await supabase
        .from('super_admins')
        .select('id')
        .limit(1);
      if (superAdminError) {
        setChecking(false);
        return;
      }
      if (!superAdmins || superAdmins.length === 0) {
        setShowAdminModal(true);
        setChecking(false);
        return;
      }
      // Vérifier Organisation
      const { data: orgs, error: orgError } = await supabase
        .from('organisations')
        .select('id')
        .limit(1);
      if (orgError) {
        setChecking(false);
        return;
      }
      if (!orgs || orgs.length === 0) {
        setShowPlanSelector(true);
        setChecking(false);
        return;
      }
      setChecking(false);
    };
    checkInitialState();
  }, [adminCompleted, orgCompleted]);

  const handleAdminComplete = () => {
    setShowAdminModal(false);
    setAdminCompleted(true);
  };
  const handleOrgComplete = () => {
    setShowOrgOnboarding(false);
    setOrgCompleted(true);
  };
  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    setShowPlanSelector(false);
    setShowOrgOnboarding(true);
  };

  // Splash screen
  if (showSplash) {
    return <UnifiedSplashScreen onComplete={() => setShowSplash(false)} />;
  }
  // Blocage UI si vérification en cours
  if (checking) {
    return <div className="min-h-screen flex items-center justify-center">Vérification initiale...</div>;
  }
  // Modal Super-Admin bloquante
  if (showAdminModal) {
    return <AdminOnboardingModal isOpen={true} onComplete={handleAdminComplete} />;
  }
  // Sélecteur de plan si aucune organisation
  if (showPlanSelector) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Choisissez un plan d'abonnement</h2>
          <Select value={selectedPlan} onValueChange={setSelectedPlan}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="starter">Gratuit (5 utilisateurs)</SelectItem>
              <SelectItem value="pro">Mensuel (20 utilisateurs)</SelectItem>
              <SelectItem value="enterprise">À VIE (illimité)</SelectItem>
            </SelectContent>
          </Select>
          <button
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
            onClick={() => handlePlanSelect(selectedPlan)}
          >
            Commencer
          </button>
        </div>
      </div>
    );
  }
  // Modal Onboarding Organisation
  if (showOrgOnboarding) {
    return (
      <OrganisationOnboarding isOpen={true} onComplete={handleOrgComplete} plan={selectedPlan} />
    );
  }

  return (
    <Routes>
      {/* =================== PAGES PUBLIQUES =================== */}
      <Route path="/" element={<Index />} />
      <Route path="/a-propos" element={<APropos />} />
      <Route path="/aide" element={<Aide />} />

      {/* =================== AUTHENTIFICATION SÉCURISÉE =================== */}
      <Route path="/create-organisation" element={<CreateOrganisationForm />} />

      {/* =================== ROUTES LEGACY (pour compatibilité) =================== */}
      <Route path="/auth" element={
        <AuthRedirect>
          <Auth />
        </AuthRedirect>
      } />
      <Route path="/connexion" element={
        <AuthRedirect>
          <Connexion />
        </AuthRedirect>
      } />

      {/* =================== ROUTES PROTÉGÉES (avec OrganisationGuard) =================== */}
      <Route path="/dashboard" element={
        <OrganisationGuard>
          <UnifiedLayout>
            <Dashboard />
          </UnifiedLayout>
        </OrganisationGuard>
      } />

      <Route path="/clients/liste" element={
        <OrganisationGuard>
          <UnifiedLayout>
            <ClientsListe />
          </UnifiedLayout>
        </OrganisationGuard>
      } />

      <Route path="/clients/ajouter" element={
        <OrganisationGuard>
          <UnifiedLayout>
            <ClientsAjouter />
          </UnifiedLayout>
        </OrganisationGuard>
      } />

      <Route path="/clients/historique" element={
        <OrganisationGuard>
          <UnifiedLayout>
            <ClientsHistorique />
          </UnifiedLayout>
        </OrganisationGuard>
      } />

      <Route path="/vehicules" element={
        <OrganisationGuard>
          <UnifiedLayout>
            <Vehicules />
          </UnifiedLayout>
        </OrganisationGuard>
      } />

      <Route path="/reparations" element={
        <OrganisationGuard>
          <UnifiedLayout>
            <Reparations />
          </UnifiedLayout>
        </OrganisationGuard>
      } />

      <Route path="/stock" element={
        <OrganisationGuard>
          <UnifiedLayout>
            <Stock />
          </UnifiedLayout>
        </OrganisationGuard>
      } />

      <Route path="/settings" element={
        <OrganisationGuard>
          <UnifiedLayout>
            <Settings />
          </UnifiedLayout>
        </OrganisationGuard>
      } />

      <Route path="/profil" element={
        <OrganisationGuard>
          <UnifiedLayout>
            <Profil />
          </UnifiedLayout>
        </OrganisationGuard>
      } />

      <Route path="/third-party-demo" element={
        <OrganisationGuard>
          <UnifiedLayout>
            <ThirdPartyDemo />
          </UnifiedLayout>
        </OrganisationGuard>
      } />

      {/* =================== ROUTE DE DEBUG =================== */}
      <Route path="/debug" element={
        <UnifiedLayout>
          <AuthStatusDebug />
        </UnifiedLayout>
      } />

      {/* =================== PAGE 404 =================== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Composant wrapper avec OrganisationProvider
const AppContentWithOrg = () => (
  <OrganisationProvider>
    <AppContent />
  </OrganisationProvider>
);

// Composant principal App
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <AppContentWithOrg />
              <Toaster />
            </TooltipProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
