import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Building, UserPlus, Key, ImagePlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Organisation {
  id: string;
  nom: string;
  slug: string;
  // code: string; // Temporairement désactivé
}

interface RegisterFormProps {
  organisations: Organisation[];
  setTab: (tab: 'login' | 'register') => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ organisations, setTab }) => {
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    nom: '',
    role: 'employe',
  });
  const [selectedOrg, setSelectedOrg] = useState('');
  // const [orgCode, setOrgCode] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (!selectedOrg || !registerData.email || !registerData.password || !registerData.nom) {
        throw new Error('Tous les champs obligatoires doivent être remplis.');
      }

      const org = organisations.find(o => o.id === selectedOrg);
      if (!org) {
        throw new Error("Organisation non valide");
      }
      /* Temporairement désactivé
      if (org.code !== orgCode) {
        throw new Error('Code d\'organisation incorrect.');
      }
      */

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
      });

      if (signUpError) throw new Error(signUpError.message);
      if (!signUpData.user) throw new Error("Erreur lors de la création de l'utilisateur.");

      let avatar_url = '';
      if (avatarFile) {
        const filePath = `public/${signUpData.user.id}/${avatarFile.name}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile);
        if (uploadError) {
            console.warn("L'upload de l'avatar a échoué, mais l'inscription continue:", uploadError.message);
        } else {
            const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
            avatar_url = urlData.publicUrl;
        }
      }

      const { error: userError } = await supabase.from('users').insert({
        id: signUpData.user.id,
        email: registerData.email,
        nom: registerData.nom,
        role: registerData.role,
        organisation_id: selectedOrg,
        avatar_url: avatar_url,
      });

      if (userError) throw new Error(userError.message);

      toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      setTab('login');

    } catch (e: any) {
      setError(e.message || 'Une erreur est survenue.');
      toast.error(e.message || 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in">
        <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                    <img src={avatarPreview} alt="Aperçu de l'avatar" className="w-full h-full object-cover" />
                ) : (
                    <UserPlus className="w-10 h-10 text-gray-400" />
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="avatar-upload">Avatar</Label>
                <Input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} />
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="nom-register">Nom complet</Label>
            <Input id="nom-register" value={registerData.nom} onChange={(e) => setRegisterData({...registerData, nom: e.target.value})} placeholder="Ex: John Doe" required/>
        </div>

        <div className="space-y-2">
            <Label htmlFor="organisation-register">Organisation</Label>
            <Select value={selectedOrg} onValueChange={setSelectedOrg} required>
                <SelectTrigger id="organisation-register">
                    <SelectValue placeholder="Rejoindre une organisation" />
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
        <Label htmlFor="org-code-register">Code de l'organisation</Label>
        <Input id="org-code-register" type="password" value={orgCode} onChange={(e) => setOrgCode(e.target.value)} placeholder="Code secret de l'organisation" required/>
    </div>
    */}

    <div className="space-y-2">
        <Label htmlFor="email-register">Email</Label>
        <Input id="email-register" type="email" value={registerData.email} onChange={(e) => setRegisterData({...registerData, email: e.target.value})} placeholder="votre.email@exemple.com" required/>
        </div>

        <div className="space-y-2">
            <Label htmlFor="password-register">Mot de passe</Label>
            <Input id="password-register" type="password" value={registerData.password} onChange={(e) => setRegisterData({...registerData, password: e.target.value})} placeholder="Créez un mot de passe sécurisé" required/>
        </div>

        <div className="space-y-2">
            <Label htmlFor="role-register">Rôle</Label>
            <Select value={registerData.role} onValueChange={(role) => setRegisterData({...registerData, role})} required>
                <SelectTrigger id="role-register">
                    <SelectValue placeholder="Quel sera votre rôle ?" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="employe">Employé</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
            S'inscrire
        </Button>
    </form>
  );
};

export default RegisterForm;
