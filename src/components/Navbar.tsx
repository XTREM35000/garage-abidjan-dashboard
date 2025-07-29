import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Users,
  Car,
  Wrench,
  Package,
  Settings,
  User,
  BarChart3,
  Plus
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const { role } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      roles: ['superadmin', 'admin', 'manager', 'technicien', 'employe']
    },
    {
      name: 'Clients',
      href: '/clients/liste',
      icon: Users,
      roles: ['superadmin', 'admin', 'manager', 'technicien', 'employe']
    },
    {
      name: 'Ajouter Client',
      href: '/clients/ajouter',
      icon: Plus,
      roles: ['superadmin', 'admin', 'manager']
    },
    {
      name: 'Véhicules',
      href: '/vehicules',
      icon: Car,
      roles: ['superadmin', 'admin', 'manager', 'technicien', 'employe']
    },
    {
      name: 'Réparations',
      href: '/reparations',
      icon: Wrench,
      roles: ['superadmin', 'admin', 'manager', 'technicien']
    },
    {
      name: 'Stock',
      href: '/stock',
      icon: Package,
      roles: ['superadmin', 'admin', 'manager']
    },
    {
      name: 'Rapports',
      href: '/reports',
      icon: BarChart3,
      roles: ['superadmin', 'admin', 'manager']
    },
    {
      name: 'Profil',
      href: '/profil',
      icon: User,
      roles: ['superadmin', 'admin', 'manager', 'technicien', 'employe']
    },
    {
      name: 'Paramètres',
      href: '/settings',
      icon: Settings,
      roles: ['superadmin', 'admin']
    }
  ];

  const filteredItems = navigationItems.filter(item =>
    item.roles.includes(role)
  );

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200',
                      isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    )
                  }
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
