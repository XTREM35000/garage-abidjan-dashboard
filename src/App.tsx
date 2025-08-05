import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';

// Pages
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import ClientsListe from '@/pages/ClientsListe';
import ClientsAjouter from '@/pages/ClientsAjouter';
import ClientsHistorique from '@/pages/ClientsHistorique';
import Vehicules from '@/pages/Vehicules';
import Reparations from '@/pages/Reparations';
import Stock from '@/pages/Stock';
import Settings from '@/pages/Settings';
import Profil from '@/pages/Profil';
import Aide from '@/pages/Aide';
import APropos from '@/pages/APropos';
import NotFound from '@/pages/NotFound';

// Composants
import WorkflowGuard from '@/components/WorkflowGuard';
import AuthGuard from '@/components/AuthGuard';
import ErrorBoundary from '@/components/ErrorBoundary';

// Styles
import './App.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Route racine - redirection intelligente */}
              <Route
                path="/"
                element={
                  <WorkflowGuard>
                    <Navigate to="/dashboard" replace />
                  </WorkflowGuard>
                }
              />

              {/* Page d'authentification */}
              <Route path="/auth" element={<Auth />} />

              {/* Routes protégées avec WorkflowGuard */}
              <Route
                path="/dashboard"
                element={
                  <WorkflowGuard>
                    <AuthGuard>
                      <Dashboard />
                    </AuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/clients"
                element={
                  <WorkflowGuard>
                    <AuthGuard>
                      <ClientsListe />
                    </AuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/clients/ajouter"
                element={
                  <WorkflowGuard>
                    <AuthGuard>
                      <ClientsAjouter />
                    </AuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/clients/historique"
                element={
                  <WorkflowGuard>
                    <AuthGuard>
                      <ClientsHistorique />
                    </AuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/vehicules"
                element={
                  <WorkflowGuard>
                    <AuthGuard>
                      <Vehicules />
                    </AuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/reparations"
                element={
                  <WorkflowGuard>
                    <AuthGuard>
                      <Reparations />
                    </AuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/stock"
                element={
                  <WorkflowGuard>
                    <AuthGuard>
                      <Stock />
                    </AuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/settings"
                element={
                  <WorkflowGuard>
                    <AuthGuard>
                      <Settings />
                    </AuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/profil"
                element={
                  <WorkflowGuard>
                    <AuthGuard>
                      <Profil />
                    </AuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/aide"
                element={
                  <WorkflowGuard>
                    <AuthGuard>
                      <Aide />
                    </AuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/a-propos"
                element={
                  <WorkflowGuard>
                    <AuthGuard>
                      <APropos />
                    </AuthGuard>
                  </WorkflowGuard>
                }
              />

              {/* Route 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Toaster pour les notifications */}
            <Toaster
              position="top-right"
              richColors
              closeButton
            />
          </div>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
