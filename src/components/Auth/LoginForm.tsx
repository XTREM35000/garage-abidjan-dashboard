import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Building, LogIn, Key } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Organisation {
  id: string;
  nom: string;
  slug: string;
  // code: string; // Temporairement désactivé
}

interface LoginFormProps {
  organisations: Organisation[];
}

const LoginForm: React.FC<LoginFormProps> = ({ organisations }) => {
  const [selectedOrg, setSelectedOrg] = useState('');
  // const [orgCode, setOrgCode] = useState('');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (!selectedOrg || !loginData.email || !loginData.password) {
        throw new Error('Tous les champs sont requis');
      }

      const org = organisations.find(o => o.id === selectedOrg);
      if (!org) {
        throw new Error("Organisation non valide");
      }
      /* Temporairement désactivé
      if (org.code !== orgCode) {
        throw new Error('Code d\'organisation incorrect');
      }
      */

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (authError) throw new Error(authError.message);

      await supabase.functions.invoke('set-organisation-context', { body: { organisationId: selectedOrg } });
      localStorage.setItem('selectedOrganisationSlug', org.slug);

      toast.success('Connexion réussie ! Redirection...');
      navigate('/dashboard');

    } catch (e: any) {
      setError(e.message || 'Une erreur est survenue.');
      toast.error(e.message || 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in">
      <div className="space-y-2">
        <Label htmlFor="organisation-login">Organisation</Label>
        <Select value={selectedOrg} onValueChange={setSelectedOrg} required>
          <SelectTrigger id="organisation-login">
            <SelectValue placeholder="Sélectionnez votre organisation" />
          </SelectTrigger>
          <SelectContent>
            {organisations.map(org => (
              <SelectItem key={org.id} value={org.id}>
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span>{org.nom}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/*
      <div className="space-y-2">
        <Label htmlFor="org-code-login">Code de l'organisation</Label>
        <Input
          id="org-code-login"
          type="password"
          value={orgCode}
          onChange={(e) => setOrgCode(e.target.value)}
          placeholder="Code d'accès secret"
          required
        />
      </div>
      */}

      <div className="space-y-2">
        <Label htmlFor="email-login">Email</Label>
        <Input
          id="email-login"
          type="email"
          value={loginData.email}
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          placeholder="votre.email@exemple.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password-login">Mot de passe</Label>
        <Input
          id="password-login"
          type="password"
          value={loginData.password}
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          placeholder="Votre mot de passe"
          required
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
        Se connecter
      </Button>
    </form>
  );
};

export default LoginForm;
