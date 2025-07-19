import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const ROLES = [
  { value: 'proprietaire', label: 'Propriétaire' },
  { value: 'chef-garagiste', label: 'Chef garagiste' },
  { value: 'technicien', label: 'Technicien' },
  { value: 'comptable', label: 'Comptable' },
];

const RegisterForm: React.FC<{ setMessage: (msg: string) => void; setTab: (tab: 'login' | 'register') => void }> = ({ setMessage, setTab }) => {
  const [registerData, setRegisterData] = useState({ email: '', password: '', role: ROLES[0].value });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    // 1. Créer l'utilisateur dans Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: registerData.email,
      password: registerData.password,
    });
    if (authError || !authData.user) {
      setMessage("Erreur lors de l'inscription : " + (authError?.message || '')); setLoading(false); return;
    }
    let avatar_url = '';
    // 2. Upload avatar si fourni
    if (avatarFile) {
      const { data: uploadData, error: uploadError } = await supabase.storage.from('avatars').upload(`public/${authData.user.id}`, avatarFile, { upsert: true });
      if (uploadError) {
        setMessage('Erreur upload avatar : ' + uploadError.message); setLoading(false); return;
      }
      avatar_url = supabase.storage.from('avatars').getPublicUrl(`public/${authData.user.id}`).data.publicUrl;
    }
    // 3. Créer le profil utilisateur
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      email: registerData.email,
      role: registerData.role,
      avatar_url,
    });
    if (profileError) {
      setMessage('Erreur création profil : ' + profileError.message); setLoading(false); return;
    }
    setMessage('Inscription réussie ! Vérifiez vos emails pour valider votre compte.');
    setTab('login');
    setLoading(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleRegister}>
      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          className="w-full input input-bordered"
          placeholder="Email"
          value={registerData.email}
          onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Mot de passe</label>
        <input
          type="password"
          className="w-full input input-bordered"
          placeholder="Mot de passe"
          value={registerData.password}
          onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Rôle</label>
        <select
          className="w-full input input-bordered"
          value={registerData.role}
          onChange={e => setRegisterData({ ...registerData, role: e.target.value })}
        >
          {ROLES.map(role => (
            <option key={role.value} value={role.value}>{role.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Avatar (optionnel)</label>
        <input type="file" accept="image/*" onChange={e => setAvatarFile(e.target.files?.[0] || null)} />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Inscription...' : "S'inscrire"}</Button>
    </form>
  );
};

export default RegisterForm;
