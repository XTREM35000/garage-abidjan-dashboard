import React from 'react';
import { Car, Wrench, Zap } from 'lucide-react';

const Header: React.FC = () => {
  // On pourrait récupérer le nom du garage via localStorage ou props/context
  const garageData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('garageData') || '{}') : {};

  return (
    <header className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 shadow-lg py-4 px-8 flex items-center justify-between animate-fade-in sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        {/* Logo animé */}
        <div className="relative">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
            <div className="relative">
              <Car className="w-7 h-7 text-white animate-pulse" />
              <div className="absolute -top-1 -right-1">
                <Wrench className="w-4 h-4 text-yellow-300 animate-bounce" />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1">
            <Zap className="w-3 h-3 text-yellow-400 animate-ping" />
          </div>
        </div>

        {/* Titre et sous-titre */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg">
            {garageData.name ? garageData.name : 'Garage Abidjan'}
          </h1>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <p className="text-sm text-white/90 font-medium">
              Excellence Automobile
            </p>
            <span className="text-xs text-white/70">•</span>
            <p className="text-xs text-white/70">
              Depuis 2010
            </p>
          </div>
        </div>
      </div>

      {/* Indicateurs de statut */}
      <div className="hidden md:flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-white font-medium">Système Opérationnel</span>
        </div>

        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20">
          <div className="w-2 h-2 bg-blue-400 rounded-full" />
          <span className="text-xs text-white font-medium">3 Interventions en cours</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
