// Configuration de l'application basée sur les variables d'environnement
export const appConfig = {
  // Configuration Supabase
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key',
  },

  // Configuration du Garage (valeurs par défaut)
  garage: {
    name: import.meta.env.VITE_GARAGE_NAME || 'Garage Excellence Abidjan',
    owner: import.meta.env.VITE_GARAGE_OWNER || 'Thierry Gogo',
    address: import.meta.env.VITE_GARAGE_ADDRESS || '123 Avenue des Champs, Cocody, Abidjan',
    phone: import.meta.env.VITE_GARAGE_PHONE || '+225 07 58 96 61 56',
    email: import.meta.env.VITE_GARAGE_EMAIL || 'contact@garage-abidjan.com',
    rccm: import.meta.env.VITE_GARAGE_RCCM || 'CI-ABJ-2024-B-12345',
    taxRegime: (import.meta.env.VITE_GARAGE_TAX_REGIME as 'reel' | 'simplifie') || 'reel',
    taxId: import.meta.env.VITE_GARAGE_TAX_ID || '123456789',
    cni: import.meta.env.VITE_GARAGE_CNI || '1234567890123456',
  },

  // Configuration Stripe (ne pas afficher dans l'interface)
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || '',
    webhookSecret: import.meta.env.VITE_STRIPE_WEBHOOK_SECRET || '',
  },

  // Configuration de l'application
  app: {
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
    defaultTheme: import.meta.env.VITE_DEFAULT_THEME || 'light',
    garageImages: import.meta.env.VITE_GARAGE_IMAGES === 'true',
  },
};

// Fonction pour obtenir la configuration du garage depuis localStorage ou les valeurs par défaut
export const getGarageConfig = () => {
  const storedConfig = localStorage.getItem('garageConfig');
  if (storedConfig) {
    try {
      return JSON.parse(storedConfig);
    } catch (error) {
      console.error('Erreur lors du parsing de la configuration:', error);
    }
  }

  // Retourner les valeurs par défaut si aucune configuration n'est stockée
  return {
    garageName: appConfig.garage.name,
    ownerName: appConfig.garage.owner,
    logo: null,
    address: appConfig.garage.address,
    phone: appConfig.garage.phone,
    email: appConfig.garage.email,
    rccm: appConfig.garage.rccm,
    taxRegime: appConfig.garage.taxRegime,
    taxId: appConfig.garage.taxId,
    cni: appConfig.garage.cni,
  };
};

// Fonction pour sauvegarder la configuration du garage
export const saveGarageConfig = (config: any) => {
  localStorage.setItem('garageConfig', JSON.stringify(config));
  localStorage.setItem('brainCompleted', 'true');
};

// Fonction pour vérifier si la configuration est complète
export const isConfigurationComplete = () => {
  const brainCompleted = localStorage.getItem('brainCompleted') === 'true';
  const garageConfig = localStorage.getItem('garageConfig');
  const garageData = localStorage.getItem('garageData');
  const userData = localStorage.getItem('user');

  return Boolean(brainCompleted && garageConfig && garageData && userData);
};

// Fonction pour obtenir les informations du garage pour les factures/devis
export const getGarageInfoForDocuments = () => {
  const config = getGarageConfig();
  return {
    name: config.garageName,
    owner: config.ownerName,
    address: config.address,
    phone: config.phone,
    email: config.email,
    logo: config.logo,
    rccm: config.rccm,
    taxRegime: config.taxRegime,
    taxId: config.taxId,
  };
};
