import React, { useEffect, useState } from 'react';
import { Wrench, Zap } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [logoScale, setLogoScale] = useState(0);

  useEffect(() => {
    // Animate logo entrance
    const timer1 = setTimeout(() => {
      setLogoScale(1);
    }, 100);

    // Hide splash screen after animation
    const timer2 = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-primary/10">
      <div className="text-center">
        <div 
          className="relative mb-8 transition-all duration-1000 ease-out"
          style={{ 
            transform: `scale(${logoScale})`,
            opacity: logoScale 
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 animate-spin-slow">
              <Zap className="w-32 h-32 text-primary opacity-30" />
            </div>
            <div className="animate-bounce-gentle">
              <Wrench className="w-32 h-32 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold text-primary mb-2">
            GarageManager Pro
          </h1>
          <p className="text-muted-foreground text-lg">
            Gestion moderne de garage
          </p>
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;