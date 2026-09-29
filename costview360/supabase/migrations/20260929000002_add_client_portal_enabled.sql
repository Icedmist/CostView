-- Migration: Add client_portal_enabled to projects table
-- Controls whether the read-only public Client & Diaspora Investor Portal is accessible

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS client_portal_enabled BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.projects.client_portal_enabled IS 'When true, client and investor portal links are visible and public /portal route is enabled';
