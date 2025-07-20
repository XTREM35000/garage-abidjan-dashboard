import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Building2,
  Upload,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon
} from 'lucide-react';
import { useBrandCheck } from '@/hooks/useBrandCheck';

interface BrandSetupWizardProps {
  isOpen: boolean;
  onComplete: (brandData: any) => void;
}

const BrandSetupWizard: React.FC<BrandSetupWizardProps> = ({
  isOpen,
  onComplete
}) => {
  const { saveBrandConfig } = useBrandCheck();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    garageName: '',
    logoFile: null as File | null,
    logoPreview: '',
    address: '',
    phone: '',
    email: '',
    currency: 'XOF',
    language: 'FR'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 1, title: 'Logo & Identité', description: 'Upload du logo et nom du garage' },
    { id: 2, title: 'Informations Légales', description: 'Adresse et coordonnées' },
    { id: 3, title: 'Paramètres', description: 'Devise et langue' }
  ];

  const progress = (currentStep / steps.length) * 100;

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.garageName.trim()) {
        newErrors.garageName = 'Le nom du garage est requis';
      }
      if (!formData.logoFile) {
        newErrors.logo = 'Le logo est requis';
      }
    }

    if (step === 2) {
      if (!formData.address.trim()) {
        newErrors.address = 'L\'adresse est requise';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Le téléphone est requis';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'L\'email est requis';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Format d\'email invalide';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);

    try {
      // Simuler l'upload du logo
      const logoUrl = formData.logoPreview || '/placeholder-logo.png';

      const result = await saveBrandConfig({
        garageName: formData.garageName,
        logoUrl,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        currency: formData.currency,
        language: formData.language
      });

      if (result.success) {
        onComplete(result.config);
      }
    } catch (error) {
      console.error('Erreur lors de la configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validation du fichier
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ logo: 'Le fichier doit faire moins de 2MB' });
        return;
      }

      if (!file.type.match(/image\/(png|jpeg|jpg|svg)/)) {
        setErrors({ logo: 'Format accepté: PNG, JPG, SVG' });
        return;
      }

      setFormData({ ...formData, logoFile: file });
      setErrors({ ...errors, logo: '' });

      // Prévisualisation
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, logoFile: file, logoPreview: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Identité du Garage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Logo */}
                <div className="space-y-2">
                  <Label>Logo du garage *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      {formData.logoPreview ? (
                        <div className="space-y-2">
                          <img
                            src={formData.logoPreview}
                            alt="Logo preview"
                            className="w-20 h-20 mx-auto object-contain rounded-lg border"
                          />
                          <p className="text-sm text-gray-600">Cliquez pour changer</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-12 h-12 mx-auto text-gray-400" />
                          <p className="text-sm font-medium">Cliquez pour uploader</p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, SVG - Max 2MB
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                  {errors.logo && (
                    <p className="text-sm text-red-500">{errors.logo}</p>
                  )}
                </div>

                {/* Nom du garage */}
                <div className="space-y-2">
                  <Label htmlFor="garageName">Nom officiel du garage *</Label>
                  <Input
                    id="garageName"
                    value={formData.garageName}
                    onChange={(e) => setFormData({ ...formData, garageName: e.target.value })}
                    placeholder="Ex: Garage Excellence Abidjan"
                    className={errors.garageName ? 'border-red-500' : ''}
                  />
                  {errors.garageName && (
                    <p className="text-sm text-red-500">{errors.garageName}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Prévisualisation */}
            {formData.logoPreview && formData.garageName && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-sm">Prévisualisation du header</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-green-600 to-green-800 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={formData.logoPreview}
                        alt="Logo"
                        className="w-10 h-10 rounded-lg object-contain bg-white/20"
                      />
                      <div>
                        <h2 className="text-white font-bold">{formData.garageName}</h2>
                        <p className="text-white/80 text-sm">Excellence Automobile</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Informations Légales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Adresse */}
              <div className="space-y-2">
                <Label htmlFor="address">Adresse complète *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Avenue des Champs, Cocody, Abidjan, Côte d'Ivoire"
                  rows={3}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address}</p>
                )}
              </div>

              {/* Téléphone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+225 XX XX XX XX XX"
                    className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email de contact *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@garage.com"
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-600" />
                Paramètres par Défaut
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Devise */}
              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <div className="relative">
                  <select
                    id="currency"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    disabled
                  >
                    <option value="XOF">Franc CFA (XOF) - Verrouillé</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500">
                  La devise est verrouillée en FCFA pour la Côte d'Ivoire
                </p>
              </div>

              {/* Langue */}
              <div className="space-y-2">
                <Label htmlFor="language">Langue d'interface</Label>
                <select
                  id="language"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="FR">Français</option>
                  <option value="EN">English</option>
                </select>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Ces paramètres peuvent être modifiés ultérieurement dans les paramètres du système.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Configuration du Garage
          </DialogTitle>
        </DialogHeader>

        {/* Barre de progression */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Étape {currentStep} sur {steps.length}
            </span>
            <Badge variant="secondary">
              {Math.round(progress)}% complété
            </Badge>
          </div>
          <Progress value={progress} className="w-full" />

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{steps[currentStep - 1].title}</span>
            <span>{steps[currentStep - 1].description}</span>
          </div>
        </div>

        {/* Contenu de l'étape */}
        <div className="py-6">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Précédent
          </Button>

          <Button
            onClick={handleNext}
            disabled={isLoading}
          >
            {currentStep === steps.length ? (
              <>
                {isLoading ? (
                  'Configuration...'
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Terminer la configuration
                  </>
                )}
              </>
            ) : (
              <>
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BrandSetupWizard;
