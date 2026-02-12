-- ============================================
-- MIGRATION 003: Table Content (Contenu éditable)
-- ============================================
-- À exécuter dans l'éditeur SQL de Supabase

-- Table pour le contenu éditable du site
CREATE TABLE IF NOT EXISTS site_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger pour updated_at
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON site_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view site content"
    ON site_content FOR SELECT
    USING (true);

CREATE POLICY "Service role can manage site content"
    ON site_content FOR ALL
    USING (true);

-- Insérer le contenu par défaut
INSERT INTO site_content (key, title, content) VALUES
('about_intro', 'Notre Histoire', 'Depuis plus de 15 ans, Fabulous transforme les espaces de vie en véritables œuvres d''art. Notre passion pour le design d''intérieur nous pousse à créer des environnements qui reflètent l''essence même de ceux qui les habitent.'),
('about_philosophy', 'Notre Philosophie', 'Nous croyons que chaque espace raconte une histoire. Notre mission est de vous aider à écrire la vôtre, en combinant esthétique raffinée et fonctionnalité optimale. Chaque projet est une nouvelle aventure, une nouvelle opportunité de créer quelque chose d''unique.'),
('about_approach', 'Notre Approche', 'De la première consultation à la réalisation finale, nous vous accompagnons à chaque étape. Notre approche personnalisée garantit que votre vision devient réalité, tout en bénéficiant de notre expertise et de notre œil pour le détail.')
ON CONFLICT (key) DO NOTHING;

-- Index
CREATE INDEX IF NOT EXISTS idx_site_content_key ON site_content(key);
