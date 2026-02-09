-- ============================================
-- SCRIPT SQL POUR SUPABASE - FABULOUS APP
-- ============================================
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Table pour les images de la galerie
CREATE TABLE IF NOT EXISTS gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    url TEXT NOT NULL,
    theme VARCHAR(50) NOT NULL CHECK (theme IN ('general', 'residential', 'commercial')),
    filename VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_gallery_theme ON gallery_images(theme);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery_images(created_at DESC);

-- 2. Table pour les rendez-vous
CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(10) NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les rendez-vous
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments(date, time);

-- 3. Table pour les avis/témoignages
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT false,  -- Les avis doivent être approuvés par l'admin
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les reviews
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_email ON reviews(email);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);

-- 4. Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Créer les triggers pour updated_at
CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON gallery_images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Activer Row Level Security (RLS)
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 7. Politiques RLS - Lecture publique pour la galerie
CREATE POLICY "Public can view gallery images"
    ON gallery_images FOR SELECT
    USING (true);

-- 8. Politiques RLS - Lecture publique pour les rendez-vous disponibles
CREATE POLICY "Public can view appointments for availability"
    ON appointments FOR SELECT
    USING (true);

-- 9. Politiques RLS - Lecture publique pour les avis approuvés
CREATE POLICY "Public can view approved reviews"
    ON reviews FOR SELECT
    USING (is_approved = true);

-- 10. Politiques RLS - Écriture pour les utilisateurs authentifiés (admin via service key)
CREATE POLICY "Service role can insert gallery images"
    ON gallery_images FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can update gallery images"
    ON gallery_images FOR UPDATE
    USING (true);

CREATE POLICY "Service role can delete gallery images"
    ON gallery_images FOR DELETE
    USING (true);

CREATE POLICY "Anyone can insert appointments"
    ON appointments FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can update appointments"
    ON appointments FOR UPDATE
    USING (true);

CREATE POLICY "Service role can delete appointments"
    ON appointments FOR DELETE
    USING (true);

CREATE POLICY "Anyone can insert reviews"
    ON reviews FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can update reviews"
    ON reviews FOR UPDATE
    USING (true);

CREATE POLICY "Service role can delete reviews"
    ON reviews FOR DELETE
    USING (true);

-- ============================================
-- CONFIGURATION DU BUCKET STORAGE
-- ============================================
-- À faire manuellement dans l'interface Supabase Storage:
-- 1. Aller dans Storage
-- 2. Créer un nouveau bucket nommé "images"
-- 3. Le rendre public
-- 4. Configuration du bucket:
--    - Name: images
--    - Public: OUI
--    - Allowed MIME types: image/jpeg, image/png, image/webp
--    - Max file size: 5MB

-- ============================================
-- DONNÉES DE TEST (OPTIONNEL)
-- ============================================

-- Insérer quelques avis de test
-- INSERT INTO reviews (name, email, rating, comment, is_approved) VALUES
-- ('Jean Dupont', 'jean@example.com', 5, 'Excellent service, très professionnel!', true),
-- ('Marie Martin', 'marie@example.com', 5, 'Travail impeccable, je recommande vivement.', true),
-- ('Pierre Durand', 'pierre@example.com', 4, 'Très satisfait du résultat final.', true);

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Vérifier que les tables sont créées
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('gallery_images', 'appointments', 'reviews');

-- Vérifier les politiques RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
