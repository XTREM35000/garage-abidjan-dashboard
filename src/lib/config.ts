// Configuration centrale pour le garage
export const GARAGE_CONFIG = {
  // Informations du garage
  name: 'Garage Excellence Abidjan',
  owner: 'Thierry Gogo',
  address: 'Cocody, Abidjan, Côte d\'Ivoire',
  phone: '+225 07 58 96 61 56',
  email: 'contact@garage-abidjan.com',

  // Configuration monétaire
  currency: {
    code: 'XOF',
    symbol: 'FCFA',
    name: 'Franc CFA',
    locale: 'fr-FR',
    exchangeRate: 1, // Taux de change par rapport à l'euro (1 XOF = 0.00152 EUR)
  },

  // Paramètres régionaux
  region: {
    country: 'Côte d\'Ivoire',
    city: 'Abidjan',
    timezone: 'Africa/Abidjan',
    language: 'fr',
  },

  // Configuration des prix par défaut
  defaultPrices: {
    // Services de base
    vidange: 45000,
    revision: 75000,
    diagnostic: 25000,
    reparationFreinage: 125000,
    reparationMoteur: 180000,
    climatisation: 95000,

    // Pièces courantes
    filtreHuile: 2500,
    filtreAir: 1800,
    plaquettesFrein: 8500,
    disquesFrein: 15000,
    batterie: 45000,
    huileMoteur: 3500,
    bougies: 1200,
    liquideRefroidissement: 1200,
    courroieDistribution: 25000,
  },

  // Seuils d'alerte pour le stock
  stockThresholds: {
    filtreHuile: 5,
    plaquettesFrein: 3,
    batterie: 2,
    huileMoteur: 8,
    bougies: 6,
    disquesFrein: 4,
    filtreAir: 4,
    liquideRefroidissement: 10,
    courroieDistribution: 2,
  },

  // Fournisseurs principaux
  suppliers: [
    'Total Côte d\'Ivoire',
    'Brembo Distribution',
    'Exide Technologies',
    'NGK Spark Plugs',
    'Mann Filter',
    'Gates Corporation',
  ],

  // Catégories de véhicules courants en Côte d'Ivoire
  vehicleCategories: [
    'Toyota',
    'Peugeot',
    'Renault',
    'Hyundai',
    'Dacia',
    'Suzuki',
    'Nissan',
    'Mitsubishi',
  ],

  // Modèles de véhicules populaires
  popularVehicles: [
    'Toyota Corolla',
    'Toyota Hilux',
    'Peugeot 206',
    'Peugeot 208',
    'Renault Logan',
    'Renault Clio',
    'Hyundai i10',
    'Dacia Sandero',
    'Suzuki Swift',
  ],

  // Services proposés
  services: [
    'Vidange et filtres',
    'Révision complète',
    'Diagnostic moteur',
    'Réparation freinage',
    'Réparation moteur',
    'Réparation climatisation',
    'Remplacement embrayage',
    'Réparation électrique',
    'Réparation suspension',
    'Réparation transmission',
  ],

  // Statuts des réparations
  repairStatuses: [
    { value: 'en_attente', label: 'En attente', color: 'yellow' },
    { value: 'en_cours', label: 'En cours', color: 'blue' },
    { value: 'termine', label: 'Terminé', color: 'green' },
    { value: 'annule', label: 'Annulé', color: 'red' },
  ],

  // Statuts des clients
  clientStatuses: [
    { value: 'nouveau', label: 'Nouveau', color: 'blue' },
    { value: 'actif', label: 'Actif', color: 'green' },
    { value: 'vip', label: 'VIP', color: 'purple' },
    { value: 'inactif', label: 'Inactif', color: 'gray' },
  ],
};

// Interface pour la configuration du garage
export interface GarageConfig {
  garageName: string;
  ownerName: string;
  logo: string | null;
  address: string;
  phone: string;
  email?: string;
  rccm?: string;
  taxRegime?: 'reel' | 'simplifie';
  taxId?: string;
  cni?: string;
}

// Fonction pour vérifier si la configuration est complète
export const isConfigurationComplete = (): boolean => {
  const garageConfig = localStorage.getItem('garageConfig');
  const brainCompleted = localStorage.getItem('brainCompleted');

  return !!(garageConfig && brainCompleted === 'true');
};

// Fonction pour obtenir la configuration du garage
export const getGarageConfig = (): GarageConfig | null => {
  const config = localStorage.getItem('garageConfig');
  return config ? JSON.parse(config) : null;
};

// Fonction pour sauvegarder la configuration du garage
export const saveGarageConfig = (config: GarageConfig): void => {
  localStorage.setItem('garageConfig', JSON.stringify(config));
  localStorage.setItem('brainCompleted', 'true');
};

// Fonction pour formater les prix en FCFA
export const formatPrice = (amount: number, currency: string = 'XOF'): string => {
  if (currency === 'XOF') {
    return `${amount.toLocaleString('fr-FR')} FCFA`;
  }
  return `${amount.toLocaleString('fr-FR')} ${currency}`;
};

// Fonction pour convertir les prix
export const convertPrice = (amount: number, fromCurrency: string, toCurrency: string): number => {
  const rates = {
    XOF: 1,
    EUR: 0.00152,
    USD: 0.00167,
  };

  const amountInXOF = amount / rates[fromCurrency as keyof typeof rates];
  return amountInXOF * rates[toCurrency as keyof typeof rates];
};

// Fonction pour obtenir les informations de devise
export const getCurrencyInfo = (currencyCode: string) => {
  const currencies = {
    XOF: { symbol: 'FCFA', name: 'Franc CFA', locale: 'fr-FR' },
    EUR: { symbol: '€', name: 'Euro', locale: 'fr-FR' },
    USD: { symbol: '$', name: 'Dollar US', locale: 'en-US' },
  };

  return currencies[currencyCode as keyof typeof currencies] || currencies.XOF;
};

export default GARAGE_CONFIG;
