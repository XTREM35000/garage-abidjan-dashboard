import { supabase } from '@/integrations/supabase/client';

export interface DatabaseTestResult {
  success: boolean;
  error?: string;
  tables: {
    super_admins: boolean;
    organisations: boolean;
    users: boolean;
    access_logs: boolean;
  };
  rlsEnabled: {
    super_admins: boolean;
    organisations: boolean;
    users: boolean;
    access_logs: boolean;
  };
}

export const testDatabaseConnection = async (): Promise<DatabaseTestResult> => {
  const result: DatabaseTestResult = {
    success: true,
    tables: {
      super_admins: false,
      organisations: false,
      users: false,
      access_logs: false
    },
    rlsEnabled: {
      super_admins: false,
      organisations: false,
      users: false,
      access_logs: false
    }
  };

  try {
    console.log('🔍 Test de connectivité à la base de données...');

    // Test 1: Vérifier la connexion de base
    const { data: testData, error: testError } = await supabase
      .from('organisations')
      .select('count', { count: 'exact', head: true });

    if (testError) {
      console.error('❌ Erreur de connexion:', testError);
      result.success = false;
      result.error = testError.message;
      return result;
    }

    console.log('✅ Connexion à la base de données réussie');

    // Test 2: Vérifier l'existence des tables
    const tablesToCheck = ['super_admins', 'organisations', 'users', 'access_logs'];

    for (const tableName of tablesToCheck) {
      try {
        const { error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (error) {
          console.warn(`⚠️ Table ${tableName} non accessible:`, error.message);
          result.tables[tableName as keyof typeof result.tables] = false;
        } else {
          console.log(`✅ Table ${tableName} accessible`);
          result.tables[tableName as keyof typeof result.tables] = true;
        }
      } catch (error) {
        console.warn(`⚠️ Exception pour la table ${tableName}:`, error);
        result.tables[tableName as keyof typeof result.tables] = false;
      }
    }

    // Test 3: Vérifier les politiques RLS (approximatif)
    try {
      const { error: rlsError } = await supabase
        .from('super_admins')
        .select('id')
        .limit(1);

      if (rlsError && rlsError.message.includes('policy')) {
        console.warn('⚠️ Politiques RLS actives sur super_admins');
        result.rlsEnabled.super_admins = true;
      } else {
        console.log('ℹ️ Politiques RLS non détectées sur super_admins');
        result.rlsEnabled.super_admins = false;
      }
    } catch (error) {
      console.warn('⚠️ Erreur lors de la vérification RLS:', error);
    }

    console.log('📊 Résumé du test:', result);
    return result;

  } catch (error) {
    console.error('❌ Erreur lors du test de la base de données:', error);
    result.success = false;
    result.error = error instanceof Error ? error.message : 'Erreur inconnue';
    return result;
  }
};

export const createMissingTables = async (): Promise<boolean> => {
  try {
    console.log('🔧 Tentative de création des tables manquantes...');

    // Créer la table super_admins si elle n'existe pas
    const { error: superAdminError } = await supabase.rpc('create_super_admins_table');
    if (superAdminError) {
      console.warn('⚠️ Impossible de créer super_admins:', superAdminError.message);
    } else {
      console.log('✅ Table super_admins créée ou déjà existante');
    }

    // Créer la table access_logs si elle n'existe pas
    const { error: accessLogsError } = await supabase.rpc('create_access_logs_table');
    if (accessLogsError) {
      console.warn('⚠️ Impossible de créer access_logs:', accessLogsError.message);
    } else {
      console.log('✅ Table access_logs créée ou déjà existante');
    }

    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error);
    return false;
  }
};

export const initializeDatabase = async (): Promise<boolean> => {
  try {
    console.log('🚀 Initialisation de la base de données...');

    // Test de connectivité
    const testResult = await testDatabaseConnection();

    if (!testResult.success) {
      console.error('❌ Échec du test de connectivité');
      return false;
    }

    // Si les tables principales n'existent pas, essayer de les créer
    if (!testResult.tables.super_admins || !testResult.tables.access_logs) {
      console.log('🔧 Tables manquantes détectées, tentative de création...');
      await createMissingTables();
    }

    console.log('✅ Initialisation de la base de données terminée');
    return true;

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    return false;
  }
};
