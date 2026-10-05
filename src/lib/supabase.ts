import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Lead, ContentAsset, OutreachMessage, Invoice } from '../types';

// Retrieve credentials safely from environment without hardcoding
const getEnvVar = (key: string, viteKey: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env[viteKey]) return import.meta.env[viteKey];
    if (import.meta.env[key]) return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[viteKey]) return process.env[viteKey];
    if (process.env[key]) return process.env[key];
  }
  return '';
};

const supabaseUrl = getEnvVar('SUPABASE_URL', 'VITE_SUPABASE_URL');
const supabasePublishableKey =
  getEnvVar('SUPABASE_PUBLISHABLE_KEY', 'VITE_SUPABASE_PUBLISHABLE_KEY') ||
  getEnvVar('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

// Create reusable Supabase client (using public publishable/anon key only - never service role)
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Check connectivity to Supabase
 */
export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  configured: boolean;
  url: string;
  error?: string;
}> {
  if (!isSupabaseConfigured || !supabase) {
    // Try fetching from server-side config endpoint in case runtime injected them
    try {
      const res = await fetch('/api/config/supabase');
      if (res.ok) {
        const data = await res.json();
        if (data.configured) {
          return {
            connected: true,
            configured: true,
            url: data.url ? data.url.replace(/^(https?:\/\/[^/]+).*/, '$1') : 'Configured',
          };
        }
      }
    } catch {
      // Ignore network fallback error
    }

    return {
      connected: false,
      configured: false,
      url: supabaseUrl || 'Not configured',
      error: 'SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are not yet configured.',
    };
  }

  try {
    // Perform a lightweight check
    const { error } = await supabase.from('leads').select('count', { count: 'exact', head: true });
    // If error is code 42P01 (relation does not exist), the connection itself is successful!
    if (!error || error.code === '42P01') {
      return {
        connected: true,
        configured: true,
        url: supabaseUrl.replace(/^(https?:\/\/[^/]+).*/, '$1'),
      };
    }

    return {
      connected: false,
      configured: true,
      url: supabaseUrl,
      error: error.message,
    };
  } catch (err: any) {
    return {
      connected: false,
      configured: true,
      url: supabaseUrl,
      error: err.message || 'Connection check failed',
    };
  }
}

/**
 * Reusable Database Operations for Leads
 */
export async function syncLeadToSupabase(lead: Lead): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('leads')
      .upsert(
        {
          id: lead.id,
          name: lead.name,
          email: lead.email,
          company: lead.company,
          title: lead.title,
          stage: lead.stage,
          estimated_value: lead.estimatedValue,
          content_attribution: lead.contentAttribution,
          objections: lead.objections,
          pain_description: lead.painDescription,
          intent: lead.intent,
          next_action: lead.nextAction,
          responsible_agent: lead.responsibleAgent,
          last_touch: lead.lastTouch,
          sales_notes: lead.salesNotes,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
    return !error;
  } catch (err) {
    console.warn('Supabase syncLead error:', err);
    return false;
  }
}

/**
 * Reusable Database Operations for Content Assets
 */
export async function syncContentAssetToSupabase(asset: ContentAsset): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('content_assets')
      .upsert(
        {
          id: asset.id,
          title: asset.title,
          platform: asset.platform,
          format: asset.format,
          status: asset.status,
          funnel_stage: asset.funnelStage,
          pillar: asset.pillar,
          source_insight: asset.sourceInsight,
          target_audience: asset.targetAudience,
          offer: asset.offer,
          cta: asset.cta,
          campaign: asset.campaign,
          hook: asset.hook,
          body: asset.body,
          metrics: asset.metrics,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
    return !error;
  } catch (err) {
    console.warn('Supabase syncContentAsset error:', err);
    return false;
  }
}

/**
 * Reusable Database Operations for Outreach Messages
 */
export async function syncOutreachToSupabase(msg: OutreachMessage): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('outreach_messages')
      .upsert(
        {
          id: msg.id,
          prospect_id: msg.prospectId,
          prospect_name: msg.prospectName,
          company: msg.company,
          channel: msg.channel,
          sequence_step: msg.sequenceStep,
          day_number: msg.dayNumber,
          status: msg.status,
          framework: msg.framework,
          full_text: msg.fullText,
          scheduled_for: msg.scheduledFor,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
    return !error;
  } catch (err) {
    console.warn('Supabase syncOutreach error:', err);
    return false;
  }
}

/**
 * Reusable Database Operations for Invoices
 */
export async function syncInvoiceToSupabase(inv: Invoice): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('invoices')
      .upsert(
        {
          id: inv.id,
          client_name: inv.clientName,
          amount: inv.amount,
          status: inv.status,
          issue_date: inv.issueDate,
          due_date: inv.dueDate,
          type: inv.type,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
    return !error;
  } catch (err) {
    console.warn('Supabase syncInvoice error:', err);
    return false;
  }
}

/**
 * Load initial data from Supabase if tables exist and have records
 */
export async function loadInitialDataFromSupabase(): Promise<{
  leads?: Lead[];
  contentAssets?: ContentAsset[];
  invoices?: Invoice[];
}> {
  if (!supabase || !isSupabaseConfigured) return {};

  const results: {
    leads?: Lead[];
    contentAssets?: ContentAsset[];
    invoices?: Invoice[];
  } = {};

  try {
    const { data: dbLeads, error: leadsErr } = await supabase.from('leads').select('*');
    if (!leadsErr && dbLeads && dbLeads.length > 0) {
      results.leads = dbLeads.map((r: any) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        company: r.company,
        title: r.title,
        stage: r.stage,
        estimatedValue: r.estimated_value,
        contentAttribution: r.content_attribution,
        objections: r.objections || [],
        painDescription: r.pain_description,
        intent: r.intent,
        nextAction: r.next_action,
        responsibleAgent: r.responsible_agent,
        lastTouch: r.last_touch,
        salesNotes: r.sales_notes || [],
      }));
    }

    const { data: dbAssets, error: assetsErr } = await supabase.from('content_assets').select('*');
    if (!assetsErr && dbAssets && dbAssets.length > 0) {
      results.contentAssets = dbAssets.map((r: any) => ({
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
        hook: r.hook,
        body: r.body,
        metrics: r.metrics,
      }));
    }

    const { data: dbInvoices, error: invErr } = await supabase.from('invoices').select('*');
    if (!invErr && dbInvoices && dbInvoices.length > 0) {
      results.invoices = dbInvoices.map((r: any) => ({
        id: r.id,
        clientName: r.client_name,
        amount: r.amount,
        status: r.status,
        issueDate: r.issue_date,
        dueDate: r.due_date,
        type: r.type,
      }));
    }
  } catch (err) {
    console.warn('loadInitialDataFromSupabase error:', err);
  }

  return results;
}
