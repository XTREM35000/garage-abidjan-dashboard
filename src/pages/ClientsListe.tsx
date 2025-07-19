import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const clients = [
  { id: 1, name: 'Jean Dupont', phone: '06 12 34 56 78', email: 'jean.dupont@email.com' },
  { id: 2, name: 'Fatou Diop', phone: '07 98 76 54 32', email: 'fatou.diop@email.com' },
  { id: 3, name: 'Ali Traoré', phone: '06 11 22 33 44', email: 'ali.traore@email.com' },
];

const ClientsListe: React.FC = () => (
  <MainLayout>
    <div className="py-8 w-full">
      <img src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80" alt="Clients garage" className="w-full h-40 object-cover rounded-xl mb-6 shadow-soft animate-fade-in" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Liste des clients</h1>
        <Button asChild>
          <a href="/clients/ajouter">Ajouter un client</a>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="shadow-soft animate-fade-in">
            <CardHeader>
              <CardTitle>{client.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-1">Téléphone : {client.phone}</p>
              <p className="text-muted-foreground">Email : {client.email}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </MainLayout>
);

export default ClientsListe;
