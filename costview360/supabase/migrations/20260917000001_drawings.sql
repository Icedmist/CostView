-- CostView PRD baseline: Drawings module (Issue #53)
-- Architect owns all drawing uploads; current version stays accessible;
-- superseded versions are retained as history (never silently replaced).
-- Links Drawing -> Work Item -> Site Progress -> Variation.

CREATE TYPE drawing_discipline AS ENUM ('Architectural', 'Structural', 'Mechanical');

CREATE TABLE drawings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  discipline drawing_discipline NOT NULL DEFAULT 'Architectural',
  title TEXT NOT NULL,
  drawing_number TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  file_url TEXT,
  is_current BOOLEAN NOT NULL DEFAULT true,
  supersedes_id UUID REFERENCES drawings(id) ON DELETE SET NULL,
  linked_boq_code TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Only one current version per drawing number per project.
-- Previous versions remain in the table as history.
CREATE UNIQUE INDEX drawings_current_unique
  ON drawings(project_id, drawing_number)
  WHERE is_current = true;

-- Architect marks work items as design-verified (PRD Section 3).
ALTER TABLE boq_items
  ADD COLUMN IF NOT EXISTS design_verified BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE drawings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view project drawings"
  ON drawings FOR SELECT
  USING (is_project_member(project_id));
