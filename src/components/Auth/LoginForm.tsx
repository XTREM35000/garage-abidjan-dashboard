import React, { useState } from 'react';
import { Alert } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label} from '@/components/ui/label';
import { handleLogin } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: authError } = await handleLogin(email, password);

      if (authError) throw authError;

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
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

      {import.meta.env.VITE_DEMO_MODE === 'true' && (
        <div className="text-sm text-muted-foreground text-center">
          Mode démo activé - la confirmation d'email est automatique
        </div>
      )}
    </form>
  );
};

export default LoginForm;
