import React, { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';
import GarageSetupModal from '@/components/GarageSetupModal';
import Dashboard from '@/components/Dashboard';

interface GarageSetupData {
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  themeColor: string;
  logoFile: File | null;
}

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [garageData, setGarageData] = useState<GarageSetupData | null>(null);

  useEffect(() => {
    // Check if garage is already configured
    const savedGarageData = localStorage.getItem('garageData');
    if (savedGarageData) {
      setGarageData(JSON.parse(savedGarageData));
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    if (!garageData) {
      setShowSetup(true);
    }
  };

  const handleSetupComplete = (data: GarageSetupData) => {
    setGarageData(data);
    setShowSetup(false);
    localStorage.setItem('garageData', JSON.stringify(data));
    
    // Apply theme color to CSS root
    document.documentElement.style.setProperty('--primary', data.themeColor);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (showSetup) {
    return <GarageSetupModal isOpen={showSetup} onComplete={handleSetupComplete} />;
  }

  if (garageData) {
    return <Dashboard garageData={garageData} />;
  }

  return null;
};

export default Index;
