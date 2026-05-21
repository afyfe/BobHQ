export type Tenant = {
  id: string;
  name: string;
  plan: "Pilot" | "Growth" | "Enterprise";
  status: "Active" | "Paused" | "Warning";
  users: number;
  connectors: number;
  documentsIndexed: number;
  lastActivity: string;
};

export type Connector = {
  id: string;
  name: string;
  tenant: string;
  status: "Healthy" | "Syncing" | "Degraded" | "Failed" | "Disabled";
  lastSuccessfulSync: string;
  lastError: string;
  itemsIndexed: number;
  enabled: boolean;
};

export type Job = {
  id: string;
  type: string;
  tenant: string;
  status: "Queued" | "Running" | "Completed" | "Failed";
  retryCount: number;
  createdAt: string;
  completedAt: string;
  failureMessage: string;
};

export type AuditRecord = {
  id: string;
  question: string;
  tenant: string;
  user: string;
  confidence: number;
  sourceCount: number;
  timestamp: string;
  status: "Completed" | "Partial" | "Failed";
};

export type Activity = {
  id: string;
  title: string;
  detail: string;
  time: string;
  status: "Healthy" | "Warning" | "Failed" | "Running";
};

export type KnowledgeSource = {
  id: string;
  tenant: string;
  source: string;
  status: "Indexed" | "Syncing" | "Warning";
  documents: number;
  emails: number;
  freshness: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Operator" | "Analyst" | "Reviewer";
  tenant: string;
  status: "Active" | "Invited" | "Disabled";
  lastSeen: string;
};

export const tenants: Tenant[] = [
  {
    id: "tenant-nova",
    name: "Nova Financial",
    plan: "Enterprise",
    status: "Active",
    users: 84,
    connectors: 6,
    documentsIndexed: 182450,
    lastActivity: "3 min ago",
  },
  {
    id: "tenant-luma",
    name: "Luma Health",
    plan: "Growth",
    status: "Warning",
    users: 37,
    connectors: 4,
    documentsIndexed: 67110,
    lastActivity: "19 min ago",
  },
  {
    id: "tenant-harbour",
    name: "Harbour Legal",
    plan: "Pilot",
    status: "Active",
    users: 18,
    connectors: 3,
    documentsIndexed: 28490,
    lastActivity: "1 hr ago",
  },
];

export const connectors: Connector[] = [
  {
    id: "conn-gdrive",
    name: "Google Drive",
    tenant: "Nova Financial",
    status: "Healthy",
    lastSuccessfulSync: "Today 14:42",
    lastError: "-",
    itemsIndexed: 94620,
    enabled: true,
  },
  {
    id: "conn-outlook",
    name: "Outlook Mail",
    tenant: "Nova Financial",
    status: "Syncing",
    lastSuccessfulSync: "Today 14:18",
    lastError: "-",
    itemsIndexed: 38120,
    enabled: true,
  },
  {
    id: "conn-sharepoint",
    name: "SharePoint",
    tenant: "Luma Health",
    status: "Degraded",
    lastSuccessfulSync: "Yesterday 22:06",
    lastError: "Rate limit window exhausted",
    itemsIndexed: 31244,
    enabled: true,
  },
  {
    id: "conn-slack",
    name: "Slack",
    tenant: "Harbour Legal",
    status: "Disabled",
    lastSuccessfulSync: "May 17 09:12",
    lastError: "Disabled by operator",
    itemsIndexed: 6105,
    enabled: false,
  },
  {
    id: "conn-notion",
    name: "Notion",
    tenant: "Luma Health",
    status: "Failed",
    lastSuccessfulSync: "May 20 18:39",
    lastError: "OAuth token expired",
    itemsIndexed: 8742,
    enabled: true,
  },
];

export const jobs: Job[] = [
  {
    id: "job-8842",
    type: "Incremental email index",
    tenant: "Nova Financial",
    status: "Running",
    retryCount: 0,
    createdAt: "Today 14:51",
    completedAt: "-",
    failureMessage: "",
  },
  {
    id: "job-8841",
    type: "Connector backfill",
    tenant: "Luma Health",
    status: "Queued",
    retryCount: 1,
    createdAt: "Today 14:46",
    completedAt: "-",
    failureMessage: "",
  },
  {
    id: "job-8839",
    type: "Knowledge chunk rebuild",
    tenant: "Harbour Legal",
    status: "Completed",
    retryCount: 0,
    createdAt: "Today 13:20",
    completedAt: "Today 13:44",
    failureMessage: "",
  },
  {
    id: "job-8835",
    type: "Notion sync",
    tenant: "Luma Health",
    status: "Failed",
    retryCount: 3,
    createdAt: "Today 12:05",
    completedAt: "Today 12:09",
    failureMessage: "OAuth token expired",
  },
];

export const auditRecords: AuditRecord[] = [
  {
    id: "audit-2048",
    question: "Summarise onboarding blockers for Q2 accounts",
    tenant: "Nova Financial",
    user: "mira@nova.example",
    confidence: 0.92,
    sourceCount: 18,
    timestamp: "Today 14:33",
    status: "Completed",
  },
  {
    id: "audit-2047",
    question: "Find contracts with renewal risk language",
    tenant: "Harbour Legal",
    user: "noah@harbour.example",
    confidence: 0.81,
    sourceCount: 11,
    timestamp: "Today 13:58",
    status: "Completed",
  },
  {
    id: "audit-2046",
    question: "Which accounts mention delayed implementation?",
    tenant: "Luma Health",
    user: "ops@luma.example",
    confidence: 0.64,
    sourceCount: 5,
    timestamp: "Today 13:41",
    status: "Partial",
  },
];

export const recentActivity: Activity[] = [
  {
    id: "activity-1",
    title: "Outlook incremental sync started",
    detail: "Nova Financial email connector entered processing",
    time: "2 min ago",
    status: "Running",
  },
  {
    id: "activity-2",
    title: "Source freshness below target",
    detail: "SharePoint sync for Luma Health is 16 hours behind",
    time: "21 min ago",
    status: "Warning",
  },
  {
    id: "activity-3",
    title: "Knowledge rebuild completed",
    detail: "Harbour Legal policy library rebuilt successfully",
    time: "1 hr ago",
    status: "Healthy",
  },
  {
    id: "activity-4",
    title: "Connector auth failure",
    detail: "Notion token expired for Luma Health",
    time: "2 hrs ago",
    status: "Failed",
  },
];

export const knowledgeSources: KnowledgeSource[] = [
  {
    id: "knowledge-drive",
    tenant: "Nova Financial",
    source: "Drive corpus",
    status: "Indexed",
    documents: 94210,
    emails: 0,
    freshness: "6 min",
  },
  {
    id: "knowledge-mail",
    tenant: "Nova Financial",
    source: "Mailbox archive",
    status: "Syncing",
    documents: 0,
    emails: 38120,
    freshness: "Live",
  },
  {
    id: "knowledge-sharepoint",
    tenant: "Luma Health",
    source: "SharePoint care ops",
    status: "Warning",
    documents: 31244,
    emails: 0,
    freshness: "16 hrs",
  },
];

export const users: User[] = [
  {
    id: "user-mira",
    name: "Mira Shah",
    email: "mira@nova.example",
    role: "Owner",
    tenant: "Nova Financial",
    status: "Active",
    lastSeen: "4 min ago",
  },
  {
    id: "user-eli",
    name: "Eli Foster",
    email: "eli@bobhq.example",
    role: "Operator",
    tenant: "All tenants",
    status: "Active",
    lastSeen: "12 min ago",
  },
  {
    id: "user-ava",
    name: "Ava Ross",
    email: "ava@luma.example",
    role: "Reviewer",
    tenant: "Luma Health",
    status: "Invited",
    lastSeen: "-",
  },
];

export const overviewMetrics = [
  { label: "Active tenants", value: tenants.filter((tenant) => tenant.status === "Active").length, delta: "+1 this week" },
  { label: "Connector health", value: "72%", delta: "3 need attention" },
  { label: "Documents indexed", value: 278050, delta: "+8.4k today" },
  { label: "Emails indexed", value: 38120, delta: "syncing now" },
  { label: "Jobs active", value: "2 / 1 / 1", delta: "queued / running / failed" },
  { label: "AI requests today", value: 1427, delta: "98.7% explainable" },
];
