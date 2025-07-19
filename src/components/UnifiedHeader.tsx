import React from 'react';
import { Car, Wrench, Zap, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import UserMenu from './UserMenu';

interface UnifiedHeaderProps {
  showUserMenu?: boolean;
  showThemeToggle?: boolean;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  showUserMenu = true,
  showThemeToggle = true
}) => {
  const { isDark, toggleTheme } = useTheme();

  // Récupérer les données du garage
  const garageData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('garageData') || '{}') : {};

  return (
    <header className={`w-full shadow-lg py-4 px-8 flex items-center justify-between animate-fade-in sticky top-0 z-40 transition-colors duration-500 ${
      isDark
        ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800'
        : 'bg-gradient-to-r from-orange-500 via-red-500 to-orange-600'
    }`}>
      <div className="flex items-center space-x-4">
        {/* Logo animé */}
        <div className="relative">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border transition-colors duration-500 ${
            isDark
              ? 'bg-white/10 backdrop-blur-sm border-white/20'
              : 'bg-white/20 backdrop-blur-sm border-white/30'
          }`}>
            <div className="relative">
              <Car className={`w-7 h-7 animate-pulse ${isDark ? 'text-white' : 'text-white'}`} />
              <div className="absolute -top-1 -right-1">
                <Wrench className={`w-4 h-4 animate-bounce ${isDark ? 'text-yellow-300' : 'text-yellow-300'}`} />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1">
            <Zap className={`w-3 h-3 animate-ping ${isDark ? 'text-yellow-400' : 'text-yellow-400'}`} />
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

      <div className="flex items-center space-x-4">
        {/* Indicateurs de statut (cachés sur mobile) */}
        <div className="hidden md:flex items-center space-x-4">
          <div className={`flex items-center space-x-2 rounded-lg px-3 py-1 border transition-colors duration-500 ${
            isDark
              ? 'bg-white/10 backdrop-blur-sm border-white/20'
              : 'bg-white/10 backdrop-blur-sm border-white/20'
          }`}>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-white font-medium">Système Opérationnel</span>
          </div>

          <div className={`flex items-center space-x-2 rounded-lg px-3 py-1 border transition-colors duration-500 ${
            isDark
              ? 'bg-white/10 backdrop-blur-sm border-white/20'
              : 'bg-white/10 backdrop-blur-sm border-white/20'
          }`}>
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span className="text-xs text-white font-medium">3 Interventions en cours</span>
          </div>
        </div>

        {/* Toggle de thème */}
        {showThemeToggle && (
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors duration-300 ${
              isDark
                ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}

        {/* Menu utilisateur */}
        {showUserMenu && <UserMenu />}
      </div>
    </header>
  );
};

export default UnifiedHeader;
