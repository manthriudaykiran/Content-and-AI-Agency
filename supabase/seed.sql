-- ==============================================================================
-- AetherOS — AI Content Creator & Agency OS
-- Supabase PostgreSQL Demo Seed Data
-- ==============================================================================

-- 1. SEED LEADS
INSERT INTO public.leads (
    id, name, email, company, title, stage, estimated_value, 
    content_attribution, objections, pain_description, intent, 
    next_action, responsible_agent, last_touch, sales_notes
) VALUES
(
    'lead-01', 'Elena Rostova', 'elena@novasurge.io', 'NovaSurge AI', 'Chief Technology Officer',
    'qualified', 48000,
    '{"contentId": "content-01", "contentTitle": "How We Replaced 4 SDRs With Autonomous Webhooks", "platform": "LinkedIn", "touchpointType": "first_touch"}'::jsonb,
    ARRAY['High upfront implementation cost', 'Data privacy with client APIs'],
    'Manual SDR processes are bottlenecking pipeline velocity. Needs 14-day zero-code deployment.',
    'high', 'Send tailored 8-section architecture proposal', 'worker-11 (CRM Agent)',
    '2 hours ago', ARRAY['Attended live webinar on LinkedIn', 'Requested technical architecture diagram']
),
(
    'lead-02', 'Marcus Vance', 'm.vance@vancemetrics.com', 'VanceMetrics Growth', 'Founder & Managing Partner',
    'proposal', 36000,
    '{"contentId": "content-02", "contentTitle": "The Architecture of an Autonomous Agency", "platform": "YouTube", "touchpointType": "first_touch"}'::jsonb,
    ARRAY['Concerned about engineering complexity', 'Need internal team training'],
    'Agency delivery margins collapsing due to manual workflow assembly. Needs autonomous coordination.',
    'high', 'Follow up on proposal review call scheduled Friday', 'worker-10 (Follow-Up Agent)',
    'Yesterday', ARRAY['Reviewed proposal PDF', 'Asked about SLA guarantees']
),
(
    'lead-03', 'Dr. Sarah Lin', 'sarah.lin@biopulse.health', 'BioPulse HealthTech', 'VP of Commercial Ops',
    'negotiation', 64000,
    '{"contentId": "content-03", "contentTitle": "Why Mid-Market Healthcare SaaS Needs Deterministic Workflows", "platform": "LinkedIn", "touchpointType": "last_touch"}'::jsonb,
    ARRAY['HIPAA compliance questions', 'SOC-2 audit requirements'],
    'Compliance review on patient communication intake flows. Needs strict sandbox isolation.',
    'high', 'Legal team reviewing Master Services Agreement (MSA)', 'worker-12 (Sales Intelligence Agent)',
    '3 hours ago', ARRAY['Passed initial security review', 'Discussing 12-month enterprise tier']
),
(
    'lead-04', 'David Kim', 'dkim@apexlogistics.io', 'Apex Logistics Engine', 'Head of Revenue Operations',
    'discovery', 24000,
    '{"contentId": "content-04", "contentTitle": "3 Hidden Bottlenecks In 7-Figure Agencies", "platform": "Instagram", "touchpointType": "first_touch"}'::jsonb,
    ARRAY['Unclear on ROI timeline'],
    'Current CRM data is polluted with dead leads. Needs autonomous triage and scoring.',
    'medium', 'Discovery call scheduled for tomorrow 2:00 PM EST', 'worker-13 (Discovery Copilot)',
    '4 hours ago', ARRAY['Filled out onboarding questionnaire preview']
),
(
    'lead-05', 'Rachel Torres', 'rtorres@cloudscale.net', 'CloudScale Infrastructure', 'Director of Marketing',
    'engaged', 18000,
    '{"contentId": "content-01", "contentTitle": "How We Replaced 4 SDRs With Autonomous Webhooks", "platform": "LinkedIn", "touchpointType": "assisted"}'::jsonb,
    ARRAY['Budget allocated for Q3 only'],
    'Wants to expand inbound lead capture without adding headcount.',
    'medium', 'Nurture with 3-part educational email sequence', 'worker-09 (Outreach Agent)',
    '1 day ago', ARRAY['Downloaded Agency OS Blueprint']
),
(
    'lead-06', 'Tariq Al-Mansoor', 'tariq@vertexcapital.ae', 'Vertex Alpha Capital', 'Managing Director',
    'won', 72000,
    '{"contentId": "content-02", "contentTitle": "The Architecture of an Autonomous Agency", "platform": "YouTube", "touchpointType": "first_touch"}'::jsonb,
    ARRAY['None — fast-tracked by referral'],
    'Deploying full autonomous operations stack across portfolio companies.',
    'high', 'Kickoff sprint completed. Currently in Phase 3 deployment.', 'worker-14 (Onboarding Agent)',
    '2 days ago', ARRAY['Invoice paid in full', 'Slack Connect channel created']
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    company = EXCLUDED.company,
    stage = EXCLUDED.stage,
    estimated_value = EXCLUDED.estimated_value,
    content_attribution = EXCLUDED.content_attribution,
    updated_at = NOW();

-- 2. SEED CONTENT ASSETS
INSERT INTO public.content_assets (
    id, title, platform, format, status, funnel_stage, pillar,
    source_insight, target_audience, offer, cta, campaign, hook, body, metrics
) VALUES
(
    'content-01', 'How We Replaced 4 SDRs With Autonomous Webhooks (Architecture Breakdown)',
    'linkedin', 'post', 'published', 'top_of_funnel', 'Agency Systems & Automation',
    'Extracted from 11 prospect questions regarding manual outreach overhead.',
    'B2B SaaS Founders & Agency Owners', 'Free AI Growth & Operations Audit',
    'Comment "WEBHOOK" below and I’ll send you the visual workflow diagram.',
    'Autonomous Acquisition Sprint',
    'Your SDR team shouldn’t be spending 3 hours a day copy-pasting LinkedIn profiles into spreadsheets.',
    'Here is the exact 4-node event pipeline we deployed that lowered response time from 4.2 hours to 85 seconds.\n\n1. Webhook trigger on profile visit\n2. AI Enrichment & ICP scoring (0-100)\n3. Personalized 4-part message draft\n4. 1-click human approval dashboard\n\nResult: 3.2x more booked discovery calls with zero spam.',
    '{"reach": 34800, "engagements": 2140, "saves": 642, "leadsGenerated": 28, "revenueAttributed": 84000}'::jsonb
),
(
    'content-02', 'The Architecture of an Autonomous Agency in 2026 (Full Code & Node Blueprint)',
    'youtube', 'video', 'published', 'middle_of_funnel', 'Technical Authority & Engineering',
    'Overwhelming demand for production-ready agent orchestration code.',
    'Technical Founders, CTOs, and AI Engineers', 'Done-With-You Implementation Sprint',
    'Download the complete repository link in the pinned comment.',
    'Agency OS Educational Series',
    'In this 28-minute masterclass, I open up our internal production repository to show you how 21 agents run our entire agency.',
    'Timestamps:\n0:00 - The Death of Single-Prompt Wrappers\n4:12 - Manager-Worker JSON Schemas\n11:30 - Supabase + Realtime CRM Sync\n18:45 - Autonomous Objection Mining\n25:10 - Scaling Retainers to $50k/mo',
    '{"reach": 18200, "engagements": 1890, "saves": 1210, "leadsGenerated": 34, "revenueAttributed": 118000}'::jsonb
),
(
    'content-03', 'Why Mid-Market CTOs Fear AI Implementation (And The 14-Day Solution)',
    'linkedin', 'post', 'review', 'middle_of_funnel', 'Objection Neutralization',
    'Synthesized from 7 CRM objections regarding tech debt & complexity.',
    'CTOs & Heads of Engineering', '14-Day Zero-Code AI Handshake',
    'Comment "BLUEPRINT" to inspect our sandboxed architecture diagram.',
    'Implementation Complexity Loop Sprint',
    'Your engineering team has 40 sprint backlog tickets. They shouldn’t be coding custom scrapers.',
    'When CTOs say "we want automation but don’t have bandwidth", they fear 6-month integration hell.\n\nHere is how we deploy isolated, sandboxed agents with 0 client codebase alterations in 14 days flat.',
    '{"reach": 0, "engagements": 0, "saves": 0, "leadsGenerated": 0, "revenueAttributed": 0}'::jsonb
),
(
    'content-04', 'Watch This AI Agent Qualify Inbound Leads in 45 Seconds (No Human In The Loop)',
    'instagram', 'reel', 'published', 'top_of_funnel', 'Live Product Proof',
    'Short-form visual proof drives highest DM volume.',
    'Bootstrapped Operators & Growth Leads', 'AI Growth Audit',
    'DM me "SPEED" and I’ll send you the terminal blueprint.',
    'Speed to Lead Viral Campaign',
    'Stop waiting 4 hours to contact high-ticket inbound prospects.',
    '[Fast cut: Terminal running sub-90s autonomous triage → Clearbit enrichment → CRM update → Slack alert].',
    '{"reach": 42100, "engagements": 3940, "saves": 980, "leadsGenerated": 19, "revenueAttributed": 48000}'::jsonb
),
(
    'content-05', 'The 5 Critical Failure Points of Multi-Agent Systems in Production',
    'newsletter', 'article', 'scheduled', 'bottom_of_funnel', 'Deep Systems Engineering',
    'Buyer skepticism around agent reliability and hallucination.',
    'Enterprise Architects & AI Decision Makers', 'Production AI Architecture Review',
    'Reply to this email with "AUDIT" to book your session.',
    'Weekly Operations Intelligence',
    'Most multi-agent tutorials online only work in a pristine Jupyter Notebook. Here is what breaks in production.',
    '1. Non-deterministic tool loops\n2. Unbounded context token inflation\n3. Missing state persistence\n4. Lack of human-in-the-loop gating\n5. Schema drift between models',
    '{"reach": 0, "engagements": 0, "saves": 0, "leadsGenerated": 0, "revenueAttributed": 0}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    status = EXCLUDED.status,
    metrics = EXCLUDED.metrics,
    updated_at = NOW();

-- 3. SEED OUTREACH MESSAGES
INSERT INTO public.outreach_messages (
    id, prospect_id, prospect_name, company, channel,
    sequence_step, day_number, status, framework, full_text, scheduled_for
) VALUES
(
    'out-01', 'prospect-01', 'Alexander Wright', 'Apex Cloud Solutions', 'linkedin',
    1, 1, 'needs_approval',
    '{"observation": "Noticed Apex added 14 new account reps last quarter.", "relevance": "Most cloud platforms hit a speed-to-lead bottleneck during rapid team expansion.", "insight": "We built a 4-node webhook that cuts lead triage time from 3 hours to 90 seconds.", "question": "Are your new reps currently handling enrichment manually?"}'::jsonb,
    'Hi Alexander, noticed Apex added 14 new account reps last quarter. Rapid headcount growth usually causes speed-to-lead friction. We built an autonomous webhook pipeline that cuts triage time from 3 hours to 90 seconds with zero CRM data pollution. Are your new reps currently handling enrichment manually?',
    'Today at 2:30 PM'
),
(
    'out-02', 'prospect-02', 'Sophia Chen', 'Lumina Analytics', 'email',
    2, 3, 'approved',
    '{"observation": "Saw your recent post regarding SDR attrition.", "relevance": "Manual prospecting burnout accounts for 68% of SDR turnover in B2B analytics.", "insight": "Autonomous qualification agents remove 70% of repetitive copy-pasting.", "question": "Would a quick 3-minute video breakdown of our workflow be helpful?"}'::jsonb,
    'Hi Sophia, saw your recent post regarding SDR burnout. We recently helped a similar analytics firm automate 70% of repetitive prospecting, freeing reps to focus solely on booked calls. Would a quick 3-minute video breakdown of our workflow be helpful?',
    'Tomorrow at 10:00 AM'
),
(
    'out-03', 'prospect-03', 'Liam O''Connor', 'Nexus FinTech Labs', 'linkedin',
    1, 1, 'draft',
    '{"observation": "Saw Nexus FinTech announced Series A expansion.", "relevance": "FinTech compliance requirements make standard marketing automation risky.", "insight": "We deploy sandboxed deterministic agents with complete audit logs.", "question": "Worth a brief exchange on how we handle SOC-2 compliant agent workflows?"}'::jsonb,
    'Hi Liam, congratulations on the Series A announcement. With FinTech compliance scrutiny, most standard automation tools pose severe data security risks. We deploy isolated deterministic agents with full audit trails. Worth a brief exchange on how we architect compliant agent workflows?',
    'Pending Approval'
),
(
    'out-04', 'prospect-04', 'Maya Patel', 'Vanguard Health', 'email',
    1, 1, 'sent',
    '{"observation": "Reviewed Vanguard''s patient intake portal updates.", "relevance": "HealthTech teams spend dozens of hours weekly answering redundant onboarding inquiries.", "insight": "Autonomous triage reduced support ticket backlog by 62% in 14 days.", "question": "Are you exploring AI triage for patient onboarding?"}'::jsonb,
    'Hi Maya, reviewed Vanguard’s recent intake updates. In similar health platforms, manual onboarding verification creates significant friction. We implemented an autonomous triage flow that reduced support tickets by 62% in 14 days. Are you exploring AI triage for patient onboarding this quarter?',
    'Sent 2 days ago'
)
ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    full_text = EXCLUDED.full_text,
    updated_at = NOW();

-- 4. SEED INVOICES
INSERT INTO public.invoices (
    id, client_name, amount, status, issue_date, due_date, type
) VALUES
(
    'inv-101', 'Vertex Alpha Capital', 72000, 'paid', '2026-09-15', '2026-09-30', 'implementation'
),
(
    'inv-102', 'NovaSurge AI', 24000, 'sent', '2026-10-01', '2026-10-15', 'retainer'
),
(
    'inv-103', 'VanceMetrics Growth', 18000, 'draft', '2026-10-03', '2026-10-18', 'retainer'
),
(
    'inv-104', 'BioPulse HealthTech', 32000, 'draft', '2026-10-02', '2026-10-16', 'implementation'
),
(
    'inv-105', 'Apex Logistics Engine', 12000, 'paid', '2026-09-20', '2026-10-05', 'performance'
),
(
    'inv-106', 'CloudScale Infrastructure', 15000, 'overdue', '2026-09-01', '2026-09-15', 'retainer'
)
ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    amount = EXCLUDED.amount,
    updated_at = NOW();

-- 5. SEED PROSPECTS
INSERT INTO public.prospects (
    id, name, title, company, segment, industry, size, fit_score, intent_score, status, probable_pain, source, research
) VALUES
(
    'pros-01', 'Alexander Wright', 'Chief Revenue Officer', 'Apex Cloud Solutions',
    'Mid-Market B2B', 'Cloud Infrastructure', '100-250 employees', 94, 88, 'in_sequence',
    'Manual SDR triage bottlenecking inbound response times', 'LinkedIn Organic Inbound',
    '{"overview": "Rapidly expanding sales organization with 14 new account executives hired in Q3.", "businessProblems": ["Slow speed-to-lead latency (4.2 hours average)", "CRM lead pollution with incomplete data"], "personalizationOpportunity": "Mentioned SDR team burnout in recent LinkedIn commentary.", "conversationStarter": "Saw your comment on inbound response time latency.", "recommendedOffer": "Autonomous Webhook Triage Sprint ($24k)", "contentToSend": "LinkedIn Webhook Architecture Case Study"}'::jsonb
),
(
    'pros-02', 'Sophia Chen', 'VP of Operations', 'Lumina Analytics',
    'Series B SaaS', 'Data & Analytics', '50-100 employees', 89, 76, 'researched',
    'Collapsing gross delivery margins due to custom scripting debt', 'YouTube Video Viewer',
    '{"overview": "High-growth business intelligence startup with complex client onboarding flows.", "businessProblems": ["Onboarding takes 21 days due to credential exchange friction", "Engineering pulled into support tickets"], "personalizationOpportunity": "Actively seeking zero-code client onboarding automation.", "conversationStarter": "Loved your keynote on scaling client retention.", "recommendedOffer": "Client Operations Hub Deployment ($36k)", "contentToSend": "YouTube Autonomous Agency Blueprint"}'::jsonb
),
(
    'pros-03', 'Liam O''Connor', 'Co-Founder & CTO', 'Nexus FinTech Labs',
    'Enterprise FinTech', 'Financial Services', '250-500 employees', 96, 92, 'cold',
    'Strict regulatory compliance preventing standard AI wrapper adoption', 'Referral / Partner',
    '{"overview": "Institutional payments platform requiring strict SOC-2 and ISO-27001 data boundaries.", "businessProblems": ["Need deterministic agent auditing", "Data privacy concerns with third-party LLMs"], "personalizationOpportunity": "Recently published whitepaper on sovereign AI workflows.", "conversationStarter": "Impressed by your approach to sovereign financial pipelines.", "recommendedOffer": "Sandboxed Enterprise Agent Stack ($64k)", "contentToSend": "Deterministic State Machine Architecture"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    fit_score = EXCLUDED.fit_score,
    status = EXCLUDED.status,
    updated_at = NOW();

-- 6. SEED CLIENT PROJECTS
INSERT INTO public.client_projects (
    id, client_name, company, project_outcome, stage, progress,
    milestones, workflows, blockers, approvals_needed, automation_health, due_date
) VALUES
(
    'proj-01', 'Vertex Alpha Capital', 'Vertex Alpha Capital',
    'Autonomous multi-agent portfolio monitoring & deal triage engine',
    'deploy', 85,
    '[{"title": "Architecture Blueprint Approval", "completed": true, "dueDate": "2026-09-20"}, {"title": "Webhook & CRM Ingestion Pipeline", "completed": true, "dueDate": "2026-09-28"}, {"title": "Autonomous Triage & LLM Reasoning", "completed": true, "dueDate": "2026-10-02"}, {"title": "Executive Dashboard & Handshake", "completed": false, "dueDate": "2026-10-10"}]'::jsonb,
    '[{"name": "Portfolio Ingest Webhook", "status": "active", "trigger": "Hourly JSON Feed"}, {"name": "Objection Classifier", "status": "active", "trigger": "Transcript Sync"}, {"name": "Weekly Briefing Compiler", "status": "in_testing", "trigger": "Cron Sunday 23:00"}]'::jsonb,
    ARRAY[]::TEXT[],
    ARRAY['Final executive dashboard cutover approval']::TEXT[],
    96, '2026-10-12'
),
(
    'proj-02', 'NovaSurge AI', 'NovaSurge AI',
    'End-to-End Speed-to-Lead Triage & Human-in-the-Loop Approval Hub',
    'build', 62,
    '[{"title": "API Keys & CRM Sync", "completed": true, "dueDate": "2026-10-02"}, {"title": "Clearbit Enrichment Node", "completed": true, "dueDate": "2026-10-05"}, {"title": "Slack Approval Bot", "completed": false, "dueDate": "2026-10-09"}]'::jsonb,
    '[{"name": "Inbound Webhook", "status": "active", "trigger": "Form Submit"}, {"name": "Enrichment Engine", "status": "active", "trigger": "Webhook Event"}, {"name": "Approval Trigger", "status": "in_testing", "trigger": "Fit Score > 80"}]'::jsonb,
    ARRAY['Pending 1Password invite acceptance for HubSpot API secret']::TEXT[],
    ARRAY['HubSpot OAuth Scope approval']::TEXT[],
    88, '2026-10-18'
)
ON CONFLICT (id) DO UPDATE SET
    progress = EXCLUDED.progress,
    stage = EXCLUDED.stage,
    automation_health = EXCLUDED.automation_health,
    updated_at = NOW();

-- 7. SEED INTEL SIGNALS
INSERT INTO public.intel_signals (
    id, type, title, description, impact_score, frequency, action_taken, suggested_automation
) VALUES
(
    'sig-01', 'emerging_pain', 'Implementation Complexity is Primary Buying Friction',
    'Analysis of 18 discovery calls and 11 CRM inquiries showed 78% of prospects hesitate due to perceived engineering burden.',
    'critical', 18,
    'Triggered closed-loop sprint: added 14-day zero-code guarantee and dispatched 3-part educational content campaign.',
    '{"opportunity": "Automate zero-code environment provisioning & verification report", "impact": "Will decrease sales cycle length by an estimated 9 days", "complexity": "medium", "recommendedAgent": "worker-16 (Solution Architect)", "actionPlan": "Deploy Docker container template that spins up client sandbox with 1 click."}'::jsonb
),
(
    'sig-02', 'content_theme', 'Systems & Operational Architecture Outperforming Hype Posts 3.4x',
    'Content assets breaking down practical workflow topologies generated 82% of all inbound qualified pipeline.',
    'high', 42,
    'Reallocated 70% of Content Creator sprint capacity to architectural teardowns and visual node walkthroughs.',
    '{}'::jsonb
),
(
    'sig-03', 'offer_opportunity', 'High Demand for Sales Call Intelligence Add-on',
    'Six warm prospects asked if our internal sales transcript analyzer could be licensed standalone.',
    'high', 6,
    'Positioning & Offer Agent drafted standalone $1,500/mo Sales Intelligence micro-tier.',
    '{}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    frequency = EXCLUDED.frequency,
    action_taken = EXCLUDED.action_taken;
