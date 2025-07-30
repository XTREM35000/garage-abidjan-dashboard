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
import MultiTenantAuthGuard from '@/components/MultiTenantAuthGuard';
import OrganisationGuard from '@/components/OrganisationGuard';
// import AuthGate from '@/components/AuthGate';
import CreateOrganisationForm from '@/components/CreateOrganisationForm';
import OrganisationSelector from '@/components/OrganisationSelector';
import AuthStatusDebug from '@/components/AuthStatusDebug';

// Layout
import UnifiedLayout from '@/layout/UnifiedLayout';
import GlobalLayout from '@/layout/GlobalLayout';

// Legacy Components (pour compatibilité)
import AuthRedirect from '@/routes/AuthRedirect';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* =================== PAGES PUBLIQUES =================== */}
      <Route path="/" element={<Index />} />
      <Route path="/a-propos" element={
        <GlobalLayout showHeader={false} showFooter={true}>
          <APropos />
        </GlobalLayout>
      } />
      <Route path="/aide" element={
        <GlobalLayout showHeader={false} showFooter={true}>
          <Aide />
        </GlobalLayout>
      } />

      {/* =================== AUTHENTIFICATION SÉCURISÉE =================== */}
      {/* <Route path="/auth-gate" element={<AuthGate />} /> */}
      <Route path="/create-organisation" element={
        <GlobalLayout showHeader={false} showFooter={false}>
          <CreateOrganisationForm />
        </GlobalLayout>
      } />
      <Route path="/organisation-selector" element={
        <GlobalLayout showHeader={false} showFooter={false}>
          <OrganisationSelector />
        </GlobalLayout>
      } />
      <Route path="/organisation-onboarding" element={
        <GlobalLayout showHeader={false} showFooter={false}>
          <OrganisationOnboardingPage />
        </GlobalLayout>
      } />

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

      {/* =================== ROUTES PROTÉGÉES (avec MultiTenantAuthGuard) =================== */}
      <Route path="/dashboard" element={
        <MultiTenantAuthGuard requireAuth={true} requireOrganisation={true}>
          <GlobalLayout showHeader={true} showFooter={true}>
            <Dashboard />
          </GlobalLayout>
        </MultiTenantAuthGuard>
      } />

      <Route path="/clients/liste" element={
        <OrganisationGuard>
          <GlobalLayout showHeader={true} showFooter={true}>
            <ClientsListe />
          </GlobalLayout>
        </OrganisationGuard>
      } />

      <Route path="/clients/ajouter" element={
        <OrganisationGuard>
          <GlobalLayout showHeader={true} showFooter={true}>
            <ClientsAjouter />
          </GlobalLayout>
        </OrganisationGuard>
      } />

      <Route path="/clients/historique" element={
        <OrganisationGuard>
          <GlobalLayout showHeader={true} showFooter={true}>
            <ClientsHistorique />
          </GlobalLayout>
        </OrganisationGuard>
      } />

      <Route path="/vehicules" element={
        <OrganisationGuard>
          <GlobalLayout showHeader={true} showFooter={true}>
            <Vehicules />
          </GlobalLayout>
        </OrganisationGuard>
      } />

      <Route path="/reparations" element={
        <OrganisationGuard>
          <GlobalLayout showHeader={true} showFooter={true}>
            <Reparations />
          </GlobalLayout>
        </OrganisationGuard>
      } />

      <Route path="/stock" element={
        <OrganisationGuard>
          <GlobalLayout showHeader={true} showFooter={true}>
            <Stock />
          </GlobalLayout>
        </OrganisationGuard>
      } />

      <Route path="/settings" element={
        <OrganisationGuard>
          <GlobalLayout showHeader={true} showFooter={true}>
            <Settings />
          </GlobalLayout>
        </OrganisationGuard>
      } />

      <Route path="/profil" element={
        <OrganisationGuard>
          <GlobalLayout showHeader={true} showFooter={true}>
            <Profil />
          </GlobalLayout>
        </OrganisationGuard>
      } />

      <Route path="/third-party-demo" element={
        <OrganisationGuard>
          <GlobalLayout showHeader={true} showFooter={true}>
            <ThirdPartyDemo />
          </GlobalLayout>
        </OrganisationGuard>
      } />

      {/* =================== ROUTE DE DEBUG =================== */}
      <Route path="/debug" element={
        <GlobalLayout showHeader={true} showFooter={true}>
          <AuthStatusDebug />
        </GlobalLayout>
      } />

      {/* =================== PAGE 404 =================== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
