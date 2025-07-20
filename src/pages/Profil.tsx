import React, { useEffect, useState } from 'react';
import UnifiedLayout from '@/layout/UnifiedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Users,
  Edit,
  Save,
  X,
  Upload,
  Camera,
  Shield,
  Clock,
  Star
} from 'lucide-react';

const Profil: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    role: '',
    fonction: '',
    specialite: '',
    datePriseFonction: '',
    superior: '',
    garageName: '',
    adresse: '',
    ville: '',
    pays: ''
  });

  const roles = [
    { value: 'proprietaire', label: 'Propriétaire', color: 'bg-purple-100 text-purple-800' },
    { value: 'directeur', label: 'Directeur', color: 'bg-blue-100 text-blue-800' },
    { value: 'chef-garagiste', label: 'Chef Garagiste', color: 'bg-green-100 text-green-800' },
    { value: 'technicien', label: 'Technicien', color: 'bg-orange-100 text-orange-800' },
    { value: 'mecanicien', label: 'Mécanicien', color: 'bg-red-100 text-red-800' },
    { value: 'electricien', label: 'Électricien', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'comptable', label: 'Comptable', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'secretaire', label: 'Secrétaire', color: 'bg-pink-100 text-pink-800' },
    { value: 'receptionniste', label: 'Réceptionniste', color: 'bg-teal-100 text-teal-800' },
    { value: 'vendeur', label: 'Vendeur', color: 'bg-cyan-100 text-cyan-800' }
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

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        nom: parsedUser.nom || '',
        prenom: parsedUser.prenom || '',
        email: parsedUser.email || '',
        telephone: parsedUser.telephone || '',
        role: parsedUser.role || '',
        fonction: parsedUser.fonction || '',
        specialite: parsedUser.specialite || '',
        datePriseFonction: parsedUser.datePriseFonction || '',
        superior: parsedUser.superior || '',
        garageName: parsedUser.garageName || '',
        adresse: parsedUser.adresse || '',
        ville: parsedUser.ville || '',
        pays: parsedUser.pays || ''
      });
      if (parsedUser.avatar) {
        setAvatarPreview(parsedUser.avatar);
      }
    }
  }, []);

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

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser = {
        ...user,
        ...formData,
        avatar: avatarPreview
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Restaurer les données originales
    if (user) {
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || '',
        role: user.role || '',
        fonction: user.fonction || '',
        specialite: user.specialite || '',
        datePriseFonction: user.datePriseFonction || '',
        superior: user.superior || '',
        garageName: user.garageName || '',
        adresse: user.adresse || '',
        ville: user.ville || '',
        pays: user.pays || ''
      });
      setAvatarPreview(user.avatar);
    }
  };

  const getRoleColor = (roleValue: string) => {
    const role = roles.find(r => r.value === roleValue);
    return role ? role.color : 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (roleValue: string) => {
    const role = roles.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
  };

  const getSpecialiteLabel = (specialiteValue: string) => {
    const specialite = specialites.find(s => s.value === specialiteValue);
    return specialite ? specialite.label : specialiteValue;
  };

  if (!user) {
    return (
      <UnifiedLayout>
        <div className="py-8 w-full max-w-4xl mx-auto">
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
      <div className="py-8 w-full max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Carte de profil principale */}
          <div className="lg:col-span-1">
            <Card className="shadow-soft animate-fade-in">
              <CardHeader className="text-center pb-6">
                <div className="relative mx-auto mb-4">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-32 h-32 rounded-full object-cover border-4 border-green-200 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center border-4 border-green-200 shadow-lg">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                  {isEditing && (
                    <label
                      htmlFor="avatar-upload"
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors shadow-lg"
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </label>
                  )}
                  {isEditing && (
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  )}
                </div>
                <CardTitle className="text-2xl font-bold">
                  {user.nom} {user.prenom}
                </CardTitle>
                <div className="flex justify-center mb-2">
                  <Badge className={getRoleColor(user.role)}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{user.fonction}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.telephone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">{user.telephone}</span>
                  </div>
                )}
                {user.garageName && (
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">{user.garageName}</span>
                  </div>
                )}
                <div className="flex justify-center pt-4">
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {loading ? 'Sauvegarde...' : <><Save className="w-4 h-4 mr-2" />Sauvegarder</>}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        <X className="w-4 h-4 mr-2" />Annuler
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Edit className="w-4 h-4 mr-2" />Modifier le profil
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informations détaillées */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations personnelles */}
            <Card className="shadow-soft animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Informations personnelles</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Nom</Label>
                    {isEditing ? (
                      <Input
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        className="h-10"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{user.nom || 'Non renseigné'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Prénom</Label>
                    {isEditing ? (
                      <Input
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        className="h-10"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{user.prenom || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Email</Label>
                    {isEditing ? (
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="h-10"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Téléphone</Label>
                    {isEditing ? (
                      <Input
                        name="telephone"
                        type="tel"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        className="h-10"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{user.telephone || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations professionnelles */}
            <Card className="shadow-soft animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5" />
                  <span>Informations professionnelles</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Rôle</Label>
                    {isEditing ? (
                      <Select value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Sélectionnez votre rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map(role => (
                            <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Badge className={getRoleColor(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Fonction</Label>
                    {isEditing ? (
                      <Input
                        name="fonction"
                        value={formData.fonction}
                        onChange={handleInputChange}
                        className="h-10"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{user.fonction || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Domaine de spécialité</Label>
                    {isEditing ? (
                      <Select value={formData.specialite} onValueChange={(value) => handleSelectChange('specialite', value)}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Sélectionnez votre spécialité" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialites.map(specialite => (
                            <SelectItem key={specialite.value} value={specialite.value}>{specialite.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {user.specialite ? getSpecialiteLabel(user.specialite) : 'Non renseigné'}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Date de prise de fonction</Label>
                    {isEditing ? (
                      <Input
                        name="datePriseFonction"
                        type="date"
                        value={formData.datePriseFonction}
                        onChange={handleInputChange}
                        className="h-10"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {user.datePriseFonction ? new Date(user.datePriseFonction).toLocaleDateString('fr-FR') : 'Non renseigné'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Supérieur hiérarchique</Label>
                  {isEditing ? (
                    <Input
                      name="superior"
                      value={formData.superior}
                      onChange={handleInputChange}
                      className="h-10"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{user.superior || 'Non renseigné'}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Informations du garage */}
            <Card className="shadow-soft animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5" />
                  <span>Informations du garage</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Nom du garage</Label>
                  {isEditing ? (
                    <Input
                      name="garageName"
                      value={formData.garageName}
                      onChange={handleInputChange}
                      className="h-10"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{user.garageName || 'Non renseigné'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Adresse</Label>
                  {isEditing ? (
                    <Input
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleInputChange}
                      className="h-10"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{user.adresse || 'Non renseigné'}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Ville</Label>
                    {isEditing ? (
                      <Input
                        name="ville"
                        value={formData.ville}
                        onChange={handleInputChange}
                        className="h-10"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{user.ville || 'Non renseigné'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Pays</Label>
                    {isEditing ? (
                      <Input
                        name="pays"
                        value={formData.pays}
                        onChange={handleInputChange}
                        className="h-10"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{user.pays || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistiques et informations supplémentaires */}
            <Card className="shadow-soft animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>Statistiques</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">Clients</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-gray-600">Véhicules</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">0</div>
                    <div className="text-sm text-gray-600">Réparations</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-sm text-gray-600">Pièces</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default Profil;
