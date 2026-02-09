const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialiser le client Supabase avec la clé de service (backend uniquement)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Vérifier la connexion
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('_test_connection').select('*').limit(1);
    if (error && error.code !== 'PGRST116') {
      console.log('⚠️ Supabase - connexion établie mais vérifier les tables');
    } else {
      console.log('✅ Connexion Supabase établie avec succès');
    }
  } catch (err) {
    console.error('❌ Erreur de connexion Supabase:', err.message);
  }
};

testConnection();

module.exports = supabase;
