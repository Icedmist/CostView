-- Migration: 20260928000001_site_posts.sql
-- CostView Site Hub: Collaborative social progress feed, site logs, expense tracking, and team member tagging.

CREATE TABLE IF NOT EXISTS site_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL DEFAULT 'Site Engineer',
  content TEXT NOT NULL,
  post_type TEXT NOT NULL DEFAULT 'progress', -- 'progress', 'expense', 'log', 'issue'
  amount_spent NUMERIC(16, 2) DEFAULT 0.00,
  expense_category TEXT,
  tagged_users JSONB DEFAULT '[]'::jsonb,
  media_urls JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES site_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL DEFAULT 'Project Member',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE site_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_post_comments ENABLE ROW LEVEL SECURITY;

-- Site Posts RLS Policies
CREATE POLICY "Members can view project site posts"
  ON site_posts FOR SELECT
  USING (is_project_member(project_id));

CREATE POLICY "Members can insert project site posts"
  ON site_posts FOR INSERT
  WITH CHECK (is_project_member(project_id));

CREATE POLICY "Members can update project site posts"
  ON site_posts FOR UPDATE
  USING (is_project_member(project_id));

CREATE POLICY "Members can delete project site posts"
  ON site_posts FOR DELETE
  USING (is_project_member(project_id));

-- Site Post Comments RLS Policies
CREATE POLICY "Members can view site post comments"
  ON site_post_comments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM site_posts WHERE site_posts.id = site_post_comments.post_id AND is_project_member(site_posts.project_id)
  ));

CREATE POLICY "Members can insert site post comments"
  ON site_post_comments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM site_posts WHERE site_posts.id = site_post_comments.post_id AND is_project_member(site_posts.project_id)
  ));
