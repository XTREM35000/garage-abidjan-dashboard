import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stock = [
  { id: 1, nom: 'Filtre à huile', quantite: 12 },
  { id: 2, nom: 'Plaquettes de frein', quantite: 8 },
  { id: 3, nom: 'Batterie', quantite: 5 },
];

const Stock: React.FC = () => (
  <MainLayout>
    <div className="py-8 w-full">
      <img src="https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=900&q=80" alt="Stock garage" className="w-full h-40 object-cover rounded-xl mb-6 shadow-soft animate-fade-in" />
      <h1 className="text-3xl font-bold mb-6">Stock</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stock.map((item) => (
          <Card key={item.id} className="shadow-soft animate-fade-in">
            <CardHeader>
              <CardTitle>{item.nom}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Quantité : {item.quantite}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </MainLayout>
);

export default Stock;
