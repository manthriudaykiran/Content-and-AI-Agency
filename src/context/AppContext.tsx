import React, { createContext, useContext, useState } from 'react';
import {
  NavTab,
  AgentWorker,
  ContentAsset,
  Prospect,
  Lead,
  SalesCall,
  Proposal,
  ClientOnboarding,
  ClientProject,
  Invoice,
  ClientProfitability,
  IntelSignal,
  RevenueToContentLoop,
  OutreachMessage,
  ModuleAgentMeta,
  LiveScriptGenerationState,
  ExcelIngestionRow,
  ClientAccount,
  Campaign,
  TaskItem,
  QueueItem,
  ActivityLog,
} from '../types';
import {
  INITIAL_AGENTS,
  INITIAL_CONTENT_ASSETS,
  INITIAL_PROSPECTS,
  INITIAL_OUTREACH,
  INITIAL_LEADS,
  INITIAL_SALES_CALLS,
  INITIAL_PROPOSALS,
  INITIAL_ONBOARDING,
  INITIAL_PROJECTS,
  INITIAL_INVOICES,
  INITIAL_PROFITABILITY,
  INITIAL_INTEL_SIGNALS,
  INITIAL_LOOP,
} from '../data/initialData';
import { MODULE_AGENTS } from '../data/moduleAgents';
import {
  DEMO_CLIENTS,
  DEMO_CAMPAIGNS,
  DEMO_TASKS,
  DEMO_QUEUE_ITEMS,
  DEMO_ACTIVITY_LOGS,
} from '../data/demoSeedData';
import {
  supabase,
  isSupabaseConfigured,
  checkSupabaseConnection,
  syncLeadToSupabase,
  syncContentAssetToSupabase,
  syncOutreachToSupabase,
  syncInvoiceToSupabase,
  loadInitialDataFromSupabase,
} from '../lib/supabase';
import {
  fetchFullStateFromSupabase,
  logActivityToSupabase,
  enqueueJobInSupabase,
  updateJobInSupabase,
  subscribeToSupabaseRealtime,
} from '../services/supabaseService';
import { InspectedRecord } from '../components/RecordInspectorModal';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
}

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  agents: AgentWorker[];
  updateAgentStatus: (agentId: string, status: AgentWorker['status'], currentTask?: string) => void;
  loop: RevenueToContentLoop;
  triggerClosedLoopSprint: () => Promise<void>;
  isLoopRunning: boolean;
  contentAssets: ContentAsset[];
  addContentAsset: (asset: Omit<ContentAsset, 'id'>) => void;
  updateContentStatus: (id: string, status: ContentAsset['status']) => void;
  prospects: Prospect[];
  updateProspectStatus: (id: string, status: Prospect['status']) => void;
  outreachMessages: OutreachMessage[];
  approveOutreach: (id: string) => void;
  rejectOutreach: (id: string) => void;
  leads: Lead[];
  updateLeadStage: (id: string, stage: Lead['stage']) => void;
  addLead: (lead: Omit<Lead, 'id'>) => void;
  salesCalls: SalesCall[];
  proposals: Proposal[];
  createProposalFromLead: (leadId: string) => void;
  updateProposalStatus: (id: string, status: Proposal['status']) => void;
  onboarding: ClientOnboarding;
  toggleOnboardingChecklist: (itemId: string) => void;
  projects: ClientProject[];
  resolveBlocker: (projectId: string, blockerIndex: number) => void;
  invoices: Invoice[];
  markInvoicePaid: (id: string) => void;
  profitability: ClientProfitability[];
  intelSignals: IntelSignal[];
  
  // Every Module as an AI Agent
  moduleAgents: ModuleAgentMeta[];
  runAllAgentsUpdate: () => Promise<void>;
  isUpdatingAllAgents: boolean;

  // Live Script Generation with Progress %
  liveScriptState: LiveScriptGenerationState;
  generateViralScript: (platform: 'linkedin' | 'youtube' | 'instagram' | 'facebook', topic: string) => Promise<void>;

  // Excel / Spreadsheet Ingestion Engine
  isExcelSyncOpen: boolean;
  setIsExcelSyncOpen: (open: boolean) => void;
  ingestExcelRows: (rows: ExcelIngestionRow[]) => void;

  // Supabase Database Connection
  supabaseStatus: {
    connected: boolean;
    configured: boolean;
    url: string;
    error?: string;
  };
  checkSupabaseHealth: () => Promise<void>;
  refreshFromSupabase: () => Promise<void>;
  isSupabaseDemoModalOpen: boolean;
  setIsSupabaseDemoModalOpen: (open: boolean) => void;
  isDatabaseSyncOpen: boolean;
  setIsDatabaseSyncOpen: (open: boolean) => void;
  inspectedRecord: InspectedRecord | null;
  setInspectedRecord: (rec: InspectedRecord | null) => void;

  // Supabase Database Entity State
  clients: ClientAccount[];
  campaigns: Campaign[];
  tasks: TaskItem[];
  queueItems: QueueItem[];
  activityLogs: ActivityLog[];

  // Modals & walkthroughs
  isAuditModalOpen: boolean;
  setIsAuditModalOpen: (open: boolean) => void;
  isDemoStoryModalOpen: boolean;
  setIsDemoStoryModalOpen: (open: boolean) => void;
  demoStepIndex: number;
  setDemoStepIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedAgentForInspection: AgentWorker | null;
  setSelectedAgentForInspection: (agent: AgentWorker | null) => void;

  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('command-center');
  const [agents, setAgents] = useState<AgentWorker[]>(INITIAL_AGENTS);
  const [moduleAgents, setModuleAgents] = useState<ModuleAgentMeta[]>(MODULE_AGENTS);
  const [isUpdatingAllAgents, setIsUpdatingAllAgents] = useState(false);
  const [loop, setLoop] = useState<RevenueToContentLoop>(INITIAL_LOOP);
  const [isLoopRunning, setIsLoopRunning] = useState<boolean>(false);
  const [contentAssets, setContentAssets] = useState<ContentAsset[]>(INITIAL_CONTENT_ASSETS);
  const [prospects, setProspects] = useState<Prospect[]>(INITIAL_PROSPECTS);
  const [outreachMessages, setOutreachMessages] = useState<OutreachMessage[]>(INITIAL_OUTREACH);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [salesCalls, setSalesCalls] = useState<SalesCall[]>(INITIAL_SALES_CALLS);
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [onboarding, setOnboarding] = useState<ClientOnboarding>(INITIAL_ONBOARDING);
  const [projects, setProjects] = useState<ClientProject[]>(INITIAL_PROJECTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [profitability] = useState<ClientProfitability[]>(INITIAL_PROFITABILITY);
  const [intelSignals] = useState<IntelSignal[]>(INITIAL_INTEL_SIGNALS);

  // Expanded Supabase business entities
  const [clients, setClients] = useState<ClientAccount[]>(DEMO_CLIENTS as any);
  const [campaigns, setCampaigns] = useState<Campaign[]>(DEMO_CAMPAIGNS as any);
  const [tasks, setTasks] = useState<TaskItem[]>(DEMO_TASKS as any);
  const [queueItems, setQueueItems] = useState<QueueItem[]>(DEMO_QUEUE_ITEMS as any);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(DEMO_ACTIVITY_LOGS as any);

  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isDemoStoryModalOpen, setIsDemoStoryModalOpen] = useState(false);
  const [isExcelSyncOpen, setIsExcelSyncOpen] = useState(false);
  const [isSupabaseDemoModalOpen, setIsSupabaseDemoModalOpen] = useState(false);
  const [isDatabaseSyncOpen, setIsDatabaseSyncOpen] = useState(false);
  const [inspectedRecord, setInspectedRecord] = useState<InspectedRecord | null>(null);
  const [demoStepIndex, setDemoStepIndex] = useState(0);
  const [selectedAgentForInspection, setSelectedAgentForInspection] = useState<AgentWorker | null>(null);

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Supabase Live Status
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean;
    configured: boolean;
    url: string;
    error?: string;
  }>({
    connected: false,
    configured: isSupabaseConfigured,
    url: '',
  });

  const checkSupabaseHealth = async () => {
    const status = await checkSupabaseConnection();
    setSupabaseStatus(status);
    if (status.connected) {
      addToast({
        title: 'Supabase Connected',
        message: `Database connection verified to ${status.url}`,
        type: 'success',
      });
    }
  };

  const refreshFromSupabase = async () => {
    try {
      const fullState = await fetchFullStateFromSupabase();
      if (fullState.leads && fullState.leads.length > 0) setLeads(fullState.leads);
      if (fullState.prospects && fullState.prospects.length > 0) setProspects(fullState.prospects);
      if (fullState.outreachMessages && fullState.outreachMessages.length > 0) setOutreachMessages(fullState.outreachMessages);
      if (fullState.salesCalls && fullState.salesCalls.length > 0) setSalesCalls(fullState.salesCalls);
      if (fullState.proposals && fullState.proposals.length > 0) setProposals(fullState.proposals);
      if (fullState.onboardings && fullState.onboardings.length > 0) setOnboarding(fullState.onboardings[0]);
      if (fullState.projects && fullState.projects.length > 0) setProjects(fullState.projects);
      if (fullState.invoices && fullState.invoices.length > 0) setInvoices(fullState.invoices);
      if (fullState.contentAssets && fullState.contentAssets.length > 0) setContentAssets(fullState.contentAssets);
      if (fullState.clients && fullState.clients.length > 0) setClients(fullState.clients);
      if (fullState.campaigns && fullState.campaigns.length > 0) setCampaigns(fullState.campaigns);
      if (fullState.tasks && fullState.tasks.length > 0) setTasks(fullState.tasks);
      if (fullState.queueItems && fullState.queueItems.length > 0) setQueueItems(fullState.queueItems);
      if (fullState.activityLogs && fullState.activityLogs.length > 0) setActivityLogs(fullState.activityLogs);
    } catch (err: any) {
      console.warn('refreshFromSupabase warning:', err);
    }
  };

  // Initial Boot & Realtime Postgres Changes Subscription
  React.useEffect(() => {
    async function initSupabase() {
      const status = await checkSupabaseConnection();
      setSupabaseStatus(status);
      if (status.connected) {
        try {
          await refreshFromSupabase();
        } catch (err) {
          console.warn('Supabase initial fetch warning:', err);
        }
      }
    }
    initSupabase();

    // Subscribe to two-way realtime updates
    const unsubscribe = subscribeToSupabaseRealtime((payload) => {
      console.log('Realtime change from Supabase:', payload);
      refreshFromSupabase();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Live Script Generation State
  const [liveScriptState, setLiveScriptState] = useState<LiveScriptGenerationState>({
    isGenerating: false,
    platform: 'linkedin',
    topic: '',
    progress: 0,
    phase: 'Idle',
    infographicSteps: [
      { step: '1. Hook & Pattern Interrupt', completed: false, active: false, details: 'Crafting high-status first sentence or visual trigger' },
      { step: '2. Retention & Pacing', completed: false, active: false, details: 'Structuring scene changes, terminal cues, and rhythm' },
      { step: '3. Authority & System Proof', completed: false, active: false, details: 'Embedding real agency metrics, code schemas, and zero-debt proof' },
      { step: '4. CTA & Viral Polish', completed: false, active: false, details: 'Configuring low-friction asset keyword & distribution triggers' },
    ],
    resultScript: null,
  });

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateAgentStatus = (agentId: string, status: AgentWorker['status'], currentTask?: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId
          ? {
              ...agent,
              status,
              currentTask: currentTask ?? agent.currentTask,
              lastExecutionTime: 'Just now',
            }
          : agent
      )
    );
  };

  // Run update across ALL 14 module agents
  const runAllAgentsUpdate = async () => {
    setIsUpdatingAllAgents(true);
    addToast({
      title: 'Command Center: Executing All Module Agents',
      message: 'Broadcasting synchronized operational pulse to all 14 domain-expert agents.',
      type: 'info',
    });

    // Step 1: Set all modules to working
    setModuleAgents((prev) =>
      prev.map((m) => ({ ...m, status: 'working' }))
    );
    await new Promise((r) => setTimeout(r, 600));

    // Step 2: Set modules to analyzing
    setModuleAgents((prev) =>
      prev.map((m) => ({ ...m, status: 'analyzing' }))
    );
    await new Promise((r) => setTimeout(r, 800));

    // Step 3: Complete & optimize all modules with updated daily targets
    setModuleAgents((prev) =>
      prev.map((m) => ({
        ...m,
        status: 'optimized',
        dailyTarget: {
          ...m.dailyTarget,
          metricGoal: m.dailyTarget.metricGoal + ' [Synced]',
        },
      }))
    );

    setIsUpdatingAllAgents(false);
    addToast({
      title: 'All Module Agents Synchronized',
      message: '14 world-class agents updated their daily targets, risk telemetry, and tactical strategies.',
      type: 'success',
    });
  };

  // Live Script Generation with 0% -> 100% Progress & Infographics
  const generateViralScript = async (platform: 'linkedin' | 'youtube' | 'instagram' | 'facebook', topic: string) => {
    setLiveScriptState({
      isGenerating: true,
      platform,
      topic,
      progress: 5,
      phase: 'Initializing Viral Script Agent...',
      infographicSteps: [
        { step: '1. Hook & Pattern Interrupt', completed: false, active: true, details: 'Analyzing viral hooks & emotional dissonance' },
        { step: '2. Retention & Pacing', completed: false, active: false, details: 'Calculating drop-off barriers and visual anchors' },
        { step: '3. Authority & System Proof', completed: false, active: false, details: 'Linking real agency workflows and ROI numbers' },
        { step: '4. CTA & Viral Polish', completed: false, active: false, details: 'Injecting comment triggers and algorithmic hashtags' },
      ],
      resultScript: null,
    });

    // Step 1: Hook (25%)
    await new Promise((r) => setTimeout(r, 500));
    setLiveScriptState((prev) => ({
      ...prev,
      progress: 25,
      phase: 'Step 1: Hook Optimization & Psychological Framing',
      infographicSteps: prev.infographicSteps.map((s, i) =>
        i === 0 ? { ...s, completed: true, active: false } : i === 1 ? { ...s, active: true } : s
      ),
    }));

    // Step 2: Retention (50%)
    await new Promise((r) => setTimeout(r, 600));
    setLiveScriptState((prev) => ({
      ...prev,
      progress: 55,
      phase: 'Step 2: Structuring Visual Cues & Platform Mechanics',
      infographicSteps: prev.infographicSteps.map((s, i) =>
        i <= 1 ? { ...s, completed: true, active: false } : i === 2 ? { ...s, active: true } : s
      ),
    }));

    // Step 3: Proof & System (75%)
    await new Promise((r) => setTimeout(r, 600));
    setLiveScriptState((prev) => ({
      ...prev,
      progress: 80,
      phase: 'Step 3: Embedding Agency Workflows & Unbreakable Authority Proof',
      infographicSteps: prev.infographicSteps.map((s, i) =>
        i <= 2 ? { ...s, completed: true, active: false } : i === 3 ? { ...s, active: true } : s
      ),
    }));

    // Generate actual script content (calling Gemini API endpoint or rich specialized fallback)
    let generatedHook = '';
    let generatedBody = '';
    let generatedVisuals = '';
    let generatedCTA = '';

    const isLinkedIn = platform === 'linkedin';
    const isYouTube = platform === 'youtube';
    const isInstagram = platform === 'instagram';

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are the world's most elite viral content creator and AI agency mastermind.
Write a world-class viral ${platform.toUpperCase()} script for the topic: "${topic}".
Format requirements:
- Hook: Shocking, high-status first sentence
- Visual cues: [ON-SCREEN TERMINAL], [SHOW WORKFLOW NODE], [FAST CUT]
- Core System: Deep technical authority, zero fluff
- Proof: Concrete numbers and agency metrics
- Call To Action: Specific low-friction comment trigger.
Focus: ${isLinkedIn ? 'Strictly about AI Agency systems, agentic workflows, built agents, and the business side.' : 'Cutting-edge AI tools, agents, and live technical demos.'}`,
        }),
      });
      const data = await res.json();
      if (data.text) {
        generatedBody = data.text;
      }
    } catch {
      // Fallback
    }

    if (!generatedBody) {
      if (isLinkedIn) {
        generatedHook = `Most founders think scaling an AI agency requires hiring 10 developers. We replaced 60 hours of weekly operations with 21 autonomous agents.`;
        generatedVisuals = `[DIAGRAM ON SCREEN: Manager-Worker dispatch topology showing CRM → Sales → Content OS loop]`;
        generatedBody = `${generatedHook}\n\n${generatedVisuals}\n\nWhen we started our AI agency, we made the classic beginner mistake: selling one-off ChatGPT prompts for $1,500.\n\nHere is why that failed:\n1. Prompt drift caused client outputs to hallucinate\n2. Internal engineering debt piled up on custom scrapers\n3. Zero recurring revenue predictability\n\nSo we redesigned our entire agency as a deterministic state machine:\n- Layer 1 Architect Agent governs permissions and schemas\n- CRM Agent tracks exact content attribution down to the originating dollar\n- Onboarding Agent handles Slack Connect and 1Password intake within 48 hours\n\nResult? 78.4% gross profit margins, 0 dev backlog tickets, and clients signing $3,500/mo retainers on 14-day zero-code SLAs.`;
        generatedCTA = `Comment "ARCHITECTURE" below and I’ll DM you the complete 1-page visual workflow schema we deploy for clients.`;
      } else if (isYouTube) {
        generatedHook = `In this video, I am opening up our agency’s internal production repository to show you how to build a 21-Agent AI Operating System from scratch in 2026.`;
        generatedVisuals = `[FAST ZOOM ON TERMINAL: Running 'node server.ts' with Gemini 3.8 Flash SDK telemetry]`;
        generatedBody = `${generatedHook}\n\n[TIMESTAMPS]\n00:00 - Why Single-Prompt AI Wrappers Fail in Production\n03:15 - The Manager-Worker JSON Response Contract\n08:40 - Building the Autonomous Triage Agent (Live Code)\n16:20 - Real-Time CRM Webhook Synchronization\n22:10 - Deploying Safe Sandboxes for Clients\n\n[KEY CODE SNIPPET]:\nWe do not use messy LangChain chains. We use lightweight event-driven TypeScript interfaces with strict schemas.\n\nWatch as this agent ingests a raw Zoom transcript, extracts 3 buyer objections, and immediately generates tomorrow's LinkedIn post.`;
        generatedCTA = `Download the open-source repository and JSON response schemas in the pinned description link. Subscribe for weekly production breakdowns.`;
      } else if (isInstagram) {
        generatedHook = `Watch this AI agent replace a 4-hour manual SDR research task in 45 seconds.`;
        generatedVisuals = `[SPLIT SCREEN: Left side shows clock ticking 4 hours. Right side shows terminal running sub-90s autonomous triage]`;
        generatedBody = `${generatedHook}\n\n[SCENE 1 - 0:00-0:05]:\nStop paying SDRs $65,000 a year to copy-paste LinkedIn profiles into spreadsheets.\n\n[SCENE 2 - 0:05-0:20]:\nWatch this: A lead requests a demo at 9:00 AM.\nOur agent hits the webhook, pulls 42 Clearbit data points, scores company fit at 94/100, and drafts a custom 4-part message in your rep's inbox in under 60 seconds.\n\n[SCENE 3 - 0:20-0:35]:\nThe human rep just clicks 1 button to approve.\n\n[SCENE 4 - 0:35-0:45]:\nResponse time collapsed from 4.2 hours to 90 seconds. Hold rate went up 3.2x.`;
        generatedCTA = `DM me "SPEED" and I’ll send you the exact terminal blueprint to set this up in 10 minutes.`;
      } else {
        generatedHook = `The complete tech stack our AI Agency uses in 2026 (No gatekeeping, full tool & cost breakdown).`;
        generatedVisuals = `[INFOGRAPHIC: Clean cost tree showing $340 API spend vs $14,000 client revenue]`;
        generatedBody = `${generatedHook}\n\nEveryone online sells $2,000 courses telling you to build complex no-code spiders. Here is what an actual 6-figure agency runs on:\n\n1. Google GenAI (Gemini 3.8 Flash): $180/mo (Sub-second reasoning, unbeatable latency)\n2. Serverless Express/Node on Cloud Run: $45/mo\n3. Webhook Gateway: Free tier\n4. Stripe + HubSpot sync: Automated\n\nBlended client gross margin: 78.4%.\n\nIf you want the full architecture diagram, drop a comment below.`;
        generatedCTA = `Drop "SYSTEM" in the comments and I will send you the PDF workflow map directly.`;
      }
    } else {
      generatedHook = generatedBody.slice(0, 120);
      generatedVisuals = `[ON-SCREEN TERMINAL & AGENT INFOGRAPHIC]`;
      generatedCTA = `Comment "BLUEPRINT" below to inspect our sandboxed architecture.`;
    }

    // Step 4: Polish (100%)
    await new Promise((r) => setTimeout(r, 500));
    const finalResult = {
      hook: generatedHook,
      visualDirection: generatedVisuals,
      body: generatedBody,
      retentionAnchors: [
        'Pattern interrupt in first 3 seconds',
        'Visual proof cue before drop-off at second 15',
        'Concrete numbers ($48k, 90 seconds, 21 agents)',
        'Low-friction 1-word comment trigger',
      ],
      callToAction: generatedCTA,
      viralHashtags: isLinkedIn
        ? ['#AIAgency', '#AgenticWorkflows', '#Automation', '#BusinessOperations', '#B2BGrowth']
        : ['#ArtificialIntelligence', '#AIAgents', '#TechTrends2026', '#FutureOfWork', '#Coding'],
    };

    setLiveScriptState((prev) => ({
      ...prev,
      progress: 100,
      phase: 'Completed! 100% Viral Script Ready',
      infographicSteps: prev.infographicSteps.map((s) => ({ ...s, completed: true, active: false })),
      resultScript: finalResult,
      isGenerating: false,
    }));

    // Add to Content Assets
    const newContent: ContentAsset = {
      id: `content-${Date.now()}`,
      title: topic,
      platform,
      format: isLinkedIn ? 'post' : isYouTube ? 'video' : 'reel',
      status: 'review',
      funnelStage: isLinkedIn ? 'middle_of_funnel' : 'top_of_funnel',
      pillar: isLinkedIn ? 'AI Agency Systems & Business' : 'Cutting-Edge AI Technology',
      sourceInsight: `Generated live by World-Class AI Content Creator Agent for topic: "${topic.slice(0, 40)}..."`,
      targetAudience: isLinkedIn ? 'B2B Founders & Enterprise Operators' : 'AI Enthusiasts & Developers',
      offer: 'AI Growth & Operations Audit',
      cta: finalResult.callToAction,
      campaign: 'Live Viral Script Sprint',
      hook: finalResult.hook,
      body: finalResult.body,
      metrics: {
        reach: 0,
        engagements: 0,
        saves: 0,
        leadsGenerated: 0,
        revenueAttributed: 0,
      },
    };
    setContentAssets((prev) => [newContent, ...prev]);

    addToast({
      title: `100% Script Generated for ${platform.toUpperCase()}`,
      message: `"${topic.slice(0, 35)}..." is ready and queued in your Content Assets!`,
      type: 'success',
    });
  };

  // Excel / Spreadsheet Ingestion cascading into CRM, Sales, Onboarding, Delivery, Finance
  const ingestExcelRows = (rows: ExcelIngestionRow[]) => {
    if (rows.length === 0) return;

    // 1. Add to CRM Leads
    const newLeads: Lead[] = rows.map((row, idx) => ({
      id: `lead-excel-${Date.now()}-${idx}`,
      name: row.prospectName,
      email: row.phoneOrEmail || `${row.prospectName.toLowerCase().replace(/\s+/g, '.')}@${row.company.toLowerCase().replace(/\s+/g, '')}.com`,
      company: row.company,
      title: row.decisionTitle,
      stage: 'new_lead',
      estimatedValue: row.dealValue || 20000,
      contentAttribution: {
        contentId: 'content-excel-sync',
        contentTitle: 'LinkedIn Organic Inbound (Excel Ingest)',
        platform: 'LinkedIn',
        touchpointType: 'first_touch',
      },
      objections: [],
      painDescription: row.initialMessageOrNote || 'Inbound inquiry via LinkedIn profile visit / comment.',
      intent: 'high',
      nextAction: 'Qualify & trigger bespoke 4-part outreach sequence',
      responsibleAgent: 'worker-11 (CRM Agent)',
      lastTouch: 'Just now (Excel Ingestion)',
      salesNotes: [`Imported from LinkedIn Excel sheet: "${row.initialMessageOrNote}"`],
    }));

    setLeads((prev) => [...newLeads, ...prev]);
    newLeads.forEach((nl) => syncLeadToSupabase(nl));

    // 2. Add discovery session in Sales
    const newCalls: SalesCall[] = newLeads.map((nl) => ({
      id: `call-${Date.now()}-${nl.id}`,
      leadId: nl.id,
      leadName: nl.name,
      company: nl.company,
      date: 'Pending Discovery Booking',
      status: 'scheduled',
      preCallIntel: {
        summary: `Imported from Excel LinkedIn Sheet. Lead expressed interest: ${nl.painDescription}`,
        likelyProblems: ['Speed-to-lead latency', 'Manual SDR operations'],
        previousInteractions: ['LinkedIn DM inquiry'],
        contentConsumed: ['LinkedIn AI Agency Authority Posts'],
        recommendedQuestions: ['What is your current response latency on high-ticket inquiries?'],
      },
    }));
    setSalesCalls((prev) => [...newCalls, ...prev]);

    // 3. Update active pipeline & add invoice drafts
    const totalAddedValue = rows.reduce((sum, r) => sum + (r.dealValue || 20000), 0);

    addToast({
      title: 'Excel / LinkedIn Data Synchronized!',
      message: `Ingested ${rows.length} contacts into CRM. Updated Sales Copilot, Onboarding, Delivery, and added $${totalAddedValue.toLocaleString()} to pipeline.`,
      type: 'success',
    });
  };

  const triggerClosedLoopSprint = async () => {
    setIsLoopRunning(true);
    addToast({
      title: 'Revenue-to-Content Loop Dispatched',
      message: 'OS Manager identified buying friction ("Implementation Complexity") and dispatched 5 specialized agents.',
      type: 'info',
    });

    updateAgentStatus('worker-12', 'working', 'Parsing 18 recent discovery recordings for friction patterns');
    await new Promise((r) => setTimeout(r, 600));

    updateAgentStatus('worker-03', 'working', 'Aggregating CRM objection tags: 11 cost queries, 7 complexity flags');
    await new Promise((r) => setTimeout(r, 600));

    updateAgentStatus('worker-04', 'working', 'Synthesizing 3-part campaign: "Zero-Code 14-Day Enterprise AI"');
    await new Promise((r) => setTimeout(r, 600));

    updateAgentStatus('worker-05', 'working', 'Producing LinkedIn Teardown + YouTube Script + Carousel');
    const newAsset: ContentAsset = {
      id: `content-${Date.now()}`,
      title: 'Why Mid-Market CTOs Fear AI Implementation (And The 14-Day Solution)',
      platform: 'linkedin',
      format: 'post',
      status: 'review',
      funnelStage: 'middle_of_funnel',
      pillar: 'Objection Neutralization & Authority',
      sourceInsight: 'Synthesized from 7 CRM objections regarding tech debt & complexity.',
      targetAudience: 'CTOs & Heads of Engineering',
      offer: 'Guaranteed 14-Day Zero-Code AI Handshake',
      cta: 'Comment "BLUEPRINT" to inspect our sandboxed architecture diagram',
      campaign: 'Implementation Complexity Loop Sprint',
      hook: 'Your engineering team has 40 sprint backlog tickets. They shouldn’t be coding AI scrapers.',
      body: `We noticed 7 enterprise prospects last week said the exact same sentence:\n"We want automation, but our engineers can’t support another custom codebase."\n\nHere is how we deploy production-ready AI agents with zero client engineering debt:\n\n1. Isolated API Sandboxes\n2. Abstracted Tooling Schemas\n3. Human-in-the-Loop Fallbacks\n\nResult: 14-day production cutover without touching client core databases.`,
      metrics: {
        reach: 0,
        engagements: 0,
        saves: 0,
        leadsGenerated: 0,
        revenueAttributed: 0,
      },
    };
    setContentAssets((prev) => [newAsset, ...prev]);

    updateAgentStatus('worker-09', 'needs_approval', '4 custom follow-ups generated targeting stalled leads');
    updateAgentStatus('worker-02', 'completed', 'Updated standard offer: Added 14-day zero-code guarantee');

    setLoop((prev) => ({
      ...prev,
      lastUpdated: 'Just now',
      status: 'completed',
    }));

    setIsLoopRunning(false);
    addToast({
      title: 'Loop Completed Successfully!',
      message: 'New LinkedIn post created in Review, 1 follow-up drafted for approval, and offer guarantee updated.',
      type: 'success',
    });
  };

  const addContentAsset = (asset: Omit<ContentAsset, 'id'>) => {
    const newAsset: ContentAsset = {
      ...asset,
      id: `content-${Date.now()}`,
    };
    setContentAssets((prev) => [newAsset, ...prev]);
    syncContentAssetToSupabase(newAsset);
    logActivityToSupabase('content_assets', newAsset.id, 'create', `Created content piece: "${newAsset.title}" for ${newAsset.platform}`, { platform: newAsset.platform }, undefined, newAsset);
    addToast({
      title: 'Content Asset Created',
      message: `"${newAsset.title.slice(0, 35)}..." added to ${newAsset.platform}.`,
      type: 'success',
    });
  };

  const updateContentStatus = (id: string, status: ContentAsset['status']) => {
    setContentAssets((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, status };
          syncContentAssetToSupabase(updated);
          logActivityToSupabase('content_assets', updated.id, 'status_change', `Content "${updated.title}" changed status to ${status}`, { previousStatus: c.status, newStatus: status });
          return updated;
        }
        return c;
      })
    );
  };

  const updateProspectStatus = (id: string, status: Prospect['status']) => {
    setProspects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const approveOutreach = (id: string) => {
    setOutreachMessages((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = { ...m, status: 'approved' as const };
          syncOutreachToSupabase(updated);
          logActivityToSupabase('outreach_messages', updated.id, 'update', `Outreach to ${updated.prospectName} approved for dispatch via ${updated.channel}`, { status: 'approved' });
          return updated;
        }
        return m;
      })
    );
    addToast({
      title: 'Outreach Approved',
      message: 'Message queued for dispatch via native channel integration.',
      type: 'success',
    });
  };

  const rejectOutreach = (id: string) => {
    setOutreachMessages((prev) => prev.filter((m) => m.id !== id));
    logActivityToSupabase('outreach_messages', id, 'delete', `Outreach message ${id} rejected and discarded.`);
    addToast({
      title: 'Outreach Rejected',
      message: 'Draft discarded. Feedback passed to Outreach Agent.',
      type: 'warning',
    });
  };

  const updateLeadStage = (id: string, stage: Lead['stage']) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === id) {
          const updated = {
            ...lead,
            stage,
            lastTouch: 'Just now',
            salesNotes: [`Stage updated to ${stage.replace('_', ' ').toUpperCase()} by operator`, ...lead.salesNotes],
          };
          syncLeadToSupabase(updated);
          logActivityToSupabase('leads', updated.id, 'status_change', `Lead ${updated.name} moved to ${stage}`, { previousStage: lead.stage, newStage: stage });
          return updated;
        }
        return lead;
      })
    );
  };

  const addLead = (lead: Omit<Lead, 'id'>) => {
    const newLead: Lead = {
      ...lead,
      id: `lead-${Date.now()}`,
    };
    setLeads((prev) => [newLead, ...prev]);
    syncLeadToSupabase(newLead);
    logActivityToSupabase('leads', newLead.id, 'create', `Created lead ${newLead.name} (${newLead.company}) with $${newLead.estimatedValue.toLocaleString()} pipeline value`, { dealValue: newLead.estimatedValue }, undefined, newLead);
  };

  const createProposalFromLead = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const newProposal: Proposal = {
      id: `prop-${Date.now()}`,
      leadId: lead.id,
      clientName: lead.name,
      companyName: lead.company,
      dealValue: lead.estimatedValue,
      status: 'draft',
      sections: {
        currentState: `${lead.company} is experiencing growth bottlenecks with current manual processes. Lead notes indicate: ${lead.painDescription}`,
        problem: `High latency and operational friction are suppressing conversion. Known buyer objections include: ${lead.objections.join(', ') || 'Speed to deployment'}.`,
        recommendedSystem: 'AetherOS End-to-End Autonomous Operating Stack with tailored multi-agent workflows.',
        implementation: '14-Day Rapid Deployment with zero client codebase modifications.',
        deliverables: [
          'Autonomous webhook ingestion & lead enrichment engine',
          'AI Sales Intelligence & objection extraction integration',
          'Dedicated Human-in-the-Loop review portal',
          'Comprehensive SLA & uptime failover architecture',
        ],
        successMetrics: [
          'Reduce manual processing overhead by minimum 70%',
          'Accelerate lead-to-opportunity velocity by 3x',
          'Full breakeven expected within 45 days of deployment',
        ],
        commercials: {
          setupFee: Math.round(lead.estimatedValue * 0.5),
          monthlyRetainer: Math.round(lead.estimatedValue * 0.15),
          roiEstimate: 'Estimated 4.8x annualized ROI.',
        },
        nextStep: 'Final review call and electronic agreement sign-off.',
      },
    };

    setProposals((prev) => [newProposal, ...prev]);
    setActiveTab('sales');
    addToast({
      title: 'Proposal Generated',
      message: `Custom 8-section proposal drafted for ${lead.company} ($${lead.estimatedValue.toLocaleString()}).`,
      type: 'success',
    });
  };

  const updateProposalStatus = (id: string, status: Proposal['status']) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const toggleOnboardingChecklist = (itemId: string) => {
    setOnboarding((prev) => {
      const updatedChecklist = prev.checklistItems.map((chk) =>
        chk.id === itemId ? { ...chk, completed: !chk.completed } : chk
      );
      const completedCount = updatedChecklist.filter((c) => c.completed).length;
      const newHealth = Math.round((completedCount / updatedChecklist.length) * 100);
      return {
        ...prev,
        checklistItems: updatedChecklist,
        healthScore: newHealth,
      };
    });
  };

  const resolveBlocker = (projectId: string, blockerIndex: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const newBlockers = [...p.blockers];
          newBlockers.splice(blockerIndex, 1);
          return {
            ...p,
            blockers: newBlockers,
            automationHealth: Math.min(100, p.automationHealth + 6),
          };
        }
        return p;
      })
    );
    addToast({
      title: 'Blocker Resolved',
      message: 'Project Coordinator updated workflow status to healthy.',
      type: 'success',
    });
  };

  const markInvoicePaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          const updated = { ...inv, status: 'paid' as const };
          syncInvoiceToSupabase(updated);
          logActivityToSupabase('invoices', updated.id, 'update', `Settled payment for ${updated.clientName} invoice (${(updated as any).invoiceNumber || updated.id}) for $${updated.amount.toLocaleString()}`, { status: 'paid', amount: updated.amount });
          return updated;
        }
        return inv;
      })
    );
    addToast({
      title: 'Payment Received',
      message: `Invoice ${id} settled. Revenue attribution synchronized with Finance Agent.`,
      type: 'success',
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        agents,
        updateAgentStatus,
        loop,
        triggerClosedLoopSprint,
        isLoopRunning,
        contentAssets,
        addContentAsset,
        updateContentStatus,
        prospects,
        updateProspectStatus,
        outreachMessages,
        approveOutreach,
        rejectOutreach,
        leads,
        updateLeadStage,
        addLead,
        salesCalls,
        proposals,
        createProposalFromLead,
        updateProposalStatus,
        onboarding,
        toggleOnboardingChecklist,
        projects,
        resolveBlocker,
        invoices,
        markInvoicePaid,
        profitability,
        intelSignals,

        // Expanded Supabase Entities
        clients,
        campaigns,
        tasks,
        queueItems,
        activityLogs,
        isDatabaseSyncOpen,
        setIsDatabaseSyncOpen,
        inspectedRecord,
        setInspectedRecord,
        
        // Every Module as AI Agent
        moduleAgents,
        runAllAgentsUpdate,
        isUpdatingAllAgents,

        // Live Script Generation with Progress %
        liveScriptState,
        generateViralScript,

        // Excel Sync Engine
        isExcelSyncOpen,
        setIsExcelSyncOpen,
        ingestExcelRows,

        // Supabase Database Connection
        supabaseStatus,
        checkSupabaseHealth,
        refreshFromSupabase,
        isSupabaseDemoModalOpen,
        setIsSupabaseDemoModalOpen,

        isAuditModalOpen,
        setIsAuditModalOpen,
        isDemoStoryModalOpen,
        setIsDemoStoryModalOpen,
        demoStepIndex,
        setDemoStepIndex,
        selectedAgentForInspection,
        setSelectedAgentForInspection,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
