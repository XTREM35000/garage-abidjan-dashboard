import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import OrganizationSelect from './OrganizationSelect';
import { toast } from 'sonner';

type AuthState = 'loading' | 'unauthenticated' | 'authenticated' | 'selecting-org';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const navigate = useNavigate();

  // Single useEffect to handle all auth logic
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setAuthState('unauthenticated');
          return;
        }

        if (!session) {
          setAuthState('unauthenticated');
          return;
        }

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('User error:', userError);
          setAuthState('unauthenticated');
          return;
        }

        setCurrentUser(user);

        // Check if user has a current organization in localStorage
        const storedOrg = localStorage.getItem('current_org');
        const storedOrgCode = localStorage.getItem('org_code');

        if (storedOrg && storedOrgCode) {
          // Validate the stored organization access
          const { data: isValid, error: validationError } = await supabase.rpc('validate_org_access', {
            org_id: storedOrg,
            user_id: user.id,
            org_code: storedOrgCode
          });

          if (!validationError && isValid) {
            setSelectedOrg({ id: storedOrg, code: storedOrgCode });
            setAuthState('authenticated');
            return;
          } else {
            // Clear invalid stored data
            localStorage.removeItem('current_org');
            localStorage.removeItem('org_code');
          }
        }

        // User is authenticated but needs to select organization
        setAuthState('selecting-org');

      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState('unauthenticated');
      }
    };

    checkAuth();
  }, []);

  // Handle navigation when unauthenticated
  useEffect(() => {
    if (authState === 'unauthenticated') {
      navigate('/auth');
    }
  }, [authState, navigate]);

  const handleOrgSelect = async (orgId: string, orgCode: string) => {
    try {
      // Validate organization access
      const { data: isValid, error } = await supabase.rpc('validate_org_access', {
        org_id: orgId,
        user_id: currentUser.id,
        org_code: orgCode
      });

      if (error || !isValid) {
        toast.error('Code d\'accès invalide ou accès refusé');
        return;
      }

      // Store organization info
      localStorage.setItem('current_org', orgId);
      localStorage.setItem('org_code', orgCode);
      
      setSelectedOrg({ id: orgId, code: orgCode });
      setAuthState('authenticated');
      
      toast.success('Organisation sélectionnée avec succès !');

    } catch (error) {
      console.error('Organization selection error:', error);
      toast.error('Erreur lors de la sélection de l\'organisation');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('current_org');
      localStorage.removeItem('org_code');
      setAuthState('unauthenticated');
      setCurrentUser(null);
      setSelectedOrg(null);
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  // Always render something to avoid conditional rendering issues
  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (authState === 'unauthenticated') {
    // Return a loading state while navigation happens
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirection vers la page de connexion...</p>
        </div>
      </div>
    );
  }

  if (authState === 'selecting-org') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Sélectionnez votre organisation
            </h2>
            <p className="text-gray-600">
              Choisissez l'organisation à laquelle vous souhaitez accéder
            </p>
          </div>

          <OrganizationSelect
            onSelect={handleOrgSelect}
          />

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (authState === 'authenticated' && selectedOrg) {
    return (
      <div>
        {/* Optional: Add a header with logout button */}
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Connecté en tant que {currentUser?.email}
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
          >
            Déconnexion
          </button>
        </div>
        
        {/* Render the main content */}
        {children}
      </div>
    );
  }

  // Fallback - should not be reached
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">État d'authentification inconnu</p>
      </div>
    </div>
  );
};

export default AuthGuard; 