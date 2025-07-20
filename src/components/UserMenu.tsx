import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, User, Settings, LogOut, Shield, Database, RefreshCw, Trash2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const UserMenu: React.FC = () => {
  const [user] = useState(() => {
    const auth = localStorage.getItem('auth');
    return auth ? JSON.parse(auth) : {
      name: 'Admin Demo',
      email: 'admin@garage.com',
      role: 'admin',
      avatar: null
    };
  });

  const { isDark } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('garageData');
    window.location.href = '/';
  };

  const handleResetDemo = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données de démonstration ?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleClearData = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer toutes les données ? Cette action est irréversible.')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Notifications */}
      <Button variant="ghost" size="sm" className="relative">
        <Bell className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
          3
        </span>
      </Button>

      {/* Avatar et menu utilisateur */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Menu principal */}
          <DropdownMenuItem asChild>
            <Link to="/profil" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Mon Profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Sous-menu Admin (pour démo) */}
          <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
            ADMIN
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link to="/dashboard" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              <span>Tableau de bord</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/clients/liste" className="flex items-center">
              <Database className="mr-2 h-4 w-4" />
              <span>Gestion clients</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleResetDemo}>
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Réinitialiser démo</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleClearData} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Supprimer toutes les données</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
