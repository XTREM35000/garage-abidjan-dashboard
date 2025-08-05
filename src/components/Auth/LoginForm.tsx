import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, AlertCircle, RefreshCw } from 'lucide-react';
import { signInWithEmail, resendConfirmation } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onSwitchToRegister?: () => void;
  onForgotPassword?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSwitchToRegister, 
  onForgotPassword 
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingConfirmation, setIsResendingConfirmation] = useState(false);
  const [error, setError] = useState('');
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setNeedsEmailConfirmation(false);

    try {
      const { user, session, error: authError } = await signInWithEmail(
        formData.email,
        formData.password
      );

      if (authError) {
        // Vérifier si c'est un problème de confirmation email
        if (authError.includes('confirmer votre email') || authError.includes('Email non confirmé')) {
          setNeedsEmailConfirmation(true);
          setError(authError);
          return;
        }
        
        setError(authError);
        return;
      }

      if (user && session) {
        toast.success('Connexion réussie !');
        
        // Redirection intelligente
        const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
        navigate(redirectTo);
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      setError('Une erreur inattendue s\'est produite. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!formData.email) {
      toast.error('Veuillez saisir votre email');
      return;
    }

    setIsResendingConfirmation(true);
    
    try {
      const { error } = await resendConfirmation(formData.email);
      
      if (error) {
        toast.error(error);
      } else {
        toast.success('Email de confirmation renvoyé ! Vérifiez votre boîte mail.');
        setNeedsEmailConfirmation(false);
        setError('');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'email de confirmation');
    } finally {
      setIsResendingConfirmation(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Connexion
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Connectez-vous à votre compte
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {needsEmailConfirmation && (
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Votre email n'est pas encore confirmé.</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResendConfirmation}
                disabled={isResendingConfirmation}
              >
                {isResendingConfirmation ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                Renvoyer
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-10"
              placeholder="votre.email@example.com"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            {onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Mot de passe oublié ?
              </button>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="pl-10"
              placeholder="Votre mot de passe"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connexion en cours...
            </>
          ) : (
            'Se connecter'
          )}
        </Button>

        {onSwitchToRegister && (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
              >
                Créer un compte
              </button>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
