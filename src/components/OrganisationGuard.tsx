import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useOrganisation } from '@/components/OrganisationProvider';
import { Loader2, Shield, Building } from 'lucide-react';

interface OrganisationGuardProps {
  children: React.ReactNode;
}

const OrganisationGuard: React.FC<OrganisationGuardProps> = ({ children }) => {
  const { user, isAuthenticated, hasOrganisation, isLoading: authLoading, checkOrganisationAccess } = useAuth();
  const { currentOrg, organisations, isLoading: orgLoading, needsOnboarding } = useOrganisation();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkOrganisationStatus();
  }, [user, isAuthenticated, hasOrganisation]);

  const checkOrganisationStatus = async () => {
    try {
      // Vérifier s'il y a des organisations en base
      const hasOrganisations = await checkOrganisationAccess();
      setIsFirstLaunch(!hasOrganisations);

      if (!hasOrganisations) {
        // Premier lancement, aucune organisation
        setLoading(false);
        return;
      }

      if (!isAuthenticated) {
        // Utilisateur non connecté
        setLoading(false);
        return;
      }

      // Utilisateur connecté, vérifier s'il a une organisation
      if (!hasOrganisation) {
        setLoading(false);
        return;
      }

      // Tout est OK
      setLoading(false);
    } catch (error) {
      console.error('Erreur vérification organisation:', error);
      setLoading(false);
    }
  };

  // Affichage du loader pendant la vérification
  if (authLoading || orgLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="relative">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          </div>
          <p className="text-muted-foreground font-medium">Vérification des accès...</p>
          <p className="text-sm text-muted-foreground">Sécurisation de votre session</p>
        </div>
      </div>
    );
  }

  // Premier lancement - rediriger vers CreateOrganisation
  if (isFirstLaunch) {
    return <Navigate to="/create-organisation" replace />;
  }

  // Pas d'utilisateur connecté - rediriger vers AuthGate
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Utilisateur connecté mais pas d'organisation - rediriger vers AuthGate
  if (!hasOrganisation) {
    return <Navigate to="/auth" replace />;
  }

  // Besoin d'onboarding - rediriger vers l'onboarding
  if (needsOnboarding) {
    if (window.location.pathname !== '/organisation-onboarding') {
      return <Navigate to="/organisation-onboarding" replace />;
    }
  }

  // Si aucune organisation sélectionnée mais des organisations existent, forcer le sélecteur
  if (!currentOrg && organisations.length > 0) {
    if (window.location.pathname !== '/organisation-selector') {
      return <Navigate to="/organisation-selector" replace />;
    }
  }

  // Utilisateur connecté avec organisation valide
  return <>{children}</>;
};

export default OrganisationGuard;
