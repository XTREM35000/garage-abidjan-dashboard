import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Eye, EyeOff, Loader2, Upload, User, Calendar, Building, Briefcase, GraduationCap, Phone, MapPin } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    telephone: '',
    role: '',
    fonction: '',
    specialite: '',
    datePriseFonction: '',
    superior: '',
    garageName: '',
    adresse: '',
    ville: '',
    pays: 'Côte d\'Ivoire'
  });

  const roles = [
    { value: 'proprietaire', label: 'Propriétaire' },
    { value: 'directeur', label: 'Directeur' },
    { value: 'chef-garagiste', label: 'Chef Garagiste' },
    { value: 'technicien', label: 'Technicien' },
    { value: 'mecanicien', label: 'Mécanicien' },
    { value: 'electricien', label: 'Électricien' },
    { value: 'comptable', label: 'Comptable' },
    { value: 'secretaire', label: 'Secrétaire' },
    { value: 'receptionniste', label: 'Réceptionniste' },
    { value: 'vendeur', label: 'Vendeur' }
  ];

  const specialites = [
    { value: 'mecanique-generale', label: 'Mécanique Générale' },
    { value: 'mecanique-moteur', label: 'Mécanique Moteur' },
    { value: 'electricite-automobile', label: 'Électricité Automobile' },
    { value: 'electronique', label: 'Électronique' },
    { value: 'climatisation', label: 'Climatisation' },
    { value: 'carrosserie', label: 'Carrosserie' },
    { value: 'peinture', label: 'Peinture' },
    { value: 'diagnostic', label: 'Diagnostic' },
    { value: 'informatique', label: 'Informatique' },
    { value: 'administration', label: 'Administration' },
    { value: 'comptabilite', label: 'Comptabilité' },
    { value: 'vente', label: 'Vente' },
    { value: 'accueil', label: 'Accueil' },
    { value: 'gestion', label: 'Gestion' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        setLoading(false);
        return;
      }

      // Simulation de connexion/inscription
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Stocker les données utilisateur avec avatar
      const userData = {
        nom: formData.nom || 'Thierry',
        prenom: formData.prenom || 'Gogo',
        email: formData.email,
        telephone: formData.telephone,
        role: formData.role || 'Propriétaire',
        fonction: formData.fonction,
        specialite: formData.specialite,
        datePriseFonction: formData.datePriseFonction,
        superior: formData.superior,
        garageName: formData.garageName || 'Garage Abidjan',
        adresse: formData.adresse,
        ville: formData.ville,
        pays: formData.pays,
        avatar: avatarPreview
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('garageData', JSON.stringify({
        name: userData.garageName,
        owner: `${userData.nom} ${userData.prenom}`,
        adresse: userData.adresse,
        ville: userData.ville,
        pays: userData.pays
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Car className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Garage Abidjan
          </h1>
          <p className="text-gray-600 text-lg">
            {isLogin ? 'Connexion à votre espace' : 'Créer votre compte'}
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-gray-900">
              {isLogin ? 'Connexion' : 'Inscription'}
            </CardTitle>
            <CardDescription className="text-lg">
              {isLogin
                ? 'Accédez à votre tableau de bord'
                : 'Créez votre compte garage'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  {/* Upload Avatar */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Photo de profil</Label>
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="Avatar preview"
                            className="w-20 h-20 rounded-full object-cover border-4 border-green-200 shadow-lg"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center border-4 border-green-200 shadow-lg">
                            <User className="w-10 h-10 text-white" />
                          </div>
                        )}
                        <label
                          htmlFor="avatar-upload"
                          className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors shadow-lg"
                        >
                          <Upload className="w-4 h-4 text-white" />
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
                        <p className="text-sm text-gray-600 font-medium">
                          {avatarFile ? avatarFile.name : 'Aucun fichier sélectionné'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Formats acceptés: JPG, PNG, GIF (max 2MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informations personnelles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom" className="text-base font-semibold">Nom *</Label>
                      <Input
                        id="nom"
                        name="nom"
                        type="text"
                        placeholder="Votre nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prenom" className="text-base font-semibold">Prénom *</Label>
                      <Input
                        id="prenom"
                        name="prenom"
                        type="text"
                        placeholder="Votre prénom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="h-12 text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telephone" className="text-base font-semibold">Téléphone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="telephone"
                        name="telephone"
                        type="tel"
                        placeholder="+225 0123456789"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="h-12 text-base pl-12"
                      />
                    </div>
                  </div>

                  {/* Informations professionnelles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Rôle *</Label>
                      <Select value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Sélectionnez votre rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map(role => (
                            <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fonction" className="text-base font-semibold">Fonction *</Label>
                      <Input
                        id="fonction"
                        name="fonction"
                        type="text"
                        placeholder="Votre fonction"
                        value={formData.fonction}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="h-12 text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Domaine de spécialité</Label>
                    <Select value={formData.specialite} onValueChange={(value) => handleSelectChange('specialite', value)}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Sélectionnez votre spécialité" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialites.map(specialite => (
                          <SelectItem key={specialite.value} value={specialite.value}>{specialite.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="datePriseFonction" className="text-base font-semibold">Date de prise de fonction</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="datePriseFonction"
                          name="datePriseFonction"
                          type="date"
                          value={formData.datePriseFonction}
                          onChange={handleInputChange}
                          className="h-12 text-base pl-12"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="superior" className="text-base font-semibold">Supérieur hiérarchique</Label>
                      <Input
                        id="superior"
                        name="superior"
                        type="text"
                        placeholder="Nom du supérieur"
                        value={formData.superior}
                        onChange={handleInputChange}
                        className="h-12 text-base"
                      />
                    </div>
                  </div>

                  {/* Informations du garage */}
                  <div className="space-y-2">
                    <Label htmlFor="garageName" className="text-base font-semibold">Nom du garage *</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="garageName"
                        name="garageName"
                        type="text"
                        placeholder="Nom de votre garage"
                        value={formData.garageName}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="h-12 text-base pl-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adresse" className="text-base font-semibold">Adresse du garage</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="adresse"
                        name="adresse"
                        type="text"
                        placeholder="Adresse complète"
                        value={formData.adresse}
                        onChange={handleInputChange}
                        className="h-12 text-base pl-12"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ville" className="text-base font-semibold">Ville</Label>
                      <Input
                        id="ville"
                        name="ville"
                        type="text"
                        placeholder="Ville"
                        value={formData.ville}
                        onChange={handleInputChange}
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pays" className="text-base font-semibold">Pays</Label>
                      <Input
                        id="pays"
                        name="pays"
                        type="text"
                        placeholder="Pays"
                        value={formData.pays}
                        onChange={handleInputChange}
                        className="h-12 text-base"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-semibold">Mot de passe *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Votre mot de passe"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="h-12 text-base pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-base font-semibold">Confirmer le mot de passe *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirmez votre mot de passe"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="h-12 text-base pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg font-semibold rounded-xl shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    {isLogin ? 'Connexion...' : 'Création...'}
                  </>
                ) : (
                  isLogin ? 'Se connecter' : 'Créer le compte'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-base text-green-600 hover:text-green-700 underline font-medium"
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
