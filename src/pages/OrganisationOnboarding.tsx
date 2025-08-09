import React, { useState } from 'react';
import PricingModal from '@/components/PricingModal';
import { AdminApprovalNotice } from '@/components/AdminApprovalNotice';
import { InitialSetupWizard } from '@/components/InitialSetupWizard';
import { submitForApproval } from '@/lib/api/organisation';
import { useNavigate } from 'react-router-dom';

export function OrganisationOnboarding() {
  const [step, setStep] = useState<'pricing' | 'approval' | 'setup'>('pricing');
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {step === 'pricing' && (
          <PricingModal
            isOpen={true}
            onSelectPlan={(plan) => {
              setStep('approval');
              submitForApproval(plan);
            }}
          />
        )}

        {step === 'approval' && (
          <AdminApprovalNotice
            onApproved={() => setStep('setup')}
          />
        )}

        {step === 'setup' && (
          <InitialSetupWizard
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  );
}
