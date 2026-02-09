import { createClient } from '@supabase/supabase-js';

// Utilise les variables d'environnement
// La ANON_KEY est publique par design (sécurisée par les politiques RLS)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

