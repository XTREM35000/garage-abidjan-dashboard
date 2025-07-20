import React from 'react';
import UnifiedLayout from '@/layout/UnifiedLayout';

const historique = [
  { id: 1, client: 'Jean Dupont', action: 'Ajouté', date: '2024-05-01' },
  { id: 2, client: 'Fatou Diop', action: 'Mis à jour', date: '2024-05-03' },
  { id: 3, client: 'Ali Traoré', action: 'Supprimé', date: '2024-05-05' },
];

const ClientsHistorique: React.FC = () => (
  <UnifiedLayout>
    <div className="py-8 w-full max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Historique des clients</h1>
      <ul className="bg-card rounded-xl shadow-soft divide-y animate-fade-in">
        {historique.map((event) => (
          <li key={event.id} className="p-4 flex justify-between items-center">
            <span>{event.client}</span>
            <span className="text-muted-foreground">{event.action} le {event.date}</span>
          </li>
        ))}
      </ul>
    </div>
      </UnifiedLayout>
  );

export default ClientsHistorique;
