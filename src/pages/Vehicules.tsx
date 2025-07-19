import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car } from 'lucide-react';

const vehicules = [
  { id: 1, marque: 'Peugeot', modele: '208', immatriculation: 'AB-123-CD' },
  { id: 2, marque: 'Renault', modele: 'Clio', immatriculation: 'EF-456-GH' },
  { id: 3, marque: 'Toyota', modele: 'Yaris', immatriculation: 'IJ-789-KL' },
];

const Vehicules: React.FC = () => (
  <MainLayout>
    <div className="py-8 w-full">
      <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=900&q=80" alt="Véhicules garage" className="w-full h-40 object-cover rounded-xl mb-6 shadow-soft animate-fade-in" />
      <h1 className="text-3xl font-bold mb-6">Véhicules</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicules.map((v) => (
          <Card key={v.id} className="shadow-soft animate-fade-in">
            <CardHeader className="flex flex-row items-center gap-3">
              <Car className="w-6 h-6 text-primary" />
              <CardTitle>{v.marque} {v.modele}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-1">Immatriculation : {v.immatriculation}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </MainLayout>
);

export default Vehicules;
