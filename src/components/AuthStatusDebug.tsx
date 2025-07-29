import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useOrganisation } from '@/components/OrganisationProvider';
import { Shield, User, Building, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AuthStatusDebug: React.FC = () => {
  const {
    user,
    profile,
    isAuthenticated,
    hasOrganisation,
    isLoading,
    role,
    organisation_id
  } = useAuth();

  const {
    currentOrg,
    organisations,
    isLoading: orgLoading,
    needsOnboarding
  } = useOrganisation();

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusBadge = (status: boolean, label: string) => {
    return (
      <Badge variant={status ? "default" : "destructive"} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {label}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            État de l'authentification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Utilisateur</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Connecté:</span>
                  {getStatusBadge(isAuthenticated, isAuthenticated ? 'Oui' : 'Non')}
                </div>
                <div className="flex justify-between">
                  <span>Chargement:</span>
                  {getStatusBadge(!isLoading, isLoading ? 'En cours' : 'Terminé')}
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-mono text-xs">{user?.email || 'Non défini'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rôle:</span>
                  <Badge variant="outline">{role}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Profil</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Nom:</span>
                  <span>{profile?.prenom} {profile?.nom}</span>
                </div>
                <div className="flex justify-between">
                  <span>Organisation ID:</span>
                  <span className="font-mono text-xs">{organisation_id || 'Non défini'}</span>
                </div>
                <div className="flex justify-between">
                  <span>A une organisation:</span>
                  {getStatusBadge(hasOrganisation, hasOrganisation ? 'Oui' : 'Non')}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            État de l'organisation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Organisation actuelle</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Chargement:</span>
                  {getStatusBadge(!orgLoading, orgLoading ? 'En cours' : 'Terminé')}
                </div>
                <div className="flex justify-between">
                  <span>Nom:</span>
                  <span>{currentOrg?.nom || 'Non défini'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Slug:</span>
                  <span className="font-mono text-xs">{currentOrg?.slug || 'Non défini'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Plan:</span>
                  <Badge variant="outline">{currentOrg?.plan_abonnement || 'Non défini'}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Système</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Organisations totales:</span>
                  <span>{organisations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Besoin onboarding:</span>
                  {getStatusBadge(!needsOnboarding, needsOnboarding ? 'Oui' : 'Non')}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Actions de debug
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log('Auth State:', { user, profile, isAuthenticated, hasOrganisation, role });
                console.log('Org State:', { currentOrg, organisations, needsOnboarding });
              }}
            >
              Log State
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              Clear LocalStorage
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.location.href = '/auth-gate';
              }}
            >
              Go to AuthGate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.location.href = '/create-organisation';
              }}
            >
              Go to Create Org
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthStatusDebug;
