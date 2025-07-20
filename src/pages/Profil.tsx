import React, { useEffect, useState } from 'react';
import UnifiedLayout from '@/layout/UnifiedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Profil: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) setUser(JSON.parse(auth));
  }, []);

  if (!user) {
    return (
      <UnifiedLayout>
        <div className="py-8 w-full max-w-md mx-auto">
          <Card className="shadow-soft animate-fade-in">
            <CardHeader>
              <CardTitle>Profil</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Aucun utilisateur connecté.</p>
            </CardContent>
          </Card>
        </div>
      </UnifiedLayout>
    );
  }

  return (
    <UnifiedLayout>
      <div className="py-8 w-full max-w-md mx-auto">
        <Card className="shadow-soft animate-fade-in">
          <CardHeader>
            <CardTitle>Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div><span className="font-medium">Email :</span> {user.email}</div>
              <div><span className="font-medium">Rôle :</span> {user.role}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UnifiedLayout>
  );
};

export default Profil;
