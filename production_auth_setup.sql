-- Production Authentication Setup
-- This script configures Supabase for production with proper email validation

-- 1. Remove demo mode auto-confirmation trigger if it exists
DROP TRIGGER IF EXISTS auto_confirm_user_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.auto_confirm_user();

-- 2. Ensure proper RLS policies for super_admins table
DROP POLICY IF EXISTS "super_admins_demo_policy" ON public.super_admins;

-- Create proper RLS policies for super_admins
CREATE POLICY "super_admins_select_policy" ON public.super_admins
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.super_admins sa
      WHERE sa.user_id = auth.uid() AND sa.est_actif = true
    )
  );

CREATE POLICY "super_admins_insert_policy" ON public.super_admins
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    auth.jwt() ->> 'email_confirmed_at' IS NOT NULL
  );

CREATE POLICY "super_admins_update_policy" ON public.super_admins
  FOR UPDATE USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.super_admins sa
      WHERE sa.user_id = auth.uid() AND sa.est_actif = true
    )
  );

-- 3. Ensure proper RLS policies for user_organizations
DROP POLICY IF EXISTS "user_organizations_demo_policy" ON public.user_organizations;

CREATE POLICY "user_organizations_select_policy" ON public.user_organizations
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.super_admins sa
      WHERE sa.user_id = auth.uid() AND sa.est_actif = true
    )
  );

CREATE POLICY "user_organizations_insert_policy" ON public.user_organizations
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    auth.jwt() ->> 'email_confirmed_at' IS NOT NULL
  );

CREATE POLICY "user_organizations_update_policy" ON public.user_organizations
  FOR UPDATE USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.super_admins sa
      WHERE sa.user_id = auth.uid() AND sa.est_actif = true
    )
  );

-- 4. Create function to activate super admin after email confirmation
CREATE OR REPLACE FUNCTION public.activate_super_admin_on_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user email was just confirmed
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    -- Activate super admin if exists
    UPDATE public.super_admins
    SET est_actif = true,
        updated_at = NOW()
    WHERE user_id = NEW.id AND est_actif = false;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create trigger to activate super admin on email confirmation
DROP TRIGGER IF EXISTS activate_super_admin_trigger ON auth.users;
CREATE TRIGGER activate_super_admin_trigger
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.activate_super_admin_on_confirmation();

-- 6. Create function to validate organization access
CREATE OR REPLACE FUNCTION public.validate_org_access(
  org_id UUID,
  user_id UUID,
  org_code TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN := FALSE;
BEGIN
  -- Check if user has access to organization
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_organizations uo
    JOIN public.organisations o ON uo.organization_id = o.id
    WHERE uo.user_id = validate_org_access.user_id
      AND uo.organization_id = validate_org_access.org_id
      AND (validate_org_access.org_code IS NULL OR o.code = validate_org_access.org_code)
  ) INTO has_access;
  
  RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Revoke excessive permissions from anon users
REVOKE ALL ON public.super_admins FROM anon;
REVOKE ALL ON public.user_organizations FROM anon;

-- Grant only necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.super_admins TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_organizations TO authenticated;

-- 8. Create audit log table for authentication events
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit_log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for audit_log
CREATE POLICY "audit_log_select_policy" ON public.audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.super_admins sa
      WHERE sa.user_id = auth.uid() AND sa.est_actif = true
    )
  );

CREATE POLICY "audit_log_insert_policy" ON public.audit_log
  FOR INSERT WITH CHECK (true); -- Allow system to insert audit logs

-- Grant permissions for audit_log
GRANT SELECT, INSERT ON public.audit_log TO authenticated;
GRANT INSERT ON public.audit_log TO anon; -- For login attempts

-- 9. Create function to log authentication events
CREATE OR REPLACE FUNCTION public.log_auth_event(
  event_type TEXT,
  event_data JSONB DEFAULT NULL,
  user_id UUID DEFAULT auth.uid()
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.audit_log (user_id, event_type, event_data)
  VALUES (user_id, event_type, event_data)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_super_admins_user_id ON public.super_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_super_admins_email ON public.super_admins(email);
CREATE INDEX IF NOT EXISTS idx_super_admins_active ON public.super_admins(est_actif);

CREATE INDEX IF NOT EXISTS idx_user_organizations_user_id ON public.user_organizations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_organizations_org_id ON public.user_organizations(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_organizations_role ON public.user_organizations(role);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_event_type ON public.audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at);

-- 11. Update existing unconfirmed users (one-time migration)
-- This will be commented out after first run
/*
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmed_at = NOW()
WHERE email_confirmed_at IS NULL 
  AND confirmed_at IS NULL
  AND created_at < NOW() - INTERVAL '1 day'; -- Only for existing users
*/

-- 12. Verify the setup
SELECT 'Production authentication setup completed successfully!' as status;

-- Show current super admins status
SELECT 
  sa.email,
  sa.nom,
  sa.prenom,
  sa.est_actif,
  u.email_confirmed_at IS NOT NULL as email_confirmed
FROM public.super_admins sa
JOIN auth.users u ON sa.user_id = u.id
ORDER BY sa.created_at;