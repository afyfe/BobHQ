import { createMockApiClient } from "../lib/apiClient";
import { mockDashboardDto } from "../data/mockDashboardData";
import { getConnectorTelemetry } from "./connectorTelemetryService";
import { getTenantManagementList } from "./tenantService";
import type {
  AttentionAlert,
  AttentionAlertDto,
  AuditEntry,
  AuditEntryDto,
  ActivityEvent,
  Connector,
  ConnectorDto,
  ConnectorRun,
  DashboardDto,
  DashboardOverview,
  DashboardSummary,
  DiscoveryFinding,
  DiscoveryFindingDto,
  Job,
  JobDto,
  KnowledgeItem,
  KnowledgeItemDto,
  Metric,
  Tenant,
  TenantDto,
  TimelineEventDto,
  User,
  UserDto,
} from "../types/dashboard";

const mockDelayMs = 180;

const dashboardClient = createMockApiClient({
  "/dashboard": mockDashboardDto,
});

async function withMockDelay<TData>(data: TData): Promise<TData> {
  await new Promise((resolve) => window.setTimeout(resolve, mockDelayMs));
  return data;
}

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
  const latestRun: ConnectorRun | undefined =
    dto.status === "Syncing" || dto.failureCount > 0
      ? {
          id: `${dto.id}-latest-run`,
          connectorId: dto.id,
          status: dto.status,
          progressText: dto.syncProgressLabel ?? undefined,
          startedAt: dto.lastSuccessfulSyncLabel,
          failureCount: dto.failureCount,
        }
      : undefined;

  return {
    id: dto.id,
    name: dto.name,
    type: "-",
    tenant: dto.tenantName,
    status: dto.status,
    lastSuccessfulSync: dto.lastSuccessfulSyncLabel,
    lastRun: dto.lastSuccessfulSyncLabel,
    lastError: dto.lastErrorMessage ?? "-",
    itemsIndexed: dto.itemsIndexed,
    itemsProcessed: dto.itemsIndexed,
    warningCount: dto.status === "Degraded" ? 1 : 0,
    errorCount: dto.failureCount,
    enabled: dto.enabled,
    syncProgress: dto.syncProgressLabel ?? undefined,
    lastSyncAge: dto.lastSyncAgeLabel,
    failureCount: dto.failureCount,
    latestRun,
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
    explainabilityStatus: dto.explainabilityStatus,
  };
}

function mapAttentionAlert(dto: AttentionAlertDto): AttentionAlert {
  return {
    id: dto.id,
    severity: dto.severity,
    title: dto.title,
    tenant: dto.tenantName,
    description: dto.description,
    timestamp: dto.timestampLabel,
    suggestedAction: dto.suggestedAction,
  };
}

function mapActivityEvent(dto: TimelineEventDto): ActivityEvent {
  return {
    id: dto.id,
    time: dto.timeLabel,
    eventType: dto.eventType,
    tenant: dto.tenantName,
    description: dto.description,
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

function mapDiscoveryFinding(dto: DiscoveryFindingDto): DiscoveryFinding {
  return {
    id: dto.id,
    finding: dto.finding,
    tenant: dto.tenantName,
    severity: dto.severity,
    confidence: dto.confidence,
    recommendedAction: dto.recommendedAction,
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
    { label: "Explainability Coverage", value: "98.7%", subtitle: "answers with traceable sources" },
  ];
}

async function getDashboardDto(): Promise<DashboardDto> {
  return dashboardClient.get<DashboardDto>("/dashboard");
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const dashboard = await getDashboardDto();
  return withMockDelay({ metrics: buildOverviewMetrics(dashboard) });
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const dashboard = await getDashboardDto();

  return withMockDelay({
    metrics: buildOverviewMetrics(dashboard),
    tenants: dashboard.tenants.map(mapTenant),
    connectors: dashboard.connectors.map(mapConnector),
    attentionAlerts: dashboard.attentionAlerts.map(mapAttentionAlert),
    activityEvents: dashboard.timelineEvents.map(mapActivityEvent),
  });
}

export async function getTenants(): Promise<Tenant[]> {
  return getTenantManagementList();
}

export async function getConnectors(): Promise<Connector[]> {
  return getConnectorTelemetry();
}

export async function getJobs(): Promise<Job[]> {
  const dashboard = await getDashboardDto();
  return withMockDelay(dashboard.jobs.map(mapJob));
}

export async function getAuditEntries(): Promise<AuditEntry[]> {
  const dashboard = await getDashboardDto();
  return withMockDelay(dashboard.auditEntries.map(mapAuditEntry));
}

export async function getKnowledgeItems(): Promise<KnowledgeItem[]> {
  const dashboard = await getDashboardDto();
  return withMockDelay(dashboard.knowledgeItems.map(mapKnowledgeItem));
}

export async function getUsers(): Promise<User[]> {
  const dashboard = await getDashboardDto();
  return withMockDelay(dashboard.users.map(mapUser));
}

export async function getDiscoveryFindings(): Promise<DiscoveryFinding[]> {
  const dashboard = await getDashboardDto();
  return withMockDelay(dashboard.discoveryFindings.map(mapDiscoveryFinding));
}

export async function getAttentionAlerts(): Promise<AttentionAlert[]> {
  const dashboard = await getDashboardDto();
  return withMockDelay(dashboard.attentionAlerts.map(mapAttentionAlert));
}

export async function getActivityEvents(): Promise<ActivityEvent[]> {
  const dashboard = await getDashboardDto();
  return withMockDelay(dashboard.timelineEvents.map(mapActivityEvent));
}
