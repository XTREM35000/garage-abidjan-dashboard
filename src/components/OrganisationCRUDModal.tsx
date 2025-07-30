import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Hash,
  MapPin,
  Phone,
  Mail,
  Globe,
  Sparkles,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OrganisationCRUDModalProps {
  isOpen: boolean;
  selectedPlan: string;
  onComplete: (organisationData: any) => void;
}

const OrganisationCRUDModal: React.FC<OrganisationCRUDModalProps> = ({
  isOpen,
  selectedPlan,
  onComplete
}) => {
  const [formData, setFormData] = useState({
    nom: '',
    slug: '',
    adresse: '',
    telephone: '',
    email: '',
    site_web: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const planInfo = {
    free: { name: 'Gratuit', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/20' },
    monthly: { name: 'Mensuel', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
    lifetime: { name: 'À VIE', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/20' }
  };

  const currentPlan = planInfo[selectedPlan as keyof typeof planInfo] || planInfo.free;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validation nom
    if (!formData.nom) {
      newErrors.nom = 'Le nom de l\'organisation est requis';
    } else if (formData.nom.length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }

    // Validation slug
    if (!formData.slug) {
      newErrors.slug = 'Le code d\'organisation est requis';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Le code doit contenir seulement des lettres minuscules, chiffres et tirets';
    } else if (formData.slug.length < 3) {
      newErrors.slug = 'Le code doit contenir au moins 3 caractères';
    }

    // Validation téléphone
    if (formData.telephone && !/^\+225\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/.test(formData.telephone.replace(/\s/g, ''))) {
      newErrors.telephone = 'Format: +225 XX XX XX XX XX';
    }

    // Validation email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('225')) {
      const match = cleaned.match(/^225(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
      if (match) {
        return `+225 ${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
      }
    }
    return value;
  };

  const generateSlug = (nom: string) => {
    return nom
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'telephone') {
      value = formatPhoneNumber(value);
    }

    setFormData(prev => ({ ...prev, [field]: value }));

    // Générer automatiquement le slug à partir du nom
    if (field === 'nom' && !formData.slug) {
      const slug = generateSlug(value);
      setFormData(prev => ({ ...prev, slug }));
    }

    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Vérifier si le slug existe déjà
      const { data: existingOrg, error: checkError } = await supabase
        .from('organisations')
        .select('id')
        .eq('slug', formData.slug)
        .single();

      if (existingOrg) {
        setErrors({ slug: 'Ce code d\'organisation existe déjà' });
        setIsLoading(false);
        return;
      }

      // Créer l'organisation
      const { data: orgData, error: orgError } = await supabase
        .from('organisations')
        .insert({
          nom: formData.nom,
          slug: formData.slug,
          adresse: formData.adresse || null,
          telephone: formData.telephone || null,
          email: formData.email || null,
          site_web: formData.site_web || null,
          description: formData.description || null,
          plan_abonnement: selectedPlan,
          est_actif: true
        })
        .select()
        .single();

      if (orgError) {
        throw orgError;
      }

      toast.success('Organisation créée avec succès !');
      onComplete(orgData);
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'organisation:', error);
      toast.error(error.message || 'Erreur lors de la création de l\'organisation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 border-blue-200 dark:border-blue-700">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center animate-pulse">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            Créer votre organisation
          </DialogTitle>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Configurez les informations de votre garage
          </p>
        </DialogHeader>

        {/* Plan sélectionné */}
        <div className={`p-4 rounded-lg border ${currentPlan.bgColor} border-current`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={`${currentPlan.color} bg-current/10 border-current/20`}>
                Plan {currentPlan.name}
              </Badge>
            </div>
            <Sparkles className={`w-5 h-5 ${currentPlan.color}`} />
          </div>
        </div>

        <Card className="border-blue-200 dark:border-blue-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <Building2 className="w-5 h-5" />
              Informations de l'organisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom et Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom" className="text-slate-700 dark:text-slate-300">
                    Nom de l'organisation *
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                    <Input
                      id="nom"
                      type="text"
                      value={formData.nom}
                      onChange={(e) => handleInputChange('nom', e.target.value)}
                      className={`pl-10 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 ${
                        errors.nom ? 'border-red-500' : ''
                      }`}
                      placeholder="Ex: Garage Central"
                    />
                  </div>
                  {errors.nom && (
                    <p className="text-red-500 text-sm">{errors.nom}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-slate-700 dark:text-slate-300">
                    Code d'organisation *
                  </Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                    <Input
                      id="slug"
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      className={`pl-10 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 ${
                        errors.slug ? 'border-red-500' : ''
                      }`}
                      placeholder="garage-central"
                    />
                  </div>
                  {errors.slug && (
                    <p className="text-red-500 text-sm">{errors.slug}</p>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ce code sera utilisé pour identifier votre organisation
                  </p>
                </div>
              </div>

              {/* Adresse */}
              <div className="space-y-2">
                <Label htmlFor="adresse" className="text-slate-700 dark:text-slate-300">
                  Adresse
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                  <Input
                    id="adresse"
                    type="text"
                    value={formData.adresse}
                    onChange={(e) => handleInputChange('adresse', e.target.value)}
                    className="pl-10 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                    placeholder="123 Rue de la Paix, Abidjan"
                  />
                </div>
              </div>

              {/* Téléphone et Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telephone" className="text-slate-700 dark:text-slate-300">
                    Téléphone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                    <Input
                      id="telephone"
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => handleInputChange('telephone', e.target.value)}
                      className={`pl-10 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 ${
                        errors.telephone ? 'border-red-500' : ''
                      }`}
                      placeholder="+225 XX XX XX XX XX"
                    />
                  </div>
                  {errors.telephone && (
                    <p className="text-red-500 text-sm">{errors.telephone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`pl-10 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                      placeholder="contact@garage.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Site web */}
              <div className="space-y-2">
                <Label htmlFor="site_web" className="text-slate-700 dark:text-slate-300">
                  Site web
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
                  <Input
                    id="site_web"
                    type="url"
                    value={formData.site_web}
                    onChange={(e) => handleInputChange('site_web', e.target.value)}
                    className="pl-10 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                    placeholder="https://www.garage.com"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700 dark:text-slate-300">
                  Description
                </Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none"
                  rows={3}
                  placeholder="Description de votre garage..."
                />
              </div>

              {/* Alert d'information */}
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
                <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-700 dark:text-blue-300">
                  Les informations marquées d'un * sont obligatoires. Vous pourrez modifier ces informations plus tard.
                </AlertDescription>
              </Alert>

              {/* Bouton de soumission */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Création en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Créer l'organisation
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default OrganisationCRUDModal;
