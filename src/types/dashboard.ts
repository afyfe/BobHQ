export type TenantStatus = "Active" | "Paused" | "Warning";
export type ConnectorStatus = "Healthy" | "Syncing" | "Degraded" | "Failed" | "Disabled";
export type JobStatus = "Queued" | "Running" | "Completed" | "Failed";
export type AuditStatus = "Completed" | "Partial" | "Failed";
export type ActivityStatus = "Healthy" | "Warning" | "Failed" | "Running";
export type KnowledgeStatus = "Indexed" | "Syncing" | "Warning";
export type UserStatus = "Active" | "Invited" | "Disabled";

export type TenantPlan = "Pilot" | "Growth" | "Enterprise";
export type UserRole = "Owner" | "Operator" | "Analyst" | "Reviewer";

export type Metric = {
  label: string;
  value: string | number;
  delta?: string;
};

export type TenantDto = {
  id: string;
  name: string;
  plan: TenantPlan;
  status: TenantStatus;
  userCount: number;
  connectorCount: number;
  documentsIndexed: number;
  lastActivityLabel: string;
};

export type Tenant = {
  id: string;
  name: string;
  plan: TenantPlan;
  status: TenantStatus;
  users: number;
  connectors: number;
  documentsIndexed: number;
  lastActivity: string;
};

export type ConnectorDto = {
  id: string;
  name: string;
  tenantName: string;
  status: ConnectorStatus;
  lastSuccessfulSyncLabel: string;
  lastErrorMessage: string | null;
  itemsIndexed: number;
  enabled: boolean;
};

export type Connector = {
  id: string;
  name: string;
  tenant: string;
  status: ConnectorStatus;
  lastSuccessfulSync: string;
  lastError: string;
  itemsIndexed: number;
  enabled: boolean;
};

export type JobDto = {
  id: string;
  type: string;
  tenantName: string;
  status: JobStatus;
  retryCount: number;
  createdAtLabel: string;
  completedAtLabel: string | null;
  failureMessage: string | null;
};

export type Job = {
  id: string;
  type: string;
  tenant: string;
  status: JobStatus;
  retryCount: number;
  createdAt: string;
  completedAt: string;
  failureMessage: string;
};

export type AuditEntryDto = {
  id: string;
  question: string;
  tenantName: string;
  userEmail: string;
  confidence: number;
  sourceCount: number;
  timestampLabel: string;
  status: AuditStatus;
};

export type AuditEntry = {
  id: string;
  question: string;
  tenant: string;
  user: string;
  confidence: number;
  sourceCount: number;
  timestamp: string;
  status: AuditStatus;
};

export type ActivityDto = {
  id: string;
  title: string;
  detail: string;
  timeLabel: string;
  status: ActivityStatus;
};

export type Activity = {
  id: string;
  title: string;
  detail: string;
  time: string;
  status: ActivityStatus;
};

export type KnowledgeItemDto = {
  id: string;
  tenantName: string;
  sourceName: string;
  status: KnowledgeStatus;
  documentCount: number;
  emailCount: number;
  freshnessLabel: string;
};

export type KnowledgeItem = {
  id: string;
  tenant: string;
  source: string;
  status: KnowledgeStatus;
  documents: number;
  emails: number;
  freshness: string;
};

export type UserDto = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantScope: string;
  status: UserStatus;
  lastSeenLabel: string | null;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenant: string;
  status: UserStatus;
  lastSeen: string;
};

export type DashboardOverview = {
  metrics: Metric[];
  tenants: Tenant[];
  connectors: Connector[];
  recentActivity: Activity[];
};

export type DashboardSummaryDto = {
  activeTenantDeltaLabel: string;
  connectorHealthPercent: number;
  connectorAttentionLabel: string;
  documentsIndexedDeltaLabel: string;
  emailsIndexedDeltaLabel: string;
  aiRequestsToday: number;
  explainabilityRateLabel: string;
};

export type DashboardDto = {
  summary: DashboardSummaryDto;
  tenants: TenantDto[];
  connectors: ConnectorDto[];
  jobs: JobDto[];
  auditEntries: AuditEntryDto[];
  recentActivity: ActivityDto[];
  knowledgeItems: KnowledgeItemDto[];
  users: UserDto[];
};
