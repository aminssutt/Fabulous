-- ============================================
-- MIGRATION 004: Fix RLS Policies
-- ============================================
-- CRITICAL: All existing RLS policies use USING(true) without
-- specifying a role, meaning they apply to ALL roles including anonymous.
-- This migration drops and recreates them with proper role restrictions.
--
-- Run this in the Supabase SQL Editor.
-- ============================================

-- ==================== gallery_images ====================
DROP POLICY IF EXISTS "Public can view gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Service role can insert gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Service role can update gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Service role can delete gallery images" ON gallery_images;

CREATE POLICY "anon_select_gallery" ON gallery_images
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "service_insert_gallery" ON gallery_images
  FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "service_update_gallery" ON gallery_images
  FOR UPDATE TO service_role USING (true);
CREATE POLICY "service_delete_gallery" ON gallery_images
  FOR DELETE TO service_role USING (true);

-- ==================== appointments ====================
DROP POLICY IF EXISTS "Public can view appointments for availability" ON appointments;
DROP POLICY IF EXISTS "Anyone can insert appointments" ON appointments;
DROP POLICY IF EXISTS "Service role can update appointments" ON appointments;
DROP POLICY IF EXISTS "Service role can delete appointments" ON appointments;

CREATE POLICY "anon_select_appointments" ON appointments
  FOR SELECT TO anon USING (true);

CREATE POLICY "service_select_appointments" ON appointments
  FOR SELECT TO service_role USING (true);

CREATE POLICY "anon_insert_appointments" ON appointments
  FOR INSERT TO anon
  WITH CHECK (
    status = 'pending'
    AND name IS NOT NULL AND length(name) > 0
    AND email IS NOT NULL AND email ~ '^[^@]+@[^@]+\.[^@]+$'
    AND phone IS NOT NULL AND length(phone) >= 6
    AND date IS NOT NULL
    AND time IS NOT NULL
  );

CREATE POLICY "service_insert_appointments" ON appointments
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "service_update_appointments" ON appointments
  FOR UPDATE TO service_role USING (true);
CREATE POLICY "service_delete_appointments" ON appointments
  FOR DELETE TO service_role USING (true);

-- ==================== reviews ====================
DROP POLICY IF EXISTS "Public can view approved reviews" ON reviews;
DROP POLICY IF EXISTS "Anyone can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Service role can update reviews" ON reviews;
DROP POLICY IF EXISTS "Service role can delete reviews" ON reviews;

CREATE POLICY "anon_select_reviews" ON reviews
  FOR SELECT TO anon USING (is_approved = true);

CREATE POLICY "service_select_reviews" ON reviews
  FOR SELECT TO service_role USING (true);

CREATE POLICY "anon_insert_reviews" ON reviews
  FOR INSERT TO anon
  WITH CHECK (
    is_approved = false
    AND name IS NOT NULL AND length(name) > 0
    AND rating >= 1 AND rating <= 5
  );

CREATE POLICY "service_insert_reviews" ON reviews
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "service_update_reviews" ON reviews
  FOR UPDATE TO service_role USING (true);
CREATE POLICY "service_delete_reviews" ON reviews
  FOR DELETE TO service_role USING (true);

-- ==================== services ====================
DROP POLICY IF EXISTS "Public can view active services" ON services;
DROP POLICY IF EXISTS "Service role can manage services" ON services;

CREATE POLICY "anon_select_services" ON services
  FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "service_select_services" ON services
  FOR SELECT TO service_role USING (true);
CREATE POLICY "service_write_services" ON services
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==================== categories ====================
DROP POLICY IF EXISTS "Public can view active categories" ON categories;
DROP POLICY IF EXISTS "Service role can manage categories" ON categories;

CREATE POLICY "anon_select_categories" ON categories
  FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "service_select_categories" ON categories
  FOR SELECT TO service_role USING (true);
CREATE POLICY "service_write_categories" ON categories
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==================== site_content ====================
DROP POLICY IF EXISTS "Public can view site content" ON site_content;
DROP POLICY IF EXISTS "Service role can manage site content" ON site_content;

CREATE POLICY "anon_select_content" ON site_content
  FOR SELECT TO anon USING (true);
CREATE POLICY "service_select_content" ON site_content
  FOR SELECT TO service_role USING (true);
CREATE POLICY "service_write_content" ON site_content
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==================== Storage Policies ====================
DO $$ BEGIN
  CREATE POLICY "public_read_images" ON storage.objects
    FOR SELECT TO anon USING (bucket_id = 'images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "service_upload_images" ON storage.objects
    FOR INSERT TO service_role
    WITH CHECK (
      bucket_id = 'images'
      AND (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'webp'))
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "service_delete_images" ON storage.objects
    FOR DELETE TO service_role USING (bucket_id = 'images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ==================== Audit Log Table ====================
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    actor_email VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    details JSONB,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "service_insert_audit" ON audit_log
    FOR INSERT TO service_role WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "service_select_audit" ON audit_log
    FOR SELECT TO service_role USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log(actor_email);

-- ==================== Verification ====================
SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
