-- Fix Database Issues - Production Auth
-- This script addresses the database structure and permission issues

-- 1. Fix organisations table structure
-- Check current columns and add missing ones if needed
DO $$
BEGIN
    -- Add nom column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'organisations' AND column_name = 'nom') THEN
        ALTER TABLE public.organisations ADD COLUMN nom TEXT;
    END IF;
    
    -- Add description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'organisations' AND column_name = 'description') THEN
        ALTER TABLE public.organisations ADD COLUMN description TEXT;
    END IF;
    
    -- Add code column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'organisations' AND column_name = 'code') THEN
        ALTER TABLE public.organisations ADD COLUMN code TEXT UNIQUE;
    END IF;
END $$;

-- 2. Update organisations table with proper structure
ALTER TABLE public.organisations 
  ALTER COLUMN nom SET NOT NULL,
  ALTER COLUMN code SET NOT NULL;

-- Add default values for existing records if any
UPDATE public.organisations 
SET nom = COALESCE(nom, 'Organisation ' || id::text),
    code = COALESCE(code, 'ORG' || EXTRACT(epoch FROM created_at)::text)
WHERE nom IS NULL OR code IS NULL;

-- 3. Fix RLS policies for better compatibility
DROP POLICY IF EXISTS "super_admins_insert_policy" ON public.super_admins;
DROP POLICY IF EXISTS "user_organizations_insert_policy" ON public.user_organizations;

-- More permissive insert policies for initial setup
CREATE POLICY "super_admins_insert_policy" ON public.super_admins
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR
    NOT EXISTS (SELECT 1 FROM public.super_admins WHERE est_actif = true)
  );

CREATE POLICY "user_organizations_insert_policy" ON public.user_organizations
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.super_admins sa
      WHERE sa.user_id = auth.uid() AND sa.est_actif = true
    )
  );

-- 4. Fix permissions for authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 5. Create default organisation if none exists
INSERT INTO public.organisations (nom, code, description, created_at)
SELECT 
  'Organisation Principale',
  'MAIN',
  'Organisation créée automatiquement lors de la configuration initiale',
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.organisations);

-- 6. Update RLS policies to handle admin API calls
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.super_admins
    WHERE super_admins.user_id = is_super_admin.user_id
    AND est_actif = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Update super_admins policies with the new function
DROP POLICY IF EXISTS "super_admins_select_policy" ON public.super_admins;
CREATE POLICY "super_admins_select_policy" ON public.super_admins
  FOR SELECT USING (
    auth.uid() = user_id OR
    public.is_super_admin()
  );

-- 8. Create a more flexible organisations policy
DROP POLICY IF EXISTS "organisations_select_policy" ON public.organisations;
CREATE POLICY "organisations_select_policy" ON public.organisations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.organization_id = organisations.id
      AND uo.user_id = auth.uid()
    ) OR
    public.is_super_admin()
  );

-- Enable RLS on organisations if not already enabled
ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;

-- 9. Grant necessary permissions for service role operations
-- This helps with admin operations
GRANT ALL ON public.super_admins TO service_role;
GRANT ALL ON public.user_organizations TO service_role;
GRANT ALL ON public.organisations TO service_role;

-- 10. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_organisations_code ON public.organisations(code);
CREATE INDEX IF NOT EXISTS idx_organisations_nom ON public.organisations(nom);

-- 11. Verify the setup
SELECT 'Database issues fixed successfully!' as status;

-- Show current organisations structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'organisations'
ORDER BY ordinal_position;