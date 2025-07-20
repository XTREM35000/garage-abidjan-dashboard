import React, { useState } from 'react';
import UnifiedLayout from '@/layout/UnifiedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, Clock, CheckCircle, AlertCircle, DollarSign, Plus, Camera, Eye, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import RepairForm from '@/components/RepairForm';
import { usePhotoEvidence } from '@/hooks/usePhotoEvidence';
import { needsPhotoEvidence } from '@/utils/photoEvidence';

const reparations = [
  {
    id: 1,
    vehicule: 'Toyota Corolla',
    client: 'Kouassi Jean',
    statut: 'En cours',
    description: 'Vidange + Filtres',
    prix: 45000,
    dateDebut: '2024-01-15',
    dateFin: '2024-01-16'
  },
  {
    id: 2,
    vehicule: 'Peugeot 206',
    client: 'Diabaté Fatou',
    statut: 'Terminé',
    description: 'Réparation freinage',
    prix: 125000,
    dateDebut: '2024-01-10',
    dateFin: '2024-01-12'
  },
  {
    id: 3,
    vehicule: 'Renault Logan',
    client: 'Traoré Ali',
    statut: 'En attente',
    description: 'Diagnostic moteur',
    prix: 25000,
    dateDebut: '2024-01-18',
    dateFin: null
  },
  {
    id: 4,
    vehicule: 'Hyundai i10',
    client: 'Yao Marie',
    statut: 'En cours',
    description: 'Remplacement embrayage',
    prix: 180000,
    dateDebut: '2024-01-14',
    dateFin: null
  },
  {
    id: 5,
    vehicule: 'Dacia Sandero',
    client: 'Koné Issouf',
    statut: 'Terminé',
    description: 'Révision complète',
    prix: 75000,
    dateDebut: '2024-01-08',
    dateFin: '2024-01-09'
  },
  {
    id: 6,
    vehicule: 'Suzuki Swift',
    client: 'Ouattara Aminata',
    statut: 'En attente',
    description: 'Réparation climatisation',
    prix: 95000,
    dateDebut: '2024-01-20',
    dateFin: null
  }
];

const getStatusIcon = (statut: string) => {
  switch (statut) {
    case 'En cours':
      return <Clock className="w-5 h-5 text-blue-500" />;
    case 'Terminé':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'En attente':
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    default:
      return <Wrench className="w-5 h-6 text-primary" />;
  }
};

const getStatusColor = (statut: string) => {
  switch (statut) {
    case 'En cours':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
    case 'Terminé':
      return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
    case 'En attente':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
  }
};

const Reparations: React.FC = () => {
  const { isDark } = useTheme();
  const [showRepairForm, setShowRepairForm] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<any>(null);
  const { hasPhotoEvidence, getPhotoEvidence } = usePhotoEvidence();

  const totalChiffreAffaires = reparations
    .filter(r => r.statut === 'Terminé')
    .reduce((sum, r) => sum + r.prix, 0);

  const reparationsEnCours = reparations.filter(r => r.statut === 'En cours').length;
  const reparationsTerminees = reparations.filter(r => r.statut === 'Terminé').length;
  const reparationsEnAttente = reparations.filter(r => r.statut === 'En attente').length;

  return (
    <UnifiedLayout>
      <div className="py-8 w-full">
        <img
          src="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80"
          alt="Réparations garage"
          className="w-full h-40 object-cover rounded-xl mb-6 shadow-soft animate-fade-in"
        />

        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Réparations
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {totalChiffreAffaires.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
            <Button
              onClick={() => setShowRepairForm(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Réparation
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className={`shadow-soft animate-fade-in ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>En cours</p>
                  <p className="text-2xl font-bold text-blue-500">{reparationsEnCours}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className={`shadow-soft animate-fade-in ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Terminées</p>
                  <p className="text-2xl font-bold text-green-500">{reparationsTerminees}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className={`shadow-soft animate-fade-in ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>En attente</p>
                  <p className="text-2xl font-bold text-yellow-500">{reparationsEnAttente}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className={`shadow-soft animate-fade-in ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total</p>
                  <p className="text-2xl font-bold text-purple-500">{reparations.length}</p>
                </div>
                <Wrench className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des réparations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reparations.map((r) => (
            <Card key={r.id} className={`shadow-soft animate-fade-in ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
              <CardHeader className="flex flex-row items-center gap-3">
                {getStatusIcon(r.statut)}
                <div className="flex-1">
                  <CardTitle className={`text-lg ${isDark ? 'text-white' : ''}`}>{r.vehicule}</CardTitle>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{r.client}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>Description :</strong> {r.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(r.statut)}`}>
                    {r.statut}
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {r.prix.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p>Début : {new Date(r.dateDebut).toLocaleDateString('fr-FR')}</p>
                  {r.dateFin && <p>Fin : {new Date(r.dateFin).toLocaleDateString('fr-FR')}</p>}
                </div>

                {/* Indicateur de preuves photo */}
                {needsPhotoEvidence({
                  id: r.id.toString(),
                  durationHours: 48, // Simuler une durée > 24h
                  type: r.description.toLowerCase(),
                  vehicleValue: 6000000, // Simuler un véhicule > 5M FCFA
                  client: { isBlacklisted: false }
                }) && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      {hasPhotoEvidence(r.id.toString()) ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <Camera className="w-4 h-4" />
                          <span className="text-xs">Photos capturées</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-yellow-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-xs">Photos requises</span>
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedRepair(r)}
                      className="text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Détails
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal de formulaire de réparation */}
      {showRepairForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <RepairForm
                onSubmit={(data, photoEvidence) => {
                  console.log('Nouvelle réparation:', data);
                  if (photoEvidence) {
                    console.log('Avec preuves photo:', photoEvidence);
                  }
                  setShowRepairForm(false);
                }}
                onCancel={() => setShowRepairForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de détails de réparation */}
      {selectedRepair && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Détails de la réparation</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRepair(null)}
                >
                  Fermer
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <strong>Client :</strong> {selectedRepair.client}
                </div>
                <div>
                  <strong>Véhicule :</strong> {selectedRepair.vehicule}
                </div>
                <div>
                  <strong>Description :</strong> {selectedRepair.description}
                </div>
                <div>
                  <strong>Prix :</strong> {selectedRepair.prix.toLocaleString('fr-FR')} FCFA
                </div>
                <div>
                  <strong>Statut :</strong> {selectedRepair.statut}
                </div>

                {/* Affichage des preuves photo si disponibles */}
                {hasPhotoEvidence(selectedRepair.id.toString()) && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">
                      📸 Preuves Photo Capturées
                    </h3>
                    <p className="text-sm text-green-700">
                      Les photos de documentation ont été enregistrées pour cette réparation.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </UnifiedLayout>
  );
};

export default Reparations;
