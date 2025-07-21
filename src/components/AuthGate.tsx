import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Organisation {
  id: string;
  nom: string;
  slug: string;
}

const AuthGate: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'createOrg'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    selectedOrg: ''
  });

  const [orgData, setOrgData] = useState({
    nom: '',
    slug: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    fetchOrganisations();
  }, []);

  const fetchOrganisations = async () => {
    try {
      const { data, error } = await supabase
        .from('organisations')
        .select('id, nom, slug')
        .eq('est_actif', true)
        .order('nom');

      if (error) throw error;
      setOrganisations(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des organisations:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!loginData.email || !loginData.password || !loginData.selectedOrg) {
        throw new Error('Tous les champs sont requis');
      }

      // Authentification Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password
      });

      if (authError) throw authError;

      // Définir le contexte organisationnel
      const { error: contextError } = await supabase.functions.invoke('set-organisation-context', {
        body: { slug: loginData.selectedOrg }
      });

      if (contextError) {
        console.warn('Erreur contexte organisation:', contextError);
      }

      // Stocker l'organisation sélectionnée
      localStorage.setItem('selectedOrganisationSlug', loginData.selectedOrg);
      
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganisation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!orgData.nom || !orgData.slug || !orgData.email || !orgData.password) {
        throw new Error('Tous les champs sont requis');
      }

      // Créer l'organisation
      const { data, error } = await supabase.functions.invoke('create-organisation', {
        body: {
          nom: orgData.nom,
          slug: orgData.slug,
          email_admin: orgData.email,
          password: orgData.password
        }
      });

      if (error) throw error;

      // Définir le contexte organisationnel
      await supabase.functions.invoke('set-organisation-context', {
        body: { organisationId: data.organisation_id }
      });

      // Stocker l'organisation créée
      localStorage.setItem('selectedOrganisationSlug', orgData.slug);
      
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Accès Garage Pro
          </CardTitle>
          <div className="flex space-x-1 bg-muted rounded-lg p-1 mt-4">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 text-sm rounded-md transition-all ${
                activeTab === 'login'
                  ? 'bg-background shadow-sm'
                  : 'hover:bg-background/50'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setActiveTab('createOrg')}
              className={`flex-1 py-2 text-sm rounded-md transition-all ${
                activeTab === 'createOrg'
                  ? 'bg-background shadow-sm'
                  : 'hover:bg-background/50'
              }`}
            >
              Nouvelle organisation
            </button>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organisation">Organisation</Label>
                <Select
                  value={loginData.selectedOrg}
                  onValueChange={(value) => setLoginData({ ...loginData, selectedOrg: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre organisation" />
                  </SelectTrigger>
                  <SelectContent>
                    {organisations.map((org) => (
                      <SelectItem key={org.slug} value={org.slug}>
                        {org.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Se connecter
              </Button>
            </form>
          ) : (
            <form onSubmit={handleCreateOrganisation} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgNom">Nom de l'organisation</Label>
                <Input
                  id="orgNom"
                  value={orgData.nom}
                  onChange={(e) => setOrgData({ ...orgData, nom: e.target.value })}
                  placeholder="Ex: Garage Excellence"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgSlug">Identifiant unique</Label>
                <Input
                  id="orgSlug"
                  value={orgData.slug}
                  onChange={(e) => setOrgData({ ...orgData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  placeholder="Ex: garage-excellence"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Utilisé pour identifier votre organisation (lettres, chiffres et tirets uniquement)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">Email administrateur</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={orgData.email}
                  onChange={(e) => setOrgData({ ...orgData, email: e.target.value })}
                  placeholder="admin@garage-excellence.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminPassword">Mot de passe administrateur</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  value={orgData.password}
                  onChange={(e) => setOrgData({ ...orgData, password: e.target.value })}
                  placeholder="Mot de passe sécurisé"
                  minLength={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Créer l'organisation
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthGate;