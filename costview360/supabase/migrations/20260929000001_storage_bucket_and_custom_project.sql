-- Migration: 20260929000001_storage_bucket_and_custom_project.sql
-- 1. Create storage bucket costview-media for pictures, drawings, and documents
-- 2. Configure storage RLS policies
-- 3. Update handle_new_user to use user-inputted project details

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'costview-media',
  'costview-media',
  true,
  52428800, -- 50MB
  ARRAY[
    'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml',
    'application/pdf', 'application/vnd.ms-excel', 'text/csv',
    'application/acad', 'application/x-acad', 'application/autocad_dwg', 'image/x-dwg',
    'application/dwg', 'application/x-dwg', 'application/dxf', 'image/vnd.dxf',
    'application/octet-stream'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for costview-media' AND tablename = 'objects') THEN
    CREATE POLICY "Public Access for costview-media" ON storage.objects FOR SELECT USING (bucket_id = 'costview-media');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can upload to costview-media' AND tablename = 'objects') THEN
    CREATE POLICY "Authenticated users can upload to costview-media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'costview-media');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can update in costview-media' AND tablename = 'objects') THEN
    CREATE POLICY "Authenticated users can update in costview-media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'costview-media');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can delete from costview-media' AND tablename = 'objects') THEN
    CREATE POLICY "Authenticated users can delete from costview-media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'costview-media');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_workspace_id UUID;
  v_workspace_name TEXT;
  v_project_id UUID;
  v_role public.role_name;
  v_full_name TEXT;
  v_project_name TEXT;
  v_project_code TEXT;
  v_project_location TEXT;
  v_project_type TEXT;
  v_project_budget NUMERIC;
BEGIN
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
  
  BEGIN
    v_role := (NEW.raw_user_meta_data->>'default_role')::public.role_name;
  EXCEPTION WHEN OTHERS THEN
    v_role := 'Project Manager'::public.role_name;
  END;
  IF v_role IS NULL THEN
    v_role := 'Project Manager'::public.role_name;
  END IF;

  IF NEW.raw_user_meta_data->>'workspace_id' IS NOT NULL THEN
    v_workspace_id := (NEW.raw_user_meta_data->>'workspace_id')::UUID;
  ELSE
    v_workspace_name := NULLIF(TRIM(NEW.raw_user_meta_data->>'company_name'), '');
    IF v_workspace_name IS NULL THEN
      v_workspace_name := v_full_name || '''s Construction Co';
    END IF;

    INSERT INTO public.workspaces (name, currency)
    VALUES (v_workspace_name, 'NGN')
    RETURNING id INTO v_workspace_id;

    INSERT INTO public.role_access (workspace_id, role, permission_key, allowed)
    VALUES
      (v_workspace_id, 'Admin', 'Budget', true),
      (v_workspace_id, 'Admin', 'Procurement', true),
      (v_workspace_id, 'Admin', 'Materials', true),
      (v_workspace_id, 'Admin', 'Labour', true),
      (v_workspace_id, 'Admin', 'Progress', true),
      (v_workspace_id, 'Admin', 'Subcontractors', true),
      (v_workspace_id, 'Admin', 'Variations', true),
      (v_workspace_id, 'Admin', 'Reports', true),
      (v_workspace_id, 'Admin', 'Admin', true),
      (v_workspace_id, 'Project Manager', 'Budget', true),
      (v_workspace_id, 'Project Manager', 'Procurement', true),
      (v_workspace_id, 'Project Manager', 'Materials', true),
      (v_workspace_id, 'Project Manager', 'Labour', true),
      (v_workspace_id, 'Project Manager', 'Progress', true),
      (v_workspace_id, 'Project Manager', 'Subcontractors', true),
      (v_workspace_id, 'Project Manager', 'Variations', true),
      (v_workspace_id, 'Project Manager', 'Reports', true),
      (v_workspace_id, 'Project Manager', 'Admin', false),
      (v_workspace_id, 'Quantity Surveyor', 'Budget', true),
      (v_workspace_id, 'Quantity Surveyor', 'Procurement', true),
      (v_workspace_id, 'Quantity Surveyor', 'Materials', false),
      (v_workspace_id, 'Quantity Surveyor', 'Labour', false),
      (v_workspace_id, 'Quantity Surveyor', 'Progress', false),
      (v_workspace_id, 'Quantity Surveyor', 'Subcontractors', true),
      (v_workspace_id, 'Quantity Surveyor', 'Variations', true),
      (v_workspace_id, 'Quantity Surveyor', 'Reports', true),
      (v_workspace_id, 'Quantity Surveyor', 'Admin', false),
      (v_workspace_id, 'Site Engineer', 'Budget', false),
      (v_workspace_id, 'Site Engineer', 'Procurement', false),
      (v_workspace_id, 'Site Engineer', 'Materials', true),
      (v_workspace_id, 'Site Engineer', 'Labour', true),
      (v_workspace_id, 'Site Engineer', 'Progress', true),
      (v_workspace_id, 'Site Engineer', 'Subcontractors', false),
      (v_workspace_id, 'Site Engineer', 'Variations', false),
      (v_workspace_id, 'Site Engineer', 'Reports', false),
      (v_workspace_id, 'Site Engineer', 'Admin', false)
    ON CONFLICT (workspace_id, role, permission_key) DO NOTHING;

    -- User-inputted Project Details
    v_project_name := NULLIF(TRIM(NEW.raw_user_meta_data->>'project_name'), '');
    IF v_project_name IS NULL THEN
      v_project_name := v_workspace_name || ' Project';
    END IF;

    v_project_code := NULLIF(TRIM(NEW.raw_user_meta_data->>'project_code'), '');
    IF v_project_code IS NULL THEN
      v_project_code := 'PRJ-01';
    END IF;

    v_project_location := NULLIF(TRIM(NEW.raw_user_meta_data->>'project_location'), '');
    IF v_project_location IS NULL THEN
      v_project_location := 'Lagos, Nigeria';
    END IF;

    v_project_type := COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'project_type'), ''), 'contractor');
    BEGIN
      v_project_budget := COALESCE((NEW.raw_user_meta_data->>'project_budget')::NUMERIC, 0.00);
    EXCEPTION WHEN OTHERS THEN
      v_project_budget := 0.00;
    END;

    INSERT INTO public.projects (
      workspace_id, name, code, description, project_type, location, budget_total, currency, status
    )
    VALUES (
      v_workspace_id,
      v_project_name,
      v_project_code,
      COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'project_description'), ''), 'Construction project: ' || v_project_name),
      v_project_type,
      v_project_location,
      v_project_budget,
      'NGN',
      'Active'
    )
    RETURNING id INTO v_project_id;
  END IF;

  INSERT INTO public.profiles (
    id, workspace_id, full_name, default_role, avatar_url
  )
  VALUES (
    NEW.id,
    v_workspace_id,
    v_full_name,
    v_role,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    workspace_id = EXCLUDED.workspace_id,
    full_name = EXCLUDED.full_name,
    default_role = EXCLUDED.default_role;

  IF v_project_id IS NOT NULL THEN
    INSERT INTO public.project_members (project_id, user_id, role)
    VALUES (v_project_id, NEW.id, v_role)
    ON CONFLICT (project_id, user_id) DO NOTHING;
  ELSE
    INSERT INTO public.project_members (project_id, user_id, role)
    SELECT p.id, NEW.id, v_role
    FROM public.projects p
    WHERE p.workspace_id = v_workspace_id
    ON CONFLICT (project_id, user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;
