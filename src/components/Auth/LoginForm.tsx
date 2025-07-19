import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const LoginForm: React.FC<{ setMessage: (msg: string) => void }> = ({ setMessage }) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (
      user.email === loginData.email &&
      user.password === loginData.password
    ) {
      localStorage.setItem('auth', JSON.stringify(user));
      setMessage('Connexion réussie !');
      window.location.href = '/';
    } else {
      setMessage('Identifiants incorrects.');
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleLogin}>
      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          className="w-full input input-bordered"
          placeholder="Email"
          value={loginData.email}
          onChange={e => setLoginData({ ...loginData, email: e.target.value })}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Mot de passe</label>
        <input
          type="password"
          className="w-full input input-bordered"
          placeholder="Mot de passe"
          value={loginData.password}
          onChange={e => setLoginData({ ...loginData, password: e.target.value })}
        />
      </div>
      <Button type="submit" className="w-full">Se connecter</Button>
    </form>
  );
};

export default LoginForm;
