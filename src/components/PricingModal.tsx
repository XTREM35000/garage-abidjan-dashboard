import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  Star,
  Zap,
  Crown,
  Sparkles,
  Users,
  Shield,
  Clock,
  Infinity
} from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
}

interface PricingModalProps {
  isOpen: boolean;
  onSelectPlan: (planId: string) => void;
}

const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onSelectPlan
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Gratuit',
      price: '0',
      period: 'À vie',
      description: 'Parfait pour commencer avec votre garage',
      icon: Star,
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-600',
      features: [
        '1 organisation',
        'Jusqu\'à 5 utilisateurs',
        'Gestion des véhicules',
        'Suivi des réparations',
        'Stock de base',
        'Support email'
      ]
    },
    {
      id: 'monthly',
      name: 'Mensuel',
      price: '25 000',
      period: 'par mois',
      description: 'Solution flexible pour les garages en croissance',
      icon: Zap,
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-600',
      popular: true,
      features: [
        'Organisations illimitées',
        'Utilisateurs illimités',
        'Toutes les fonctionnalités',
        'Support prioritaire',
        'Sauvegarde automatique',
        'API d\'intégration',
        'Rapports avancés',
        'Notifications SMS'
      ]
    },
    {
      id: 'lifetime',
      name: 'À VIE',
      price: '500 000',
      period: 'une fois',
      description: 'Investissement unique pour votre succès',
      icon: Crown,
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-600',
      features: [
        'Tout inclus à vie',
        'Mises à jour gratuites',
        'Support premium',
        'Formation personnalisée',
        'Migration de données',
        'Déploiement sur site',
        'Personnalisation avancée',
        'Accès anticipé aux nouvelles fonctionnalités'
      ]
    }
  ];

  const handlePlanSelect = async (planId: string) => {
    setSelectedPlan(planId);
    setIsLoading(true);

    // Simuler un délai pour l'animation
    setTimeout(() => {
      setIsLoading(false);
      onSelectPlan(planId);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 border-blue-200 dark:border-blue-700">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-3xl font-bold text-slate-800 dark:text-slate-200">
            Choisissez votre plan
          </DialogTitle>
          <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">
            Sélectionnez le plan qui correspond le mieux à vos besoins
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {plans.map((plan) => {
            const PlanIcon = plan.icon;
            const isSelected = selectedPlan === plan.id;

            return (
              <Card
                key={plan.id}
                className={`relative transition-all duration-300 transform hover:scale-105 cursor-pointer border-2 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                } ${plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    <Star className="w-3 h-3 mr-1" />
                    Populaire
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto mb-4 w-12 h-12 bg-gradient-to-r ${plan.gradient} rounded-full flex items-center justify-center`}>
                    <PlanIcon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className={`text-xl font-bold ${plan.color}`}>
                    {plan.name}
                  </CardTitle>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Prix */}
                  <div className="text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                        {plan.price === '0' ? 'Gratuit' : `${plan.price} FCFA`}
                      </span>
                      {plan.price !== '0' && (
                        <span className="text-slate-500 dark:text-slate-400 text-sm">
                          /{plan.period}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Fonctionnalités */}
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bouton de sélection */}
                  <Button
                    className={`w-full transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-600 hover:text-white'
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading && isSelected ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sélection en cours...
                      </div>
                    ) : isSelected ? (
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Plan sélectionné
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Choisir ce plan
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                Garantie et support
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Tous nos plans incluent une garantie de satisfaction et un support technique.
                Vous pouvez changer de plan à tout moment selon vos besoins.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
