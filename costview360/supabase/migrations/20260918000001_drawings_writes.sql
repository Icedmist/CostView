-- CostView PRD Drawings follow-up (Issue #53)
-- Allow project members to write the records the Drawings UI manages.
-- Trust model matches the app: role checks (Architect approves, QS prices)
-- are enforced in the UI permission matrix; the database scopes writes to
-- members of the project, same as the existing SELECT policies.

-- Drawings: insert new uploads/revisions, retire superseded versions.
CREATE POLICY "Members can insert project drawings"
  ON drawings FOR INSERT
  WITH CHECK (is_project_member(project_id));

CREATE POLICY "Members can update project drawings"
  ON drawings FOR UPDATE
  USING (is_project_member(project_id));

-- Work items: Architect marks design-verified.
CREATE POLICY "Members can update project BOQ verification"
  ON boq_items FOR UPDATE
  USING (is_project_member(project_id));

-- Variations: Architect approves/rejects, QS prices.
CREATE POLICY "Members can update project variations"
  ON variation_orders FOR UPDATE
  USING (is_project_member(project_id));
