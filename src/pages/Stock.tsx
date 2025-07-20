import React from 'react';
import UnifiedLayout from '@/layout/UnifiedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const stock = [
  {
    id: 1,
    nom: 'Filtre à huile',
    quantite: 12,
    prixUnitaire: 2500,
    seuilAlerte: 5,
    categorie: 'Filtres',
    fournisseur: 'Total Côte d\'Ivoire'
  },
  {
    id: 2,
    nom: 'Plaquettes de frein avant',
    quantite: 8,
    prixUnitaire: 8500,
    seuilAlerte: 3,
    categorie: 'Freinage',
    fournisseur: 'Brembo Distribution'
  },
  {
    id: 3,
    nom: 'Batterie 60Ah',
    quantite: 5,
    prixUnitaire: 45000,
    seuilAlerte: 2,
    categorie: 'Électricité',
    fournisseur: 'Exide Technologies'
  },
  {
    id: 4,
    nom: 'Huile moteur 5W30',
    quantite: 20,
    prixUnitaire: 3500,
    seuilAlerte: 8,
    categorie: 'Lubrifiants',
    fournisseur: 'Total Côte d\'Ivoire'
  },
  {
    id: 5,
    nom: 'Bougies d\'allumage',
    quantite: 15,
    prixUnitaire: 1200,
    seuilAlerte: 6,
    categorie: 'Moteur',
    fournisseur: 'NGK Spark Plugs'
  },
  {
    id: 6,
    nom: 'Disques de frein',
    quantite: 6,
    prixUnitaire: 15000,
    seuilAlerte: 4,
    categorie: 'Freinage',
    fournisseur: 'Brembo Distribution'
  },
  {
    id: 7,
    nom: 'Filtre à air',
    quantite: 10,
    prixUnitaire: 1800,
    seuilAlerte: 4,
    categorie: 'Filtres',
    fournisseur: 'Mann Filter'
  },
  {
    id: 8,
    nom: 'Liquide de refroidissement',
    quantite: 25,
    prixUnitaire: 1200,
    seuilAlerte: 10,
    categorie: 'Refroidissement',
    fournisseur: 'Total Côte d\'Ivoire'
  },
  {
    id: 9,
    nom: 'Courroie de distribution',
    quantite: 3,
    prixUnitaire: 25000,
    seuilAlerte: 2,
    categorie: 'Moteur',
    fournisseur: 'Gates Corporation'
  }
];

const Stock: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <UnifiedLayout>
      <div className="py-8 w-full">
        <img
          src="https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Stock garage"
          className="w-full h-40 object-cover rounded-xl mb-6 shadow-soft animate-fade-in"
        />
        <h1 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Gestion du Stock
        </h1>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-soft animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stock.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valeur Stock</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stock.reduce((total, item) => total + (item.quantite * item.prixUnitaire), 0).toLocaleString()} FCFA
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stock.filter(item => item.quantite <= item.seuilAlerte).length}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tendance</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+12%</div>
            </CardContent>
          </Card>
        </div>

        {/* Liste du stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stock.map((item) => (
            <Card key={item.id} className={`shadow-soft animate-fade-in ${item.quantite <= item.seuilAlerte ? 'border-orange-200 bg-orange-50/50' : ''}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg">{item.nom}</CardTitle>
                <Package className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Quantité:</span>
                    <span className={`font-semibold ${item.quantite <= item.seuilAlerte ? 'text-orange-600' : ''}`}>
                      {item.quantite} unités
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Prix unitaire:</span>
                    <span className="font-semibold">{item.prixUnitaire.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Valeur totale:</span>
                    <span className="font-semibold">{(item.quantite * item.prixUnitaire).toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Catégorie:</span>
                    <span className="text-sm font-medium">{item.categorie}</span>
                  </div>
                  {item.quantite <= item.seuilAlerte && (
                    <div className="mt-2 p-2 bg-orange-100 rounded-md">
                      <p className="text-xs text-orange-700 font-medium">
                        ⚠️ Stock faible - Seuil d'alerte: {item.seuilAlerte}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default Stock;
