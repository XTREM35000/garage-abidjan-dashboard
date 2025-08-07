import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building, Key, Loader2, AlertCircle } from 'lucide-react';
import { getAvailableOrganizations } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Organization {
  id: string;
  nom: string;
  code: string;
  description?: string;
}

interface OrganizationSelectProps {
  onSelect: (orgId: string, orgCode: string) => void;
}

const OrganizationSelect: React.FC<OrganizationSelectProps> = ({ onSelect }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [accessCode, setAccessCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setIsLoading(true);
      setError('');

      const { organizations: orgs, isSuperAdmin: isSuper, error: fetchError } = await getAvailableOrganizations();

      if (fetchError) {
        throw new Error(fetchError);
      }

      setOrganizations(orgs || []);
      setIsSuperAdmin(isSuper || false);

      if (orgs && orgs.length === 1) {
        setSelectedOrgId(orgs[0].id);
      }

    } catch (error: any) {
      console.error('Erreur récupération organisations:', error);
      setError('Erreur lors du chargement des organisations. Veuillez réessayer.');
      toast.error('Impossible de charger les organisations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOrgId) {
      setError('Veuillez sélectionner une organisation');
      return;
    }

    if (isSuperAdmin) {
      const selectedOrg = organizations.find(org => org.id === selectedOrgId);
      onSelect(selectedOrgId, selectedOrg?.code || '');
      return;
    }

    if (!accessCode.trim()) {
      setError('Veuillez saisir le code d\'accès');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const selectedOrg = organizations.find(org => org.id === selectedOrgId);

      if (!selectedOrg) {
        throw new Error('Organisation non trouvée');
      }

      if (selectedOrg.code !== accessCode.trim()) {
        throw new Error('Code d\'accès incorrect');
      }

      onSelect(selectedOrgId, accessCode.trim());

    } catch (error: any) {
      console.error('Erreur sélection organisation:', error);
      setError(error.message || 'Code d\'accès invalide');
      toast.error('Code d\'accès incorrect');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Chargement des organisations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (organizations.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Aucune organisation disponible. Contactez votre administrateur pour obtenir l'accès à une organisation.
            </AlertDescription>
          </Alert>

          <div className="mt-4 text-center">
            <Button onClick={fetchOrganizations} variant="outline">
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          Sélection d'organisation
          {isSuperAdmin && (
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Super Admin
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="organization">Organisation</Label>
            <select
              id="organization"
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Sélectionnez une organisation</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.nom}
                  {org.description && ` - ${org.description}`}
                </option>
              ))}
            </select>
          </div>

          {!isSuperAdmin && (
            <div className="space-y-2">
              <Label htmlFor="accessCode">Code d'accès</Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="accessCode"
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="pl-10"
                  placeholder="Saisissez le code d'accès"
                  required
                />
              </div>
              <p className="text-sm text-gray-600">
                Demandez le code d'accès à votre administrateur
              </p>
            </div>
          )}

          {isSuperAdmin && selectedOrgId && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                En tant que Super Admin, vous avez accès direct à toutes les organisations.
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || !selectedOrgId}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vérification...
              </>
            ) : (
              <>
                <Building className="mr-2 h-4 w-4" />
                Accéder à l'organisation
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrganizationSelect;
