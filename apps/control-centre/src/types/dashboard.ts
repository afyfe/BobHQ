export type TenantStatus = "Active" | "Paused" | "Warning";
export type ConnectorStatus = "Healthy" | "Syncing" | "Degraded" | "Failed" | "Disabled";
export type JobStatus = "Queued" | "Running" | "Completed" | "Failed";
export type AuditStatus = "Completed" | "Partial" | "Failed";
export type KnowledgeStatus = "Indexed" | "Syncing" | "Warning";
export type UserStatus = "Active" | "Invited" | "Disabled";
export type AlertSeverity = "warning" | "critical" | "info";
export type TimelineEventStatus = "Healthy" | "Running" | "Completed" | "Failed" | "Warning";
export type ExplainabilityStatus = "Fully sourced" | "Partially sourced" | "Needs review";
export type DiscoverySeverity = "warning" | "critical" | "info";

export type TenantPlan = "Pilot" | "Growth" | "Enterprise";
export type UserRole = "Owner" | "Operator" | "Analyst" | "Reviewer";

export type Metric = {
  label: string;
  value: string | number;
  delta?: string;
  subtitle?: string;
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
  syncProgressLabel: string | null;
  lastSyncAgeLabel: string;
  failureCount: number;
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
  syncProgress?: string;
  lastSyncAge: string;
  failureCount: number;
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
  explainabilityStatus: ExplainabilityStatus;
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
  explainabilityStatus: ExplainabilityStatus;
};

export type AttentionAlertDto = {
  id: string;
  severity: AlertSeverity;
  title: string;
  tenantName: string;
  description: string;
  timestampLabel: string;
  suggestedAction: string;
};

export type AttentionAlert = {
  id: string;
  severity: AlertSeverity;
  title: string;
  tenant: string;
  description: string;
  timestamp: string;
  suggestedAction: string;
};

export type TimelineEventDto = {
  id: string;
  timeLabel: string;
  eventType: string;
  tenantName: string;
  description: string;
  status: TimelineEventStatus;
};

export type TimelineEvent = {
  id: string;
  time: string;
  eventType: string;
  tenant: string;
  description: string;
  status: TimelineEventStatus;
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

export type DiscoveryFindingDto = {
  id: string;
  finding: string;
  tenantName: string;
  severity: DiscoverySeverity;
  confidence: number;
  recommendedAction: string;
};

export type DiscoveryFinding = {
  id: string;
  finding: string;
  tenant: string;
  severity: DiscoverySeverity;
  confidence: number;
  recommendedAction: string;
};

export type DashboardOverview = {
  metrics: Metric[];
  tenants: Tenant[];
  connectors: Connector[];
  attentionAlerts: AttentionAlert[];
  timelineEvents: TimelineEvent[];
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
  attentionAlerts: AttentionAlertDto[];
  timelineEvents: TimelineEventDto[];
  knowledgeItems: KnowledgeItemDto[];
  users: UserDto[];
  discoveryFindings: DiscoveryFindingDto[];
};
