import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface OrganisationGuardProps {
  children: React.ReactNode;
}

const OrganisationGuard: React.FC<OrganisationGuardProps> = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();
  const [hasOrganisation, setHasOrganisation] = useState<boolean | null>(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkOrganisationStatus();
  }, [user]);

  const checkOrganisationStatus = async () => {
    try {
      // Vérifier s'il y a des organisations en base
      const { data: orgsCount, error: countError } = await supabase
        .from('organisations')
        .select('id', { count: 'exact', head: true });

      if (countError) throw countError;

      const isFirstTime = (orgsCount as any)?.count === 0;
      setIsFirstLaunch(isFirstTime);

      if (isFirstTime) {
        // Premier lancement, aucune organisation
        setHasOrganisation(false);
        setLoading(false);
        return;
      }

      if (!user) {
        // Utilisateur non connecté, rediriger vers AuthGate
        setHasOrganisation(false);
        setLoading(false);
        return;
      }

      // Vérifier si l'utilisateur a une organisation
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('organisation_id, role')
        .eq('email', user.email)
        .single();

      if (profileError) {
        console.error('Erreur profil utilisateur:', profileError);
        setHasOrganisation(false);
      } else {
        const hasValidOrg = !!profile?.organisation_id;
        setHasOrganisation(hasValidOrg);

        if (hasValidOrg) {
          // Définir le contexte organisationnel
          await supabase.functions.invoke('set-organisation-context', {
            body: { organisationId: profile.organisation_id }
          });
        }
      }
    } catch (error) {
      console.error('Erreur vérification organisation:', error);
      setHasOrganisation(false);
    } finally {
      setLoading(false);
    }
  };

  // Affichage du loader pendant la vérification
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  // Premier lancement - rediriger vers CreateOrganisation
  if (isFirstLaunch) {
    return <Navigate to="/create-organisation" replace />;
  }

  // Pas d'utilisateur ou pas d'organisation - rediriger vers AuthGate
  if (!user || !hasOrganisation) {
    return <Navigate to="/auth-gate" replace />;
  }

  // Utilisateur connecté avec organisation valide
  return <>{children}</>;
};

export default OrganisationGuard;