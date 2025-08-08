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
import Personnel from '@/pages/Personnel';
import Aide from '@/pages/Aide';
import APropos from '@/pages/APropos';
import NotFound from '@/pages/NotFound';

// Composants
import WorkflowGuard from '@/components/WorkflowGuard';
import SimpleAuthGuard from '@/components/SimpleAuthGuard';
import PostAuthHandler from '@/components/PostAuthHandler';
import ErrorBoundary from '@/components/ErrorBoundary';
import AuthenticatedLayout from '@/layout/AuthenticatedLayout';
import UserMenuDebug from '@/components/UserMenuDebug';

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

              {/* Routes protégées avec WorkflowGuard et AuthenticatedLayout */}
              <Route
                path="/dashboard"
                element={
                  <WorkflowGuard>
                    <SimpleAuthGuard>
                      <PostAuthHandler>
                        <AuthenticatedLayout>
                          <Dashboard />
                        </AuthenticatedLayout>
                      </PostAuthHandler>
                    </SimpleAuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/clients"
                element={
                  <WorkflowGuard>
                    <SimpleAuthGuard>
                      <PostAuthHandler>
                        <AuthenticatedLayout>
                          <ClientsListe />
                        </AuthenticatedLayout>
                      </PostAuthHandler>
                    </SimpleAuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/clients/ajouter"
                element={
                  <WorkflowGuard>
                    <SimpleAuthGuard>
                      <PostAuthHandler>
                        <AuthenticatedLayout>
                          <ClientsAjouter />
                        </AuthenticatedLayout>
                      </PostAuthHandler>
                    </SimpleAuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/clients/historique"
                element={
                  <WorkflowGuard>
                    <SimpleAuthGuard>
                      <PostAuthHandler>
                        <AuthenticatedLayout>
                          <ClientsHistorique />
                        </AuthenticatedLayout>
                      </PostAuthHandler>
                    </SimpleAuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/clients/liste"
                element={
                  <WorkflowGuard>
                    <SimpleAuthGuard>
                      <PostAuthHandler>
                        <AuthenticatedLayout>
                          <ClientsListe />
                        </AuthenticatedLayout>
                      </PostAuthHandler>
                    </SimpleAuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/vehicules"
                element={
                  <WorkflowGuard>
                    <SimpleAuthGuard>
                      <PostAuthHandler>
                        <AuthenticatedLayout>
                          <Vehicules />
                        </AuthenticatedLayout>
                      </PostAuthHandler>
                    </SimpleAuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/reparations"
                element={
                  <WorkflowGuard>
                    <SimpleAuthGuard>
                      <PostAuthHandler>
                        <AuthenticatedLayout>
                          <Reparations />
                        </AuthenticatedLayout>
                      </PostAuthHandler>
                    </SimpleAuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/stock"
                element={
                  <WorkflowGuard>
                    <SimpleAuthGuard>
                      <PostAuthHandler>
                        <AuthenticatedLayout>
                          <Stock />
                        </AuthenticatedLayout>
                      </PostAuthHandler>
                    </SimpleAuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/settings"
                element={
                  <WorkflowGuard>
                    <SimpleAuthGuard>
                      <PostAuthHandler>
                        <AuthenticatedLayout>
                          <Settings />
                        </AuthenticatedLayout>
                      </PostAuthHandler>
                    </SimpleAuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/profil"
                element={
                  <WorkflowGuard>
                    <SimpleAuthGuard>
                      <PostAuthHandler>
                        <AuthenticatedLayout>
                          <Profil />
                        </AuthenticatedLayout>
                      </PostAuthHandler>
                    </SimpleAuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/personnel"
                element={
                  <WorkflowGuard>
                    <SimpleAuthGuard>
                      <PostAuthHandler>
                        <AuthenticatedLayout>
                          <Personnel />
                        </AuthenticatedLayout>
                      </PostAuthHandler>
                    </SimpleAuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/aide"
                element={
                  <WorkflowGuard>
                    <SimpleAuthGuard>
                      <PostAuthHandler>
                        <AuthenticatedLayout>
                          <Aide />
                        </AuthenticatedLayout>
                      </PostAuthHandler>
                    </SimpleAuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/a-propos"
                element={
                  <WorkflowGuard>
                    <SimpleAuthGuard>
                      <PostAuthHandler>
                        <AuthenticatedLayout>
                          <APropos />
                        </AuthenticatedLayout>
                      </PostAuthHandler>
                    </SimpleAuthGuard>
                  </WorkflowGuard>
                }
              />

              <Route
                path="/debug"
                element={
                  <WorkflowGuard>
                    <SimpleAuthGuard>
                      <PostAuthHandler>
                        <AuthenticatedLayout>
                          <UserMenuDebug />
                        </AuthenticatedLayout>
                      </PostAuthHandler>
                    </SimpleAuthGuard>
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
