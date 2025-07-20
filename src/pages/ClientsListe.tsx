import React, { useState } from 'react';
import UnifiedLayout from '@/layout/UnifiedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Phone, Mail, MapPin, Car, Calendar, DollarSign, Plus } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import ClientForm from '@/components/ClientForm';

const clients = [
  {
    id: 1,
    name: 'Kouassi Jean',
    phone: '+225 07 58 96 61 56',
    email: 'kouassi.jean@gmail.com',
    adresse: 'Cocody, Abidjan',
    vehicules: ['Toyota Corolla 2018', 'Peugeot 206 2015'],
    derniereVisite: '2024-01-15',
    totalDepense: 450000,
    statut: 'Actif'
  },
  {
    id: 2,
    name: 'Diabaté Fatou',
    phone: '+225 05 42 18 73 29',
    email: 'diabate.fatou@yahoo.fr',
    adresse: 'Marcory, Abidjan',
    vehicules: ['Peugeot 206 2017'],
    derniereVisite: '2024-01-12',
    totalDepense: 125000,
    statut: 'Actif'
  },
  {
    id: 3,
    name: 'Traoré Ali',
    phone: '+225 06 33 45 67 89',
    email: 'traore.ali@hotmail.com',
    adresse: 'Plateau, Abidjan',
    vehicules: ['Renault Logan 2019'],
    derniereVisite: '2024-01-18',
    totalDepense: 25000,
    statut: 'Nouveau'
  },
  {
    id: 4,
    name: 'Yao Marie',
    phone: '+225 07 12 34 56 78',
    email: 'yao.marie@gmail.com',
    adresse: 'Yopougon, Abidjan',
    vehicules: ['Hyundai i10 2020'],
    derniereVisite: '2024-01-14',
    totalDepense: 180000,
    statut: 'Actif'
  },
  {
    id: 5,
    name: 'Koné Issouf',
    phone: '+225 05 67 89 12 34',
    email: 'kone.issouf@yahoo.fr',
    adresse: 'Adjamé, Abidjan',
    vehicules: ['Dacia Sandero 2016'],
    derniereVisite: '2024-01-09',
    totalDepense: 75000,
    statut: 'Actif'
  },
  {
    id: 6,
    name: 'Ouattara Aminata',
    phone: '+225 06 98 76 54 32',
    email: 'ouattara.aminata@gmail.com',
    adresse: 'Treichville, Abidjan',
    vehicules: ['Suzuki Swift 2021'],
    derniereVisite: '2024-01-20',
    totalDepense: 95000,
    statut: 'Nouveau'
  },
  {
    id: 7,
    name: 'Bamba Souleymane',
    phone: '+225 07 45 67 89 12',
    email: 'bamba.souleymane@hotmail.com',
    adresse: 'Bingerville',
    vehicules: ['Toyota Hilux 2018'],
    derniereVisite: '2024-01-10',
    totalDepense: 320000,
    statut: 'VIP'
  },
  {
    id: 8,
    name: 'Coulibaly Aïcha',
    phone: '+225 05 23 45 67 89',
    email: 'coulibaly.aicha@gmail.com',
    adresse: 'Grand-Bassam',
    vehicules: ['Renault Clio 2019'],
    derniereVisite: '2024-01-08',
    totalDepense: 89000,
    statut: 'Actif'
  }
];

const getStatusColor = (statut: string) => {
  switch (statut) {
    case 'VIP':
      return 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300';
    case 'Actif':
      return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
    case 'Nouveau':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
  }
};

const ClientsListe: React.FC = () => {
  const { isDark } = useTheme();
  const [showClientForm, setShowClientForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const totalClients = clients.length;
  const clientsActifs = clients.filter(c => c.statut === 'Actif').length;
  const clientsVIP = clients.filter(c => c.statut === 'VIP').length;
  const totalChiffreAffaires = clients.reduce((sum, client) => sum + client.totalDepense, 0);

  return (
    <UnifiedLayout>
      <div className="py-8 w-full">
        <img
          src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80"
          alt="Clients garage"
          className="w-full h-40 object-cover rounded-xl mb-6 shadow-soft animate-fade-in"
        />

        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Gestion des Clients
          </h1>
          <Button
            onClick={() => setShowClientForm(true)}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un client
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className={`shadow-soft animate-fade-in ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total clients</p>
                  <p className="text-2xl font-bold text-blue-500">{totalClients}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className={`shadow-soft animate-fade-in ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Clients actifs</p>
                  <p className="text-2xl font-bold text-green-500">{clientsActifs}</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className={`shadow-soft animate-fade-in ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Clients VIP</p>
                  <p className="text-2xl font-bold text-purple-500">{clientsVIP}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className={`shadow-soft animate-fade-in ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Chiffre d'affaires</p>
                  <p className="text-xl font-bold text-green-500">
                    {(totalChiffreAffaires / 1000).toFixed(0)}k FCFA
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des clients */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Card key={client.id} className={`shadow-soft animate-fade-in ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-lg ${isDark ? 'text-white' : ''}`}>{client.name}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.statut)}`}>
                    {client.statut}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {client.phone}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {client.email}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {client.adresse}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Car className="w-4 h-4 text-gray-500" />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {client.vehicules.length} véhicule(s)
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Dernière visite : {new Date(client.derniereVisite).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Total dépensé :
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {client.totalDepense.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal d'ajout de client */}
      <ClientForm
        isOpen={showClientForm}
        onClose={() => setShowClientForm(false)}
        onSubmit={(data) => {
          console.log('Nouveau client:', data);
          setIsLoading(true);

          // Simuler l'ajout du client
          setTimeout(() => {
            setIsLoading(false);
            setShowClientForm(false);
            // Ici on pourrait ajouter le client à la liste
            console.log('Client ajouté avec succès!');
          }, 1500);
        }}
        isLoading={isLoading}
      />
    </UnifiedLayout>
  );
};

export default ClientsListe;
