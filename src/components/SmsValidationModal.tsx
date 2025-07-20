import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Shield
} from 'lucide-react';

interface SmsValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onValidate: (code: string) => void;
  onReject: () => void;
  thirdPartyName: string;
  vehicleInfo: {
    marque: string;
    modele: string;
    immatriculation: string;
  };
  ownerPhone: string;
  expiresAt: Date;
}

const SmsValidationModal: React.FC<SmsValidationModalProps> = ({
  isOpen,
  onClose,
  onValidate,
  onReject,
  thirdPartyName,
  vehicleInfo,
  ownerPhone,
  expiresAt
}) => {
  const [smsCode, setSmsCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [canResend, setCanResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  // Calculer le temps restant
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const difference = expiry - now;

      if (difference > 0) {
        setTimeLeft(Math.floor(difference / 1000));
      } else {
        setTimeLeft(0);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  // Gérer le renvoi de SMS
  useEffect(() => {
    if (resendCount === 0) {
      setCanResend(true);
    } else {
      const timer = setTimeout(() => {
        setCanResend(true);
      }, 60000); // 1 minute d'attente

      return () => clearTimeout(timer);
    }
  }, [resendCount]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleValidate = async () => {
    if (smsCode.length !== 6) {
      setError('Le code doit contenir 6 chiffres');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      // Simulation de validation
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Vérifier si le code est valide (simulation)
      if (smsCode === '123456') { // Code de test
        onValidate(smsCode);
      } else {
        setError('Code invalide. Veuillez réessayer.');
      }
    } catch (error) {
      setError('Erreur lors de la validation. Veuillez réessayer.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleResendSms = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendCount(prev => prev + 1);

    try {
      // Simulation d'envoi de nouveau SMS
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Nouveau SMS envoyé au propriétaire');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du SMS:', error);
    }
  };

  const handleReject = () => {
    onReject();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Phone className="w-5 h-5 text-green-600" />
            Validation Propriétaire
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations de la demande */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Demande de Dépôt</CardTitle>
              <CardDescription>
                {thirdPartyName} souhaite déposer votre véhicule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Véhicule :</span>
                <span>{vehicleInfo.marque} {vehicleInfo.modele}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Immatriculation :</span>
                <Badge variant="outline">{vehicleInfo.immatriculation}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tiers :</span>
                <span className="text-blue-600">{thirdPartyName}</span>
              </div>
            </CardContent>
          </Card>

          {/* Code SMS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange-600" />
                Code de Validation
              </CardTitle>
              <CardDescription>
                Entrez le code reçu par SMS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smsCode">Code SMS (6 chiffres)</Label>
                <Input
                  id="smsCode"
                  value={smsCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setSmsCode(value);
                    setError('');
                  }}
                  placeholder="123456"
                  className="text-center text-2xl font-mono tracking-widest"
                  maxLength={6}
                />
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
              </div>

              {/* Timer */}
              <div className="text-center">
                {timeLeft > 0 ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Expire dans : {formatTime(timeLeft)}</span>
                  </div>
                ) : (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      Le code a expiré. Demandez un nouveau code.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Renvoi SMS */}
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResendSms}
                  disabled={!canResend || timeLeft > 0}
                  className="text-sm"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  {canResend ? 'Renvoyer le code' : 'Attendez 1 minute'}
                </Button>
                {resendCount > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Renvoi #{resendCount}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReject}
              className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Refuser
            </Button>
            <Button
              onClick={handleValidate}
              disabled={smsCode.length !== 6 || isValidating || timeLeft === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {isValidating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Validation...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Valider
                </>
              )}
            </Button>
          </div>

          {/* Informations légales */}
          <Alert className="border-blue-200 bg-blue-50">
            <Shield className="w-4 h-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              En validant, vous autorisez {thirdPartyName} à déposer votre véhicule.
              Vous pouvez annuler cette autorisation à tout moment.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SmsValidationModal;
