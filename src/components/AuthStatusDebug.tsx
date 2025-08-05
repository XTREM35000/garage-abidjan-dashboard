import React, { useEffect, useState } from 'react';
import { supabase, validateSession, getSupabaseDebugInfo } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertTriangle, CheckCircle, XCircle, Wrench, Database } from 'lucide-react';
import { resolveSessionIssues, checkApplicationState } from '@/utils/sessionCleaner';

interface AuthDebugInfo {
  sessionValid: boolean;
  user: any;
  session: any;
  localStorage: {
    currentOrg: string | null;
    orgCode: string | null;
  };
  errors: string[];
  supabaseInstances: any;
}

const AuthStatusDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<AuthDebugInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  const refreshDebugInfo = async () => {
    try {
      const sessionValid = await validateSession();
      const { data: { session } } = await supabase.auth.getSession();
      const { data: { user } } = await supabase.auth.getUser();

      const localStorage = {
        currentOrg: localStorage.getItem('current_org'),
        orgCode: localStorage.getItem('org_code'),
      };

      const errors: string[] = [];

      if (!sessionValid) {
        errors.push('Session invalide ou expirée');
      }

      if (!user) {
        errors.push('Aucun utilisateur connecté');
      }

      // Obtenir les informations sur les instances Supabase
      const supabaseInstances = getSupabaseDebugInfo();

      setDebugInfo({
        sessionValid,
        user,
        session,
        localStorage,
        errors,
        supabaseInstances
      });
    } catch (error) {
      console.error('Erreur lors du débogage:', error);
      setDebugInfo({
        sessionValid: false,
        user: null,
        session: null,
        localStorage: {
          currentOrg: localStorage.getItem('current_org'),
          orgCode: localStorage.getItem('org_code'),
        },
        errors: ['Erreur lors de la vérification'],
        supabaseInstances: getSupabaseDebugInfo()
      });
    }
  };

  useEffect(() => {
    refreshDebugInfo();
  }, []);

  const clearAllData = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('current_org');
      localStorage.removeItem('org_code');
      await refreshDebugInfo();
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
    }
  };

  const handleAutoResolve = async () => {
    setIsResolving(true);
    try {
      await resolveSessionIssues();
    } catch (error) {
      console.error('Erreur lors de la résolution automatique:', error);
      setIsResolving(false);
    }
  };

  const handleCheckState = () => {
    checkApplicationState();
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-white/80 backdrop-blur-sm"
        >
          <Info className="w-4 h-4 mr-2" />
          Debug Auth
        </Button>
      </div>
    );
  }

  if (!debugInfo) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl mx-4">
          <CardHeader>
            <CardTitle>Chargement du débogage...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Debug Authentification
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              Fermer
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* État général */}
          <div className="flex items-center gap-2">
            <span className="font-medium">État général:</span>
            <Badge variant={debugInfo.sessionValid ? "default" : "destructive"}>
              {debugInfo.sessionValid ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Valide
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 mr-1" />
                  Invalide
                </>
              )}
            </Badge>
          </div>

          {/* Instances Supabase */}
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Database className="w-4 h-4" />
              Instances Supabase:
            </h4>
            <div className="bg-gray-50 p-3 rounded-md text-sm">
              <div className="space-y-1">
                <div><strong>Nombre d'instances:</strong> {debugInfo.supabaseInstances.instanceCount}</div>
                <div><strong>Instance créée:</strong> {debugInfo.supabaseInstances.hasInstance ? 'Oui' : 'Non'}</div>
                <div><strong>URL configurée:</strong> {debugInfo.supabaseInstances.hasKey ? 'Oui' : 'Non'}</div>
                {debugInfo.supabaseInstances.instanceCount > 1 && (
                  <div className="text-orange-600 font-medium">
                    ⚠️ Attention: {debugInfo.supabaseInstances.instanceCount} instances détectées
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Erreurs */}
          {debugInfo.errors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {debugInfo.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Informations utilisateur */}
          <div className="space-y-2">
            <h4 className="font-medium">Utilisateur:</h4>
            <div className="bg-gray-50 p-3 rounded-md text-sm">
              {debugInfo.user ? (
                <div className="space-y-1">
                  <div><strong>ID:</strong> {debugInfo.user.id}</div>
                  <div><strong>Email:</strong> {debugInfo.user.email}</div>
                  <div><strong>Email vérifié:</strong> {debugInfo.user.email_confirmed_at ? 'Oui' : 'Non'}</div>
                </div>
              ) : (
                <div className="text-gray-500">Aucun utilisateur connecté</div>
              )}
            </div>
          </div>

          {/* Informations session */}
          <div className="space-y-2">
            <h4 className="font-medium">Session:</h4>
            <div className="bg-gray-50 p-3 rounded-md text-sm">
              {debugInfo.session ? (
                <div className="space-y-1">
                  <div><strong>Token:</strong> {debugInfo.session.access_token ? 'Présent' : 'Absent'}</div>
                  <div><strong>Refresh Token:</strong> {debugInfo.session.refresh_token ? 'Présent' : 'Absent'}</div>
                  <div><strong>Expire:</strong> {debugInfo.session.expires_at ? new Date(debugInfo.session.expires_at * 1000).toLocaleString() : 'Non défini'}</div>
                </div>
              ) : (
                <div className="text-gray-500">Aucune session</div>
              )}
            </div>
          </div>

          {/* LocalStorage */}
          <div className="space-y-2">
            <h4 className="font-medium">LocalStorage:</h4>
            <div className="bg-gray-50 p-3 rounded-md text-sm">
              <div><strong>Organisation:</strong> {debugInfo.localStorage.currentOrg || 'Non définie'}</div>
              <div><strong>Code org:</strong> {debugInfo.localStorage.orgCode || 'Non défini'}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button onClick={refreshDebugInfo} variant="outline" size="sm">
              Actualiser
            </Button>
            <Button onClick={clearAllData} variant="outline" size="sm">
              Nettoyer tout
            </Button>
            <Button onClick={handleCheckState} variant="outline" size="sm">
              Vérifier état
            </Button>
            <Button
              onClick={handleAutoResolve}
              variant="destructive"
              size="sm"
              disabled={isResolving}
            >
              <Wrench className="w-4 h-4 mr-2" />
              {isResolving ? 'Résolution...' : 'Résolution auto'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthStatusDebug;
