import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock } from 'lucide-react';
import { signInWithEmailConfirmationBypass } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await signInWithEmailConfirmationBypass(
        formData.email,
        formData.password
      );

      if (error) {
        // Handle special demo mode error
        if (error.message?.includes('EMAIL_NOT_CONFIRMED_DEMO')) {
          throw new Error('Email non confirmé. En mode démo, contactez l\'administrateur pour activer votre compte.');
        }
        throw error;
      }

      if (data.user) {
        toast.success('Connexion réussie !');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);

      // Messages d'erreur plus spécifiques
      let errorMessage = 'Erreur de connexion';
      if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Email non confirmé. Vérifiez votre boîte mail pour confirmer votre compte, ou contactez l\'administrateur en mode démo.';
      } else if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email ou mot de passe incorrect.';
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = 'Trop de tentatives de connexion. Veuillez réessayer plus tard.';
      } else if (error.message?.includes('Network')) {
        errorMessage = 'Problème de connexion réseau. Vérifiez votre connexion internet.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
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
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
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
            Connexion...
          </>
        ) : (
          'Se connecter'
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
