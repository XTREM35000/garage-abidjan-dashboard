import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { validateSession, checkUserPermissions } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// États d'authentification
export enum AuthState {
  LOADING = 'LOADING',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  AUTHENTICATED = 'AUTHENTICATED',
  ORG_REQUIRED = 'ORG_REQUIRED'
}

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireOrganization?: boolean;
  allowedRoles?: string[];
}

interface AuthData {
  user: any;
  session: any;
  organizations: any[];
  currentOrganization?: any;
  userRole?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true,
  requireOrganization = false,
  allowedRoles = []
}) => {
  const [authState, setAuthState] = useState<AuthState>(AuthState.LOADING);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuthentication = async () => {
    try {
      setAuthState(AuthState.LOADING);

      // 1. Valider la session
      const sessionResult = await validateSession();
      
      if (!sessionResult.isValid || !sessionResult.user) {
        setAuthState(AuthState.UNAUTHENTICATED);
        
        if (requireAuth) {
          // Sauvegarder l'URL actuelle pour redirection après connexion
          const redirectUrl = encodeURIComponent(location.pathname + location.search);
          navigate(`/auth?redirect=${redirectUrl}`);
          return;
        }
        
        setAuthData(null);
        return;
      }

      // 2. Vérifier les permissions et organisations
      const permissionsResult = await checkUserPermissions(sessionResult.user.id);
      
      const authDataResult: AuthData = {
        user: sessionResult.user,
        session: sessionResult.session,
        organizations: permissionsResult.organizations || [],
        currentOrganization: null,
        userRole: undefined
      };

      // 3. Gérer les organisations
      if (requireOrganization) {
        if (!permissionsResult.hasAccess || authDataResult.organizations.length === 0) {
          setAuthState(AuthState.ORG_REQUIRED);
          setAuthData(authDataResult);
          navigate('/create-organisation');
          return;
        }

        // Vérifier l'organisation courante
        const storedOrgId = localStorage.getItem('current_org');
        let currentOrg = null;
        let userRole = undefined;

        if (storedOrgId) {
          // Vérifier l'accès à l'organisation stockée
          const orgPermissions = await checkUserPermissions(sessionResult.user.id, storedOrgId);
          
          if (orgPermissions.hasAccess) {
            currentOrg = orgPermissions.organization;
            userRole = orgPermissions.role;
          } else {
            // Supprimer l'organisation invalide du localStorage
            localStorage.removeItem('current_org');
            localStorage.removeItem('org_code');
          }
        }

        // Si pas d'organisation courante valide, utiliser la première disponible
        if (!currentOrg && authDataResult.organizations.length > 0) {
          const firstOrg = authDataResult.organizations[0];
          currentOrg = firstOrg.organisations;
          userRole = firstOrg.role;
          
          // Sauvegarder dans localStorage
          localStorage.setItem('current_org', currentOrg.id);
          localStorage.setItem('org_code', currentOrg.code || '');
        }

        // Si l'utilisateur a plusieurs organisations mais aucune sélectionnée
        if (!currentOrg && authDataResult.organizations.length > 1) {
          setAuthState(AuthState.ORG_REQUIRED);
          setAuthData(authDataResult);
          navigate('/select-organisation');
          return;
        }

        authDataResult.currentOrganization = currentOrg;
        authDataResult.userRole = userRole;
      }

      // 4. Vérifier les rôles requis
      if (allowedRoles.length > 0 && authDataResult.userRole) {
        if (!allowedRoles.includes(authDataResult.userRole)) {
          toast.error('Vous n\'avez pas les permissions nécessaires pour accéder à cette page.');
          navigate('/dashboard');
          return;
        }
      }

      // 5. Authentification réussie
      setAuthData(authDataResult);
      setAuthState(AuthState.AUTHENTICATED);

    } catch (error) {
      console.error('Erreur lors de la vérification d\'authentification:', error);
      setAuthState(AuthState.UNAUTHENTICATED);
      setAuthData(null);
      
      if (requireAuth) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
        navigate('/auth');
      }
    }
  };

  const handleOrganizationChange = async (organizationId: string) => {
    if (!authData?.user) return;

    try {
      const permissions = await checkUserPermissions(authData.user.id, organizationId);
      
      if (permissions.hasAccess) {
        localStorage.setItem('current_org', organizationId);
        localStorage.setItem('org_code', permissions.organization?.code || '');
        
        // Recharger les données d'authentification
        await checkAuthentication();
        
        toast.success(`Organisation changée: ${permissions.organization?.nom}`);
      } else {
        toast.error('Vous n\'avez pas accès à cette organisation.');
      }
    } catch (error) {
      console.error('Erreur changement organisation:', error);
      toast.error('Erreur lors du changement d\'organisation.');
    }
  };

  const signOut = () => {
    localStorage.removeItem('current_org');
    localStorage.removeItem('org_code');
    setAuthData(null);
    setAuthState(AuthState.UNAUTHENTICATED);
    navigate('/auth');
  };

  useEffect(() => {
    checkAuthentication();
  }, [location.pathname]);

  // Écran de chargement
  if (authState === AuthState.LOADING) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Vérification de l'authentification...
          </p>
        </div>
      </div>
    );
  }

  // Si pas d'authentification requise, afficher le contenu
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Si authentifié, passer les données d'auth aux enfants
  if (authState === AuthState.AUTHENTICATED) {
    return (
      <>
        {React.cloneElement(children as React.ReactElement, {
          authData,
          onOrganizationChange: handleOrganizationChange,
          onSignOut: signOut
        })}
      </>
    );
  }

  // Les autres états (UNAUTHENTICATED, ORG_REQUIRED) sont gérés par les redirections
  return null;
};

export default AuthGuard; 