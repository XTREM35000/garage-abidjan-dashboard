import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Car, Eye, EyeOff, Loader2, Upload, User } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    garageName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulation de connexion/inscription
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Stocker les données utilisateur avec avatar
      const userData = {
        name: formData.name || 'Thierry Gogo',
        email: formData.email,
        role: 'Propriétaire',
        garageName: formData.garageName || 'Garage Abidjan',
        avatar: avatarPreview // Inclure l'avatar
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('garageData', JSON.stringify({
        name: userData.garageName,
        owner: userData.name
      }));

      // Rediriger vers le dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Garage Abidjan
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Connexion à votre espace' : 'Créer votre compte'}
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isLogin ? 'Connexion' : 'Inscription'}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? 'Accédez à votre tableau de bord'
                : 'Créez votre compte garage'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  {/* Upload Avatar */}
                  <div className="space-y-2">
                    <Label>Photo de profil</Label>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="Avatar preview"
                            className="w-16 h-16 rounded-full object-cover border-2 border-orange-200"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center border-2 border-orange-200">
                            <User className="w-8 h-8 text-white" />
                          </div>
                        )}
                        <label
                          htmlFor="avatar-upload"
                          className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors"
                        >
                          <Upload className="w-3 h-3 text-white" />
                        </label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          {avatarFile ? avatarFile.name : 'Aucun fichier sélectionné'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Formats acceptés: JPG, PNG, GIF (max 2MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Votre nom complet"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={!isLogin}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="garageName">Nom du garage</Label>
                    <Input
                      id="garageName"
                      name="garageName"
                      type="text"
                      placeholder="Nom de votre garage"
                      value={formData.garageName}
                      onChange={handleInputChange}
                      required={!isLogin}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Votre mot de passe"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirmez votre mot de passe"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required={!isLogin}
                  />
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isLogin ? 'Connexion...' : 'Création...'}
                  </>
                ) : (
                  isLogin ? 'Se connecter' : 'Créer le compte'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                {isLogin
                  ? "Pas encore de compte ? S'inscrire"
                  : "Déjà un compte ? Se connecter"
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
