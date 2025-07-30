import React, { useState, useEffect } from 'react';
import { Car, Wrench, Zap, Building2, CheckCircle, Shield, Loader2, Crown, Users, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOrganisation } from '@/components/OrganisationProvider';
import { useMultiInstanceSetup } from '@/hooks/useMultiInstanceSetup';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { APP_CONFIG } from '@/lib/config';

// Import des nouveaux composants
import SuperAdminSetupModal from './SuperAdminSetupModal';
import PricingModal from './PricingModal';
import OrganisationCRUDModal from './OrganisationCRUDModal';
import AdminCRUDModal from './AdminCRUDModal';

interface UnifiedSplashScreenProps {
  onComplete: () => void;
}

const UnifiedSplashScreen: React.FC<UnifiedSplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const navigate = useNavigate();
  const { isAuthenticated, hasOrganisation, isLoading: authLoading } = useAuth();
  const { currentOrg, isLoading: orgLoading, needsOnboarding } = useOrganisation();

  // Hook pour l'initialisation multi-instances
  const {
    setupState,
    handleSuperAdminComplete,
    handlePlanSelect,
    handleOrganisationComplete,
    handleAdminComplete,
    handleAuthComplete
  } = useMultiInstanceSetup();

  const addLog = (message: string) => {
    if (APP_CONFIG.DEBUG_MODE) {
      console.log(`${APP_CONFIG.LOG_PREFIX} ${message}`);
      setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    }
  };

  const steps = [
    { name: 'Vérification Super-Admin', icon: Crown, color: 'from-green-500 to-emerald-600' },
    { name: 'Sélection du plan', icon: Sparkles, color: 'from-blue-500 to-cyan-600' },
    { name: 'Création de l\'organisation', icon: Building2, color: 'from-purple-500 to-pink-600' },
    { name: 'Configuration de l\'admin', icon: Users, color: 'from-orange-500 to-red-600' },
    { name: 'Authentification', icon: Shield, color: 'from-yellow-500 to-orange-500' },
    { name: 'Finalisation', icon: CheckCircle, color: 'from-green-500 to-teal-600' }
  ];

  useEffect(() => {
    addLog('Démarrage de l\'initialisation multi-instances...');

    const initializeApp = async () => {
      try {
        // Attendre que le setup state soit prêt
        if (setupState.isLoading) {
          addLog('Attente de la vérification de l\'état initial...');
          return;
        }

        // Mapper les étapes du setup vers les étapes visuelles
        const stepMapping: Record<string, number> = {
          'checking': 0,
          'super-admin': 0,
          'pricing': 1,
          'organisation': 2,
          'admin': 3,
          'auth': 4,
          'complete': 5
        };

        const currentStepIndex = stepMapping[setupState.step] || 0;
        const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

        setCurrentStep(currentStepIndex);
        setProgress(progressPercentage);

        addLog(`Étape actuelle: ${setupState.step} (${currentStepIndex + 1}/${steps.length})`);

        // Si l'initialisation est complète, rediriger
        if (setupState.step === 'complete') {
          setProgress(100);
          addLog('Initialisation multi-instances terminée');

          setShowCheckmark(true);
          setTimeout(() => {
            if (window.location.pathname === '/') {
              navigate('/dashboard', { replace: true });
            }
            onComplete();
          }, 500);
        }

      } catch (error) {
        addLog(`Erreur lors de l'initialisation: ${error}`);
        toast.error('Erreur lors de l\'initialisation');
        setTimeout(() => {
          navigate('/auth', { replace: true });
          onComplete();
        }, 800);
      }
    };

    initializeApp();
  }, [setupState, navigate, onComplete]);

  return (
    <>
      {/* Modals pour l'initialisation multi-instances */}
      <SuperAdminSetupModal
        isOpen={setupState.step === 'super-admin'}
        onComplete={handleSuperAdminComplete}
      />

      <PricingModal
        isOpen={setupState.step === 'pricing'}
        onSelectPlan={handlePlanSelect}
      />

      <OrganisationCRUDModal
        isOpen={setupState.step === 'organisation'}
        selectedPlan={setupState.selectedPlan || 'free'}
        onComplete={handleOrganisationComplete}
      />

      <AdminCRUDModal
        isOpen={setupState.step === 'admin'}
        organisationData={setupState.organisationData}
        onComplete={handleAdminComplete}
      />

      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50">
      {/* Particules animées en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-8">
        {/* Logo principal avec animation */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            {/* Cercle de fond animé */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-2 bg-slate-900 rounded-full flex items-center justify-center">
              <div className="relative">
                {/* Voiture principale */}
                <Car className="w-16 h-16 text-white animate-bounce" style={{ animationDuration: '2s' }} />
                {/* Voitures flottantes */}
                <Car className="absolute -top-4 -left-4 w-6 h-6 text-orange-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <Car className="absolute -bottom-4 -right-4 w-6 h-6 text-red-400 animate-pulse" style={{ animationDelay: '1s' }} />
                <Car className="absolute -top-2 -right-2 w-4 h-4 text-pink-400 animate-pulse" style={{ animationDelay: '1.5s' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Titre avec animation de typewriter */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white animate-fade-in">
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              Garage Pro
            </span>
          </h1>
          <p className="text-gray-300 text-lg animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Gestion intelligente de votre garage
          </p>

          {/* Informations du développeur */}
          <div className="mt-6 space-y-1 animate-fade-in" style={{ animationDelay: '1s' }}>
            <p className="text-blue-300 text-sm font-medium">
              Développé par <span className="text-blue-200 font-semibold">Thierry Gogo</span>
            </p>
            <p className="text-gray-400 text-xs">
              FullStack Developer • Freelance
            </p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-gray-500 text-xs">React • TypeScript • Supabase</span>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="w-80 mx-auto space-y-4">
          <div className="relative">
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-sm font-medium">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Étapes de chargement */}
          <div className="space-y-2">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div
                  key={index}
                  className={`flex items-center space-x-3 transition-all duration-300 ${
                    isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-gray-500'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${step.color}`
                      : isCompleted
                        ? 'bg-green-500'
                        : 'bg-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : isActive ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <StepIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className={`text-sm transition-all duration-300 ${
                    isActive ? 'font-medium' : ''
                  }`}>
                    {step.name}
                  </span>
                  {isActive && (
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Message de chargement */}
        <div className="text-gray-400 text-sm animate-pulse">
          {progress < 100 ? 'Sécurisation de votre session...' : 'Application prête !'}
        </div>

        {/* Logs de debug (visible en mode développement) */}
        {APP_CONFIG.DEBUG_MODE && (
          <div className="mt-4 p-4 bg-black/20 rounded-lg max-h-32 overflow-y-auto">
            <p className="text-xs text-gray-400 mb-2">Logs de debug:</p>
            {logs.slice(-5).map((log, index) => (
              <p key={index} className="text-xs text-gray-300">{log}</p>
            ))}
          </div>
        )}
      </div>

      {/* Animation de fin avec checkmark */}
      {showCheckmark && (
        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center animate-fade-in">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-scale-in">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default UnifiedSplashScreen;
