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
import AuthGate from '@/components/AuthGate';
import CreateOrganisationForm from '@/components/CreateOrganisationForm';

// Legacy Components (pour compatibilité)
import PrivateRoute from '@/routes/PrivateRoute';
import AuthRedirect from '@/routes/AuthRedirect';
import SplashScreen from '@/components/SplashScreen';
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

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Afficher le splash screen si activé
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* =================== PAGES PUBLIQUES =================== */}
        <Route path="/" element={<Index />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/aide" element={<Aide />} />

        {/* =================== AUTHENTIFICATION SÉCURISÉE =================== */}
        <Route path="/auth-gate" element={<AuthGate />} />
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
            <Dashboard />
          </OrganisationGuard>
        } />
        
        <Route path="/clients/liste" element={
          <OrganisationGuard>
            <ClientsListe />
          </OrganisationGuard>
        } />
        
        <Route path="/clients/ajouter" element={
          <OrganisationGuard>
            <ClientsAjouter />
          </OrganisationGuard>
        } />
        
        <Route path="/clients/historique" element={
          <OrganisationGuard>
            <ClientsHistorique />
          </OrganisationGuard>
        } />
        
        <Route path="/vehicules" element={
          <OrganisationGuard>
            <Vehicules />
          </OrganisationGuard>
        } />
        
        <Route path="/reparations" element={
          <OrganisationGuard>
            <Reparations />
          </OrganisationGuard>
        } />
        
        <Route path="/stock" element={
          <OrganisationGuard>
            <Stock />
          </OrganisationGuard>
        } />
        
        <Route path="/settings" element={
          <OrganisationGuard>
            <Settings />
          </OrganisationGuard>
        } />
        
        <Route path="/profil" element={
          <OrganisationGuard>
            <Profil />
          </OrganisationGuard>
        } />
        
        <Route path="/third-party-demo" element={
          <OrganisationGuard>
            <ThirdPartyDemo />
          </OrganisationGuard>
        } />

        {/* =================== PAGE 404 =================== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
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
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppContentWithOrg />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;