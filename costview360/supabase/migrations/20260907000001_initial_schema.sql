-- CostView 360: Full-Stack Supabase (PostgreSQL) Initial Schema Migration
-- Matches PRD v2.0 & Section 4 Access Matrices

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE role_name AS ENUM (
  'Admin',
  'Project Manager',
  'Quantity Surveyor',
  'Architect',
  'Site Engineer',
  'Procurement Officer',
  'Accountant',
  'Storekeeper'
);

CREATE TYPE project_type AS ENUM ('contractor', 'developer');
CREATE TYPE project_status AS ENUM ('Planning', 'Active', 'On Hold', 'Completed', 'Archived');
CREATE TYPE po_status AS ENUM ('Draft', 'Sent to Suppliers', 'Approved', 'Partially Delivered', 'Delivered', 'Cancelled');
CREATE TYPE approval_status AS ENUM ('Draft', 'Pending', 'Approved', 'Rejected');
CREATE TYPE match_status AS ENUM ('Pending', 'Matched', 'Discrepancy', 'Paid');
CREATE TYPE transfer_status AS ENUM ('Requested', 'Approved', 'In Transit', 'Received', 'Cancelled');
CREATE TYPE snag_severity AS ENUM ('Low', 'Medium', 'High', 'Critical');
CREATE TYPE snag_status AS ENUM ('Open', 'In Progress', 'Remediated', 'Closed');
CREATE TYPE claim_status AS ENUM ('Submitted', 'Verified', 'Certified', 'Approved', 'Paid');
CREATE TYPE variation_status AS ENUM ('Draft', 'QS Valuation', 'PM Review', 'Client Approved', 'Rejected');

-- 3. CORE TENANCY & PROFILES
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  default_role role_name NOT NULL DEFAULT 'Site Engineer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  project_type project_type NOT NULL DEFAULT 'contractor',
  location TEXT,
  budget_total NUMERIC(16, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'NGN',
  status project_status NOT NULL DEFAULT 'Active',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role role_name NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

CREATE TABLE role_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  role role_name NOT NULL,
  permission_key TEXT NOT NULL,
  allowed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workspace_id, role, permission_key)
);

-- 4. BUDGET & BOQ
CREATE TABLE boq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES boq_items(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  description TEXT NOT NULL,
  unit TEXT NOT NULL,
  quantity NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  rate NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  budget_amount NUMERIC(16, 2) NOT NULL DEFAULT 0.00,
  committed_amount NUMERIC(16, 2) NOT NULL DEFAULT 0.00,
  actual_amount NUMERIC(16, 2) NOT NULL DEFAULT 0.00,
  category TEXT NOT NULL DEFAULT 'Material',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE budget_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  boq_item_id UUID NOT NULL REFERENCES boq_items(id) ON DELETE CASCADE,
  delta_quantity NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  delta_rate NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  delta_amount NUMERIC(16, 2) NOT NULL,
  reason TEXT NOT NULL,
  status approval_status NOT NULL DEFAULT 'Pending',
  requested_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. PROCUREMENT & 3-WAY FINANCIAL MATCH
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  rating_otd NUMERIC(3, 2) DEFAULT 5.00,
  rating_quality NUMERIC(3, 2) DEFAULT 5.00,
  rating_price NUMERIC(3, 2) DEFAULT 5.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  po_number TEXT NOT NULL UNIQUE,
  status po_status NOT NULL DEFAULT 'Draft',
  total_amount NUMERIC(16, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'NGN',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE po_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  boq_item_id UUID REFERENCES boq_items(id),
  description TEXT NOT NULL,
  unit TEXT NOT NULL,
  quantity NUMERIC(14, 2) NOT NULL,
  agreed_rate NUMERIC(14, 2) NOT NULL,
  line_total NUMERIC(16, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE goods_received_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  grn_number TEXT NOT NULL UNIQUE,
  received_by UUID REFERENCES auth.users(id),
  delivery_date DATE NOT NULL DEFAULT CURRENT_DATE,
  delivery_note_photo_url TEXT,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE grn_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grn_id UUID NOT NULL REFERENCES goods_received_notes(id) ON DELETE CASCADE,
  po_item_id UUID NOT NULL REFERENCES po_items(id) ON DELETE CASCADE,
  quantity_ordered NUMERIC(14, 2) NOT NULL,
  quantity_delivered NUMERIC(14, 2) NOT NULL,
  discrepancy_qty NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE supplier_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL,
  billed_amount NUMERIC(16, 2) NOT NULL,
  invoice_file_url TEXT,
  match_status match_status NOT NULL DEFAULT 'Pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE three_way_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES supplier_invoices(id) ON DELETE CASCADE,
  po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  grn_id UUID NOT NULL REFERENCES goods_received_notes(id) ON DELETE CASCADE,
  is_quantity_matched BOOLEAN NOT NULL DEFAULT false,
  is_rate_matched BOOLEAN NOT NULL DEFAULT false,
  variance_amount NUMERIC(16, 2) NOT NULL DEFAULT 0.00,
  flagged_reason TEXT,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. MATERIALS & INVENTORY
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  min_reorder_level NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE stock_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  qty_on_hand NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  qty_reserved NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  qty_consumed NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, item_id)
);

CREATE TABLE material_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  to_project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  quantity NUMERIC(14, 2) NOT NULL,
  status transfer_status NOT NULL DEFAULT 'Requested',
  requested_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. LABOUR, PROGRESS, SNAGGING
CREATE TABLE daily_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  worker_name TEXT NOT NULL,
  trade TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Present',
  hours_worked NUMERIC(4, 2) NOT NULL DEFAULT 8.00,
  overtime_hours NUMERIC(4, 2) NOT NULL DEFAULT 0.00,
  logged_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE site_diaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weather_condition TEXT NOT NULL DEFAULT 'Sunny',
  temperature TEXT,
  delay_hours NUMERIC(4, 2) NOT NULL DEFAULT 0.00,
  work_summary TEXT NOT NULL,
  total_headcount INTEGER NOT NULL DEFAULT 0,
  photos JSONB DEFAULT '[]'::jsonb,
  logged_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, log_date)
);

CREATE TABLE snags_and_ncrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  severity snag_severity NOT NULL DEFAULT 'Medium',
  status snag_status NOT NULL DEFAULT 'Open',
  photo_before_url TEXT,
  photo_after_url TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  raised_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. COMMERCIAL MODE & SUBCONTRACTORS
CREATE TABLE subcontractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  trade TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  contract_sum NUMERIC(16, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE subcontractor_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcontractor_id UUID NOT NULL REFERENCES subcontractors(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  claim_number TEXT NOT NULL,
  claimed_amount NUMERIC(16, 2) NOT NULL,
  certified_amount NUMERIC(16, 2) NOT NULL DEFAULT 0.00,
  status claim_status NOT NULL DEFAULT 'Submitted',
  valuation_date DATE NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE variation_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  boq_item_id UUID REFERENCES boq_items(id),
  vo_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  cost_impact NUMERIC(16, 2) NOT NULL DEFAULT 0.00,
  time_impact_days INTEGER NOT NULL DEFAULT 0,
  status variation_status NOT NULL DEFAULT 'Draft',
  raised_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. AUDIT LOGGING
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  actor_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  delta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. ROW LEVEL SECURITY (RLS) HELPER & POLICIES
CREATE OR REPLACE FUNCTION is_project_member(p_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM project_members
    WHERE project_id = p_id
      AND user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Enable RLS on core tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE boq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods_received_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE snags_and_ncrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Workspace Policies
CREATE POLICY "Users can view their workspaces"
  ON workspaces FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.workspace_id = workspaces.id AND profiles.id = auth.uid())
  );

-- Profile Policies
CREATE POLICY "Users can read all profiles in their workspace"
  ON profiles FOR SELECT
  USING (
    workspace_id IN (SELECT workspace_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- Project Policies
CREATE POLICY "Members can view projects"
  ON projects FOR SELECT
  USING (is_project_member(id));

-- BOQ Policies
CREATE POLICY "Members can view project BOQ items"
  ON boq_items FOR SELECT
  USING (is_project_member(project_id));

-- Trigger: Automatically create profile entry on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', new.email), new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
