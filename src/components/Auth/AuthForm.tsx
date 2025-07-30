import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Building, LogIn, UserPlus, Key, User, Shield, Plus, ImagePlus, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

// Simplified auth form without organization dependency

const AuthForm: React.FC = () => {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Accès Sécurisé</h1>
        <p className="text-gray-600">
          Connectez-vous à votre compte ou créez-en un nouveau.
        </p>
      </div>

      <Card className="shadow-soft animate-fade-in">
        <CardHeader>
          <CardTitle>
            <Tabs value={tab} onValueChange={(value) => setTab(value as 'login' | 'register')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Connexion
                </TabsTrigger>
                <TabsTrigger value="register">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Inscription
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TabsContent value={tab} className="m-0">
            {tab === 'login' ? (
              <LoginForm />
            ) : (
              <RegisterForm setTab={setTab} />
            )}
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
