import { useOrganisation } from '@/components/OrganisationProvider';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useSupabaseQuery = () => {
  const { currentOrg } = useOrganisation();
  const { role } = useAuth();

  const createQuery = (tableName: string) => {
    const query = supabase.from(tableName);
    
    // Inject organisation_id filter for non-superadmin users
    if (role !== 'superadmin' && currentOrg?.id) {
      return {
        ...query,
        select: (columns = '*') => query.select(columns).eq('organisation_id', currentOrg.id),
        insert: (values: any) => query.insert({ ...values, organisation_id: currentOrg.id }),
        update: (values: any) => query.update(values).eq('organisation_id', currentOrg.id),
        delete: () => query.delete().eq('organisation_id', currentOrg.id),
        upsert: (values: any) => query.upsert({ ...values, organisation_id: currentOrg.id })
      };
    }

    return query;
  };

  return { createQuery, organisationId: currentOrg?.id };
};