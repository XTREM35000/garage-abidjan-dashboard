import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import ClientsListe from "./pages/ClientsListe";
import ClientsAjouter from "./pages/ClientsAjouter";
import ClientsHistorique from "./pages/ClientsHistorique";
import Vehicules from "./pages/Vehicules";
import Reparations from "./pages/Reparations";
import ThirdPartyDemo from "./pages/ThirdPartyDemo";
import Stock from "./pages/Stock";
import APropos from "./pages/APropos";
import Aide from "./pages/Aide";
import Connexion from "./pages/Connexion";
import Auth from "./pages/Auth";
import Profil from "./pages/Profil";
import Settings from "./pages/Settings";
import PrivateRoute from "./routes/PrivateRoute";
import AuthRedirect from "./routes/AuthRedirect";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { OrganisationProvider, useOrganisation } from "@/components/OrganisationProvider";
import { OrganisationOnboarding } from "@/components/OrganisationOnboarding";
import BrainModal from "@/components/BrainModal";
import { useBrainSetup } from "@/hooks/useBrainSetup";
import { useBrandCheck } from "@/hooks/useBrandCheck";
import AdminOnboardingModal from "@/components/AdminOnboardingModal";
import BrandSetupWizard from "@/components/BrandSetupWizard";

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <OrganisationProvider>
      <AppContentWithOrg />
    </OrganisationProvider>
  );
};

const AppContentWithOrg = () => {
  const {
    isFirstLaunch,
    isConfigured,
    showBrainModal,
    handleBrainComplete
  } = useBrainSetup();

  const {
    isBrandConfigured,
    isAdminExists,
    isFirstLaunch: isBrandFirstLaunch,
    isLoading: isBrandLoading,
    saveAdminUser,
    saveBrandConfig
  } = useBrandCheck();

  const [showAdminOnboarding, setShowAdminOnboarding] = useState(false);
  const [showBrandSetup, setShowBrandSetup] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

  useEffect(() => {
    // Si c'est le premier lancement et qu'aucun admin n'existe
    if (isBrandFirstLaunch && !isAdminExists && !isBrandLoading) {
      setShowAdminOnboarding(true);
    }
    // Si un admin existe mais que le brand n'est pas configuré
    else if (isAdminExists && !isBrandConfigured && !isBrandLoading) {
      setShowBrandSetup(true);
    }
  }, [isBrandFirstLaunch, isAdminExists, isBrandConfigured, isBrandLoading]);

  const handleAdminComplete = (adminData: any) => {
    setCurrentAdmin(adminData);
    setShowAdminOnboarding(false);
    setShowBrandSetup(true);
  };

  const handleBrandComplete = (brandData: any) => {
    setShowBrandSetup(false);
    // Rediriger vers le dashboard
    window.location.href = '/dashboard';
  };

  // Afficher le splash screen pendant le chargement
  if (isBrandLoading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Page d'accueil publique */}
        <Route path="/" element={<Index />} />

        {/* Routes d'authentification avec redirection automatique */}
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

        {/* Pages publiques */}
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/aide" element={<Aide />} />

        {/* Routes protégées - vérification brand configuré */}
        <Route path="/dashboard" element={
          isBrandConfigured ? (
            <PrivateRoute><Dashboard /></PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/clients/liste" element={
          isBrandConfigured ? (
            <PrivateRoute><ClientsListe /></PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/clients/ajouter" element={
          isBrandConfigured ? (
            <PrivateRoute><ClientsAjouter /></PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/clients/historique" element={
          isBrandConfigured ? (
            <PrivateRoute><ClientsHistorique /></PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/vehicules" element={
          isBrandConfigured ? (
            <PrivateRoute><Vehicules /></PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/reparations" element={
          isBrandConfigured ? (
            <PrivateRoute><Reparations /></PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/third-party-demo" element={
          isBrandConfigured ? (
            <PrivateRoute><ThirdPartyDemo /></PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/stock" element={
          isBrandConfigured ? (
            <PrivateRoute><Stock /></PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/profil" element={
          isBrandConfigured ? (
            <PrivateRoute><Profil /></PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/settings" element={
          isBrandConfigured ? (
            <PrivateRoute><Settings /></PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        } />

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Modal de configuration initiale (ancien système) */}
      <BrainModal
        isOpen={showBrainModal}
        onComplete={handleBrainComplete}
      />

      {/* Nouveau système d'onboarding */}
      <AdminOnboardingModal
        isOpen={showAdminOnboarding}
        onComplete={handleAdminComplete}
      />

      <BrandSetupWizard
        isOpen={showBrandSetup}
        onComplete={handleBrandComplete}
      />

      <OrganisationOnboardingWrapper />
    </BrowserRouter>
  );
};

const OrganisationOnboardingWrapper = () => {
  const { needsOnboarding, completeOnboarding } = useOrganisation();

  return (
    <OrganisationOnboarding
      isOpen={needsOnboarding}
      onComplete={completeOnboarding}
    />
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {showSplash ? (
            <SplashScreen onComplete={handleSplashComplete} />
          ) : (
            <AppContent />
          )}
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
