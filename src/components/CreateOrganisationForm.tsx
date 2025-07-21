import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const CreateOrganisationForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    slug: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.nom || !formData.slug || !formData.email || !formData.password) {
        throw new Error('Tous les champs sont requis');
      }

      // Créer la première organisation
      const { data, error } = await supabase.functions.invoke('create-organisation', {
        body: {
          nom: formData.nom,
          slug: formData.slug,
          email_admin: formData.email,
          password: formData.password
        }
      });

      if (error) throw error;

      // Définir le contexte organisationnel
      await supabase.functions.invoke('set-organisation-context', {
        body: { organisationId: data.organisation_id }
      });

      // Stocker l'organisation créée
      localStorage.setItem('selectedOrganisationSlug', formData.slug);
      
      // Rediriger vers le dashboard
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'slug' ? value.toLowerCase().replace(/[^a-z0-9-]/g, '') : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">
            Bienvenue ! Créons votre organisation
          </CardTitle>
          <p className="text-muted-foreground">
            C'est votre premier accès. Commençons par configurer votre organisation.
          </p>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom de l'organisation *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                placeholder="Ex: Garage Excellence Abidjan"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Identifiant unique *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="Ex: garage-excellence"
                required
              />
              <p className="text-xs text-muted-foreground">
                Identifiant URL-friendly (lettres, chiffres et tirets uniquement)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email administrateur *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="admin@garage-excellence.com"
                required
              />
              <p className="text-xs text-muted-foreground">
                Cet email sera utilisé pour le compte administrateur principal
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe administrateur *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Mot de passe sécurisé"
                minLength={6}
                required
              />
              <p className="text-xs text-muted-foreground">
                Minimum 6 caractères
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer l'organisation et commencer
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Qu'est-ce qui va être créé ?</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Votre organisation avec les paramètres de base</li>
              <li>• Un compte administrateur principal</li>
              <li>• L'accès complet au système de gestion</li>
              <li>• La possibilité d'inviter d'autres utilisateurs</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateOrganisationForm;