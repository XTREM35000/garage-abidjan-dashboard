import React, { useState } from 'react';
import { Alert } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label} from '@/components/ui/label';
import { signInWithEmail, resendConfirmation } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResendLink, setShowResendLink] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowResendLink(false);

    try {
      const { user, session, error } = await signInWithEmail(email, password);
      if (error) {
        if (error.includes('Email non confirmé')) {
          setShowResendLink(true);
        }
        setError(error);
        return;
      }
      if (session) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    try {
      setLoading(true);
      const { error } = await resendConfirmation(email);
      if (!error) {
        setError('');
        setShowResendLink(false);
        alert('Email de confirmation renvoyé !');
      } else {
        setError(error);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du renvoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <Alert variant="destructive">{error}</Alert>}

      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Mot de passe</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Connexion...' : 'Se connecter'}
      </Button>

      {showResendLink && (
        <div className="text-center">
          <Button
            variant="link"
            onClick={handleResendConfirmation}
            disabled={loading}
            className="text-sm"
          >
            Renvoyer l'email de confirmation
          </Button>
        </div>
      )}
    </form>
  );
};

export default LoginForm;