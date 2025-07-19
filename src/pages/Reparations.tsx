import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

const reparations = [
  { id: 1, vehicule: 'Peugeot 208', client: 'Jean Dupont', statut: 'En cours' },
  { id: 2, vehicule: 'Renault Clio', client: 'Fatou Diop', statut: 'Terminé' },
  { id: 3, vehicule: 'Toyota Yaris', client: 'Ali Traoré', statut: 'En attente' },
];

const Reparations: React.FC = () => (
  <MainLayout>
    <div className="py-8 w-full">
      <img src="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80" alt="Réparations garage" className="w-full h-40 object-cover rounded-xl mb-6 shadow-soft animate-fade-in" />
      <h1 className="text-3xl font-bold mb-6">Réparations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reparations.map((r) => (
          <Card key={r.id} className="shadow-soft animate-fade-in">
            <CardHeader className="flex flex-row items-center gap-3">
              <Wrench className="w-6 h-6 text-primary" />
              <CardTitle>{r.vehicule}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-1">Client : {r.client}</p>
              <p className="text-muted-foreground">Statut : {r.statut}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </MainLayout>
);

export default Reparations;
