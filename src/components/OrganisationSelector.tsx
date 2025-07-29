import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Building, Plus, LogIn, Shield, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Organisation {
  id: string;
  nom: string;
  slug: string;
  created_at: string;
}

const OrganisationSelector: React.FC = () => {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadOrganisations();
  }, []);

  const loadOrganisations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organisations')
        .select('id, nom, slug, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrganisations(data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des organisations:', error);
      setError('Erreur lors du chargement des organisations');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg || !email || !password) {
      setError('Tous les champs sont requis');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Connexion avec Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Vérifier que l'utilisateur appartient à l'organisation sélectionnée
      const { data: userOrg, error: userOrgError } = await supabase
        .from('users')
        .select('organisation_id')
        .eq('email', email)
        .eq('organisation_id', selectedOrg)
        .maybeSingle();

      if (userOrgError) throw userOrgError;
      if (!userOrg) {
        throw new Error('Vous n\'avez pas accès à cette organisation');
      }

      // Définir le contexte organisationnel
      const { error: contextError } = await supabase.functions.invoke('set-organisation-context', {
        body: { organisationId: selectedOrg }
      });

      if (contextError) {
        console.warn('Erreur lors de la configuration du contexte (non critique):', contextError);
      }

      // Stocker l'organisation sélectionnée
      const selectedOrgData = organisations.find(org => org.id === selectedOrg);
      if (selectedOrgData) {
        localStorage.setItem('selectedOrganisationSlug', selectedOrgData.slug);
      }

      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur lors de la connexion';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/create-organisation');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="text-gray-600">Chargement des organisations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenue !</h1>
          <p className="text-gray-600">
            {organisations.length > 0
              ? 'Sélectionnez votre organisation ou créez-en une nouvelle'
              : 'Aucune organisation trouvée'
            }
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl font-bold text-gray-900">
              {organisations.length > 0 ? 'Connexion à une organisation' : 'Créer une organisation'}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert className="mb-6" variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {organisations.length > 0 ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="organisation">Organisation *</Label>
                  <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une organisation" />
                    </SelectTrigger>
                    <SelectContent>
                      {organisations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          <div className="flex items-center space-x-2">
                            <Building className="w-4 h-4" />
                            <span>{org.nom}</span>
                            <span className="text-xs text-gray-500">({org.slug})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  disabled={submitting || !selectedOrg || !email || !password}
                >
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <LogIn className="mr-2 h-4 w-4" />
                  Se connecter
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Building className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">
                  Aucune organisation n'existe encore. Créez la première !
                </p>
              </div>
            )}

            {/* Bouton pour créer une nouvelle organisation */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleCreateNew}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Créer une nouvelle organisation
              </Button>
            </div>

            {/* Informations supplémentaires */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Sécurité garantie</p>
                  <p className="text-blue-600">
                    Vos données sont protégées et chaque organisation est isolée.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganisationSelector;
