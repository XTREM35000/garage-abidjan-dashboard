import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Mail, User, Key } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Props {
  isOpen: boolean;
  onComplete: (organisationId: string) => void;
}

export const OrganisationOnboarding: React.FC<Props> = ({ isOpen, onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    slug: '',
    adminEmail: '',
    adminPassword: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Générer le slug automatiquement si vide
      const slug = formData.slug || formData.nom.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const { data, error } = await supabase.functions.invoke('create-organisation', {
        body: {
          nom: formData.nom,
          slug,
          email_admin: formData.adminEmail,
          password: formData.adminPassword
        }
      });

      if (error) throw error;

      toast({
        title: "Organisation créée avec succès",
        description: `Bienvenue dans ${formData.nom} !`
      });

      onComplete(data.org_id);
    } catch (error: any) {
      toast({
        title: "Erreur lors de la création",
        description: error.message || "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Créer votre organisation
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations de l'organisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nom">Nom de l'organisation *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  placeholder="Ex: Garage Central Abidjan"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="slug">Identifiant unique (slug)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="garage-central-abidjan (généré automatiquement)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Utilisé pour l'URL. Laissez vide pour génération automatique.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Compte administrateur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="adminEmail" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email administrateur *
                </Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                  placeholder="admin@garagecentral.ci"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="adminPassword" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Mot de passe *
                </Label>
                <Input
                  id="adminPassword"
                  type="password"
                  value={formData.adminPassword}
                  onChange={(e) => handleInputChange('adminPassword', e.target.value)}
                  placeholder="Mot de passe sécurisé"
                  required
                  minLength={6}
                />
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Que se passe-t-il ensuite ?
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Votre organisation sera créée avec un plan starter</li>
              <li>• Vous pourrez inviter jusqu'à 5 utilisateurs</li>
              <li>• Vous aurez accès à 1Go de stockage</li>
              <li>• Un compte administrateur sera automatiquement configuré</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !formData.nom || !formData.adminEmail || !formData.adminPassword}
          >
            {isLoading ? 'Création en cours...' : 'Créer mon organisation'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};