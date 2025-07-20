import React, { useState } from 'react';
import UnifiedLayout from '@/layout/UnifiedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings as SettingsIcon,
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  Database,
  AlertTriangle,
  Save,
  RefreshCw,
  Camera
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import AdvancedSettings from '@/components/AdvancedSettings';
import { useBrainSetup } from '@/hooks/useBrainSetup';
import { getGarageConfig } from '@/lib/config';

const Settings: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { resetToFirstLaunch } = useBrainSetup();
  const [loading, setLoading] = useState(false);

  // Récupérer la configuration actuelle
  const garageConfig = getGarageConfig();
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    display: {
      theme: isDark ? 'dark' : 'light',
      language: 'fr',
      currency: 'XOF'
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30
    }
  });

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Sauvegarder les paramètres
      localStorage.setItem('settings', JSON.stringify(settings));

      // Appliquer le thème
      if (settings.display.theme === 'dark' && !isDark) {
        toggleTheme();
      } else if (settings.display.theme === 'light' && isDark) {
        toggleTheme();
      }

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = () => {
    resetToFirstLaunch();
  };

  return (
    <UnifiedLayout>
      <div className="py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Paramètres
            </h1>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Gérez votre compte et les paramètres de l'application
            </p>
          </div>
          <Button
            onClick={handleSaveSettings}
            disabled={loading}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className={`grid w-full grid-cols-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="advanced">Avancé</TabsTrigger>
          </TabsList>

          {/* Onglet Général */}
          <TabsContent value="general" className="space-y-6">
            {/* Informations du garage */}
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${isDark ? 'text-white' : ''}`}>
                  <Building2 className="w-5 h-5" />
                  <span>Informations du Garage</span>
                </CardTitle>
                <CardDescription className={isDark ? 'text-gray-300' : ''}>
                  Modifiez les informations de votre garage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="garageName" className={isDark ? 'text-gray-300' : ''}>
                      Nom du garage
                    </Label>
                    <Input
                      id="garageName"
                      defaultValue={garageConfig.garageName || ''}
                      className={isDark ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ownerName" className={isDark ? 'text-gray-300' : ''}>
                      Propriétaire
                    </Label>
                    <Input
                      id="ownerName"
                      defaultValue={garageConfig.ownerName || ''}
                      className={isDark ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className={isDark ? 'text-gray-300' : ''}>
                      Adresse
                    </Label>
                    <Input
                      id="address"
                      defaultValue={garageConfig.address || ''}
                      className={isDark ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className={isDark ? 'text-gray-300' : ''}>
                      Téléphone
                    </Label>
                    <Input
                      id="phone"
                      defaultValue={garageConfig.phone || ''}
                      className={isDark ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className={isDark ? 'text-gray-300' : ''}>
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={garageConfig.email || ''}
                      className={isDark ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rccm" className={isDark ? 'text-gray-300' : ''}>
                      RCCM
                    </Label>
                    <Input
                      id="rccm"
                      defaultValue={garageConfig.rccm || ''}
                      className={isDark ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="taxRegime" className={isDark ? 'text-gray-300' : ''}>
                      Régime Fiscal
                    </Label>
                    <select
                      id="taxRegime"
                      defaultValue={garageConfig.taxRegime || 'reel'}
                      className={`w-full px-3 py-2 border rounded-md ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    >
                      <option value="reel">Régime Réel</option>
                      <option value="simplifie">Régime Simplifié</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="taxId" className={isDark ? 'text-gray-300' : ''}>
                      Numéro Fiscal
                    </Label>
                    <Input
                      id="taxId"
                      defaultValue={garageConfig.taxId || ''}
                      className={isDark ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cni" className={isDark ? 'text-gray-300' : ''}>
                      CNI
                    </Label>
                    <Input
                      id="cni"
                      defaultValue={garageConfig.cni || ''}
                      className={isDark ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations utilisateur */}
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${isDark ? 'text-white' : ''}`}>
                  <User className="w-5 h-5" />
                  <span>Informations Utilisateur</span>
                </CardTitle>
                <CardDescription className={isDark ? 'text-gray-300' : ''}>
                  Vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="userName" className={isDark ? 'text-gray-300' : ''}>
                      Nom complet
                    </Label>
                    <Input
                      id="userName"
                      defaultValue={userData.name || ''}
                      className={isDark ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="userEmail" className={isDark ? 'text-gray-300' : ''}>
                      Email
                    </Label>
                    <Input
                      id="userEmail"
                      type="email"
                      defaultValue={userData.email || ''}
                      className={isDark ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Affichage */}
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${isDark ? 'text-white' : ''}`}>
                  <Palette className="w-5 h-5" />
                  <span>Affichage</span>
                </CardTitle>
                <CardDescription className={isDark ? 'text-gray-300' : ''}>
                  Personnalisez l'apparence de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className={isDark ? 'text-gray-300' : ''}>Mode sombre</Label>
                    <p className="text-sm text-gray-500">Activer le thème sombre</p>
                  </div>
                  <Switch
                    checked={isDark}
                    onCheckedChange={toggleTheme}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language" className={isDark ? 'text-gray-300' : ''}>
                      Langue
                    </Label>
                    <select
                      id="language"
                      defaultValue="fr"
                      className={`w-full p-2 rounded-md border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="currency" className={isDark ? 'text-gray-300' : ''}>
                      Devise
                    </Label>
                    <select
                      id="currency"
                      defaultValue="XOF"
                      className={`w-full p-2 rounded-md border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    >
                      <option value="XOF">XOF (FCFA)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preuves Photo */}
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${isDark ? 'text-white' : ''}`}>
                  <Camera className="w-5 h-5" />
                  <span>Preuves Photo</span>
                </CardTitle>
                <CardDescription className={isDark ? 'text-gray-300' : ''}>
                  Configuration de la documentation photo obligatoire
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className={isDark ? 'text-gray-300' : ''}>Activer les preuves photo</Label>
                    <p className="text-sm text-gray-500">Documentation obligatoire pour certaines réparations</p>
                  </div>
                  <Switch
                    checked={true}
                    onCheckedChange={() => {}}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minPhotos" className={isDark ? 'text-gray-300' : ''}>
                      Nombre minimum de photos
                    </Label>
                    <Input
                      id="minPhotos"
                      type="number"
                      min="1"
                      max="5"
                      defaultValue="2"
                      className={isDark ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxFileSize" className={isDark ? 'text-gray-300' : ''}>
                      Taille max. par photo (MB)
                    </Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      min="1"
                      max="10"
                      defaultValue="5"
                      className={isDark ? 'bg-gray-700 border-gray-600' : ''}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">📸 Conditions d'activation</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Durée de réparation {'>'} 24 heures</li>
                    <li>• Type : Carrosserie ou Moteur</li>
                    <li>• Valeur du véhicule {'>'} 5M FCFA</li>
                    <li>• Client non blacklisté</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${isDark ? 'text-white' : ''}`}>
                  <Bell className="w-5 h-5" />
                  <span>Préférences de Notifications</span>
                </CardTitle>
                <CardDescription className={isDark ? 'text-gray-300' : ''}>
                  Choisissez comment recevoir vos notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className={isDark ? 'text-gray-300' : ''}>Notifications par email</Label>
                      <p className="text-sm text-gray-500">Recevoir les notifications par email</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, email: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className={isDark ? 'text-gray-300' : ''}>Notifications push</Label>
                      <p className="text-sm text-gray-500">Notifications dans le navigateur</p>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, push: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className={isDark ? 'text-gray-300' : ''}>Notifications SMS</Label>
                      <p className="text-sm text-gray-500">Recevoir les notifications par SMS</p>
                    </div>
                    <Switch
                      checked={settings.notifications.sms}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, sms: checked }
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Sécurité */}
          <TabsContent value="security" className="space-y-6">
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${isDark ? 'text-white' : ''}`}>
                  <Shield className="w-5 h-5" />
                  <span>Sécurité</span>
                </CardTitle>
                <CardDescription className={isDark ? 'text-gray-300' : ''}>
                  Paramètres de sécurité de votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className={isDark ? 'text-gray-300' : ''}>Authentification à deux facteurs</Label>
                      <p className="text-sm text-gray-500">Sécurisez votre compte avec 2FA</p>
                    </div>
                    <Switch
                      checked={settings.security.twoFactor}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, twoFactor: checked }
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="sessionTimeout" className={isDark ? 'text-gray-300' : ''}>
                      Timeout de session (minutes)
                    </Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="5"
                      max="480"
                      defaultValue={settings.security.sessionTimeout}
                      className={isDark ? 'bg-gray-700 border-gray-600' : ''}
                      onChange={(e) =>
                        setSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                        }))
                      }
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Durée d'inactivité avant déconnexion automatique
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Avancé */}
          <TabsContent value="advanced">
            <AdvancedSettings onDeleteAll={handleDeleteAll} />
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedLayout>
  );
};

export default Settings;
