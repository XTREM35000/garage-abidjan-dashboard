import React, { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import PricingModal from '@/components/PricingModal';
import SuperAdminSetupModal from '@/components/SuperAdminSetupModal';
import GarageSetupModal from '@/components/GarageSetupModal';
import SmsValidationModal from '@/components/SmsValidationModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, User, Mail, Key, Phone } from 'lucide-react';

interface InitializationWizardProps {
  isOpen: boolean;
  onComplete: () => void;
  startStep: 'super-admin' | 'pricing' | 'organization-admin';
}

type WizardStep = 
  | 'super-admin'
  | 'pricing'
  | 'organization-admin'
  | 'sms-validation'
  | 'garage-setup'
  | 'complete';

interface OrganizationAdminData {
  // Organisation
  organisationName: string;
  organisationSlug: string;
  organisationCode?: string;
  // Admin
  adminEmail: string;
  adminPassword: string;
  adminPhone: string;
  adminName: string;
  // Plan
  selectedPlan: string;
}

const InitializationWizard: React.FC<InitializationWizardProps> = ({
  isOpen,
  onComplete,
  startStep
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(startStep);
  const [isLoading, setIsLoading] = useState(false);
  const [orgAdminData, setOrgAdminData] = useState<OrganizationAdminData>({
    organisationName: '',
    organisationSlug: '',
    adminEmail: '',
    adminPassword: '',
    adminPhone: '',
    adminName: '',
    selectedPlan: ''
  });

  // Gestion du Super-Admin
  const handleSuperAdminCreated = () => {
    console.log('✅ Super-Admin créé, passage au pricing');
    setCurrentStep('pricing');
  };

  // Gestion du Pricing
  const handlePlanSelection = (planId: string) => {
    console.log('✅ Plan sélectionné:', planId);
    setOrgAdminData(prev => ({ ...prev, selectedPlan: planId }));
    setCurrentStep('organization-admin');
  };

  // Gestion du formulaire Organisation + Admin
  const handleOrganizationAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Générer le slug automatiquement si vide
      const slug = orgAdminData.organisationSlug || orgAdminData.organisationName.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      // Générer un code unique pour l'organisation
      const code = slug.toUpperCase().substring(0, 6) + Date.now().toString().slice(-4);

      // Créer l'organisation
      const { data: orgData, error: orgError } = await supabase
        .from('organisations')
        .insert({
          name: orgAdminData.organisationName,
          code: code,
          slug: slug,
          email: orgAdminData.adminEmail,
          subscription_type: orgAdminData.selectedPlan === 'annual' ? 'lifetime' : 'monthly',
          is_active: true
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Mettre à jour les données avec le code généré
      setOrgAdminData(prev => ({ ...prev, organisationCode: code }));

      toast.success('Organisation créée avec succès!');
      
      // Passer à la validation SMS
      setCurrentStep('sms-validation');
    } catch (error: any) {
      toast.error('Erreur lors de la création: ' + (error.message || 'Erreur inconnue'));
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion de la validation SMS
  const handleSmsValidation = async (code: string) => {
    console.log('✅ SMS validé:', code);
    
    try {
      // Créer le compte admin après validation SMS
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: orgAdminData.adminEmail,
        password: orgAdminData.adminPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: orgAdminData.adminName,
            phone: orgAdminData.adminPhone,
            role: 'admin'
          }
        }
      });

      if (authError) throw authError;

      // Créer l'entrée utilisateur
      if (authData.user) {
        // Récupérer l'organisation créée
        const { data: orgData } = await supabase
          .from('organisations')
          .select('id')
          .eq('code', orgAdminData.organisationCode)
          .single();

        if (orgData) {
          await supabase.from('users').insert({
            auth_user_id: authData.user.id,
            full_name: orgAdminData.adminName,
            phone: orgAdminData.adminPhone,
            role: 'admin',
            organisation_id: orgData.id,
            is_active: true
          });
        }
      }

      toast.success('Compte administrateur créé avec succès!');
      setCurrentStep('garage-setup');
    } catch (error: any) {
      toast.error('Erreur lors de la création du compte: ' + (error.message || 'Erreur inconnue'));
    }
  };

  const handleSmsRejection = () => {
    toast.error('Validation SMS annulée');
    setCurrentStep('organization-admin');
  };

  // Gestion du setup garage
  const handleGarageSetup = async (garageData: any) => {
    console.log('✅ Garage configuré:', garageData);
    
    // Ici on pourrait sauvegarder les données du garage
    toast.success('Configuration du garage terminée!');
    setCurrentStep('complete');
    
    // Rediriger vers l'authentification après un délai
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const handleInputChange = (field: keyof OrganizationAdminData, value: string) => {
    setOrgAdminData(prev => ({ ...prev, [field]: value }));
  };

  // Rendu selon l'étape
  switch (currentStep) {
    case 'super-admin':
      return (
        <SuperAdminSetupModal
          isOpen={isOpen}
          onComplete={handleSuperAdminCreated}
        />
      );

    case 'pricing':
      return (
        <PricingModal 
          isOpen={isOpen} 
          onSelectPlan={handlePlanSelection}
        />
      );

    case 'organization-admin':
      return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                Configuration Organisation & Admin
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleOrganizationAdminSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Informations de l'organisation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="organisationName">Nom de l'organisation *</Label>
                    <Input
                      id="organisationName"
                      value={orgAdminData.organisationName}
                      onChange={(e) => handleInputChange('organisationName', e.target.value)}
                      placeholder="Ex: Garage Central Abidjan"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="organisationSlug">Identifiant unique (slug)</Label>
                    <Input
                      id="organisationSlug"
                      value={orgAdminData.organisationSlug}
                      onChange={(e) => handleInputChange('organisationSlug', e.target.value)}
                      placeholder="garage-central-abidjan (généré automatiquement)"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Utilisé pour l'URL. Laissez vide pour génération automatique.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Compte administrateur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="adminName">Nom complet *</Label>
                    <Input
                      id="adminName"
                      value={orgAdminData.adminName}
                      onChange={(e) => handleInputChange('adminName', e.target.value)}
                      placeholder="Jean Kouassi"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="adminEmail" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email administrateur *
                    </Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={orgAdminData.adminEmail}
                      onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                      placeholder="admin@garagecentral.ci"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="adminPhone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Téléphone *
                    </Label>
                    <Input
                      id="adminPhone"
                      type="tel"
                      value={orgAdminData.adminPhone}
                      onChange={(e) => handleInputChange('adminPhone', e.target.value)}
                      placeholder="+225 07 XX XX XX XX"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="adminPassword" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Mot de passe *
                    </Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      value={orgAdminData.adminPassword}
                      onChange={(e) => handleInputChange('adminPassword', e.target.value)}
                      placeholder="Mot de passe sécurisé"
                      required
                      minLength={6}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Que se passe-t-il ensuite ?
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Un SMS de validation sera envoyé au numéro fourni</li>
                  <li>• Après validation, votre compte admin sera créé</li>
                  <li>• Vous configurerez ensuite votre garage (logo, détails)</li>
                  <li>• Plan sélectionné: <span className="font-semibold">{orgAdminData.selectedPlan}</span></li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !orgAdminData.organisationName || !orgAdminData.adminEmail || !orgAdminData.adminPassword || !orgAdminData.adminPhone || !orgAdminData.adminName}
              >
                {isLoading ? 'Création en cours...' : 'Continuer vers la validation SMS'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      );

    case 'sms-validation':
      return (
        <SmsValidationModal
          isOpen={isOpen}
          onClose={() => {}}
          onValidate={handleSmsValidation}
          onReject={handleSmsRejection}
          thirdPartyName="Système d'initialisation"
          vehicleInfo={{
            marque: "Configuration",
            modele: "Organisation",
            immatriculation: orgAdminData.organisationCode || "ORG-001"
          }}
          ownerPhone={orgAdminData.adminPhone}
          expiresAt={new Date(Date.now() + 15 * 60 * 1000)} // 15 minutes
        />
      );

    case 'garage-setup':
      return (
        <GarageSetupModal
          isOpen={isOpen}
          onComplete={handleGarageSetup}
        />
      );

    case 'complete':
      return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
          <DialogContent className="max-w-md text-center">
            <DialogHeader>
              <DialogTitle className="text-xl text-green-600">
                🎉 Configuration Terminée !
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Votre organisation et votre compte administrateur ont été créés avec succès.
              </p>
              <p className="text-sm text-blue-600">
                Redirection vers la page d'authentification...
              </p>
            </div>
          </DialogContent>
        </Dialog>
      );

    default:
      return null;
  }
};

export default InitializationWizard;