import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Users, Car, CreditCard, Plus, Edit, Trash, Crown } from 'lucide-react';
import { toast } from 'sonner';

interface Organisation {
  id: string;
  nom: string;
  slug: string;
  plan_abonnement: string;
  email: string;
  telephone?: string;
  ville?: string;
  est_actif: boolean;
  date_creation: string;
  nb_utilisateurs: number;
  nb_clients: number;
  nb_vehicules: number;
}

interface NewOrgForm {
  nom: string;
  slug: string;
  email: string;
  adminPassword: string;
  plan: string;
}

export const MultiGarageAdminPanel: React.FC = () => {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrgForm, setNewOrgForm] = useState<NewOrgForm>({
    nom: '',
    slug: '',
    email: '',
    adminPassword: '',
    plan: 'starter'
  });

  useEffect(() => {
    fetchOrganisations();
  }, []);

  const fetchOrganisations = async () => {
    try {
      const { data, error } = await supabase
        .from('vue_administration')
        .select('*')
        .order('date_creation', { ascending: false });

      if (error) throw error;
      setOrganisations(data || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des organisations');
    } finally {
      setIsLoading(false);
    }
  };

  const createOrganisation = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-organisation', {
        body: {
          nom: newOrgForm.nom,
          slug: newOrgForm.slug,
          email_admin: newOrgForm.email,
          password: newOrgForm.adminPassword,
          plan: newOrgForm.plan
        }
      });

      if (error) throw error;

      toast.success(`Organisation "${newOrgForm.nom}" créée avec succès!`);
      setShowCreateModal(false);
      setNewOrgForm({ nom: '', slug: '', email: '', adminPassword: '', plan: 'starter' });
      fetchOrganisations();
    } catch (error) {
      console.error('Erreur création:', error);
      toast.error('Erreur lors de la création de l\'organisation');
    }
  };

  const toggleOrganisationStatus = async (orgId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('organisations')
        .update({ est_actif: !currentStatus })
        .eq('id', orgId);

      if (error) throw error;

      toast.success(`Organisation ${!currentStatus ? 'activée' : 'désactivée'}`);
      fetchOrganisations();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la modification du statut');
    }
  };

  const generateSlug = (nom: string) => {
    return nom.toLowerCase()
      .replace(/[àáäâ]/g, 'a')
      .replace(/[èéëê]/g, 'e')
      .replace(/[ìíïî]/g, 'i')
      .replace(/[òóöô]/g, 'o')
      .replace(/[ùúüû]/g, 'u')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'starter': return 'bg-blue-100 text-blue-800';
      case 'pro': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="h-8 w-8 text-gold-600" />
          <div>
            <h1 className="text-2xl font-bold">Administration Multi-Garages</h1>
            <p className="text-muted-foreground">Gérez toutes les organisations</p>
          </div>
        </div>

        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-secondary">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Garage
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle organisation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nom">Nom du garage</Label>
                <Input
                  id="nom"
                  value={newOrgForm.nom}
                  onChange={(e) => {
                    const nom = e.target.value;
                    setNewOrgForm(prev => ({
                      ...prev,
                      nom,
                      slug: generateSlug(nom)
                    }));
                  }}
                  placeholder="Ex: Garage Central Abidjan"
                />
              </div>

              <div>
                <Label htmlFor="slug">Identifiant (slug)</Label>
                <Input
                  id="slug"
                  value={newOrgForm.slug}
                  onChange={(e) => setNewOrgForm(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="garage-central-abidjan"
                />
              </div>

              <div>
                <Label htmlFor="email">Email administrateur</Label>
                <Input
                  id="email"
                  type="email"
                  value={newOrgForm.email}
                  onChange={(e) => setNewOrgForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@garage-central.ci"
                />
              </div>

              <div>
                <Label htmlFor="password">Mot de passe admin</Label>
                <Input
                  id="password"
                  type="password"
                  value={newOrgForm.adminPassword}
                  onChange={(e) => setNewOrgForm(prev => ({ ...prev, adminPassword: e.target.value }))}
                  placeholder="Mot de passe sécurisé"
                />
              </div>

              <div>
                <Label htmlFor="plan">Plan d'abonnement</Label>
                <Select
                  value={newOrgForm.plan}
                  onValueChange={(value) => setNewOrgForm(prev => ({ ...prev, plan: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter (5 users)</SelectItem>
                    <SelectItem value="pro">Pro (20 users)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (illimité)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={createOrganisation}
                className="w-full"
                disabled={!newOrgForm.nom || !newOrgForm.email || !newOrgForm.adminPassword}
              >
                Créer l'organisation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Organisations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organisations.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organisations.reduce((sum, org) => sum + org.nb_utilisateurs, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clients Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organisations.reduce((sum, org) => sum + org.nb_clients, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Véhicules Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {organisations.reduce((sum, org) => sum + org.nb_vehicules, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organisations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {organisations.map((org) => (
          <Card key={org.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{org.nom}</CardTitle>
                    <p className="text-sm text-muted-foreground">@{org.slug}</p>
                  </div>
                </div>
                <Badge className={getPlanBadgeColor(org.plan_abonnement)}>
                  {org.plan_abonnement}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center">
                  <Users className="h-4 w-4 text-blue-500 mb-1" />
                  <span className="text-sm font-medium">{org.nb_utilisateurs}</span>
                  <span className="text-xs text-muted-foreground">Users</span>
                </div>
                <div className="flex flex-col items-center">
                  <Car className="h-4 w-4 text-green-500 mb-1" />
                  <span className="text-sm font-medium">{org.nb_vehicules}</span>
                  <span className="text-xs text-muted-foreground">Véhicules</span>
                </div>
                <div className="flex flex-col items-center">
                  <CreditCard className="h-4 w-4 text-purple-500 mb-1" />
                  <span className="text-sm font-medium">{org.nb_clients}</span>
                  <span className="text-xs text-muted-foreground">Clients</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Badge variant={org.est_actif ? "default" : "secondary"}>
                  {org.est_actif ? 'Actif' : 'Inactif'}
                </Badge>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleOrganisationStatus(org.id, org.est_actif)}
                  >
                    {org.est_actif ? 'Désactiver' : 'Activer'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};