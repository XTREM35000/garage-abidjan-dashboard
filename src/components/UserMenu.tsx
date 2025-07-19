import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  Bell,
  Shield,
  HelpCircle,
  BarChart3,
  Upload
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const UserMenu: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Récupérer les données utilisateur depuis localStorage
  const userData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};

  const user = {
    name: userData.name || 'Thierry Gogo',
    email: userData.email || 'thierry@garage-abidjan.com',
    role: userData.role || 'Propriétaire',
    avatar: avatarPreview || userData.avatar || null
  };

  const handleLogout = () => {
    // Logique de déconnexion Supabase
    localStorage.removeItem('garageData');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        // Sauvegarder l'avatar dans localStorage
        const updatedUser = { ...userData, avatar: result };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-start space-x-3 p-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">Nouvelle intervention</p>
              <p className="text-xs text-gray-500">Véhicule Toyota Corolla en attente</p>
              <p className="text-xs text-gray-400">Il y a 5 minutes</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-start space-x-3 p-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">Stock faible</p>
              <p className="text-xs text-gray-500">Filtres à huile en rupture</p>
              <p className="text-xs text-gray-400">Il y a 1 heure</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-start space-x-3 p-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">Intervention terminée</p>
              <p className="text-xs text-gray-500">Honda Civic prête</p>
              <p className="text-xs text-gray-400">Il y a 2 heures</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Toggle Theme */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="hidden md:flex"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </Button>

      {/* User Menu */}
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
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
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
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600 font-medium">{user.role}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link to="/dashboard" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/profil" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Mon Profil</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/aide" className="flex items-center">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Aide</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
