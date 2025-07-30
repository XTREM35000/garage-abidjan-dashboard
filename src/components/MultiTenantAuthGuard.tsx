import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOrganisation } from '@/components/OrganisationProvider';
import { useMultiInstanceSetup } from '@/hooks/useMultiInstanceSetup';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface MultiTenantAuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireOrganisation?: boolean;
  allowedRoles?: string[];
}

const MultiTenantAuthGuard: React.FC<MultiTenantAuthGuardProps> = ({
  children,
  requireAuth = true,
  requireOrganisation = true,
  allowedRoles = []
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, profile, isLoading: authLoading } = useAuth();
  const { currentOrg, organisations, isLoading: orgLoading } = useOrganisation();
  const { setupState } = useMultiInstanceSetup();
  const [isChecking, setIsChecking] = useState(true);
  const [accessLog, setAccessLog] = useState<any>(null);

  // Journaliser les tentatives d'accès
  const logAccessAttempt = async (success: boolean, reason?: string) => {
    try {
      const logData = {
        timestamp: new Date().toISOString(),
        path: location.pathname,
        user_id: profile?.id || 'anonymous',
        user_email: profile?.email || 'anonymous',
        organisation_id: currentOrg?.id || null,
        success,
        reason: reason || null,
        user_agent: navigator.userAgent,
        ip_address: 'client-side' // En production, récupérer depuis le serveur
      };

      setAccessLog(logData);

      // Envoyer le log à Supabase (table access_logs)
      await supabase
        .from('access_logs')
        .insert(logData);

    } catch (error) {
      console.warn('Erreur lors de la journalisation:', error);
    }
  };

  useEffect(() => {
    const checkAccess = async () => {
      // Attendre que les hooks soient chargés
      if (authLoading || orgLoading || setupState.isLoading) {
        return;
      }

      // Vérifier si l'initialisation multi-instances est en cours
      if (setupState.step !== 'complete') {
        console.log('Initialisation multi-instances en cours, redirection vers le splash screen');
        navigate('/', { replace: true });
        return;
      }

      // En cas d'erreur de setup, rediriger vers l'authentification
      if (setupState.error) {
        console.log('Erreur de setup détectée, redirection vers l\'authentification');
        navigate('/auth', { replace: true });
        return;
      }

      // Vérifier l'authentification si requise
      if (requireAuth && !isAuthenticated) {
        console.log('Authentification requise, redirection vers /auth');
        await logAccessAttempt(false, 'Authentication required');
        navigate('/auth', { replace: true });
        return;
      }

      // Vérifier l'organisation si requise
      if (requireOrganisation && !currentOrg) {
        console.log('Organisation requise, redirection vers le sélecteur');
        await logAccessAttempt(false, 'Organization required');

        // Si l'utilisateur a des organisations mais aucune n'est sélectionnée
        if (organisations.length > 0) {
          navigate('/organisation-selector', { replace: true });
        } else {
          navigate('/organisation-onboarding', { replace: true });
        }
        return;
      }

      // Vérifier les rôles si spécifiés
      if (allowedRoles.length > 0 && profile?.role) {
        if (!allowedRoles.includes(profile.role)) {
          console.log(`Rôle insuffisant: ${profile.role}, rôles autorisés: ${allowedRoles.join(', ')}`);
          await logAccessAttempt(false, `Insufficient role: ${profile.role}`);
          toast.error('Accès refusé: permissions insuffisantes');
          navigate('/dashboard', { replace: true });
          return;
        }
      }

      // Accès autorisé
      await logAccessAttempt(true);
      setIsChecking(false);
    };

    checkAccess();
  }, [
    authLoading,
    orgLoading,
    setupState.isLoading,
    setupState.step,
    isAuthenticated,
    currentOrg,
    organisations,
    profile,
    requireAuth,
    requireOrganisation,
    allowedRoles,
    navigate,
    location.pathname
  ]);

  // Afficher un loader pendant la vérification
  if (isChecking || authLoading || orgLoading || setupState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center animate-pulse">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Vérification des accès
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Sécurisation de votre session...
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {setupState.isLoading ? 'Initialisation...' : 'Vérification...'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Afficher les enfants si l'accès est autorisé
  return <>{children}</>;
};

export default MultiTenantAuthGuard;
