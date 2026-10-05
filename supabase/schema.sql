-- ==============================================================================
-- AetherOS — AI Content Creator & Agency OS
-- Supabase PostgreSQL Database Schema
-- Compatible with Supabase Publishable / Anon Key & Row Level Security (RLS)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. LEADS TABLE (CRM Pipeline & Attribution)
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    company TEXT NOT NULL,
    title TEXT,
    stage TEXT NOT NULL DEFAULT 'new_lead',
    estimated_value NUMERIC DEFAULT 0,
    content_attribution JSONB DEFAULT '{}'::jsonb,
    objections TEXT[] DEFAULT ARRAY[]::TEXT[],
    pain_description TEXT,
    intent TEXT DEFAULT 'medium',
    next_action TEXT,
    responsible_agent TEXT,
    last_touch TEXT,
    sales_notes TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CONTENT ASSETS TABLE (Content OS & Multi-Platform Publishing)
CREATE TABLE IF NOT EXISTS public.content_assets (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    platform TEXT NOT NULL,
    format TEXT NOT NULL DEFAULT 'post',
    status TEXT NOT NULL DEFAULT 'idea',
    funnel_stage TEXT NOT NULL DEFAULT 'top_of_funnel',
    pillar TEXT,
    source_insight TEXT,
    target_audience TEXT,
    offer TEXT,
    cta TEXT,
    campaign TEXT,
    scheduled_date TEXT,
    published_date TEXT,
    hook TEXT,
    body TEXT,
    metrics JSONB DEFAULT '{"reach": 0, "engagements": 0, "saves": 0, "leadsGenerated": 0, "revenueAttributed": 0}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. OUTREACH MESSAGES TABLE (Autonomous Sequences & Human Approval)
CREATE TABLE IF NOT EXISTS public.outreach_messages (
    id TEXT PRIMARY KEY,
    prospect_id TEXT,
    prospect_name TEXT NOT NULL,
    company TEXT NOT NULL,
    channel TEXT NOT NULL DEFAULT 'linkedin',
    sequence_step INTEGER DEFAULT 1,
    day_number INTEGER DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'needs_approval',
    framework JSONB DEFAULT '{}'::jsonb,
    full_text TEXT NOT NULL,
    scheduled_for TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INVOICES TABLE (Finance & Revenue Attribution)
CREATE TABLE IF NOT EXISTS public.invoices (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft',
    issue_date TEXT,
    due_date TEXT,
    type TEXT NOT NULL DEFAULT 'retainer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PROSPECTS TABLE (Client Acquisition & ICP Scoring)
CREATE TABLE IF NOT EXISTS public.prospects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    company TEXT NOT NULL,
    segment TEXT,
    industry TEXT,
    size TEXT,
    fit_score INTEGER DEFAULT 0,
    intent_score INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'cold',
    probable_pain TEXT,
    source TEXT,
    research JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CLIENT PROJECTS TABLE (Delivery Operations & Automation Health)
CREATE TABLE IF NOT EXISTS public.client_projects (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    company TEXT NOT NULL,
    project_outcome TEXT,
    stage TEXT NOT NULL DEFAULT 'map',
    progress INTEGER DEFAULT 0,
    milestones JSONB DEFAULT '[]'::jsonb,
    workflows JSONB DEFAULT '[]'::jsonb,
    blockers TEXT[] DEFAULT ARRAY[]::TEXT[],
    approvals_needed TEXT[] DEFAULT ARRAY[]::TEXT[],
    automation_health INTEGER DEFAULT 100,
    due_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SALES CALLS TABLE (Discovery Copilot & Objection Intelligence)
CREATE TABLE IF NOT EXISTS public.sales_calls (
    id TEXT PRIMARY KEY,
    lead_id TEXT,
    lead_name TEXT NOT NULL,
    company TEXT NOT NULL,
    date TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled',
    pre_call_intel JSONB DEFAULT '{}'::jsonb,
    copilot_notes JSONB DEFAULT '{}'::jsonb,
    post_call_intel JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. INTEL SIGNALS TABLE (Revenue-to-Content Loop Telemetry)
CREATE TABLE IF NOT EXISTS public.intel_signals (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    impact_score TEXT DEFAULT 'high',
    frequency INTEGER DEFAULT 1,
    action_taken TEXT,
    suggested_automation JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR HIGH-THROUGHPUT QUERIES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_leads_stage ON public.leads(stage);
CREATE INDEX IF NOT EXISTS idx_content_platform ON public.content_assets(platform);
CREATE INDEX IF NOT EXISTS idx_content_status ON public.content_assets(status);
CREATE INDEX IF NOT EXISTS idx_outreach_status ON public.outreach_messages(status);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_prospects_fit ON public.prospects(fit_score);
CREATE INDEX IF NOT EXISTS idx_projects_stage ON public.client_projects(stage);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Configured for seamless client-side access with Supabase Publishable Key
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intel_signals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public full access to leads with publishable key" ON public.leads;
    DROP POLICY IF EXISTS "Public full access to content_assets with publishable key" ON public.content_assets;
    DROP POLICY IF EXISTS "Public full access to outreach_messages with publishable key" ON public.outreach_messages;
    DROP POLICY IF EXISTS "Public full access to invoices with publishable key" ON public.invoices;
    DROP POLICY IF EXISTS "Public full access to prospects with publishable key" ON public.prospects;
    DROP POLICY IF EXISTS "Public full access to client_projects with publishable key" ON public.client_projects;
    DROP POLICY IF EXISTS "Public full access to sales_calls with publishable key" ON public.sales_calls;
    DROP POLICY IF EXISTS "Public full access to intel_signals with publishable key" ON public.intel_signals;
END $$;

-- Create permissive public policies allowing SELECT, INSERT, UPDATE, DELETE with publishable/anon key
CREATE POLICY "Public full access to leads with publishable key"
    ON public.leads FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public full access to content_assets with publishable key"
    ON public.content_assets FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public full access to outreach_messages with publishable key"
    ON public.outreach_messages FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public full access to invoices with publishable key"
    ON public.invoices FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public full access to prospects with publishable key"
    ON public.prospects FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public full access to client_projects with publishable key"
    ON public.client_projects FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public full access to sales_calls with publishable key"
    ON public.sales_calls FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public full access to intel_signals with publishable key"
    ON public.intel_signals FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);
