import React from 'react';
import UnifiedHeader from '@/components/UnifiedHeader';
import UnifiedFooter from '@/components/UnifiedFooter';
import AuthForm from '@/components/Auth/AuthForm';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Auth: React.FC = () => {
  useEffect(() => {
    // Vérifier la connexion à Supabase
    const checkSupabaseConnection = async () => {
      try {
        console.log('Vérification de la connexion Supabase...');
        const { data, error } = await supabase
          .from('organisations')
          .select('count')
          .eq('est_actif', true);

        if (error) {
          console.error('Erreur de connexion Supabase:', error);
        } else {
          console.log('Connexion Supabase OK, nombre d\'organisations:', data);
        }
      } catch (e) {
        console.error('Erreur lors de la vérification de la connexion:', e);
      }
    };

    checkSupabaseConnection();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <UnifiedHeader showUserMenu={false} showThemeToggle={true} />
      <main className="flex-grow flex items-center justify-center p-4">
          <AuthForm />
      </main>
      <UnifiedFooter />
    </div>
  );
};

export default Auth;
