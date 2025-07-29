import React from 'react';
import { Routes, Route } from 'react-router-dom';

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
import OrganisationOnboardingPage from '@/pages/OrganisationOnboarding';

// Security Components
import OrganisationGuard from '@/components/OrganisationGuard';
// import AuthGate from '@/components/AuthGate';
import CreateOrganisationForm from '@/components/CreateOrganisationForm';
import OrganisationSelector from '@/components/OrganisationSelector';
import AuthStatusDebug from '@/components/AuthStatusDebug';

// Layout
import UnifiedLayout from '@/layout/UnifiedLayout';

// Legacy Components (pour compatibilité)
import AuthRedirect from '@/routes/AuthRedirect';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* =================== PAGES PUBLIQUES =================== */}
      <Route path="/" element={<Index />} />
      <Route path="/a-propos" element={<APropos />} />
      <Route path="/aide" element={<Aide />} />

      {/* =================== AUTHENTIFICATION SÉCURISÉE =================== */}
      {/* <Route path="/auth-gate" element={<AuthGate />} /> */}
      <Route path="/create-organisation" element={<CreateOrganisationForm />} />
      <Route path="/organisation-selector" element={<OrganisationSelector />} />
      <Route path="/organisation-onboarding" element={<OrganisationOnboardingPage />} />

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

export default AppRouter;
