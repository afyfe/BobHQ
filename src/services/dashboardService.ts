import { createMockApiClient } from "../lib/apiClient";
import { mockDashboardDto } from "../data/mockDashboardData";
import type {
  Activity,
  ActivityDto,
  AuditEntry,
  AuditEntryDto,
  Connector,
  ConnectorDto,
  DashboardDto,
  DashboardOverview,
  Job,
  JobDto,
  KnowledgeItem,
  KnowledgeItemDto,
  Metric,
  Tenant,
  TenantDto,
  User,
  UserDto,
} from "../types/dashboard";

const dashboardClient = createMockApiClient({
  "/dashboard": mockDashboardDto,
});

function mapTenant(dto: TenantDto): Tenant {
  return {
    id: dto.id,
    name: dto.name,
    plan: dto.plan,
    status: dto.status,
    users: dto.userCount,
    connectors: dto.connectorCount,
    documentsIndexed: dto.documentsIndexed,
    lastActivity: dto.lastActivityLabel,
  };
}

function mapConnector(dto: ConnectorDto): Connector {
  return {
    id: dto.id,
    name: dto.name,
    tenant: dto.tenantName,
    status: dto.status,
    lastSuccessfulSync: dto.lastSuccessfulSyncLabel,
    lastError: dto.lastErrorMessage ?? "-",
    itemsIndexed: dto.itemsIndexed,
    enabled: dto.enabled,
  };
}

function mapJob(dto: JobDto): Job {
  return {
    id: dto.id,
    type: dto.type,
    tenant: dto.tenantName,
    status: dto.status,
    retryCount: dto.retryCount,
    createdAt: dto.createdAtLabel,
    completedAt: dto.completedAtLabel ?? "-",
    failureMessage: dto.failureMessage ?? "",
  };
}

function mapAuditEntry(dto: AuditEntryDto): AuditEntry {
  return {
    id: dto.id,
    question: dto.question,
    tenant: dto.tenantName,
    user: dto.userEmail,
    confidence: dto.confidence,
    sourceCount: dto.sourceCount,
    timestamp: dto.timestampLabel,
    status: dto.status,
  };
}

function mapActivity(dto: ActivityDto): Activity {
  return {
    id: dto.id,
    title: dto.title,
    detail: dto.detail,
    time: dto.timeLabel,
    status: dto.status,
  };
}

function mapKnowledgeItem(dto: KnowledgeItemDto): KnowledgeItem {
  return {
    id: dto.id,
    tenant: dto.tenantName,
    source: dto.sourceName,
    status: dto.status,
    documents: dto.documentCount,
    emails: dto.emailCount,
    freshness: dto.freshnessLabel,
  };
}

function mapUser(dto: UserDto): User {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    role: dto.role,
    tenant: dto.tenantScope,
    status: dto.status,
    lastSeen: dto.lastSeenLabel ?? "-",
  };
}

function buildOverviewMetrics(dashboard: DashboardDto): Metric[] {
  const activeTenants = dashboard.tenants.filter((tenant) => tenant.status === "Active").length;
  const documentsIndexed = dashboard.knowledgeItems.reduce((total, item) => total + item.documentCount, 0);
  const emailsIndexed = dashboard.knowledgeItems.reduce((total, item) => total + item.emailCount, 0);
  const queued = dashboard.jobs.filter((job) => job.status === "Queued").length;
  const running = dashboard.jobs.filter((job) => job.status === "Running").length;
  const failed = dashboard.jobs.filter((job) => job.status === "Failed").length;

  return [
    { label: "Active tenants", value: activeTenants, delta: dashboard.summary.activeTenantDeltaLabel },
    { label: "Connector health", value: `${dashboard.summary.connectorHealthPercent}%`, delta: dashboard.summary.connectorAttentionLabel },
    { label: "Documents indexed", value: documentsIndexed, delta: dashboard.summary.documentsIndexedDeltaLabel },
    { label: "Emails indexed", value: emailsIndexed, delta: dashboard.summary.emailsIndexedDeltaLabel },
    { label: "Jobs active", value: `${queued} / ${running} / ${failed}`, delta: "queued / running / failed" },
    { label: "AI requests today", value: dashboard.summary.aiRequestsToday, delta: dashboard.summary.explainabilityRateLabel },
  ];
}

async function getDashboardDto(): Promise<DashboardDto> {
  return dashboardClient.get<DashboardDto>("/dashboard");
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const dashboard = await getDashboardDto();

  return {
    metrics: buildOverviewMetrics(dashboard),
    tenants: dashboard.tenants.map(mapTenant),
    connectors: dashboard.connectors.map(mapConnector),
    recentActivity: dashboard.recentActivity.map(mapActivity),
  };
}

export async function getTenants(): Promise<Tenant[]> {
  const dashboard = await getDashboardDto();
  return dashboard.tenants.map(mapTenant);
}

export async function getConnectors(): Promise<Connector[]> {
  const dashboard = await getDashboardDto();
  return dashboard.connectors.map(mapConnector);
}

export async function getJobs(): Promise<Job[]> {
  const dashboard = await getDashboardDto();
  return dashboard.jobs.map(mapJob);
}

export async function getAuditEntries(): Promise<AuditEntry[]> {
  const dashboard = await getDashboardDto();
  return dashboard.auditEntries.map(mapAuditEntry);
}

export async function getKnowledgeItems(): Promise<KnowledgeItem[]> {
  const dashboard = await getDashboardDto();
  return dashboard.knowledgeItems.map(mapKnowledgeItem);
}

export async function getUsers(): Promise<User[]> {
  const dashboard = await getDashboardDto();
  return dashboard.users.map(mapUser);
}
