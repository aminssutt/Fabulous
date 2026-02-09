export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Supabase configuration - utilise les variables d'environnement
// La ANON_KEY est publique par design (sécurisée par les politiques RLS)
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
