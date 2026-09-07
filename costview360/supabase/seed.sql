-- Seed Initial Workspace and Default Demo Project
INSERT INTO workspaces (id, name, currency)
VALUES ('11111111-1111-1111-1111-111111111111', 'CostView Demo Workspace', 'NGN')
ON CONFLICT (id) DO NOTHING;

-- Seed Default Projects
INSERT INTO projects (id, workspace_id, name, code, description, project_type, location, budget_total, currency, status)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Eko Atlantic Horizon Towers',
  'CV-EAH-2026',
  'High-rise mixed-use luxury residential and commercial development',
  'contractor',
  'Victoria Island, Lagos',
  301815000.00,
  'NGN',
  'Active'
)
ON CONFLICT (id) DO NOTHING;

-- Seed Role Access Permissions Matrix (PRD Section 4)
INSERT INTO role_access (workspace_id, role, permission_key, allowed)
VALUES
  -- Admin
  ('11111111-1111-1111-1111-111111111111', 'Admin', 'Budget', true),
  ('11111111-1111-1111-1111-111111111111', 'Admin', 'Procurement', true),
  ('11111111-1111-1111-1111-111111111111', 'Admin', 'Materials', true),
  ('11111111-1111-1111-1111-111111111111', 'Admin', 'Labour', true),
  ('11111111-1111-1111-1111-111111111111', 'Admin', 'Progress', true),
  ('11111111-1111-1111-1111-111111111111', 'Admin', 'Subcontractors', true),
  ('11111111-1111-1111-1111-111111111111', 'Admin', 'Variations', true),
  ('11111111-1111-1111-1111-111111111111', 'Admin', 'Reports', true),
  ('11111111-1111-1111-1111-111111111111', 'Admin', 'Admin', true),
  -- Project Manager
  ('11111111-1111-1111-1111-111111111111', 'Project Manager', 'Budget', true),
  ('11111111-1111-1111-1111-111111111111', 'Project Manager', 'Procurement', true),
  ('11111111-1111-1111-1111-111111111111', 'Project Manager', 'Materials', true),
  ('11111111-1111-1111-1111-111111111111', 'Project Manager', 'Labour', true),
  ('11111111-1111-1111-1111-111111111111', 'Project Manager', 'Progress', true),
  ('11111111-1111-1111-1111-111111111111', 'Project Manager', 'Subcontractors', true),
  ('11111111-1111-1111-1111-111111111111', 'Project Manager', 'Variations', true),
  ('11111111-1111-1111-1111-111111111111', 'Project Manager', 'Reports', true),
  ('11111111-1111-1111-1111-111111111111', 'Project Manager', 'Admin', false),
  -- Quantity Surveyor
  ('11111111-1111-1111-1111-111111111111', 'Quantity Surveyor', 'Budget', true),
  ('11111111-1111-1111-1111-111111111111', 'Quantity Surveyor', 'Procurement', true),
  ('11111111-1111-1111-1111-111111111111', 'Quantity Surveyor', 'Materials', false),
  ('11111111-1111-1111-1111-111111111111', 'Quantity Surveyor', 'Labour', false),
  ('11111111-1111-1111-1111-111111111111', 'Quantity Surveyor', 'Progress', false),
  ('11111111-1111-1111-1111-111111111111', 'Quantity Surveyor', 'Subcontractors', true),
  ('11111111-1111-1111-1111-111111111111', 'Quantity Surveyor', 'Variations', true),
  ('11111111-1111-1111-1111-111111111111', 'Quantity Surveyor', 'Reports', true),
  ('11111111-1111-1111-1111-111111111111', 'Quantity Surveyor', 'Admin', false),
  -- Site Engineer
  ('11111111-1111-1111-1111-111111111111', 'Site Engineer', 'Budget', false),
  ('11111111-1111-1111-1111-111111111111', 'Site Engineer', 'Procurement', false),
  ('11111111-1111-1111-1111-111111111111', 'Site Engineer', 'Materials', true),
  ('11111111-1111-1111-1111-111111111111', 'Site Engineer', 'Labour', true),
  ('11111111-1111-1111-1111-111111111111', 'Site Engineer', 'Progress', true),
  ('11111111-1111-1111-1111-111111111111', 'Site Engineer', 'Subcontractors', false),
  ('11111111-1111-1111-1111-111111111111', 'Site Engineer', 'Variations', false),
  ('11111111-1111-1111-1111-111111111111', 'Site Engineer', 'Reports', false),
  ('11111111-1111-1111-1111-111111111111', 'Site Engineer', 'Admin', false)
ON CONFLICT (workspace_id, role, permission_key) DO NOTHING;

-- Seed Sample BOQ Items
INSERT INTO boq_items (project_id, code, description, category, unit, quantity, rate, budget_amount, committed_amount, actual_amount)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'SUB-01.01', 'Excavation and earthwork disposal offsite', 'Plant', 'm³', 1250, 18500.00, 23125000.00, 21500000.00, 19800000.00),
  ('22222222-2222-2222-2222-222222222222', 'CON-02.01', 'Grade 30 reinforced concrete for foundation raft & plinth beams', 'Material', 'm³', 480, 195000.00, 93600000.00, 94000000.00, 62000000.00),
  ('22222222-2222-2222-2222-222222222222', 'STL-02.03', 'High-yield deformed reinforcement bars (12mm, 16mm, 20mm)', 'Material', 'Tons', 65, 1450000.00, 94250000.00, 94250000.00, 85000000.00),
  ('22222222-2222-2222-2222-222222222222', 'BLK-03.01', '225mm vibrated hollow sandcrete blockwork in cement mortar (1:4)', 'Material', 'm²', 3200, 11200.00, 35840000.00, 33000000.00, 24500000.00),
  ('22222222-2222-2222-2222-222222222222', 'LAB-01.02', 'Structural steel fixing and formwork carpenters gang attendance', 'Labour', 'Man-days', 600, 12500.00, 7500000.00, 7500000.00, 5100000.00),
  ('22222222-2222-2222-2222-222222222222', 'MEP-04.01', 'First fix electrical conduit pipes & heavy-duty distribution boards', 'Subcontractor', 'Item', 1, 45000000.00, 45000000.00, 42000000.00, 20000000.00);

-- Seed Suppliers
INSERT INTO suppliers (workspace_id, name, contact_person, email, phone)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Dangote Cement Plc', 'Alhaji Sanusi', 'sales@dangote.com', '+2348030000001'),
  ('11111111-1111-1111-1111-111111111111', 'Pulkit Steels & Alloys Ltd', 'Mr. Rajesh', 'orders@pulkit.ng', '+2348030000002');
