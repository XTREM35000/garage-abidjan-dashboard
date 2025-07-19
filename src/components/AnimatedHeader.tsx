import React, { useState, useEffect } from 'react';
import { Car, Wrench, Zap, Settings, Activity } from 'lucide-react';

const AnimatedHeader: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [garageData, setGarageData] = useState<any>({});

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const stored = localStorage.getItem('garageData');
    if (stored) {
      setGarageData(JSON.parse(stored));
    }
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative bg-gradient-to-r from-primary via-primary/90 to-secondary shadow-2xl overflow-hidden">
      {/* Fond animé */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-ping" />
        <div className="absolute top-32 right-16 w-16 h-16 bg-white/5 rounded-full animate-pulse" />
        <div className="absolute bottom-8 left-1/3 w-12 h-12 bg-white/8 rounded-full animate-bounce" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo et informations garage */}
          <div className="flex items-center space-x-6">
            {/* Logo animé */}
            <div className="relative group">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl border border-white/30 transition-all duration-500 hover:scale-110 hover:rotate-3">
                <div className="relative">
                  <Car className="w-8 h-8 text-white animate-pulse" />
                  <div className="absolute -top-1 -right-1">
                    <Wrench className="w-5 h-5 text-yellow-300 animate-bounce" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2">
                <Zap className="w-4 h-4 text-yellow-400 animate-ping" />
              </div>
            </div>

            {/* Informations du garage */}
            <div className="flex flex-col space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg transition-all duration-300 hover:scale-105">
                {garageData.name || 'Garage Abidjan'}
              </h1>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                  <span className="text-sm text-white/90 font-medium">
                    Système Opérationnel
                  </span>
                </div>
                <span className="text-white/60">•</span>
                <span className="text-sm text-white/80">
                  {garageData.owner || 'Excellence Automobile'}
                </span>
              </div>
            </div>
          </div>

          {/* Indicateurs de statut et heure */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20 shadow-lg">
                <Activity className="w-4 h-4 text-white" />
                <span className="text-sm text-white font-medium">3 Interventions</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20 shadow-lg">
                <Settings className="w-4 h-4 text-white animate-spin-slow" />
                <span className="text-sm text-white font-medium">En service</span>
              </div>
            </div>

            {/* Horloge */}
            <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 border border-white/30 shadow-lg">
              <div className="text-center">
                <div className="text-lg font-mono font-bold text-white">
                  {currentTime.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
                <div className="text-xs text-white/80">
                  {currentTime.toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AnimatedHeader;