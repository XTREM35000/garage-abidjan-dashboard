import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthForm: React.FC = () => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [message, setMessage] = useState('');

  return (
    <Card className="shadow-soft animate-fade-in">
      <CardHeader>
        <CardTitle>
          <div className="flex gap-4">
            <button
              className={`pb-2 border-b-2 transition-all ${tab === 'login' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
              onClick={() => setTab('login')}
            >
              Connexion
            </button>
            <button
              className={`pb-2 border-b-2 transition-all ${tab === 'register' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
              onClick={() => setTab('register')}
            >
              Inscription
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tab === 'login' ? (
          <LoginForm setMessage={setMessage} />
        ) : (
          <RegisterForm setMessage={setMessage} setTab={setTab} />
        )}
        {message && <div className="mt-4 text-center text-sm text-primary animate-fade-in">{message}</div>}
      </CardContent>
    </Card>
  );
};

export default AuthForm;
