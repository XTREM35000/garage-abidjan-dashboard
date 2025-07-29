import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Building, LogIn, UserPlus, Key, User, Shield, Plus, ImagePlus, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface Organisation {
  id: string;
  nom: string;
  slug: string;
  // code: string; // Temporairement désactivé
}

const AuthForm: React.FC = () => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadOrganisations();
  }, []);

  const loadOrganisations = async () => {
    setLoadingOrgs(true);
    try {
      console.log('Chargement des organisations...');

      // Première tentative : avec le filtre est_actif
      const { data: orgsData, error: orgsError } = await supabase
        .from('organisations')
        .select('id, nom, slug') // Retrait de 'code'
        .eq('est_actif', true)
        .order('nom');

      console.log('Résultat de la requête:', { orgsData, orgsError });

      // Si pas de résultats, essayer sans le filtre pour déboguer
      if (!orgsData || orgsData.length === 0) {
        console.log('Tentative sans filtre est_actif...');
        const { data: allOrgsData, error: allOrgsError } = await supabase
          .from('organisations')
          .select('id, nom, slug')
          .order('nom');

        console.log('Résultat sans filtre:', { allOrgsData, allOrgsError });

        if (allOrgsError) {
          console.error('Erreur Supabase (sans filtre):', allOrgsError);
          throw allOrgsError;
        }

        if (allOrgsData && allOrgsData.length > 0) {
          console.log('Organisations trouvées sans filtre:', allOrgsData.length);
          setOrganisations(allOrgsData);
          setMessage('');
          return;
        }
      }

      if (orgsError) {
        console.error('Erreur Supabase:', orgsError);
        throw orgsError;
      }

      // Vérifier si les données sont nulles ou vides
      if (!orgsData || orgsData.length === 0) {
        console.log('Aucune organisation trouvée');
        setOrganisations([]);
        setMessage("Aucune organisation n'a été trouvée. Veuillez en créer une.");
      } else {
        console.log(`${orgsData.length} organisations trouvées`);
        setOrganisations(orgsData);
        setMessage(''); // Effacer le message s'il y a des organisations
      }
    } catch (e: any) {
      console.error('Erreur lors du chargement des organisations:', e);
      setError('Erreur lors du chargement des organisations: ' + (e.message || 'Erreur inconnue'));
      setOrganisations([]); // S'assurer que le tableau est vide en cas d'erreur
    } finally {
      setLoadingOrgs(false);
    }
  };

  const handleCreateOrganisation = () => {
    navigate('/create-organisation');
  };

  // Afficher l'état de chargement
  if (loadingOrgs) {
    return (
      <div className="w-full max-w-md text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <p className="mt-2 text-sm text-gray-600">Chargement des organisations...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
       <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Accès Sécurisé</h1>
          <p className="text-gray-600">
            {organisations.length > 0
              ? 'Rejoignez votre espace de travail ou créez un nouveau compte.'
              : 'Aucune organisation trouvée. Cliquez ci-dessous pour créer la première.'}
          </p>
        </div>
    <Card className="shadow-soft animate-fade-in">
      {organisations.length > 0 ? (
        <>
          <CardHeader>
            <CardTitle>
              <Tabs value={tab} onValueChange={(value) => setTab(value as 'login' | 'register')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Connexion
                  </TabsTrigger>
                  <TabsTrigger value="register">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Inscription
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TabsContent value={tab} className="m-0">
              {tab === 'login' ? (
                <LoginForm organisations={organisations} />
              ) : (
                <RegisterForm organisations={organisations} setTab={setTab}/>
              )}
            </TabsContent>
          </CardContent>
        </>
      ) : (
        <CardContent className="text-center space-y-4 p-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Building className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 font-semibold text-lg">
            Aucune organisation n'existe encore.
          </p>
          <Button onClick={() => window.location.href = '/create-organisation'} size="lg" className="w-full text-lg py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="mr-2 h-5 w-5" /> Créer une organisation
          </Button>
        </CardContent>
      )}
      {message && <div className="mt-4 text-center text-sm text-green-600 animate-fade-in">{message}</div>}
      {error && <div className="mt-4 text-center text-sm text-red-600 animate-fade-in">{error}</div>}
    </Card>
    </div>
  );
};

export default AuthForm;
