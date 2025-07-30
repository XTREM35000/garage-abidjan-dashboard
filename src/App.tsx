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

// Components
import SimpleAuthGuard from '@/components/SimpleAuthGuard';
import UnifiedSplashScreen from '@/components/UnifiedSplashScreen';
import ErrorBoundary from '@/components/ErrorBoundary';

// Layout
import UnifiedLayout from '@/layout/UnifiedLayout';
import GlobalLayout from '@/layout/GlobalLayout';

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

  // Splash screen
  if (showSplash) {
    return <UnifiedSplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <GlobalLayout showHeader={true} showFooter={true}>
      <Routes>
        {/* =================== PAGES PUBLIQUES =================== */}
        <Route path="/" element={<Index />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/aide" element={<Aide />} />

      {/* =================== AUTHENTIFICATION =================== */}
      <Route path="/auth" element={
        <SimpleAuthGuard requireAuth={false}>
          <Auth />
        </SimpleAuthGuard>
      } />
      <Route path="/connexion" element={
        <SimpleAuthGuard requireAuth={false}>
          <Connexion />
        </SimpleAuthGuard>
      } />

      {/* =================== ROUTES PROTÉGÉES =================== */}
      <Route path="/dashboard" element={
        <SimpleAuthGuard>
          <UnifiedLayout>
            <Dashboard />
          </UnifiedLayout>
        </SimpleAuthGuard>
      } />

      <Route path="/clients/liste" element={
        <SimpleAuthGuard>
          <UnifiedLayout>
            <ClientsListe />
          </UnifiedLayout>
        </SimpleAuthGuard>
      } />

      <Route path="/clients/ajouter" element={
        <SimpleAuthGuard>
          <UnifiedLayout>
            <ClientsAjouter />
          </UnifiedLayout>
        </SimpleAuthGuard>
      } />

      <Route path="/clients/historique" element={
        <SimpleAuthGuard>
          <UnifiedLayout>
            <ClientsHistorique />
          </UnifiedLayout>
        </SimpleAuthGuard>
      } />

      <Route path="/vehicules" element={
        <SimpleAuthGuard>
          <UnifiedLayout>
            <Vehicules />
          </UnifiedLayout>
        </SimpleAuthGuard>
      } />

      <Route path="/reparations" element={
        <SimpleAuthGuard>
          <UnifiedLayout>
            <Reparations />
          </UnifiedLayout>
        </SimpleAuthGuard>
      } />

      <Route path="/stock" element={
        <SimpleAuthGuard>
          <UnifiedLayout>
            <Stock />
          </UnifiedLayout>
        </SimpleAuthGuard>
      } />

      <Route path="/settings" element={
        <SimpleAuthGuard>
          <UnifiedLayout>
            <Settings />
          </UnifiedLayout>
        </SimpleAuthGuard>
      } />

      <Route path="/profil" element={
        <SimpleAuthGuard>
          <UnifiedLayout>
            <Profil />
          </UnifiedLayout>
        </SimpleAuthGuard>
      } />

      <Route path="/third-party-demo" element={
        <SimpleAuthGuard>
          <UnifiedLayout>
            <ThirdPartyDemo />
          </UnifiedLayout>
        </SimpleAuthGuard>
      } />

        {/* =================== PAGE 404 =================== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </GlobalLayout>
  );
};

// Content without complex providers for now
const AppContentSimple = () => <AppContent />;

// Composant principal App
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <AppContentSimple />
              <Toaster />
            </TooltipProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
