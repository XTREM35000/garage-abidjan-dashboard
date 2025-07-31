import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { Shield, User, Building, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AuthStatusDebug: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useSimpleAuth();

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
                  <span>Créé le:</span>
                  <span className="text-xs">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Non défini'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Profil</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>ID:</span>
                  <span className="font-mono text-xs">{user?.id || 'Non défini'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  {getStatusBadge(isAuthenticated, 'Connecté')}
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
                console.log('Auth State:', { user, isAuthenticated, isLoading });
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
