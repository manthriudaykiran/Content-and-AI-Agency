# AetherOS: Supabase Database Architecture & Module Mapping

> **System Overview:** AetherOS is an Autonomous 21-Agent AI Content Creator and Agency Operating System.  
> Every business entity, queue job, autonomous agent execution, and telemetry signal has a **1-to-1 mapping with Supabase PostgreSQL tables**.

---

## High-Level Entity-Relationship Model

```
                    ┌─────────────────────────┐
                    │       workspaces        │ (Agency Tenant Root)
                    └───────────┬─────────────┘
                                │
        ┌───────────────────────┼─────────────────────────┐
        │                       │                         │
        ▼                       ▼                         ▼
┌──────────────┐        ┌──────────────┐          ┌──────────────┐
│   clients    │        │  campaigns   │          │  prospects   │
└───────┬──────┘        └───────┬──────┘          └───────┬──────┘
        │                       │                         │
   ┌────┴────┐                  │                         │
   ▼         ▼                  ▼                         ▼
┌─────┐ ┌─────────┐      ┌──────────────┐         ┌────────────────┐
│leads│ │projects │      │content_assets│         │outreach_messages│
└──┬──┘ └─────────┘      └──────────────┘         └────────────────┘
   │
┌──┴────────────┐
▼               ▼
┌───────────┐ ┌─────────┐
│sales_calls│ │proposals│
└───────────┘ └─────────┘
```

---

## Table-to-Module Mappings

### 1. Module: Command Center (Executive OS Heartbeat)
* **Database Table:** `public.workspaces`, `public.queue_items`, `public.revenue_to_content_loops`, `public.activity_logs`
* **Purpose:** Serves as the executive orchestration dashboard calculating realtime pipeline metrics, total closed cash, autonomous loop status, and active background jobs.
* **Primary Key:** `id` (`UUID`)
* **Foreign Keys:**
  * `queue_items.workspace_id` → `workspaces.id`
  * `activity_logs.workspace_id` → `workspaces.id`
* **Fields Used:**
  * `workspaces`: `id`, `name`, `slug`, `plan`, `created_at`
  * `queue_items`: `id`, `job_type`, `source_module`, `status`, `priority`, `progress`, `started_at`, `completed_at`
  * `activity_logs`: `id`, `entity_type`, `entity_id`, `action`, `description`, `created_at`
* **Create Trigger:** Initial onboarding or manual tenant setup (`workspaces`); dispatched autonomous workflows enqueue rows into `queue_items`.
* **Update Trigger:** Worker agent state transitions update `queue_items.status` and `progress`.
* **Read Trigger:** Loaded immediately upon entering `command-center` tab and continuously refreshed via Supabase realtime.
* **Delete/Archive Trigger:** Cancelled jobs update `queue_items.status = 'cancelled'`.
* **UI Component Using It:** `src/components/pages/CommandCenter.tsx`, `src/components/Header.tsx`

---

### 2. Module: Content OS & Editorial Calendar
* **Database Table:** `public.content_assets`
* **Purpose:** Stores all high-ticket B2B content pieces, viral video scripts, carousels, and multi-channel marketing campaigns across LinkedIn, YouTube, Instagram, and Facebook.
* **Primary Key:** `id` (`UUID`)
* **Foreign Keys:**
  * `campaign_id` → `campaigns.id` (Optional)
  * `workspace_id` → `workspaces.id`
* **Fields Used:**
  * `id`: Unique asset UUID
  * `title`: Headline / Concept
  * `platform`: `'linkedin' | 'youtube' | 'instagram' | 'facebook' | 'newsletter'`
  * `format`: `'post' | 'carousel' | 'reel' | 'video' | 'article' | 'script'`
  * `status`: `'idea' | 'draft' | 'review' | 'approved' | 'scheduled' | 'published' | 'analyzed'`
  * `funnel_stage`: `'top_of_funnel' | 'middle_of_funnel' | 'bottom_of_funnel' | 'retention'`
  * `pillar`: Content strategy pillar (e.g. *AI Agency Systems*, *Cutting-Edge AI Deep Dive*)
  * `source_insight`: CRM objection or market friction that triggered this piece
  * `target_audience`: Buyer persona
  * `offer`: Associated agency lead magnet / call-to-action
  * `cta`: Specific viral engagement keyword (e.g. *Comment "HANDSHAKE"*)
  * `scheduled_date`, `published_date`: Release timestamps
  * `hook`, `body`: Exact copy text
  * `metrics`: JSONB containing `reach`, `engagements`, `saves`, `leadsGenerated`, `revenueAttributed`
* **Create Trigger:** User clicks **"Create Content Asset"** or triggers **"Generate Viral Script"** or autonomous closed-loop sprint.
* **Update Trigger:** Moving card stages in Kanban (*Draft → Review → Approved → Scheduled*), modifying copy, or receiving engagement webhooks.
* **Read Trigger:** Rendered on `content-os` and `content-calendar` tabs.
* **Delete/Archive Trigger:** Archived via content card menu (`status = 'analyzed'` or removed from table).
* **UI Component Using It:** `src/components/pages/ContentOS.tsx`, `src/components/pages/ContentCalendar.tsx`

---

### 3. Module: Client Acquisition & Prospect Mining
* **Database Table:** `public.prospects`
* **Purpose:** Tracks high-intent B2B target accounts mined from hiring triggers, LinkedIn job posts, and outbound SDR signals.
* **Primary Key:** `id` (`UUID`)
* **Foreign Keys:**
  * `workspace_id` → `workspaces.id`
* **Fields Used:**
  * `id`: Account UUID
  * `name`: Decision-maker full name
  * `title`: Target executive title (CRO, VP Ops, Managing Partner)
  * `company`: Target organization name
  * `segment`: Mid-Market, Enterprise, High-Growth
  * `industry`: Freight, Fintech, Omnichannel Retail, Defense
  * `size`: Employee headcount bracket
  * `fit_score`: Algorithmic fit score (0-100)
  * `intent_score`: Active buying signal score (0-100)
  * `status`: `'cold' | 'researched' | 'in_sequence' | 'engaged' | 'converted' | 'unqualified'`
  * `probable_pain`: Specific operational bottleneck identified by miner
  * `source`: Mining signal (e.g. *LinkedIn Active SDR Hiring Trigger*)
  * `research`: Deep-dive JSONB containing `overview`, `businessProblems`, `personalizationOpportunity`, `conversationStarter`, `recommendedOffer`, `contentToSend`
* **Create Trigger:** Acquisition agent miners identify new target profile; batch ingestion via Excel/Sheets sync.
* **Update Trigger:** Research enrichment completed, fit score calculated, or outreach initiated.
* **Read Trigger:** Loaded in `client-acquisition` module.
* **Delete/Archive Trigger:** Account disqualified updates `status = 'unqualified'`.
* **UI Component Using It:** `src/components/pages/ClientAcquisition.tsx`

---

### 4. Module: Outreach & Multi-Channel Sequences
* **Database Table:** `public.outreach_messages`
* **Purpose:** Manages human-in-the-loop outbound sequences structured with psychological frameworks (*Observation → Relevance → Insight → Question*).
* **Primary Key:** `id` (`UUID`)
* **Foreign Keys:**
  * `prospect_id` → `prospects.id`
  * `campaign_id` → `campaigns.id`
* **Fields Used:**
  * `id`: Message UUID
  * `prospect_id`: Associated prospect reference
  * `prospect_name`, `company`: Cached for sub-millisecond table joins
  * `channel`: `'linkedin' | 'email' | 'whatsapp'`
  * `sequence_step`, `day_number`: Sequence timing
  * `status`: `'draft' | 'needs_approval' | 'approved' | 'sent' | 'replied'`
  * `framework`: JSONB breakdown of `observation`, `relevance`, `insight`, `question`
  * `full_text`: Dispatched outreach copy
  * `scheduled_for`: Scheduled dispatch time
* **Create Trigger:** Generated autonomously when a prospect transitions to `'researched'` or upon batch sequence creation.
* **Update Trigger:** Operator clicks **"Approve Outreach"** (`status = 'approved'`) or edits message copy.
* **Read Trigger:** Rendered on `outreach` tab and in Command Center task queues.
* **Delete/Archive Trigger:** Operator clicks **"Reject"** (`DELETE FROM public.outreach_messages WHERE id = ...`).
* **UI Component Using It:** `src/components/pages/Outreach.tsx`

---

### 5. Module: CRM Pipeline & Revenue Attribution
* **Database Table:** `public.leads`
* **Purpose:** Core deal engine tracking deal stages from `new_lead` to `won`, with precise touchpoint attribution linking closed revenue back to the originating content asset.
* **Primary Key:** `id` (`UUID`)
* **Foreign Keys:**
  * `workspace_id` → `workspaces.id`
  * `client_id` → `clients.id` (Linked once deal is won)
* **Fields Used:**
  * `id`: Lead UUID
  * `name`, `email`, `company`, `title`: Prospect identifiers
  * `stage`: `'new_lead' | 'contacted' | 'engaged' | 'qualified' | 'discovery' | 'proposal' | 'negotiation' | 'won' | 'lost'`
  * `estimated_value`: Contract deal value (USD)
  * `content_attribution`: JSONB containing `contentId`, `contentTitle`, `platform`, `touchpointType`
  * `objections`: Array of buyer friction tags (e.g. *Implementation Complexity*, *Speed to Deployment*)
  * `pain_description`: Primary commercial pain
  * `intent`: `'high' | 'medium' | 'low'`
  * `next_action`: Recommended autonomous or operator step
  * `responsible_agent`: Designated AI agent custodian
  * `last_touch`: Timestamp and channel of last contact
  * `sales_notes`: Array of audit notes and call transcripts
* **Create Trigger:** Inbound form submission, Excel spreadsheet sync, or prospect conversion.
* **Update Trigger:** Dragging pipeline stage card, adding note, updating contract valuation.
* **Read Trigger:** Loaded on `crm` tab and queried by Command Center metrics.
* **Delete/Archive Trigger:** Deal marked `'lost'` or purged by administrator.
* **UI Component Using It:** `src/components/pages/CRM.tsx`, `src/components/ExcelSyncModal.tsx`

---

### 6. Module: Sales Copilot & Discovery Intelligence
* **Database Table:** `public.sales_calls`
* **Purpose:** Live call assistant dossiers, pre-call intelligence, real-time objection extraction, and post-call deal commitments.
* **Primary Key:** `id` (`UUID`)
* **Foreign Keys:**
  * `lead_id` → `leads.id` (ON DELETE CASCADE)
* **Fields Used:**
  * `id`: Call UUID
  * `lead_id`: Associated CRM lead
  * `lead_name`, `company`: Display metadata
  * `date`: Scheduled session time
  * `status`: `'scheduled' | 'in_progress' | 'analyzed'`
  * `pre_call_intel`: JSONB (`summary`, `likelyProblems`, `previousInteractions`, `contentConsumed`, `recommendedQuestions`)
  * `copilot_notes`: JSONB (`currentProcess`, `bottleneck`, `businessImpact`, `desiredOutcome`, `urgency`, `budgetContext`)
  * `post_call_intel`: JSONB (`summary`, `extractedPain`, `objections`, `purchaseSignals`, `competitorsMentioned`, `commitments`, `suggestedFollowUp`)
* **Create Trigger:** Automatically scheduled when a lead reaches `'discovery'` stage or upon calendar webhook intake.
* **Update Trigger:** Copilot saves live objection notes or analyzes call transcript.
* **Read Trigger:** Rendered on `sales` tab.
* **Delete/Archive Trigger:** Call cancelled or lead deleted.
* **UI Component Using It:** `src/components/pages/SalesCopilot.tsx`

---

### 7. Module: Enterprise Proposals
* **Database Table:** `public.proposals`
* **Purpose:** Stores dynamic 8-section custom agency agreements generated by the Proposal Architect Agent.
* **Primary Key:** `id` (`UUID`)
* **Foreign Keys:**
  * `lead_id` → `leads.id` (ON DELETE CASCADE)
* **Fields Used:**
  * `id`: Proposal UUID
  * `lead_id`: Associated lead
  * `client_name`, `company_name`: Client identity
  * `deal_value`: Total contract valuation
  * `status`: `'draft' | 'review' | 'sent' | 'accepted' | 'declined'`
  * `sections`: JSONB containing:
    * `currentState`: Current manual bottlenecks
    * `problem`: Buyer objection and tech debt fear
    * `recommendedSystem`: AetherOS autonomous architecture
    * `implementation`: 14-day rapid deployment schedule
    * `deliverables`: Array of deliverables
    * `successMetrics`: SLA guarantees
    * `commercials`: `setupFee`, `monthlyRetainer`, `roiEstimate`
    * `nextStep`: Sign-off and kickoff instructions
* **Create Trigger:** User or Sales Agent clicks **"Generate Custom Proposal"** from a lead.
* **Update Trigger:** Proposal approved, sent to prospect, or signed (`status = 'accepted'`).
* **Read Trigger:** Rendered on `sales` tab under Proposals sub-view.
* **Delete/Archive Trigger:** Proposal rejected or archived.
* **UI Component Using It:** `src/components/pages/SalesCopilot.tsx`

---

### 8. Module: Client Onboarding & Launch
* **Database Table:** `public.client_onboardings`
* **Purpose:** Tracks the zero-delay kickoff process: Slack Connect provisioning, 1Password credential intake, webhook gateways, and staging cutover.
* **Primary Key:** `id` (`UUID`)
* **Foreign Keys:**
  * `client_id` → `clients.id` (ON DELETE CASCADE)
* **Fields Used:**
  * `id`: Onboarding UUID
  * `client_id`: Associated client
  * `client_name`, `company`: Client credentials
  * `deal_won_date`: Deal close date
  * `current_step_index`: Progress indicator (0 to 5)
  * `steps`: JSONB array of workflow milestones and assignees
  * `checklist_items`: JSONB array of security items (`id`, `label`, `completed`)
  * `required_integrations`: API credentials required (`Shopify`, `Klaviyo`, `HubSpot`)
  * `missing_items`: Outstanding blocker strings
  * `next_meeting`: Kickoff call time
  * `health_score`: Calculated onboarding health percentage (0-100)
* **Create Trigger:** Automatically triggered when CRM lead status transitions to `'won'`.
* **Update Trigger:** Operator toggles checklist item or completes credentials intake.
* **Read Trigger:** Loaded on `client-onboarding` tab.
* **Delete/Archive Trigger:** Onboarding completed and client transitioned to active delivery.
* **UI Component Using It:** `src/components/pages/ClientOnboarding.tsx`

---

### 9. Module: Delivery Coordination & Production Sprints
* **Database Table:** `public.client_projects`
* **Purpose:** Real-time production telemetry: workflow state machines, automation health score, latency, and blocker triage.
* **Primary Key:** `id` (`UUID`)
* **Foreign Keys:**
  * `client_id` → `clients.id` (ON DELETE CASCADE)
* **Fields Used:**
  * `id`: Project UUID
  * `client_id`: Linked client
  * `client_name`, `company`: Client identifiers
  * `project_outcome`: Contract objective
  * `stage`: `'map' | 'design' | 'build' | 'test' | 'deploy' | 'optimize'`
  * `progress`: Overall completion percentage (0-100)
  * `milestones`: Array of milestone objects (`title`, `completed`, `dueDate`)
  * `workflows`: Array of active agent workflows (`name`, `status`, `trigger`)
  * `blockers`: Active impediment strings
  * `approvals_needed`: Pending client sign-offs
  * `automation_health`: System uptime and error health rating (0-100)
  * `due_date`: Target delivery date
* **Create Trigger:** Created upon onboarding sign-off.
* **Update Trigger:** Operator clicks **"Resolve Blocker"** or milestone checkbox.
* **Read Trigger:** Rendered on `delivery-coordination` tab.
* **Delete/Archive Trigger:** Project archived upon completion.
* **UI Component Using It:** `src/components/pages/DeliveryCoordination.tsx`

---

### 10. Module: Finance, Billing & Unit Economics
* **Database Table:** `public.invoices`, `public.client_profitability`
* **Purpose:** Cashflow velocity and client profitability calculations auditing revenue vs API token costs, delivery hours, and gross profit margin.
* **Primary Key:** `id` (`UUID`)
* **Foreign Keys:**
  * `invoices.client_id` → `clients.id`
  * `client_profitability.client_id` → `clients.id`
* **Fields Used:**
  * `invoices`: `id`, `invoice_number`, `client_name`, `amount`, `status` (`'draft' | 'sent' | 'paid' | 'overdue'`), `issue_date`, `due_date`, `type`
  * `client_profitability`: `id`, `client_name`, `revenue`, `api_cost`, `tool_cost`, `delivery_hours`, `hourly_cost`, `net_margin`
* **Create Trigger:** Invoices created automatically upon milestone completion or monthly retainer cycle.
* **Update Trigger:** Operator clicks **"Mark Paid"** or Stripe webhook confirms settlement (`status = 'paid'`).
* **Read Trigger:** Rendered on `finance` tab and aggregated in Command Center cash metric.
* **Delete/Archive Trigger:** Voided invoices marked draft/archived.
* **UI Component Using It:** `src/components/pages/Finance.tsx`

---

### 11. Module: Market Intel & Operational Signals
* **Database Table:** `public.intel_signals`
* **Purpose:** Market objection listener aggregating buyer friction into actionable automation opportunities.
* **Primary Key:** `id` (`UUID`)
* **Foreign Keys:**
  * `workspace_id` → `workspaces.id`
* **Fields Used:**
  * `id`: Signal UUID
  * `type`: `'emerging_pain' | 'sales_risk' | 'automation_opp'`
  * `title`: Friction summary
  * `description`: Detailed market evidence
  * `impact_score`: `'critical' | 'high' | 'medium'`
  * `frequency`: Mentions across discovery calls
  * `action_taken`: Strategic response implemented
  * `suggested_automation`: JSONB recommendations
* **Create Trigger:** Scraped from call transcripts or CRM objection tags.
* **Update Trigger:** Action executed or impact score recalculated.
* **Read Trigger:** Rendered on `intel` tab.
* **UI Component Using It:** `src/components/pages/IntelSignals.tsx`

---

### 12. Module: Revenue-to-Content Closed Loop
* **Database Table:** `public.revenue_to_content_loops`
* **Purpose:** Dispatches multi-agent sprints when buyer friction is detected, connecting CRM revenue loss directly into new content assets.
* **Primary Key:** `id` (`UUID`)
* **Foreign Keys:**
  * `workspace_id` → `workspaces.id`
* **Fields Used:**
  * `id`: Loop run UUID
  * `trigger_event`: Originating objection
  * `detected_pain`: Root cause
  * `data_points`: JSONB counts (`inquiriesCount`, `objectionsCount`, `salesCallMentions`, `leadsGeneratedFromTopic`)
  * `conclusion`: Executive directive
  * `dispatched_agents`: JSONB map of worker assignments
  * `status`: `'active' | 'analyzed' | 'dispatched' | 'completed'`
  * `last_updated`: Timestamp
* **Create Trigger:** User clicks **"Run Closed-Loop Sprint"** or automated threshold exceeded.
* **Update Trigger:** Step-by-step dispatch across the 5 specialized agents.
* **Read Trigger:** Loaded in Command Center loop banner and Orchestration module.
* **UI Component Using It:** `src/components/Header.tsx`, `src/components/pages/Orchestration.tsx`

---

### 13. Module: System Settings & Platform Config
* **Database Table:** `public.system_settings`
* **Purpose:** Persists human-in-the-loop governance boundaries, model sampling temperature, webhook URLs, and platform connector states.
* **Primary Key:** `id` (`UUID`)
* **Fields Used:**
  * `id`: Setting UUID
  * `setting_key`: `'runtime_config' | 'security_policy' | 'connectors_status'`
  * `setting_value`: JSONB configuration payload
* **Create Trigger:** System initialization.
* **Update Trigger:** User adjusts temperature slider, approval checkbox, or tests webhooks in Settings.
* **Read Trigger:** Loaded on `settings` tab.
* **UI Component Using It:** `src/components/pages/Settings.tsx`
