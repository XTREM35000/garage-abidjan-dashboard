import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AuthConfirm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Récupérer les paramètres de l'URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        const email = searchParams.get('email');

        if (!token || type !== 'signup') {
          setStatus('error');
          setMessage('Lien de confirmation invalide ou expiré.');
          return;
        }

        // Vérifier le token avec Supabase
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email'
        });

        if (error) {
          console.error('Erreur confirmation email:', error);
          
          if (error.message.includes('expired')) {
            setStatus('expired');
            setMessage('Le lien de confirmation a expiré. Vous pouvez demander un nouveau lien.');
          } else {
            setStatus('error');
            setMessage('Erreur lors de la confirmation de votre email. Veuillez réessayer.');
          }
          return;
        }

        if (data.user) {
          setStatus('success');
          setMessage('Votre email a été confirmé avec succès ! Vous pouvez maintenant vous connecter.');
          
          // Redirection automatique vers la page de connexion après 3 secondes
          setTimeout(() => {
            navigate('/auth?confirmed=true');
          }, 3000);
        }

      } catch (error) {
        console.error('Erreur inattendue:', error);
        setStatus('error');
        setMessage('Une erreur inattendue s\'est produite.');
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  const handleGoToLogin = () => {
    navigate('/auth?confirmed=true');
  };

  const handleResendConfirmation = () => {
    navigate('/auth?resend=true');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center">
            {status === 'loading' && (
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            )}
            {status === 'success' && (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            )}
            {(status === 'error' || status === 'expired') && (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            )}
          </div>
          
          <CardTitle className="text-2xl font-bold">
            {status === 'loading' && 'Confirmation en cours...'}
            {status === 'success' && 'Email confirmé !'}
            {status === 'error' && 'Erreur de confirmation'}
            {status === 'expired' && 'Lien expiré'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert variant={status === 'success' ? 'default' : 'destructive'}>
            <Mail className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>

          {status === 'success' && (
            <div className="space-y-4">
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Redirection automatique dans 3 secondes...
              </div>
              
              <Button 
                onClick={handleGoToLogin}
                className="w-full"
              >
                Se connecter maintenant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {status === 'expired' && (
            <div className="space-y-4">
              <Button 
                onClick={handleResendConfirmation}
                className="w-full"
                variant="outline"
              >
                Demander un nouveau lien
                <Mail className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                onClick={handleGoToLogin}
                className="w-full"
                variant="ghost"
              >
                Retour à la connexion
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <Button 
                onClick={handleGoToLogin}
                className="w-full"
              >
                Retour à la connexion
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Veuillez patienter pendant que nous confirmons votre email...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthConfirm;