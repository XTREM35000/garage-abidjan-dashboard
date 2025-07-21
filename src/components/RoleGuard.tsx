import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  allowedRoles: Array<'superadmin' | 'admin' | 'manager' | 'technicien' | 'employe'>;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<Props> = ({ 
  children, 
  allowedRoles, 
  fallback 
}) => {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!allowedRoles.includes(role)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <Alert variant="destructive">
        <Lock className="h-4 w-4" />
        <AlertDescription>
          Vous n'avez pas les permissions nécessaires pour accéder à cette section.
          Rôle requis: {allowedRoles.join(', ')}
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};