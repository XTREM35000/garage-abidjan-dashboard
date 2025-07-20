import React, { useState, useEffect } from 'react';
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
import { User, Settings, LogOut, Shield, Database, RefreshCw, Trash2, Download, Upload } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { DemoService } from '@/integrations/supabase/demoService';

const UserMenu: React.FC = () => {
  const [user, setUser] = useState(() => {
    const auth = localStorage.getItem('auth');
    return auth ? JSON.parse(auth) : {
      name: 'Admin Demo',
      email: 'admin@garage.com',
      role: 'admin',
      avatar: null
    };
  });

  const { isDark } = useTheme();

  // Récupérer les données utilisateur mises à jour
  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const userData = JSON.parse(auth);
      setUser(userData);
    }
  }, []);

    // Fonction pour obtenir l'avatar utilisateur
  const getUserAvatar = () => {
    // Priorité 1: Avatar depuis l'auth (inscription)
    if (user.avatar) {
      return user.avatar;
    }

    // Priorité 2: Photo depuis le profil utilisateur
    const profileData = localStorage.getItem('userProfile');
    if (profileData) {
      const profile = JSON.parse(profileData);
      if (profile.photo_url) {
        return profile.photo_url;
      }
    }

    // Priorité 3: Photo depuis les données de démonstration
    const demoData = localStorage.getItem('demoUserData');
    if (demoData) {
      const demo = JSON.parse(demoData);
      if (demo.avatar) {
        return demo.avatar;
      }
    }

    // Aucune photo trouvée
    return null;
  };

  // Fonction pour obtenir le nom d'utilisateur
  const getUserName = () => {
    // Priorité 1: Nom depuis l'auth (inscription)
    if (user.name && user.name !== 'Admin Demo') {
      return user.name;
    }

    // Priorité 2: Nom depuis le profil utilisateur
    const profileData = localStorage.getItem('userProfile');
    if (profileData) {
      const profile = JSON.parse(profileData);
      if (profile.nom && profile.prenom) {
        return `${profile.nom} ${profile.prenom}`;
      }
    }

    // Priorité 3: Nom depuis les données de démonstration
    const demoData = localStorage.getItem('demoUserData');
    if (demoData) {
      const demo = JSON.parse(demoData);
      if (demo.name) {
        return demo.name;
      }
    }

    // Nom par défaut
    return user.name || 'Utilisateur';
  };

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

    const handleInjectDemoData = async () => {
    if (confirm('Voulez-vous injecter des données de démonstration dans la base de données ?')) {
      try {
        const result = await DemoService.injectDemoData();

        if (result.success) {
          alert('Données de démonstration injectées avec succès !');
          window.location.reload();
        } else {
          alert('Erreur lors de l\'injection des données : ' + result.error);
        }
      } catch (error) {
        alert('Erreur de connexion : ' + (error as Error).message);
      }
    }
  };

  const handleClearDemoData = async () => {
    if (confirm('Voulez-vous supprimer toutes les données de démonstration ? Cette action est irréversible.')) {
      try {
        const result = await DemoService.clearDemoData();

        if (result.success) {
          alert('Données de démonstration supprimées avec succès !');
          window.location.reload();
        } else {
          alert('Erreur lors de la suppression : ' + result.error);
        }
      } catch (error) {
        alert('Erreur de connexion : ' + (error as Error).message);
      }
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Avatar et menu utilisateur */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            {getUserAvatar() ? (
              <img
                src={getUserAvatar()}
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
              <p className="text-sm font-medium leading-none">{getUserName()}</p>
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
          <DropdownMenuItem onClick={handleInjectDemoData}>
            <Download className="mr-2 h-4 w-4" />
            <span>Injecter données démo</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleClearDemoData}>
            <Upload className="mr-2 h-4 w-4" />
            <span>Supprimer données démo</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleResetDemo}>
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Réinitialiser localStorage</span>
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
