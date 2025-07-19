import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export function Navbar() {
  const isMobile = useIsMobile();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) setUser(JSON.parse(auth));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth');
    window.location.href = '/auth';
  };

  const handleDeleteAll = () => {
    localStorage.clear();
    window.location.href = '/auth';
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="container flex h-16 items-center justify-between pl-4 md:pl-8 pr-2 md:pr-6">
        {/* Logo automobile expressif */}
        <Link to="/" className="flex items-center gap-3 font-bold">
          <img src="https://cdn-icons-png.flaticon.com/512/743/743131.png" alt="Logo auto" className="w-8 h-8" />
          <span>GarageManager</span>
        </Link>

        {/* Menu principal - Desktop */}
        {!isMobile && (
          <NavigationMenu>
            <NavigationMenuList className="flex gap-6 md:gap-8">
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Accueil
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/dashboard">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Tableau de bord
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Clients
                    </NavigationMenuLink>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <Link to="/clients/liste">
                      <DropdownMenuItem>Liste des clients</DropdownMenuItem>
                    </Link>
                    <Link to="/clients/ajouter">
                      <DropdownMenuItem>Ajouter un client</DropdownMenuItem>
                    </Link>
                    <Link to="/clients/historique">
                      <DropdownMenuItem>Historique</DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/vehicules">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Véhicules
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/reparations">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Réparations
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/stock">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Stock
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/a-propos">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    À propos
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/aide">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Aide
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/connexion">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Connexion
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}

        {/* Menu Admin à droite si connecté */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground font-medium shadow-soft hover:bg-primary/90 transition-all">
                <img src="https://cdn-icons-png.flaticon.com/512/743/743131.png" alt="Profil" className="w-6 h-6 rounded-full" />
                <span>{user.role}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link to="/profil">
                <DropdownMenuItem>Profil</DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={handleLogout}>Se déconnecter</DropdownMenuItem>
              {user.role === 'proprietaire' && (
                <DropdownMenuItem onClick={handleDeleteAll} className="text-destructive">Delete All</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Mobile menu toggle */}
        {isMobile && (
          <button className="p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
