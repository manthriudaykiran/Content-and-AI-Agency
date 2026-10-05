export type NavTab = 
  | 'command-center'
  | 'content-os'
  | 'content-calendar'
  | 'client-acquisition'
  | 'outreach'
  | 'crm'
  | 'sales'
  | 'client-onboarding'
  | 'delivery-coordination'
  | 'finance'
  | 'orchestration'
  | 'intel'
  | 'knowledge-base'
  | 'settings';

export type AgentStatus = 'idle' | 'thinking' | 'working' | 'waiting' | 'needs_approval' | 'completed' | 'failed';

export interface AgentWorker {
  id: string;
  name: string;
  role: string;
  category: 'core' | 'content' | 'acquisition' | 'sales' | 'delivery' | 'intelligence';
  avatar: string;
  status: AgentStatus;
  currentTask?: string;
  lastExecutionTime?: string;
  confidence: number;
  dependencies: string[];
  systemInstruction: string;
  inputSchema: string;
  outputSchema: string;
}

export interface SharedAgentResponse {
  task_id: string;
  agent_id: string;
  status: 'completed' | 'needs_approval' | 'working' | 'failed';
  summary: string;
  findings: string[];
  recommendations: string[];
  artifacts: Array<{ title: string; type: string; content: string }>;
  confidence: number;
  assumptions: string[];
  missing_data: string[];
  next_suggested_action: string;
  approval_required: boolean;
}

export interface DispatchTask {
  id: string;
  workerId: string;
  workerName: string;
  objective: string;
  contextRefs: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'needs_approval' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  approvalRequired: boolean;
  result?: SharedAgentResponse;
}

export interface RevenueToContentLoop {
  id: string;
  triggerEvent: string;
  detectedPain: string;
  dataPoints: {
    inquiriesCount: number;
    objectionsCount: number;
    salesCallMentions: number;
    leadsGeneratedFromTopic: number;
  };
  conclusion: string;
  dispatchedAgents: {
    salesIntelligence: string;
    contentStrategist: string;
    contentCreator: string;
    outreachAgent: string;
    offerAgent: string;
  };
  status: 'active' | 'analyzed' | 'dispatched' | 'completed';
  lastUpdated: string;
}

export interface ContentAsset {
  id: string;
  title: string;
  platform: 'linkedin' | 'instagram' | 'youtube' | 'facebook' | 'newsletter';
  format: 'post' | 'carousel' | 'reel' | 'video' | 'article' | 'script';
  status: 'idea' | 'draft' | 'review' | 'approved' | 'scheduled' | 'published' | 'analyzed';
  funnelStage: 'top_of_funnel' | 'middle_of_funnel' | 'bottom_of_funnel' | 'retention';
  pillar: string;
  sourceInsight: string;
  targetAudience: string;
  offer: string;
  cta: string;
  campaign: string;
  scheduledDate?: string;
  publishedDate?: string;
  hook?: string;
  body: string;
  metrics?: {
    reach: number;
    engagements: number;
    saves: number;
    leadsGenerated: number;
    revenueAttributed: number;
  };
}

export interface Prospect {
  id: string;
  name: string;
  title: string;
  company: string;
  segment: string;
  industry: string;
  size: string;
  fitScore: number;
  intentScore: number;
  status: 'cold' | 'researched' | 'in_sequence' | 'engaged' | 'converted' | 'unqualified';
  probablePain: string;
  source: string;
  research: {
    overview: string;
    businessProblems: string[];
    personalizationOpportunity: string;
    conversationStarter: string;
    recommendedOffer: string;
    contentToSend: string;
  };
}

export interface OutreachMessage {
  id: string;
  prospectId: string;
  prospectName: string;
  company: string;
  channel: 'linkedin' | 'email' | 'whatsapp';
  sequenceStep: number;
  dayNumber: number;
  status: 'draft' | 'needs_approval' | 'approved' | 'sent' | 'replied';
  framework: {
    observation: string;
    relevance: string;
    insight: string;
    question: string;
  };
  fullText: string;
  scheduledFor: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
  stage: 'new_lead' | 'contacted' | 'engaged' | 'qualified' | 'discovery' | 'proposal' | 'negotiation' | 'won' | 'lost';
  estimatedValue: number;
  contentAttribution: {
    contentId: string;
    contentTitle: string;
    platform: string;
    touchpointType: 'first_touch' | 'last_touch' | 'assisted';
  };
  objections: string[];
  painDescription: string;
  intent: 'high' | 'medium' | 'low';
  nextAction: string;
  responsibleAgent: string;
  lastTouch: string;
  salesNotes: string[];
}

export interface SalesCall {
  id: string;
  leadId: string;
  leadName: string;
  company: string;
  date: string;
  status: 'scheduled' | 'in_progress' | 'analyzed';
  preCallIntel: {
    summary: string;
    likelyProblems: string[];
    previousInteractions: string[];
    contentConsumed: string[];
    recommendedQuestions: string[];
  };
  copilotNotes?: {
    currentProcess: string;
    bottleneck: string;
    businessImpact: string;
    desiredOutcome: string;
    urgency: string;
    budgetContext: string;
  };
  postCallIntel?: {
    summary: string;
    extractedPain: string[];
    objections: string[];
    purchaseSignals: string[];
    competitorsMentioned: string[];
    commitments: string[];
    suggestedFollowUp: string;
  };
}

export interface Proposal {
  id: string;
  leadId: string;
  clientName: string;
  companyName: string;
  dealValue: number;
  status: 'draft' | 'review' | 'sent' | 'accepted' | 'declined';
  sections: {
    currentState: string;
    problem: string;
    recommendedSystem: string;
    implementation: string;
    deliverables: string[];
    successMetrics: string[];
    commercials: {
      setupFee: number;
      monthlyRetainer: number;
      roiEstimate: string;
    };
    nextStep: string;
  };
}

export interface ClientOnboarding {
  id: string;
  clientId: string;
  clientName: string;
  company: string;
  dealWonDate: string;
  currentStepIndex: number;
  steps: Array<{
    id: string;
    name: string;
    status: 'completed' | 'in_progress' | 'pending' | 'blocked';
    assignee: string;
  }>;
  checklistItems: Array<{ id: string; label: string; completed: boolean }>;
  requiredIntegrations: Array<{ name: string; connected: boolean; priority: 'required' | 'optional' }>;
  missingItems: string[];
  nextMeeting: string;
  healthScore: number;
}

export interface ClientProject {
  id: string;
  clientName: string;
  company: string;
  projectOutcome: string;
  stage: 'map' | 'design' | 'build' | 'test' | 'deploy' | 'optimize';
  progress: number;
  milestones: Array<{ title: string; completed: boolean; dueDate: string }>;
  workflows: Array<{ name: string; status: 'active' | 'in_testing' | 'failing'; trigger: string }>;
  blockers: string[];
  approvalsNeeded: string[];
  automationHealth: number; // 0 - 100
  dueDate: string;
}

export interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issueDate: string;
  dueDate: string;
  type: 'retainer' | 'implementation' | 'performance';
}

export interface ClientProfitability {
  clientId: string;
  clientName: string;
  revenue: number;
  apiCost: number;
  toolCost: number;
  deliveryHours: number;
  hourlyCost: number;
  netMargin: number;
}

export interface IntelSignal {
  id: string;
  type: 'emerging_pain' | 'content_theme' | 'offer_opportunity' | 'sales_risk' | 'automation_opportunity';
  title: string;
  description: string;
  impactScore: 'critical' | 'high' | 'medium';
  frequency: number;
  actionTaken: string;
  suggestedAutomation?: {
    opportunity: string;
    impact: string;
    complexity: 'low' | 'medium' | 'high';
    recommendedAgent: string;
    actionPlan: string;
  };
}

export interface ModuleAgentMeta {
  moduleId: NavTab;
  agentName: string;
  agentTitle: string;
  domainExpertise: string;
  avatar: string;
  status: 'idle' | 'working' | 'analyzing' | 'optimized';
  dailyTarget: {
    title: string;
    description: string;
    metricGoal: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
  };
  precautions: string[];
  bestStrategies: string[];
  systemInstruction: string;
}

export interface SocialPlatformIdea {
  id: string;
  platform: 'linkedin' | 'youtube' | 'instagram' | 'facebook';
  topic: string;
  category: string;
  hookTeaser: string;
  targetFocus: string; // 'AI Agency Systems & Business' for LinkedIn, 'Cutting-Edge AI & Demos' for others
  estimatedViralPotential: number; // e.g. 98%
}

export interface LiveScriptGenerationState {
  isGenerating: boolean;
  platform: 'linkedin' | 'youtube' | 'instagram' | 'facebook';
  topic: string;
  progress: number; // 0 to 100
  phase: string;
  infographicSteps: Array<{
    step: string;
    completed: boolean;
    active: boolean;
    details: string;
  }>;
  resultScript: {
    hook: string;
    visualDirection: string;
    body: string;
    retentionAnchors: string[];
    callToAction: string;
    viralHashtags: string[];
  } | null;
}

export interface ExcelIngestionRow {
  prospectName: string;
  company: string;
  decisionTitle: string;
  source: string; // e.g. 'LinkedIn Inbound DM', 'Excel Batch Sync'
  dealValue: number;
  initialMessageOrNote: string;
  phoneOrEmail?: string;
}

// ------------------------------------------------------------------
// Supabase Data Architecture & Tracking Entities
// ------------------------------------------------------------------

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientAccount {
  id: string;
  workspaceId: string;
  name: string;
  company: string;
  industry: string;
  status: 'active' | 'onboarding' | 'lead' | 'churned';
  retainerAmount: number;
  primaryContactEmail: string;
  slaTier: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QueueItem {
  id: string;
  jobType: string;
  sourceModule: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  input: Record<string, any>;
  output?: Record<string, any>;
  error?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  workspaceId: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'archive' | 'status_change';
  description: string;
  previousValue?: any;
  newValue?: any;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface TaskItem {
  id: string;
  workspaceId: string;
  clientId?: string;
  title: string;
  module: string;
  assignedAgent: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Campaign {
  id: string;
  workspaceId: string;
  name: string;
  objective: string;
  targetAudience: string;
  status: 'draft' | 'active' | 'completed' | 'paused';
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}


