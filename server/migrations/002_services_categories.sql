-- ============================================
-- MIGRATION 002: Tables Services et Catégories
-- ============================================
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Table pour les services
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    icon VARCHAR(50) NOT NULL DEFAULT 'faGem',
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table pour les catégories de la galerie
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL,
    label VARCHAR(100) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Ajouter title et description aux images de galerie
ALTER TABLE gallery_images 
ADD COLUMN IF NOT EXISTS title VARCHAR(255),
ADD COLUMN IF NOT EXISTS description TEXT;

-- 4. Modifier la contrainte de theme pour accepter toutes les catégories
ALTER TABLE gallery_images DROP CONSTRAINT IF EXISTS gallery_images_theme_check;

-- 5. Triggers pour updated_at
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. RLS pour services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active services"
    ON services FOR SELECT
    USING (is_active = true);

CREATE POLICY "Service role can manage services"
    ON services FOR ALL
    USING (true);

-- 7. RLS pour categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active categories"
    ON categories FOR SELECT
    USING (is_active = true);

CREATE POLICY "Service role can manage categories"
    ON categories FOR ALL
    USING (true);

-- 8. Insérer les services par défaut
INSERT INTO services (icon, title, description, sort_order) VALUES
('faCouch', 'Design Intérieur', 'Création d''espaces harmonieux et fonctionnels qui reflètent votre personnalité unique.', 1),
('faLightbulb', 'Conseil & Concept', 'Accompagnement personnalisé pour définir votre identité décorative avec précision.', 2),
('faRulerCombined', 'Sur Mesure', 'Optimisation des volumes et agencement intelligent pour maximiser chaque espace.', 3),
('faPalette', 'Matériaux Nobles', 'Sélection de textures et finitions exclusives pour un rendu véritablement unique.', 4)
ON CONFLICT DO NOTHING;

-- 9. Insérer les catégories par défaut
INSERT INTO categories (slug, label, sort_order) VALUES
('general', 'Général', 1),
('residential', 'Résidentiel', 2),
('commercial', 'Commercial', 3)
ON CONFLICT (slug) DO NOTHING;

-- 10. Index
CREATE INDEX IF NOT EXISTS idx_services_sort ON services(sort_order);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
