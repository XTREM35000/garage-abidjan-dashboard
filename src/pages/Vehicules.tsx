import React, { useState } from 'react';
import UnifiedLayout from '@/layout/UnifiedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Plus } from 'lucide-react';
import VehicleForm, { VehicleData } from '@/components/VehicleForm';

const vehicules = [
  { id: 1, marque: 'Peugeot', modele: '208', immatriculation: 'AB-123-CD' },
  { id: 2, marque: 'Renault', modele: 'Clio', immatriculation: 'EF-456-GH' },
  { id: 3, marque: 'Toyota', modele: 'Yaris', immatriculation: 'IJ-789-KL' },
];

const Vehicules: React.FC = () => {
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddVehicle = async (vehicleData: VehicleData) => {
    setIsLoading(true);

    try {
      // Simulation d'un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Nouveau véhicule ajouté:', vehicleData);

      // Ici, vous pourriez ajouter la logique pour sauvegarder dans la base de données
      // Pour l'instant, on simule juste l'ajout

      // Fermer le modal après l'ajout
      setShowVehicleForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du véhicule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UnifiedLayout>
      <div className="py-8 w-full">
        <img
          src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Véhicules garage"
          className="w-full h-40 object-cover rounded-xl mb-6 shadow-soft animate-fade-in"
        />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Véhicules</h1>
          <Button
            onClick={() => setShowVehicleForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un Véhicule
          </Button>
        </div>

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

        {/* Modal pour ajouter un véhicule */}
        <VehicleForm
          isOpen={showVehicleForm}
          onClose={() => setShowVehicleForm(false)}
          onSubmit={handleAddVehicle}
        />
      </div>
    </UnifiedLayout>
  );
};

export default Vehicules;
