import { supabase } from './client';

// Types pour les données
export interface Client {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  adresse?: string;
  date_naissance?: string;
  numero_permis?: string;
  date_creation: string;
  date_modification: string;
  notes?: string;
  statut: 'actif' | 'inactif' | 'bloque';
}

export interface Vehicule {
  id: string;
  client_id: string;
  marque: string;
  modele: string;
  annee?: number;
  immatriculation: string;
  couleur?: string;
  kilometrage?: number;
  carburant?: 'essence' | 'diesel' | 'hybride' | 'electrique';
  transmission?: 'manuelle' | 'automatique';
  date_acquisition?: string;
  date_creation: string;
  date_modification: string;
  statut: 'actif' | 'hors_service' | 'vendu';
}

export interface Intervention {
  id: string;
  vehicule_id: string;
  client_id: string;
  type_intervention: string;
  description?: string;
  date_debut: string;
  date_fin?: string;
  duree_estimee?: number;
  duree_reelle?: number;
  cout_estime?: number;
  cout_final?: number;
  statut: 'en_attente' | 'en_cours' | 'termine' | 'annule';
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
  mecaniciens?: string[];
  pieces_utilisees?: any;
  notes?: string;
  date_creation: string;
  date_modification: string;
}

export interface Piece {
  id: string;
  reference: string;
  nom: string;
  description?: string;
  categorie?: string;
  marque?: string;
  prix_achat?: number;
  prix_vente?: number;
  stock_actuel: number;
  stock_minimum: number;
  fournisseur?: string;
  date_creation: string;
  date_modification: string;
  statut: 'actif' | 'inactif' | 'rupture';
}

export interface Media {
  id: string;
  type: 'gif' | 'image' | 'video';
  url: string;
  titre?: string;
  description?: string;
  categorie?: string;
  tags?: string[];
  taille?: number;
  largeur?: number;
  hauteur?: number;
  date_creation: string;
  statut: 'actif' | 'inactif';
}

// Service pour les clients
export const ClientService = {
  async getAll(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('date_creation', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(client: Omit<Client, 'id' | 'date_creation' | 'date_modification'>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async search(query: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .or(`nom.ilike.%${query}%,prenom.ilike.%${query}%,telephone.ilike.%${query}%`)
      .order('nom', { ascending: true });

    if (error) throw error;
    return data || [];
  }
};

// Service pour les véhicules
export const VehiculeService = {
  async getAll(): Promise<Vehicule[]> {
    const { data, error } = await supabase
      .from('vehicules')
      .select('*, clients(nom, prenom, telephone)')
      .order('date_creation', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByClientId(clientId: string): Promise<Vehicule[]> {
    const { data, error } = await supabase
      .from('vehicules')
      .select('*')
      .eq('client_id', clientId)
      .order('date_creation', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(vehicule: Omit<Vehicule, 'id' | 'date_creation' | 'date_modification'>): Promise<Vehicule> {
    const { data, error } = await supabase
      .from('vehicules')
      .insert([vehicule])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Vehicule>): Promise<Vehicule> {
    const { data, error } = await supabase
      .from('vehicules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('vehicules')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Service pour les interventions
export const InterventionService = {
  async getAll(): Promise<Intervention[]> {
    const { data, error } = await supabase
      .from('interventions')
      .select(`
        *,
        vehicules(marque, modele, immatriculation),
        clients(nom, prenom, telephone)
      `)
      .order('date_debut', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByStatus(status: Intervention['statut']): Promise<Intervention[]> {
    const { data, error } = await supabase
      .from('interventions')
      .select(`
        *,
        vehicules(marque, modele, immatriculation),
        clients(nom, prenom, telephone)
      `)
      .eq('statut', status)
      .order('date_debut', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(intervention: Omit<Intervention, 'id' | 'date_creation' | 'date_modification'>): Promise<Intervention> {
    const { data, error } = await supabase
      .from('interventions')
      .insert([intervention])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Intervention>): Promise<Intervention> {
    const { data, error } = await supabase
      .from('interventions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('interventions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Service pour les pièces
export const PieceService = {
  async getAll(): Promise<Piece[]> {
    const { data, error } = await supabase
      .from('pieces')
      .select('*')
      .order('nom', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getByCategory(category: string): Promise<Piece[]> {
    const { data, error } = await supabase
      .from('pieces')
      .select('*')
      .eq('categorie', category)
      .order('nom', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getLowStock(): Promise<Piece[]> {
    const { data, error } = await supabase
      .from('pieces')
      .select('*')
      .lte('stock_actuel', 'stock_minimum')
      .order('stock_actuel', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async create(piece: Omit<Piece, 'id' | 'date_creation' | 'date_modification'>): Promise<Piece> {
    const { data, error } = await supabase
      .from('pieces')
      .insert([piece])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Piece>): Promise<Piece> {
    const { data, error } = await supabase
      .from('pieces')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('pieces')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Service pour les médias
export const MediaService = {
  async getAll(): Promise<Media[]> {
    const { data, error } = await supabase
      .from('medias')
      .select('*')
      .order('date_creation', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByCategory(category: string): Promise<Media[]> {
    const { data, error } = await supabase
      .from('medias')
      .select('*')
      .eq('categorie', category)
      .eq('statut', 'actif')
      .order('date_creation', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByType(type: Media['type']): Promise<Media[]> {
    const { data, error } = await supabase
      .from('medias')
      .select('*')
      .eq('type', type)
      .eq('statut', 'actif')
      .order('date_creation', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(media: Omit<Media, 'id' | 'date_creation'>): Promise<Media> {
    const { data, error } = await supabase
      .from('medias')
      .insert([media])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('medias')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Service pour les statistiques
export const StatistiqueService = {
  async getDashboardStats() {
    const [
      { count: clientsCount },
      { count: vehiculesCount },
      { count: interventionsEnCours },
      { count: piecesLowStock }
    ] = await Promise.all([
      supabase.from('clients').select('*', { count: 'exact', head: true }),
      supabase.from('vehicules').select('*', { count: 'exact', head: true }),
      supabase.from('interventions').select('*', { count: 'exact', head: true }).eq('statut', 'en_cours'),
      supabase.from('pieces').select('*', { count: 'exact', head: true }).lte('stock_actuel', 'stock_minimum')
    ]);

    return {
      clients: clientsCount || 0,
      vehicules: vehiculesCount || 0,
      interventionsEnCours: interventionsEnCours || 0,
      piecesLowStock: piecesLowStock || 0
    };
  },

  async getInterventionsByStatus() {
    const { data, error } = await supabase
      .from('interventions')
      .select('statut')
      .gte('date_debut', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    const stats = data?.reduce((acc, item) => {
      acc[item.statut] = (acc[item.statut] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return stats;
  }
};
