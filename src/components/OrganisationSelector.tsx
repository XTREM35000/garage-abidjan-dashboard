import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, ChevronDown } from 'lucide-react';
import { useOrganisation } from './OrganisationProvider';

interface Props {
  className?: string;
  showLabel?: boolean;
}

export const OrganisationSelector: React.FC<Props> = ({ 
  className = '', 
  showLabel = true 
}) => {
  const { currentOrg, organisations, isLoading, selectOrganisation } = useOrganisation();

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Building2 className="h-4 w-4 animate-pulse" />
        <span className="text-sm text-muted-foreground">Chargement...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showLabel && (
        <div className="flex items-center space-x-1">
          <Building2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Garage:</span>
        </div>
      )}
      
      <Select
        value={currentOrg?.id || ''}
        onValueChange={selectOrganisation}
      >
        <SelectTrigger className="min-w-[200px] bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <SelectValue placeholder="Sélectionner un garage" />
          <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
        </SelectTrigger>
        
        <SelectContent>
          {organisations.map((org) => (
            <SelectItem 
              key={org.id} 
              value={org.id}
              className="flex items-center space-x-2"
            >
              <div className="flex items-center space-x-2">
                {org.logo_url && (
                  <img 
                    src={org.logo_url} 
                    alt={org.nom}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                )}
                <span className="font-medium">{org.nom}</span>
                <span className="text-xs text-muted-foreground">
                  ({org.plan_abonnement})
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};