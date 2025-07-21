import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOrganisation } from './OrganisationProvider';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { Building2, Users, Car, Wrench, Settings, Plus, Crown } from 'lucide-react';
import { RoleGuard } from './RoleGuard';

export const OrganisationDashboard: React.FC = () => {
  const { currentOrg } = useOrganisation();
  const { createQuery } = useSupabaseQuery();
  const [stats, setStats] = useState({
    users: 0,
    clients: 0,
    vehicules: 0,
    reparations: 0
  });

  useEffect(() => {
    if (!currentOrg?.id) return;

    const fetchStats = async () => {
      try {
        const [usersRes, clientsRes, vehiculesRes, reparationsRes] = await Promise.all([
          createQuery('users').select('id', { count: 'exact', head: true }),
          createQuery('clients').select('id', { count: 'exact', head: true }),
          createQuery('vehicules').select('id', { count: 'exact', head: true }),
          createQuery('reparations').select('id', { count: 'exact', head: true })
        ]);

        setStats({
          users: usersRes.count || 0,
          clients: clientsRes.count || 0,
          vehicules: vehiculesRes.count || 0,
          reparations: reparationsRes.count || 0
        });
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    };

    fetchStats();
  }, [currentOrg?.id]);

  if (!currentOrg) {
    return <div>Aucune organisation sélectionnée</div>;
  }

  return (
    <div className="space-y-6">
      {/* En-tête organisation */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentOrg.logo_url ? (
                <img 
                  src={currentOrg.logo_url} 
                  alt={currentOrg.nom}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              ) : (
                <div className="h-16 w-16 bg-primary rounded-lg flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
              )}
              
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  {currentOrg.nom}
                  {currentOrg.plan_abonnement === 'premium' && (
                    <Crown className="h-5 w-5 text-yellow-500" />
                  )}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{currentOrg.slug}</Badge>
                  <Badge variant={currentOrg.est_actif ? 'default' : 'destructive'}>
                    {currentOrg.est_actif ? 'Actif' : 'Inactif'}
                  </Badge>
                  <Badge variant="secondary">{currentOrg.plan_abonnement}</Badge>
                </div>
              </div>
            </div>

            <RoleGuard allowedRoles={['admin', 'superadmin']}>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
            </RoleGuard>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground">
              Membres de l'équipe
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clients}</div>
            <p className="text-xs text-muted-foreground">
              Clients enregistrés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Véhicules</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.vehicules}</div>
            <p className="text-xs text-muted-foreground">
              Véhicules suivis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Réparations</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reparations}</div>
            <p className="text-xs text-muted-foreground">
              Interventions totales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <RoleGuard allowedRoles={['admin', 'manager', 'superadmin']}>
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <RoleGuard allowedRoles={['admin', 'superadmin']}>
                <Button className="h-24 flex flex-col items-center justify-center gap-2">
                  <Plus className="h-6 w-6" />
                  <span>Créer un garage</span>
                </Button>
              </RoleGuard>

              <RoleGuard allowedRoles={['admin', 'manager', 'superadmin']}>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                  <Users className="h-6 w-6" />
                  <span>Inviter un utilisateur</span>
                </Button>
              </RoleGuard>

              <RoleGuard allowedRoles={['admin', 'superadmin']}>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                  <Settings className="h-6 w-6" />
                  <span>Paramètres org.</span>
                </Button>
              </RoleGuard>
            </div>
          </CardContent>
        </Card>
      </RoleGuard>
    </div>
  );
};