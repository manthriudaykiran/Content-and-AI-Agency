import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Lead,
  ContentAsset,
  Prospect,
  OutreachMessage,
  SalesCall,
  Proposal,
  ClientOnboarding,
  ClientProject,
  Invoice,
  ClientProfitability,
  IntelSignal,
  RevenueToContentLoop,
  ClientAccount,
  Campaign,
  TaskItem,
  QueueItem,
  ActivityLog,
} from '../types';
import {
  DEMO_WORKSPACE,
  DEMO_ORGANIZATION,
  DEMO_CLIENTS,
  DEMO_CAMPAIGNS,
  DEMO_TASKS,
  DEMO_QUEUE_ITEMS,
  DEMO_ACTIVITY_LOGS,
  DEMO_PROSPECTS,
  DEMO_OUTREACH,
  DEMO_LEADS,
  DEMO_SALES_CALLS,
  DEMO_PROPOSALS,
  DEMO_ONBOARDINGS,
  DEMO_PROJECTS,
  DEMO_INVOICES,
  DEMO_PROFITABILITY,
  DEMO_CONTENT_ASSETS,
  DEMO_INTEL_SIGNALS,
  DEMO_REVENUE_LOOP,
  DEMO_SYSTEM_SETTINGS,
} from '../data/demoSeedData';

export interface SeedResult {
  success: boolean;
  message: string;
  counts: Record<string, number>;
  tableMissing?: boolean;
  error?: string;
}

export interface DetailedHealthCheck {
  clientInitialized: boolean;
  connectionSuccessful: boolean;
  url: string;
  tablesStatus: Record<string, 'accessible' | 'missing' | 'error'>;
  tableCounts: Record<string, number>;
  demoDataWritten: boolean;
  demoDataReadable: boolean;
  allTablesReady: boolean;
  message: string;
  error?: string;
}

export const REQUIRED_TABLES = [
  'workspaces',
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
  'system_settings',
];

/**
 * Diagnostic health check across all required Supabase tables
 */
export async function runSupabaseHealthCheck(): Promise<DetailedHealthCheck> {
  const result: DetailedHealthCheck = {
    clientInitialized: isSupabaseConfigured && !!supabase,
    connectionSuccessful: false,
    url: (supabase as any)?.supabaseUrl || '',
    tablesStatus: {},
    tableCounts: {},
    demoDataWritten: false,
    demoDataReadable: false,
    allTablesReady: false,
    message: '',
  };

  if (!isSupabaseConfigured || !supabase) {
    result.message = 'Supabase client is not configured. Check SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.';
    return result;
  }

  try {
    let missingCount = 0;
    for (const table of REQUIRED_TABLES) {
      const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      if (error) {
        if (
          error.code === '42P01' ||
          error.message.includes('Could not find the table') ||
          error.message.includes('does not exist')
        ) {
          result.tablesStatus[table] = 'missing';
          missingCount++;
        } else {
          result.tablesStatus[table] = 'error';
        }
        result.tableCounts[table] = 0;
      } else {
        result.tablesStatus[table] = 'accessible';
        result.tableCounts[table] = count || 0;
      }
    }

    result.connectionSuccessful = true;
    result.allTablesReady = missingCount === 0;

    if (missingCount > 0) {
      result.message = `${missingCount} of ${REQUIRED_TABLES.length} tables not found. Run 'supabase/migrations/001_initial_schema.sql' in the Supabase SQL Editor.`;
      return result;
    }

    // Verify read capability
    const { data: readTest, error: readErr } = await supabase.from('leads').select('id').limit(1);
    if (!readErr) {
      result.demoDataReadable = true;
      result.demoDataWritten = Boolean(readTest && readTest.length > 0);
      result.message = `Supabase connection healthy. All ${REQUIRED_TABLES.length} application tables accessible and synchronized.`;
    } else {
      result.message = `Read check returned: ${readErr.message}`;
    }

    return result;
  } catch (err: any) {
    result.message = err.message || 'Health check encountered an unexpected error.';
    result.error = err.message;
    return result;
  }
}

/**
 * Idempotently seed the Supabase database with realistic demo records across all tables
 */
export async function seedSupabaseDemoData(): Promise<SeedResult> {
  const counts: Record<string, number> = {};

  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      message: 'Supabase client is not configured. SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY is missing.',
      counts,
    };
  }

  try {
    // 1. Workspaces
    const { error: wsErr } = await supabase.from('workspaces').upsert(DEMO_WORKSPACE, { onConflict: 'id' });
    if (wsErr) {
      if (wsErr.code === '42P01' || wsErr.message.includes('Could not find the table') || wsErr.message.includes('schema cache')) {
        return {
          success: false,
          tableMissing: true,
          message: "Database tables do not exist yet. Please run migration 'supabase/migrations/001_initial_schema.sql' in the Supabase SQL Editor first.",
          error: wsErr.message,
          counts,
        };
      }
      throw wsErr;
    }
    counts.workspaces = 1;

    // Organizations (compatibility)
    try {
      await supabase.from('organizations').upsert(DEMO_ORGANIZATION, { onConflict: 'id' });
      counts.organizations = 1;
    } catch {
      // Ignore if organizations table is optional
    }

    // 2. Clients
    const { error: clientErr } = await supabase.from('clients').upsert(DEMO_CLIENTS, { onConflict: 'id' });
    if (clientErr) throw clientErr;
    counts.clients = DEMO_CLIENTS.length;

    // 3. Campaigns
    const { error: campErr } = await supabase.from('campaigns').upsert(DEMO_CAMPAIGNS, { onConflict: 'id' });
    if (campErr) throw campErr;
    counts.campaigns = DEMO_CAMPAIGNS.length;

    // 4. Tasks
    const { error: taskErr } = await supabase.from('tasks').upsert(DEMO_TASKS, { onConflict: 'id' });
    if (taskErr) throw taskErr;
    counts.tasks = DEMO_TASKS.length;

    // 5. Queue Items (Jobs)
    const { error: qErr } = await supabase.from('queue_items').upsert(DEMO_QUEUE_ITEMS, { onConflict: 'id' });
    if (qErr) throw qErr;
    counts.queue_items = DEMO_QUEUE_ITEMS.length;

    // 6. Activity Logs (Audit Trail)
    const { error: actErr } = await supabase.from('activity_logs').upsert(DEMO_ACTIVITY_LOGS, { onConflict: 'id' });
    if (actErr) throw actErr;
    counts.activity_logs = DEMO_ACTIVITY_LOGS.length;

    // 7. Prospects
    const { error: prosErr } = await supabase.from('prospects').upsert(DEMO_PROSPECTS, { onConflict: 'id' });
    if (prosErr) throw prosErr;
    counts.prospects = DEMO_PROSPECTS.length;

    // 8. Outreach Messages
    const { error: outErr } = await supabase.from('outreach_messages').upsert(DEMO_OUTREACH, { onConflict: 'id' });
    if (outErr) throw outErr;
    counts.outreach_messages = DEMO_OUTREACH.length;

    // 9. Leads
    const { error: leadErr } = await supabase.from('leads').upsert(DEMO_LEADS, { onConflict: 'id' });
    if (leadErr) throw leadErr;
    counts.leads = DEMO_LEADS.length;

    // 10. Sales Calls
    const { error: callErr } = await supabase.from('sales_calls').upsert(DEMO_SALES_CALLS, { onConflict: 'id' });
    if (callErr) throw callErr;
    counts.sales_calls = DEMO_SALES_CALLS.length;

    // 11. Proposals
    const { error: propErr } = await supabase.from('proposals').upsert(DEMO_PROPOSALS, { onConflict: 'id' });
    if (propErr) throw propErr;
    counts.proposals = DEMO_PROPOSALS.length;

    // 12. Client Onboardings
    const { error: onbErr } = await supabase.from('client_onboardings').upsert(DEMO_ONBOARDINGS, { onConflict: 'id' });
    if (onbErr) throw onbErr;
    counts.client_onboardings = DEMO_ONBOARDINGS.length;

    // 13. Client Projects
    const { error: projErr } = await supabase.from('client_projects').upsert(DEMO_PROJECTS, { onConflict: 'id' });
    if (projErr) throw projErr;
    counts.client_projects = DEMO_PROJECTS.length;

    // 14. Invoices
    const { error: invErr } = await supabase.from('invoices').upsert(DEMO_INVOICES, { onConflict: 'id' });
    if (invErr) throw invErr;
    counts.invoices = DEMO_INVOICES.length;

    // 15. Client Profitability
    const { error: profErr } = await supabase.from('client_profitability').upsert(DEMO_PROFITABILITY, { onConflict: 'id' });
    if (profErr) throw profErr;
    counts.client_profitability = DEMO_PROFITABILITY.length;

    // 16. Content Assets
    const { error: contErr } = await supabase.from('content_assets').upsert(DEMO_CONTENT_ASSETS, { onConflict: 'id' });
    if (contErr) throw contErr;
    counts.content_assets = DEMO_CONTENT_ASSETS.length;

    // 17. Intel Signals
    const { error: sigErr } = await supabase.from('intel_signals').upsert(DEMO_INTEL_SIGNALS, { onConflict: 'id' });
    if (sigErr) throw sigErr;
    counts.intel_signals = DEMO_INTEL_SIGNALS.length;

    // 18. Revenue Loop
    await supabase.from('revenue_to_content_loops').upsert(DEMO_REVENUE_LOOP, { onConflict: 'id' });
    counts.revenue_to_content_loops = 1;

    // 19. System Settings
    await supabase.from('system_settings').upsert(DEMO_SYSTEM_SETTINGS, { onConflict: 'setting_key' });
    counts.system_settings = DEMO_SYSTEM_SETTINGS.length;

    // Record an activity log for this seed action
    await logActivityToSupabase(
      'system',
      'demo_seed',
      'create',
      'Development-only demo environment seeded into Supabase with realistic linked records.',
      { counts }
    );

    return {
      success: true,
      message: `Demo environment seeded successfully! (${counts.leads} leads, ${counts.content_assets} content assets, ${counts.clients} clients, ${counts.queue_items} jobs populated)`,
      counts,
    };
  } catch (err: any) {
    console.error('Supabase seeding error:', err);
    return {
      success: false,
      message: err.message || 'Failed to seed demo data into Supabase',
      counts,
      error: err.message,
    };
  }
}

/**
 * Fetch full state from all Supabase tables
 */
export async function fetchFullStateFromSupabase(): Promise<{
  leads?: Lead[];
  prospects?: Prospect[];
  outreachMessages?: OutreachMessage[];
  salesCalls?: SalesCall[];
  proposals?: Proposal[];
  onboardings?: ClientOnboarding[];
  projects?: ClientProject[];
  invoices?: Invoice[];
  profitability?: ClientProfitability[];
  contentAssets?: ContentAsset[];
  intelSignals?: IntelSignal[];
  revenueLoop?: RevenueToContentLoop;
  clients?: ClientAccount[];
  campaigns?: Campaign[];
  tasks?: TaskItem[];
  queueItems?: QueueItem[];
  activityLogs?: ActivityLog[];
}> {
  if (!supabase || !isSupabaseConfigured) return {};

  const state: any = {};

  try {
    const [
      leadsRes,
      prospRes,
      outRes,
      callRes,
      propRes,
      onbRes,
      projRes,
      invRes,
      profRes,
      contRes,
      sigRes,
      clientRes,
      campRes,
      taskRes,
      queueRes,
      actRes,
    ] = await Promise.all([
      supabase.from('leads').select('*').order('created_at', { ascending: false }),
      supabase.from('prospects').select('*').order('fit_score', { ascending: false }),
      supabase.from('outreach_messages').select('*').order('created_at', { ascending: false }),
      supabase.from('sales_calls').select('*').order('created_at', { ascending: false }),
      supabase.from('proposals').select('*').order('created_at', { ascending: false }),
      supabase.from('client_onboardings').select('*').order('created_at', { ascending: false }),
      supabase.from('client_projects').select('*').order('created_at', { ascending: false }),
      supabase.from('invoices').select('*').order('issue_date', { ascending: false }),
      supabase.from('client_profitability').select('*').order('revenue', { ascending: false }),
      supabase.from('content_assets').select('*').order('created_at', { ascending: false }),
      supabase.from('intel_signals').select('*').order('frequency', { ascending: false }),
      supabase.from('clients').select('*').order('created_at', { ascending: false }),
      supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
      supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      supabase.from('queue_items').select('*').order('created_at', { ascending: false }),
      supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(25),
    ]);

    if (!leadsRes.error && leadsRes.data && leadsRes.data.length > 0) {
      state.leads = leadsRes.data.map((r: any) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        company: r.company,
        title: r.title,
        stage: r.stage,
        estimatedValue: Number(r.estimated_value) || 0,
        contentAttribution: r.content_attribution || {},
        objections: r.objections || [],
        painDescription: r.pain_description || '',
        intent: r.intent || 'medium',
        nextAction: r.next_action || '',
        responsibleAgent: r.responsible_agent || '',
        lastTouch: r.last_touch || '',
        salesNotes: r.sales_notes || [],
      }));
    }

    if (!prospRes.error && prospRes.data && prospRes.data.length > 0) {
      state.prospects = prospRes.data.map((r: any) => ({
        id: r.id,
        name: r.name,
        title: r.title,
        company: r.company,
        segment: r.segment,
        industry: r.industry,
        size: r.size,
        fitScore: r.fit_score,
        intentScore: r.intent_score,
        status: r.status,
        probablePain: r.probable_pain,
        source: r.source,
        research: r.research || {},
      }));
    }

    if (!outRes.error && outRes.data && outRes.data.length > 0) {
      state.outreachMessages = outRes.data.map((r: any) => ({
        id: r.id,
        prospectId: r.prospect_id,
        prospectName: r.prospect_name,
        company: r.company,
        channel: r.channel,
        sequenceStep: r.sequence_step,
        dayNumber: r.day_number,
        status: r.status,
        framework: r.framework || {},
        fullText: r.full_text,
        scheduledFor: r.scheduled_for,
      }));
    }

    if (!callRes.error && callRes.data && callRes.data.length > 0) {
      state.salesCalls = callRes.data.map((r: any) => ({
        id: r.id,
        leadId: r.lead_id,
        leadName: r.lead_name,
        company: r.company,
        date: r.date,
        status: r.status,
        preCallIntel: r.pre_call_intel || {},
        copilotNotes: r.copilot_notes,
        postCallIntel: r.post_call_intel,
      }));
    }

    if (!propRes.error && propRes.data && propRes.data.length > 0) {
      state.proposals = propRes.data.map((r: any) => ({
        id: r.id,
        leadId: r.lead_id,
        clientName: r.client_name,
        companyName: r.company_name,
        dealValue: Number(r.deal_value) || 0,
        status: r.status,
        sections: r.sections || {},
      }));
    }

    if (!onbRes.error && onbRes.data && onbRes.data.length > 0) {
      const first = onbRes.data[0];
      state.onboardings = [
        {
          id: first.id,
          clientId: first.id,
          clientName: first.client_name,
          company: first.company,
          dealWonDate: first.deal_won_date || 'Oct 1, 2026',
          currentStepIndex: first.current_step_index || 0,
          steps: first.steps || [],
          checklistItems: first.checklist_items || [],
          requiredIntegrations: first.required_integrations || [],
          missingItems: first.missing_items || [],
          nextMeeting: first.next_meeting || '',
          healthScore: first.health_score || 100,
        },
      ];
    }

    if (!projRes.error && projRes.data && projRes.data.length > 0) {
      state.projects = projRes.data.map((r: any) => ({
        id: r.id,
        clientName: r.client_name,
        company: r.company,
        projectOutcome: r.project_outcome,
        stage: r.stage,
        progress: r.progress,
        milestones: r.milestones || [],
        workflows: r.workflows || [],
        blockers: r.blockers || [],
        approvalsNeeded: r.approvals_needed || [],
        automationHealth: r.automation_health,
        dueDate: r.due_date,
      }));
    }

    if (!invRes.error && invRes.data && invRes.data.length > 0) {
      state.invoices = invRes.data.map((r: any) => ({
        id: r.id,
        clientName: r.client_name,
        amount: Number(r.amount) || 0,
        status: r.status,
        issueDate: r.issue_date,
        dueDate: r.due_date,
        type: r.type,
      }));
    }

    if (!profRes.error && profRes.data && profRes.data.length > 0) {
      state.profitability = profRes.data.map((r: any) => ({
        clientId: r.client_id || r.id,
        clientName: r.client_name,
        revenue: Number(r.revenue) || 0,
        apiCost: Number(r.api_cost) || 0,
        toolCost: Number(r.tool_cost) || 0,
        deliveryHours: Number(r.delivery_hours) || 0,
        hourlyCost: Number(r.hourly_cost) || 0,
        netMargin: Number(r.net_margin) || 0,
      }));
    }

    if (!contRes.error && contRes.data && contRes.data.length > 0) {
      state.contentAssets = contRes.data.map((r: any) => ({
        id: r.id,
        title: r.title,
        platform: r.platform,
        format: r.format,
        status: r.status,
        funnelStage: r.funnel_stage,
        pillar: r.pillar,
        sourceInsight: r.source_insight,
        targetAudience: r.target_audience,
        offer: r.offer,
        cta: r.cta,
        campaign: r.campaign,
        scheduledDate: r.scheduled_date,
        publishedDate: r.published_date,
        hook: r.hook,
        body: r.body,
        metrics: r.metrics || {
          reach: 0,
          engagements: 0,
          saves: 0,
          leadsGenerated: 0,
          revenueAttributed: 0,
        },
      }));
    }

    if (!sigRes.error && sigRes.data && sigRes.data.length > 0) {
      state.intelSignals = sigRes.data.map((r: any) => ({
        id: r.id,
        type: r.type,
        title: r.title,
        description: r.description,
        impactScore: r.impact_score,
        frequency: r.frequency,
        actionTaken: r.action_taken,
        suggestedAutomation: r.suggested_automation,
      }));
    }

    if (!clientRes.error && clientRes.data && clientRes.data.length > 0) {
      state.clients = clientRes.data.map((r: any) => ({
        id: r.id,
        workspaceId: r.workspace_id,
        name: r.name,
        company: r.company,
        industry: r.industry,
        status: r.status,
        retainerAmount: Number(r.retainer_amount) || 0,
        primaryContactEmail: r.primary_contact_email,
        slaTier: r.sla_tier,
      }));
    }

    if (!campRes.error && campRes.data && campRes.data.length > 0) {
      state.campaigns = campRes.data.map((r: any) => ({
        id: r.id,
        workspaceId: r.workspace_id,
        name: r.name,
        objective: r.objective,
        targetAudience: r.target_audience,
        status: r.status,
        startDate: r.start_date,
        endDate: r.end_date,
      }));
    }

    if (!taskRes.error && taskRes.data && taskRes.data.length > 0) {
      state.tasks = taskRes.data.map((r: any) => ({
        id: r.id,
        workspaceId: r.workspace_id,
        clientId: r.client_id,
        title: r.title,
        module: r.module,
        assignedAgent: r.assigned_agent,
        status: r.status,
        priority: r.priority,
        dueDate: r.due_date,
      }));
    }

    if (!queueRes.error && queueRes.data && queueRes.data.length > 0) {
      state.queueItems = queueRes.data.map((r: any) => ({
        id: r.id,
        jobType: r.job_type,
        sourceModule: r.source_module,
        status: r.status,
        priority: r.priority,
        progress: r.progress,
        input: r.input || {},
        output: r.output || {},
        error: r.error,
        startedAt: r.started_at,
        completedAt: r.completed_at,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    }

    if (!actRes.error && actRes.data && actRes.data.length > 0) {
      state.activityLogs = actRes.data.map((r: any) => ({
        id: r.id,
        workspaceId: r.workspace_id,
        entityType: r.entity_type,
        entityId: r.entity_id,
        action: r.action,
        description: r.description,
        previousValue: r.previous_value,
        newValue: r.new_value,
        metadata: r.metadata,
        createdAt: r.created_at,
      }));
    }
  } catch (err) {
    console.warn('Error fetching full state from Supabase:', err);
  }

  return state;
}

/**
 * Audit log helper: Records actions in public.activity_logs
 */
export async function logActivityToSupabase(
  entityType: string,
  entityId: string,
  action: 'create' | 'update' | 'delete' | 'archive' | 'status_change',
  description: string,
  metadata?: Record<string, any>,
  previousValue?: any,
  newValue?: any
): Promise<void> {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    await supabase.from('activity_logs').insert({
      id: crypto.randomUUID ? crypto.randomUUID() : `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      workspace_id: '00000000-0000-0000-0000-000000000001',
      entity_type: entityType,
      entity_id: entityId,
      action,
      description,
      previous_value: previousValue,
      new_value: newValue,
      metadata: metadata || {},
    });
  } catch (err) {
    console.warn('logActivityToSupabase warning:', err);
  }
}

/**
 * Enqueue a new processing job in public.queue_items
 */
export async function enqueueJobInSupabase(
  jobType: string,
  sourceModule: string,
  input: Record<string, any>,
  priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
): Promise<string | null> {
  if (!supabase || !isSupabaseConfigured) return null;
  const jobId = crypto.randomUUID ? crypto.randomUUID() : `job-${Date.now()}`;
  try {
    const { error } = await supabase.from('queue_items').insert({
      id: jobId,
      workspace_id: '00000000-0000-0000-0000-000000000001',
      job_type: jobType,
      source_module: sourceModule,
      status: 'running',
      priority,
      progress: 10,
      input,
      started_at: new Date().toISOString(),
    });
    if (error) throw error;
    await logActivityToSupabase('queue_items', jobId, 'create', `Job '${jobType}' enqueued from ${sourceModule}`);
    return jobId;
  } catch (err) {
    console.warn('enqueueJobInSupabase warning:', err);
    return null;
  }
}

/**
 * Update a processing job status & progress in public.queue_items
 */
export async function updateJobInSupabase(
  jobId: string,
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled',
  progress: number,
  output?: Record<string, any>,
  error?: string
): Promise<void> {
  if (!supabase || !isSupabaseConfigured) return;
  try {
    await supabase.from('queue_items').update({
      status,
      progress,
      output: output || {},
      error: error || null,
      completed_at: status === 'completed' || status === 'failed' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }).eq('id', jobId);
  } catch (err) {
    console.warn('updateJobInSupabase warning:', err);
  }
}

/**
 * Reusable repository operation: Delete record from Supabase
 */
export async function deleteRecordFromSupabase(table: string, id: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase || !isSupabaseConfigured) return { success: false, error: 'Supabase not configured' };
  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    await logActivityToSupabase(table, id, 'delete', `Record '${id}' deleted from table '${table}'`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Subscribe to Supabase Realtime Postgres Changes for two-way synchronization
 */
export function subscribeToSupabaseRealtime(onTableChange: (payload: any) => void): (() => void) | null {
  if (!supabase || !isSupabaseConfigured) return null;
  try {
    const channel = supabase
      .channel('aetheros-realtime-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          onTableChange(payload);
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  } catch (err) {
    console.warn('Realtime subscription error:', err);
    return null;
  }
}
