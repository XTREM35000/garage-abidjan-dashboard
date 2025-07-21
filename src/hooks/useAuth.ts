import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'superadmin' | 'admin' | 'manager' | 'technicien' | 'employe';
  organisation_id?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.email!);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.email!);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userEmail: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, nom, prenom, role, organisation_id')
        .eq('email', userEmail)
        .single();

      if (error) {
        console.warn('User profile not found in database:', error);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    // Nettoyer le localStorage
    localStorage.removeItem('selectedOrganisationSlug');
  };

  return {
    user,
    profile,
    isLoading,
    signOut,
    isAuthenticated: !!user,
    hasOrganisation: !!profile?.organisation_id,
    role: profile?.role || 'employe'
  };
};