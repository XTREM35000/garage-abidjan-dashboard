import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building, Key, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Organization {
  id: string;
  nom: string;
  description?: string;
}

interface OrganizationSelectProps {
  onSelect: (orgId: string, code: string) => void;
}

const OrganizationSelect: React.FC<OrganizationSelectProps> = ({ onSelect }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Récupération des organisations...');

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('❌ Utilisateur non connecté');
        toast.error('Session expirée');
        return;
      }

      // Récupérer les organisations de l'utilisateur
      const { data, error } = await supabase
        .from('user_organizations')
        .select(`
          organisation:organisations (
            id,
            nom,
            description
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Erreur récupération organisations:', error);
        toast.error('Erreur lors de la récupération des organisations');
        return;
      }

      const orgs = data?.map(item => item.organisation).filter(Boolean) || [];
      console.log(`✅ ${orgs.length} organisation(s) trouvée(s)`);
      setOrganizations(orgs);

    } catch (error) {
      console.error('❌ Erreur lors de la récupération:', error);
      toast.error('Erreur lors de la récupération des organisations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrg || !code.trim()) {
      toast.error('Veuillez sélectionner une organisation et entrer le code');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('🔍 Validation accès...');
      await onSelect(selectedOrg, code.trim());
    } catch (error) {
      console.error('❌ Erreur validation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedOrganization = organizations.find(org => org.id === selectedOrg);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des organisations...</p>
        </div>
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-800">
              Aucune organisation trouvée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Vous n'avez pas encore d'organisation associée à votre compte.
                Veuillez contacter votre administrateur.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <Building className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Sélectionnez votre organisation
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Choisissez votre organisation et entrez le code d'accès
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="organization" className="text-gray-700 font-medium">
                Organisation
              </Label>
              <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une organisation" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        {org.nom}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedOrganization && (
              <Alert className="border-blue-200 bg-blue-50">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  <strong>{selectedOrganization.nom}</strong>
                  {selectedOrganization.description && (
                    <p className="text-sm mt-1">{selectedOrganization.description}</p>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="code" className="text-gray-700 font-medium">
                Code d'accès
              </Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="pl-10"
                  placeholder="Entrez le code d'accès"
                  autoComplete="off"
                />
              </div>
              <p className="text-xs text-gray-500">
                Le code d'accès vous a été fourni par votre administrateur
              </p>
            </div>

            <Alert className="border-amber-200 bg-amber-50">
              <Shield className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                <strong>Sécurité :</strong> Ce code est unique à votre organisation et ne doit pas être partagé.
              </AlertDescription>
            </Alert>

            <Button
              type="submit"
              disabled={!selectedOrg || !code.trim() || isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Validation...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Accéder à l'organisation
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationSelect; 