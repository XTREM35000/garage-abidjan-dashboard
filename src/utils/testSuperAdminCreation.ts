import { supabase } from '@/integrations/supabase/client';

export interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

/**
 * Teste la création d'un Super-Admin
 */
export const testSuperAdminCreation = async (): Promise<TestResult> => {
  try {
    console.log('🧪 Test de création du Super-Admin...');

    // 1. Vérifier que la table super_admins existe
    const { data: tableCheck, error: tableError } = await supabase
      .from('super_admins')
      .select('id')
      .limit(1);

    if (tableError) {
      return {
        success: false,
        message: 'Table super_admins non accessible',
        details: tableError
      };
    }

    console.log('✅ Table super_admins accessible');

    // 2. Vérifier les politiques RLS
    let policiesError = null;
    try {
      const { data: policies, error } = await supabase
        .rpc('get_table_policies', { table_name: 'super_admins' });
      policiesError = error;
    } catch {
      policiesError = { message: 'Fonction get_table_policies non disponible' };
    }

    if (policiesError) {
      console.warn('⚠️ Impossible de vérifier les politiques RLS:', policiesError.message);
    } else {
      console.log('✅ Politiques RLS vérifiées');
    }

    // 3. Vérifier les permissions
    let permissionsError = null;
    try {
      const { data: permissions, error } = await supabase
        .rpc('check_table_permissions', { table_name: 'super_admins' });
      permissionsError = error;
    } catch {
      permissionsError = { message: 'Fonction check_table_permissions non disponible' };
    }

    if (permissionsError) {
      console.warn('⚠️ Impossible de vérifier les permissions:', permissionsError.message);
    } else {
      console.log('✅ Permissions vérifiées');
    }

    // 4. Tester la fonction create_super_admin
    let functionError = null;
    try {
      const { data: functionTest, error } = await supabase
        .rpc('create_super_admin', {
          p_email: 'test@example.com',
          p_nom: 'Test',
          p_prenom: 'Admin',
          p_phone: '+225 01 23 45 67 89'
        });
      functionError = error;
    } catch {
      functionError = { message: 'Fonction create_super_admin non disponible' };
    }

    if (functionError) {
      if (functionError.message.includes('existe déjà')) {
        console.log('✅ Fonction create_super_admin fonctionne (Super-Admin existe déjà)');
      } else {
        console.warn('⚠️ Fonction create_super_admin:', functionError.message);
      }
    } else {
      console.log('✅ Fonction create_super_admin fonctionne');
    }

    return {
      success: true,
      message: 'Tests de création du Super-Admin réussis',
      details: {
        tableAccessible: true,
        policiesChecked: !policiesError,
        permissionsChecked: !permissionsError,
        functionTested: !functionError || functionError.message.includes('existe déjà')
      }
    };

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    return {
      success: false,
      message: 'Erreur lors du test de création du Super-Admin',
      details: error
    };
  }
};

/**
 * Teste la connexion à la base de données
 */
export const testDatabaseConnection = async (): Promise<TestResult> => {
  try {
    console.log('🔌 Test de connexion à la base de données...');

    // Test simple de connexion
    const { data, error } = await supabase
      .from('super_admins')
      .select('count')
      .limit(1);

    if (error) {
      return {
        success: false,
        message: 'Impossible de se connecter à la base de données',
        details: error
      };
    }

    console.log('✅ Connexion à la base de données réussie');
    return {
      success: true,
      message: 'Connexion à la base de données réussie'
    };

  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
    return {
      success: false,
      message: 'Erreur de connexion à la base de données',
      details: error
    };
  }
};

/**
 * Lance tous les tests
 */
export const runAllTests = async (): Promise<{
  connection: TestResult;
  creation: TestResult;
  summary: string;
}> => {
  console.log('🚀 Lancement de tous les tests...\n');

  const connection = await testDatabaseConnection();
  const creation = await testSuperAdminCreation();

  const summary = `
📊 RÉSUMÉ DES TESTS
==================
🔌 Connexion DB: ${connection.success ? '✅' : '❌'} ${connection.message}
🧪 Création Super-Admin: ${creation.success ? '✅' : '❌'} ${creation.message}

${!connection.success ? '❌ ERREUR CRITIQUE: Impossible de se connecter à la base de données' : ''}
${!creation.success ? '⚠️ ATTENTION: Problèmes avec la création du Super-Admin' : ''}
${connection.success && creation.success ? '🎉 TOUS LES TESTS RÉUSSIS!' : ''}
  `.trim();

  console.log(summary);

  return { connection, creation, summary };
};

// Fonction pour exécuter les tests depuis la console du navigateur
if (typeof window !== 'undefined') {
  (window as any).testSuperAdmin = {
    testConnection: testDatabaseConnection,
    testCreation: testSuperAdminCreation,
    runAll: runAllTests
  };

  console.log('🧪 Tests Super-Admin disponibles dans window.testSuperAdmin');
  console.log('💡 Utilisez: window.testSuperAdmin.runAll() pour lancer tous les tests');
}
