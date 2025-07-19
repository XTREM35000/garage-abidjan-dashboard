export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          nom: string
          prenom: string
          telephone: string
          email: string | null
          adresse: string | null
          date_naissance: string | null
          numero_permis: string | null
          date_creation: string
          date_modification: string
          notes: string | null
          statut: 'actif' | 'inactif' | 'bloque'
        }
        Insert: {
          id?: string
          nom: string
          prenom: string
          telephone: string
          email?: string | null
          adresse?: string | null
          date_naissance?: string | null
          numero_permis?: string | null
          date_creation?: string
          date_modification?: string
          notes?: string | null
          statut?: 'actif' | 'inactif' | 'bloque'
        }
        Update: {
          id?: string
          nom?: string
          prenom?: string
          telephone?: string
          email?: string | null
          adresse?: string | null
          date_naissance?: string | null
          numero_permis?: string | null
          date_creation?: string
          date_modification?: string
          notes?: string | null
          statut?: 'actif' | 'inactif' | 'bloque'
        }
      }
      vehicules: {
        Row: {
          id: string
          client_id: string
          marque: string
          modele: string
          annee: number | null
          immatriculation: string
          couleur: string | null
          kilometrage: number | null
          carburant: 'essence' | 'diesel' | 'hybride' | 'electrique' | null
          transmission: 'manuelle' | 'automatique' | null
          date_acquisition: string | null
          date_creation: string
          date_modification: string
          statut: 'actif' | 'hors_service' | 'vendu'
        }
        Insert: {
          id?: string
          client_id: string
          marque: string
          modele: string
          annee?: number | null
          immatriculation: string
          couleur?: string | null
          kilometrage?: number | null
          carburant?: 'essence' | 'diesel' | 'hybride' | 'electrique' | null
          transmission?: 'manuelle' | 'automatique' | null
          date_acquisition?: string | null
          date_creation?: string
          date_modification?: string
          statut?: 'actif' | 'hors_service' | 'vendu'
        }
        Update: {
          id?: string
          client_id?: string
          marque?: string
          modele?: string
          annee?: number | null
          immatriculation?: string
          couleur?: string | null
          kilometrage?: number | null
          carburant?: 'essence' | 'diesel' | 'hybride' | 'electrique' | null
          transmission?: 'manuelle' | 'automatique' | null
          date_acquisition?: string | null
          date_creation?: string
          date_modification?: string
          statut?: 'actif' | 'hors_service' | 'vendu'
        }
      }
      interventions: {
        Row: {
          id: string
          vehicule_id: string
          client_id: string
          type_intervention: string
          description: string | null
          date_debut: string
          date_fin: string | null
          duree_estimee: number | null
          duree_reelle: number | null
          cout_estime: number | null
          cout_final: number | null
          statut: 'en_attente' | 'en_cours' | 'termine' | 'annule'
          priorite: 'basse' | 'normale' | 'haute' | 'urgente'
          mecaniciens: string[] | null
          pieces_utilisees: Json | null
          notes: string | null
          date_creation: string
          date_modification: string
        }
        Insert: {
          id?: string
          vehicule_id: string
          client_id: string
          type_intervention: string
          description?: string | null
          date_debut?: string
          date_fin?: string | null
          duree_estimee?: number | null
          duree_reelle?: number | null
          cout_estime?: number | null
          cout_final?: number | null
          statut?: 'en_attente' | 'en_cours' | 'termine' | 'annule'
          priorite?: 'basse' | 'normale' | 'haute' | 'urgente'
          mecaniciens?: string[] | null
          pieces_utilisees?: Json | null
          notes?: string | null
          date_creation?: string
          date_modification?: string
        }
        Update: {
          id?: string
          vehicule_id?: string
          client_id?: string
          type_intervention?: string
          description?: string | null
          date_debut?: string
          date_fin?: string | null
          duree_estimee?: number | null
          duree_reelle?: number | null
          cout_estime?: number | null
          cout_final?: number | null
          statut?: 'en_attente' | 'en_cours' | 'termine' | 'annule'
          priorite?: 'basse' | 'normale' | 'haute' | 'urgente'
          mecaniciens?: string[] | null
          pieces_utilisees?: Json | null
          notes?: string | null
          date_creation?: string
          date_modification?: string
        }
      }
      pieces: {
        Row: {
          id: string
          reference: string
          nom: string
          description: string | null
          categorie: string | null
          marque: string | null
          prix_achat: number | null
          prix_vente: number | null
          stock_actuel: number
          stock_minimum: number
          fournisseur: string | null
          date_creation: string
          date_modification: string
          statut: 'actif' | 'inactif' | 'rupture'
        }
        Insert: {
          id?: string
          reference: string
          nom: string
          description?: string | null
          categorie?: string | null
          marque?: string | null
          prix_achat?: number | null
          prix_vente?: number | null
          stock_actuel?: number
          stock_minimum?: number
          fournisseur?: string | null
          date_creation?: string
          date_modification?: string
          statut?: 'actif' | 'inactif' | 'rupture'
        }
        Update: {
          id?: string
          reference?: string
          nom?: string
          description?: string | null
          categorie?: string | null
          marque?: string | null
          prix_achat?: number | null
          prix_vente?: number | null
          stock_actuel?: number
          stock_minimum?: number
          fournisseur?: string | null
          date_creation?: string
          date_modification?: string
          statut?: 'actif' | 'inactif' | 'rupture'
        }
      }
      medias: {
        Row: {
          id: string
          type: 'gif' | 'image' | 'video'
          url: string
          titre: string | null
          description: string | null
          categorie: string | null
          tags: string[] | null
          taille: number | null
          largeur: number | null
          hauteur: number | null
          date_creation: string
          statut: 'actif' | 'inactif'
        }
        Insert: {
          id?: string
          type: 'gif' | 'image' | 'video'
          url: string
          titre?: string | null
          description?: string | null
          categorie?: string | null
          tags?: string[] | null
          taille?: number | null
          largeur?: number | null
          hauteur?: number | null
          date_creation?: string
          statut?: 'actif' | 'inactif'
        }
        Update: {
          id?: string
          type?: 'gif' | 'image' | 'video'
          url?: string
          titre?: string | null
          description?: string | null
          categorie?: string | null
          tags?: string[] | null
          taille?: number | null
          largeur?: number | null
          hauteur?: number | null
          date_creation?: string
          statut?: 'actif' | 'inactif'
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          nom: string | null
          prenom: string | null
          role: 'proprietaire' | 'chef-garagiste' | 'technicien' | 'comptable'
          telephone: string | null
          avatar_url: string | null
          date_creation: string
          date_modification: string
          statut: 'actif' | 'inactif' | 'bloque'
        }
        Insert: {
          id: string
          email: string
          nom?: string | null
          prenom?: string | null
          role?: 'proprietaire' | 'chef-garagiste' | 'technicien' | 'comptable'
          telephone?: string | null
          avatar_url?: string | null
          date_creation?: string
          date_modification?: string
          statut?: 'actif' | 'inactif' | 'bloque'
        }
        Update: {
          id?: string
          email?: string
          nom?: string | null
          prenom?: string | null
          role?: 'proprietaire' | 'chef-garagiste' | 'technicien' | 'comptable'
          telephone?: string | null
          avatar_url?: string | null
          date_creation?: string
          date_modification?: string
          statut?: 'actif' | 'inactif' | 'bloque'
        }
      }
      notifications: {
        Row: {
          id: string
          type: string
          titre: string
          message: string
          donnees: Json | null
          utilisateur_id: string | null
          date_creation: string
          date_lecture: string | null
          statut: 'non_lu' | 'lu' | 'archive'
        }
        Insert: {
          id?: string
          type: string
          titre: string
          message: string
          donnees?: Json | null
          utilisateur_id?: string | null
          date_creation?: string
          date_lecture?: string | null
          statut?: 'non_lu' | 'lu' | 'archive'
        }
        Update: {
          id?: string
          type?: string
          titre?: string
          message?: string
          donnees?: Json | null
          utilisateur_id?: string | null
          date_creation?: string
          date_lecture?: string | null
          statut?: 'non_lu' | 'lu' | 'archive'
        }
      }
      statistiques: {
        Row: {
          id: string
          date: string
          type: string
          valeur: Json
          date_creation: string
        }
        Insert: {
          id?: string
          date: string
          type: string
          valeur: Json
          date_creation?: string
        }
        Update: {
          id?: string
          date?: string
          type?: string
          valeur?: Json
          date_creation?: string
        }
      }
    }
    Views: {
      interventions_completes: {
        Row: {
          id: string | null
          vehicule_id: string | null
          client_id: string | null
          type_intervention: string | null
          description: string | null
          date_debut: string | null
          date_fin: string | null
          duree_estimee: number | null
          duree_reelle: number | null
          cout_estime: number | null
          cout_final: number | null
          statut: string | null
          priorite: string | null
          mecaniciens: string[] | null
          pieces_utilisees: Json | null
          notes: string | null
          date_creation: string | null
          date_modification: string | null
          marque: string | null
          modele: string | null
          immatriculation: string | null
          client_nom: string | null
          client_prenom: string | null
          client_telephone: string | null
        }
      }
      pieces_stock_faible: {
        Row: {
          id: string | null
          reference: string | null
          nom: string | null
          description: string | null
          categorie: string | null
          marque: string | null
          prix_achat: number | null
          prix_vente: number | null
          stock_actuel: number | null
          stock_minimum: number | null
          fournisseur: string | null
          date_creation: string | null
          date_modification: string | null
          statut: string | null
          statut_stock: string | null
        }
      }
    }
    Functions: {
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      search_clients: {
        Args: {
          search_term: string
        }
        Returns: {
          id: string
          nom: string
          prenom: string
          telephone: string
          email: string | null
          adresse: string | null
          statut: string
        }[]
      }
      get_vehicle_history: {
        Args: {
          vehicle_id: string
        }
        Returns: {
          id: string
          type_intervention: string
          description: string | null
          date_debut: string
          date_fin: string | null
          statut: string
          cout_final: number | null
          mecaniciens: string[] | null
        }[]
      }
      create_notification: {
        Args: {
          p_type: string
          p_titre: string
          p_message: string
          p_donnees?: Json
          p_utilisateur_id?: string
        }
        Returns: string
      }
      mark_notification_read: {
        Args: {
          notification_id: string
        }
        Returns: boolean
      }
      get_unread_notifications: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          type: string
          titre: string
          message: string
          donnees: Json | null
          date_creation: string
        }[]
      }
      cleanup_old_notifications: {
        Args: {
          days_to_keep?: number
        }
        Returns: number
      }
      get_notification_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
    }
    Enums: {
      client_statut: 'actif' | 'inactif' | 'bloque'
      vehicule_statut: 'actif' | 'hors_service' | 'vendu'
      intervention_statut: 'en_attente' | 'en_cours' | 'termine' | 'annule'
      intervention_priorite: 'basse' | 'normale' | 'haute' | 'urgente'
      piece_statut: 'actif' | 'inactif' | 'rupture'
      media_type: 'gif' | 'image' | 'video'
      media_statut: 'actif' | 'inactif'
      profile_role: 'proprietaire' | 'chef-garagiste' | 'technicien' | 'comptable'
      profile_statut: 'actif' | 'inactif' | 'bloque'
      notification_statut: 'non_lu' | 'lu' | 'archive'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
    ? (Database["public"]["Tables"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
    ? (Database["public"]["Tables"])[PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
    ? (Database["public"]["Tables"])[PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof (Database["public"]["Enums"])
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicEnumNameOrOptions["schema"]]["Enums"])
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicEnumNameOrOptions["schema"]]["Enums"])[EnumName]
  : PublicEnumNameOrOptions extends keyof (Database["public"]["Enums"])
    ? (Database["public"]["Enums"])[PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof (Database["public"]["CompositeTypes"])
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"])
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"])[CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof (Database["public"]["CompositeTypes"])
    ? (Database["public"]["CompositeTypes"])[PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
