import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';

const ClientsAjouter: React.FC = () => (
  <MainLayout>
    <div className="py-8 w-full max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6">Ajouter un client</h1>
      <form className="space-y-4 bg-card p-6 rounded-xl shadow-soft animate-fade-in">
        <div>
          <label className="block mb-1 font-medium">Nom</label>
          <input type="text" className="w-full input input-bordered" placeholder="Nom du client" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Téléphone</label>
          <input type="tel" className="w-full input input-bordered" placeholder="Téléphone" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input type="email" className="w-full input input-bordered" placeholder="Email" />
        </div>
        <Button type="submit" className="w-full">Ajouter</Button>
      </form>
    </div>
  </MainLayout>
);

export default ClientsAjouter;
