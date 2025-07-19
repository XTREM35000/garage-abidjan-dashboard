import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import ClientsListe from "./pages/ClientsListe";
import ClientsAjouter from "./pages/ClientsAjouter";
import ClientsHistorique from "./pages/ClientsHistorique";
import Vehicules from "./pages/Vehicules";
import Reparations from "./pages/Reparations";
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
import BrainModal from "@/components/BrainModal";
import { useBrainSetup } from "@/hooks/useBrainSetup";

const queryClient = new QueryClient();

const AppContent = () => {
  const {
    isFirstLaunch,
    isConfigured,
    showBrainModal,
    handleBrainComplete
  } = useBrainSetup();

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

        {/* Routes protégées - rediriger vers configuration si pas configuré */}
        <Route path="/dashboard" element={
          isConfigured ? (
            <PrivateRoute><Dashboard /></PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/clients/liste" element={
          isConfigured ? (
            <PrivateRoute><ClientsListe /></PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/clients/ajouter" element={
          isConfigured ? (
            <PrivateRoute><ClientsAjouter /></PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/clients/historique" element={
          isConfigured ? (
            <PrivateRoute><ClientsHistorique /></PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/vehicules" element={
          isConfigured ? (
            <PrivateRoute><Vehicules /></PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/reparations" element={
          isConfigured ? (
            <PrivateRoute><Reparations /></PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/stock" element={
          isConfigured ? (
            <PrivateRoute><Stock /></PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/profil" element={
          isConfigured ? (
            <PrivateRoute><Profil /></PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/settings" element={
          isConfigured ? (
            <PrivateRoute><Settings /></PrivateRoute>
          ) : (
            <Navigate to="/" replace />
          )
        } />

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Modal de configuration initiale */}
      <BrainModal
        isOpen={showBrainModal}
        onComplete={handleBrainComplete}
      />
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
