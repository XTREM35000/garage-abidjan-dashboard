import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Building2,
  User,
  MapPin,
  Phone,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Car,
  Wrench,
  Zap,
  FileText,
  CreditCard,
  X
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface BrainModalProps {
  isOpen: boolean;
  onComplete: (config: GarageConfig) => void;
}

interface GarageConfig {
  garageName: string;
  ownerName: string;
  logo: string | null;
  address: string;
  phonePrefix: string;
  phoneNumber: string;
  phone: string; // Calculé: prefix + number
  email?: string;
  rccm?: string;
  taxRegime?: 'reel' | 'simplifie';
  taxId?: string;
  cni?: string;
}

const BrainModal: React.FC<BrainModalProps> = ({ isOpen, onComplete }) => {
  const { isDark } = useTheme();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);

  const [config, setConfig] = useState<GarageConfig>({
    garageName: '',
    ownerName: '',
    logo: null,
    address: '',
    phonePrefix: '+225',
    phoneNumber: '',
    phone: '+225',
    email: '',
    rccm: '',
    taxRegime: 'reel',
    taxId: '',
    cni: ''
  });

  const [errors, setErrors] = useState<Partial<GarageConfig>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset modal when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setLoading(false);
      setErrors({});
    }
  }, [isOpen]);

  // Validation des champs
  const validateField = (field: keyof GarageConfig, value: string): string => {
    switch (field) {
      case 'garageName':
        if (!value.trim()) return 'Le nom du garage est requis';
        if (value.length > 50) return 'Le nom ne peut pas dépasser 50 caractères';
        return '';

      case 'ownerName':
        if (!value.trim()) return 'Le nom du propriétaire est requis';
        return '';

      case 'address':
        if (!value.trim()) return 'L\'adresse est requise';
        return '';

      case 'phone':
        if (!value.trim()) return 'Le téléphone est requis';
        // Validation plus flexible pour différents pays
        const cleanPhone = value.replace(/\s/g, '');
        const phoneRegex = /^(\+225|\+33|\+226|\+224)[0-9]{8,10}$/;
        if (!phoneRegex.test(cleanPhone)) {
          return 'Format téléphone invalide (ex: +225 07 58 96 61 56)';
        }
        return '';

      default:
        return '';
    }
  };

  // Fonction pour formater le numéro de téléphone avec masque
  const formatPhoneNumber = (value: string): string => {
    // Supprimer tous les caractères non numériques
    const numbers = value.replace(/\D/g, '');
    // Appliquer le masque XX XX XX XX XX
    const formatted = numbers.replace(/(\d{2})(?=\d)/g, '$1 ');
    return formatted.substring(0, 14); // Limiter à 10 chiffres + espaces
  };

  // Fonction pour gérer le changement de préfixe téléphonique
  const handlePhonePrefixChange = (prefix: string) => {
    console.log('🎯 Phone prefix changed to:', prefix);
    setConfig(prev => {
      const newConfig = {
        ...prev,
        phonePrefix: prefix,
        phone: prefix + prev.phoneNumber.replace(/\s/g, '')
      };
      console.log('New config after prefix change:', newConfig);
      return newConfig;
    });
  };

  // Fonction pour gérer le changement de numéro téléphonique
  const handlePhoneNumberChange = (value: string) => {
    console.log('🎯 Phone number changed to:', value);
    const formatted = formatPhoneNumber(value);
    const numbers = formatted.replace(/\s/g, '');

    setConfig(prev => {
      const newConfig = {
        ...prev,
        phoneNumber: formatted,
        phone: prev.phonePrefix + numbers
      };
      console.log('New config after phone number change:', newConfig);
      return newConfig;
    });

    // Validation
    const fullPhone = config.phonePrefix + numbers;
    const error = validateField('phone', fullPhone);
    setErrors(prev => ({
      ...prev,
      phone: error
    }));
  };

  const handleInputChange = (field: keyof GarageConfig, value: string) => {
    console.log('🎯 handleInputChange:', field, value);

    setConfig(prev => {
      const newConfig = { ...prev, [field]: value };
      console.log('New config:', newConfig);
      return newConfig;
    });

    // Validation en temps réel
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));

    // Auto-complétion d'adresse
    if (field === 'address' && value.length > 3) {
      const suggestions = [
        `${value}, Abidjan, Côte d'Ivoire`,
        `${value}, Cocody, Abidjan`,
        `${value}, Marcory, Abidjan`,
        `${value}, Plateau, Abidjan`
      ];
      setAddressSuggestions(suggestions);
      setShowAddressSuggestions(true);
    } else if (field === 'address') {
      setShowAddressSuggestions(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: 'Le fichier ne peut pas dépasser 2MB' }));
        return;
      }

      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setErrors(prev => ({ ...prev, logo: 'Formats acceptés: JPG, PNG' }));
        return;
      }

      setLogoFile(file);
      setErrors(prev => ({ ...prev, logo: '' }));

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        setConfig(prev => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const selectAddress = (address: string) => {
    setConfig(prev => ({ ...prev, address }));
    setShowAddressSuggestions(false);
    setErrors(prev => ({ ...prev, address: '' }));
  };

  const validateStep = (): boolean => {
    console.log('=== validateStep called ===');
    console.log('Validating step:', step);

    const newErrors: Partial<GarageConfig> = {};

    if (step === 1) {
      console.log('Validating step 1 fields...');
      newErrors.garageName = validateField('garageName', config.garageName);
      newErrors.ownerName = validateField('ownerName', config.ownerName);
      newErrors.address = validateField('address', config.address);
      newErrors.phone = validateField('phone', config.phone);
      console.log('Step 1 validation results:', {
        garageName: newErrors.garageName,
        ownerName: newErrors.ownerName,
        address: newErrors.address,
        phone: newErrors.phone
      });
    } else if (step === 2) {
      console.log('Validating step 2 fields...');
      newErrors.address = validateField('address', config.address);
      newErrors.phone = validateField('phone', config.phone);
      console.log('Step 2 validation results:', {
        address: newErrors.address,
        phone: newErrors.phone
      });
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Validation result:', isValid, 'Errors:', newErrors);
    return isValid;
  };

  const handleNext = () => {
    console.log('=== handleNext called ===');
    console.log('Current step:', step);
    console.log('Current config:', config);
    console.log('Current errors:', errors);

    if (validateStep()) {
      console.log('✅ Validation passed, moving to next step');
      setStep(prev => {
        console.log('Setting step from', prev, 'to', prev + 1);
        return prev + 1;
      });
    } else {
      console.log('❌ Validation failed, errors:', errors);
    }
  };

  const handlePrevious = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onComplete(config);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

    const canProceedToNext = () => {
    console.log('canProceedToNext called, step:', step);
    console.log('config:', config);

    if (step === 1) {
      const canProceed = config.garageName.trim() && config.ownerName.trim() && config.address.trim() && config.phone.trim();
      console.log('Step 1 validation:', {
        garageName: config.garageName.trim(),
        ownerName: config.ownerName.trim(),
        address: config.address.trim(),
        phone: config.phone.trim(),
        canProceed
      });
      return canProceed;
    } else if (step === 2) {
      const canProceed = config.address.trim() && config.phone.trim();
      console.log('Step 2 validation:', {
        address: config.address.trim(),
        phone: config.phone.trim(),
        canProceed
      });
      return canProceed;
    }
    console.log('Step 3 or 4, can proceed: true');
    return true;
  };

    return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        console.log('🎯 Modal backdrop clicked!');
        console.log('Target:', e.target);
        console.log('Current target:', e.currentTarget);
        if (e.target === e.currentTarget) {
          console.log('Clicked on backdrop, not modal content');
        }
      }}
      onMouseEnter={() => console.log('🎯 Modal backdrop mouse enter')}
      onMouseLeave={() => console.log('🎯 Modal backdrop mouse leave')}
    >
      <Card
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}
        onClick={(e) => {
          console.log('🎯 Card clicked!');
          console.log('Card target:', e.target);
          e.stopPropagation();
        }}
        onMouseEnter={() => console.log('🎯 Card mouse enter')}
        onMouseLeave={() => console.log('🎯 Card mouse leave')}
      >
        <CardHeader className="text-center border-b relative">
          {/* Bouton de fermeture */}
          <button
            onClick={(e) => {
              console.log('🎯 Close button clicked!');
              console.log('Close button target:', e.target);
              e.stopPropagation();
              // Fermer le modal
            }}
            onMouseEnter={() => console.log('🎯 Close button mouse enter')}
            onMouseLeave={() => console.log('🎯 Close button mouse leave')}
            className="absolute top-4 right-4 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className={`text-2xl ${isDark ? 'text-white' : ''}`}>
            Configuration Initiale
          </CardTitle>
          <CardDescription className={isDark ? 'text-gray-300' : ''}>
            Configurez votre garage en quelques étapes
          </CardDescription>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Étape {step} sur 2</span>
              <span>{Math.round((step / 2) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent
          className="p-6"
          onClick={(e) => {
            console.log('🎯 CardContent clicked!');
            console.log('CardContent target:', e.target);
            e.stopPropagation();
          }}
          onMouseEnter={() => console.log('🎯 CardContent mouse enter')}
          onMouseLeave={() => console.log('🎯 CardContent mouse leave')}
        >
          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
              <p><strong>Debug:</strong> Step: {step}, Can proceed: {canProceedToNext() ? 'true' : 'false'}</p>
              <p>Garage: "{config.garageName}", Owner: "{config.ownerName}"</p>
              <p>Address: "{config.address}", Phone: "{config.phone}"</p>
                            <button
                onClick={(e) => {
                  console.log('🎯 Test button clicked!');
                  console.log('Test button target:', e.target);
                  e.stopPropagation();
                }}
                onMouseEnter={() => console.log('🎯 Test button mouse enter')}
                onMouseLeave={() => console.log('🎯 Test button mouse leave')}
                className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs cursor-pointer"
              >
                Test Click
              </button>
            </div>
          )}

          {/* Étape 1: Toutes les informations */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : ''}`}>
                  <Building2 className="w-5 h-5" />
                  Configuration Complète du Garage
                </h3>

                <div className="space-y-4">
                  {/* Nom du garage */}
                  <div>
                    <Label htmlFor="garageName" className={isDark ? 'text-gray-300' : ''}>
                      Nom du garage *
                    </Label>
                    <Input
                      id="garageName"
                      value={config.garageName}
                      onChange={(e) => handleInputChange('garageName', e.target.value)}
                      placeholder="Ex: Garage Excellence Abidjan"
                      maxLength={50}
                      className={errors.garageName ? 'border-red-500' : ''}
                    />
                    {errors.garageName && (
                      <p className="text-red-500 text-sm mt-1">{errors.garageName}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {config.garageName.length}/50 caractères
                    </p>
                  </div>

                  {/* Nom du propriétaire */}
                  <div>
                    <Label htmlFor="ownerName" className={isDark ? 'text-gray-300' : ''}>
                      Nom du propriétaire *
                    </Label>
                    <Input
                      id="ownerName"
                      value={config.ownerName}
                      onChange={(e) => handleInputChange('ownerName', e.target.value)}
                      placeholder="Ex: Thierry Gogo"
                      className={errors.ownerName ? 'border-red-500' : ''}
                    />
                    {errors.ownerName && (
                      <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>
                    )}
                  </div>

                  {/* Adresse */}
                  <div className="relative">
                    <Label htmlFor="address" className={isDark ? 'text-gray-300' : ''}>
                      Adresse *
                    </Label>
                    <Input
                      id="address"
                      value={config.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Ex: 123 Avenue des Champs, Cocody, Abidjan"
                      className={errors.address ? 'border-red-500' : ''}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}

                    {showAddressSuggestions && addressSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {addressSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => selectAddress(suggestion)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Téléphone */}
                  <div>
                    <Label htmlFor="phone" className={isDark ? 'text-gray-300' : ''}>
                      Téléphone *
                    </Label>
                    <div className="flex space-x-2">
                      <select
                        value={config.phonePrefix}
                        onChange={(e) => handlePhonePrefixChange(e.target.value)}
                        className={`px-3 py-2 border rounded-md ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} min-w-[100px]`}
                      >
                        <option value="+225">+225</option>
                        <option value="+33">+33</option>
                        <option value="+226">+226</option>
                        <option value="+224">+224</option>
                      </select>
                      <Input
                        id="phoneNumber"
                        value={config.phoneNumber}
                        onChange={(e) => handlePhoneNumberChange(e.target.value)}
                        placeholder="00 00 00 00 00"
                        className={`flex-1 ${errors.phone ? 'border-red-500' : ''}`}
                        maxLength={14}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Format: {config.phonePrefix} XX XX XX XX XX
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className={isDark ? 'text-gray-300' : ''}>
                      Email (optionnel)
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={config.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="contact@garage-abidjan.com"
                    />
                  </div>

                  {/* Logo */}
                  <div>
                    <Label className={isDark ? 'text-gray-300' : ''}>
                      Logo du garage
                    </Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="relative">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-16 h-16 rounded-lg object-cover border-2 border-orange-200"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center border-2 border-orange-200">
                            <Building2 className="w-8 h-8 text-white" />
                          </div>
                        )}
                        <label
                          htmlFor="logo-upload"
                          className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors"
                        >
                          <Upload className="w-3 h-3 text-white" />
                        </label>
                        <input
                          ref={fileInputRef}
                          id="logo-upload"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          {logoFile ? logoFile.name : 'Aucun fichier sélectionné'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Formats: PNG, JPG (max 2MB)
                        </p>
                        {errors.logo && (
                          <p className="text-red-500 text-sm">{errors.logo}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Étape 2: Récapitulatif */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : ''}`}>
                  <CheckCircle className="w-5 h-5" />
                  Récapitulatif
                </h3>

                <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-medium">{config.garageName}</p>
                        <p className="text-sm text-gray-500">Nom du garage</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{config.ownerName}</p>
                        <p className="text-sm text-gray-500">Propriétaire</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">{config.address}</p>
                        <p className="text-sm text-gray-500">Adresse</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium">{config.phone}</p>
                        <p className="text-sm text-gray-500">Téléphone</p>
                      </div>
                    </div>

                    {config.email && (
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium">{config.email}</p>
                          <p className="text-sm text-gray-500">Email</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Vérifiez que toutes les informations sont correctes. Vous pourrez les modifier plus tard dans les paramètres.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}



          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={step === 1}
            >
              Précédent
            </Button>

            <div className="flex space-x-2">
              {step === 1 ? (
                <button
                  type="button"
                  onClick={(e) => {
                    console.log('🎯 HTML Button clicked!');
                    console.log('Button target:', e.target);
                    console.log('Button disabled:', !canProceedToNext());
                    console.log('About to call handleNext...');
                    e.stopPropagation();
                    try {
                      handleNext();
                      console.log('handleNext called successfully');
                    } catch (error) {
                      console.error('Error in handleNext:', error);
                    }
                  }}
                  onMouseEnter={() => console.log('🎯 HTML Button mouse enter')}
                  onMouseLeave={() => console.log('🎯 HTML Button mouse leave')}
                  disabled={!canProceedToNext()}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white h-10 px-4 py-2 cursor-pointer"
                >
                  Suivant (HTML)
                </button>
              ) : (
                <Button
                  onClick={handleComplete}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Configuration...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Terminer la configuration
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrainModal;
