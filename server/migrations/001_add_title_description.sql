-- ============================================
-- MIGRATION: Ajout titre et description aux posts
-- ============================================
-- À exécuter dans l'éditeur SQL de Supabase
-- si vous avez déjà créé les tables

-- Ajouter les colonnes title et description à gallery_images
ALTER TABLE gallery_images 
ADD COLUMN IF NOT EXISTS title VARCHAR(255),
ADD COLUMN IF NOT EXISTS description TEXT;

-- Vérification
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'gallery_images';
