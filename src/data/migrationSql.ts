export const INITIAL_MIGRATION_SQL = `-- ====================================================================
-- AETHER OS: AI Content Creator & Autonomous Agency OS
-- Migration: 001_initial_schema.sql
-- Description: Complete Idempotent Supabase Schema for Full Agency OS
-- ====================================================================

-- 1. Helper function for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Workspaces (Agency Root Tenant)
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'enterprise_agency',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Backwards compatibility view/table for organizations
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'enterprise_agency',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Clients (Retainer & Implementation Client Accounts)
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  industry TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  retainer_amount NUMERIC DEFAULT 0,
  primary_contact_email TEXT,
  sla_tier TEXT DEFAULT 'enterprise',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Campaigns (Marketing, Inbound & Acquisition Sprints)
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  objective TEXT NOT NULL,
  target_audience TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  start_date TEXT,
  end_date TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tasks (Cross-Module Agency Task Board)
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  module TEXT NOT NULL,
  assigned_agent TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo',
  priority TEXT NOT NULL DEFAULT 'medium',
  due_date TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Processing Queue & Jobs (AI Generation, Scraping & Autonomous Sprints)
CREATE TABLE IF NOT EXISTS public.queue_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL,
  source_module TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  priority TEXT NOT NULL DEFAULT 'medium',
  progress INTEGER DEFAULT 0,
  input JSONB DEFAULT '{}'::jsonb,
  output JSONB DEFAULT '{}'::jsonb,
  error TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Activity History & Audit Trail (Full Visibility of System Actions)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  previous_value JSONB,
  new_value JSONB,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Agent Workers (21 Autonomous Specialized AI Workers)
CREATE TABLE IF NOT EXISTS public.agent_workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  category TEXT NOT NULL,
  avatar TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'idle',
  current_task TEXT,
  last_execution_time TEXT,
  confidence NUMERIC DEFAULT 0.95,
  dependencies JSONB DEFAULT '[]'::jsonb,
  system_instruction TEXT,
  input_schema TEXT,
  output_schema TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Module Agents (14 Autonomous Module Expert Personas)
CREATE TABLE IF NOT EXISTS public.module_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id TEXT UNIQUE NOT NULL,
  agent_name TEXT NOT NULL,
  agent_title TEXT NOT NULL,
  domain_expertise TEXT NOT NULL,
  avatar TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'optimized',
  daily_target JSONB NOT NULL DEFAULT '{}'::jsonb,
  precautions JSONB NOT NULL DEFAULT '[]'::jsonb,
  best_strategies JSONB NOT NULL DEFAULT '[]'::jsonb,
  system_instruction TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Prospects (Enriched B2B Accounts Mined by Acquisition Agent)
CREATE TABLE IF NOT EXISTS public.prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  segment TEXT,
  industry TEXT,
  size TEXT,
  fit_score INTEGER DEFAULT 80,
  intent_score INTEGER DEFAULT 80,
  status TEXT NOT NULL DEFAULT 'cold',
  probable_pain TEXT,
  source TEXT,
  research JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Outreach Messages (Psychological 4-Part Sequences)
CREATE TABLE IF NOT EXISTS public.outreach_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  prospect_id UUID REFERENCES public.prospects(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  prospect_name TEXT NOT NULL,
  company TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'linkedin',
  sequence_step INTEGER DEFAULT 1,
  day_number INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft',
  framework JSONB DEFAULT '{}'::jsonb,
  full_text TEXT NOT NULL,
  scheduled_for TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Leads (CRM Revenue Attribution & Deal Stages)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  company TEXT NOT NULL,
  title TEXT,
  stage TEXT NOT NULL DEFAULT 'new_lead',
  estimated_value NUMERIC DEFAULT 0,
  content_attribution JSONB DEFAULT '{}'::jsonb,
  objections JSONB DEFAULT '[]'::jsonb,
  pain_description TEXT,
  intent TEXT DEFAULT 'high',
  next_action TEXT,
  responsible_agent TEXT,
  last_touch TEXT,
  sales_notes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 13. Sales Discovery Calls & Copilot Intelligence
CREATE TABLE IF NOT EXISTS public.sales_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  lead_name TEXT NOT NULL,
  company TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  pre_call_intel JSONB DEFAULT '{}'::jsonb,
  copilot_notes JSONB DEFAULT '{}'::jsonb,
  post_call_intel JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 14. Enterprise Proposals (8-Section Tailored Architecture)
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  deal_value NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  sections JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 15. Client Onboardings (Zero-Delay Handshake & Launch)
CREATE TABLE IF NOT EXISTS public.client_onboardings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  company TEXT NOT NULL,
  deal_won_date TEXT,
  current_step_index INTEGER DEFAULT 0,
  steps JSONB DEFAULT '[]'::jsonb,
  checklist_items JSONB DEFAULT '[]'::jsonb,
  required_integrations JSONB DEFAULT '[]'::jsonb,
  missing_items JSONB DEFAULT '[]'::jsonb,
  next_meeting TEXT,
  health_score INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 16. Client Delivery Projects & Automation Sprints
CREATE TABLE IF NOT EXISTS public.client_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  company TEXT NOT NULL,
  project_outcome TEXT,
  stage TEXT NOT NULL DEFAULT 'map',
  progress INTEGER DEFAULT 0,
  milestones JSONB DEFAULT '[]'::jsonb,
  workflows JSONB DEFAULT '[]'::jsonb,
  blockers JSONB DEFAULT '[]'::jsonb,
  approvals_needed JSONB DEFAULT '[]'::jsonb,
  automation_health INTEGER DEFAULT 100,
  due_date TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 17. Invoices & Cashflow
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  invoice_number TEXT,
  client_name TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  issue_date TEXT NOT NULL,
  due_date TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'retainer',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 18. Client Profitability & Unit Economics
CREATE TABLE IF NOT EXISTS public.client_profitability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  revenue NUMERIC DEFAULT 0,
  api_cost NUMERIC DEFAULT 0,
  tool_cost NUMERIC DEFAULT 0,
  delivery_hours NUMERIC DEFAULT 0,
  hourly_cost NUMERIC DEFAULT 0,
  net_margin NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 19. Content Assets (Viral Scripts, Carousels, Videos, Posts)
CREATE TABLE IF NOT EXISTS public.content_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  platform TEXT NOT NULL,
  format TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'idea',
  funnel_stage TEXT NOT NULL,
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
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 20. Market & Operational Intel Signals
CREATE TABLE IF NOT EXISTS public.intel_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  impact_score TEXT NOT NULL DEFAULT 'medium',
  frequency INTEGER DEFAULT 1,
  action_taken TEXT,
  suggested_automation JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 21. Revenue-to-Content Intelligence Loops
CREATE TABLE IF NOT EXISTS public.revenue_to_content_loops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  trigger_event TEXT NOT NULL,
  detected_pain TEXT NOT NULL,
  data_points JSONB DEFAULT '{}'::jsonb,
  conclusion TEXT,
  dispatched_agents JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'active',
  last_updated TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 22. System Settings & Platform Config
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ====================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_leads_stage ON public.leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_company ON public.leads(company);
CREATE INDEX IF NOT EXISTS idx_content_platform ON public.content_assets(platform);
CREATE INDEX IF NOT EXISTS idx_content_status ON public.content_assets(status);
CREATE INDEX IF NOT EXISTS idx_outreach_status ON public.outreach_messages(status);
CREATE INDEX IF NOT EXISTS idx_outreach_prospect ON public.outreach_messages(prospect_id);
CREATE INDEX IF NOT EXISTS idx_sales_calls_lead ON public.sales_calls(lead_id);
CREATE INDEX IF NOT EXISTS idx_proposals_lead ON public.proposals(lead_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_queue_status ON public.queue_items(status);
CREATE INDEX IF NOT EXISTS idx_activity_entity ON public.activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);

-- ====================================================================
-- UPDATED_AT TRIGGERS
-- ====================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_leads_updated_at') THEN
    CREATE TRIGGER trg_leads_updated_at BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_content_updated_at') THEN
    CREATE TRIGGER trg_content_updated_at BEFORE UPDATE ON public.content_assets
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_outreach_updated_at') THEN
    CREATE TRIGGER trg_outreach_updated_at BEFORE UPDATE ON public.outreach_messages
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_invoices_updated_at') THEN
    CREATE TRIGGER trg_invoices_updated_at BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_queue_updated_at') THEN
    CREATE TRIGGER trg_queue_updated_at BEFORE UPDATE ON public.queue_items
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_tasks_updated_at') THEN
    CREATE TRIGGER trg_tasks_updated_at BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_onboardings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profitability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intel_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_to_content_loops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS Policies for Public/Anon Role (Using publishable key)
DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY[
    'workspaces',
    'organizations',
    'clients',
    'campaigns',
    'tasks',
    'queue_items',
    'activity_logs',
    'agent_workers',
    'module_agents',
    'prospects',
    'outreach_messages',
    'leads',
    'sales_calls',
    'proposals',
    'client_onboardings',
    'client_projects',
    'invoices',
    'client_profitability',
    'content_assets',
    'intel_signals',
    'revenue_to_content_loops',
    'system_settings'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Allow anon full access on %I" ON public.%I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "Allow anon full access on %I" ON public.%I FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);', tbl, tbl);
  END LOOP;
END $$;

-- ====================================================================
-- ENABLE REALTIME REPLICATION (For Two-Way Synchronization)
-- ====================================================================
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE 
      public.leads,
      public.content_assets,
      public.outreach_messages,
      public.sales_calls,
      public.proposals,
      public.client_onboardings,
      public.client_projects,
      public.invoices,
      public.queue_items,
      public.activity_logs,
      public.tasks;
  EXCEPTION WHEN OTHERS THEN
    -- In some environments or if table is already in publication, ignore
    NULL;
  END;
END $$;
`;
