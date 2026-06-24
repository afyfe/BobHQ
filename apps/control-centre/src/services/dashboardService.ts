import { createApiClient } from "../lib/apiClient";
import { getConnectorTelemetry } from "./connectorTelemetryService";
import { getTenantManagementList } from "./tenantService";
import type {
  AttentionAlert,
  AttentionAlertDto,
  AuditEntry,
  AuditEntryDto,
  ActivityEvent,
  Connector,
  DashboardOverview,
  DashboardSummary,
  DashboardSummaryDto,
  DiscoveryFinding,
  DiscoveryFindingDto,
  Job,
  JobDto,
  KnowledgeItem,
  KnowledgeItemDto,
  Metric,
  Tenant,
  TimelineEventDto,
  User,
  UserDto,
} from "../types/dashboard";

const dashboardClient = createApiClient();

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

function buildOverviewMetrics(summary: DashboardSummaryDto): Metric[] {
  const noData = "No data yet";

  return [
    {
      label: "Active tenants",
      value: metricValue(summary.activeTenantCount, noData),
      delta: summary.totalTenantCount === null ? "Tenants table" : `${summary.totalTenantCount} total tenants`,
    },
    {
      label: "Connector health",
      value: summary.connectorHealthPercent === null ? noData : `${summary.connectorHealthPercent}%`,
      delta:
        summary.degradedConnectorCount === null
          ? "Latest ConnectorRuns"
          : `${summary.degradedConnectorCount} degraded / failed`,
    },
    {
      label: "Attention required",
      value: metricValue(summary.attentionRequiredCount, noData),
      delta: "open alerts",
    },
    {
      label: "Items processed",
      value: metricValue(summary.connectorItemsProcessed, noData),
      delta:
        summary.connectorCycleCount === null
          ? "ConnectorCycleSummaries"
          : `${summary.connectorCycleCount} connector cycles`,
    },
    {
      label: "Discovery findings",
      value: metricValue(summary.discoveryFindingCount, noData),
      delta: "DiscoveryFindings",
    },
  ];
}

function metricValue(value: number | null, fallback: string): number | string {
  return value === null ? fallback : value;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const summary = await dashboardClient.get<DashboardSummaryDto>("/dashboard/summary");
  return { metrics: buildOverviewMetrics(summary) };
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const [summary, tenants, connectors, attentionAlerts, activityEvents] = await Promise.all([
    getDashboardSummary(),
    getTenants(),
    getConnectors(),
    getAttentionAlerts(),
    getActivityEvents(),
  ]);

  return { ...summary, tenants, connectors, attentionAlerts, activityEvents };
}

export async function getTenants(): Promise<Tenant[]> {
  return getTenantManagementList();
}

export async function getConnectors(): Promise<Connector[]> {
  return getConnectorTelemetry();
}

export async function getJobs(): Promise<Job[]> {
  const jobs = await dashboardClient.get<JobDto[]>("/jobs");
  return jobs.map(mapJob);
}

export async function getAuditEntries(): Promise<AuditEntry[]> {
  const auditEntries = await dashboardClient.get<AuditEntryDto[]>("/audit");
  return auditEntries.map(mapAuditEntry);
}

export async function getKnowledgeItems(): Promise<KnowledgeItem[]> {
  const knowledgeItems = await dashboardClient.get<KnowledgeItemDto[]>("/knowledge");
  return knowledgeItems.map(mapKnowledgeItem);
}

export async function getUsers(): Promise<User[]> {
  const users = await dashboardClient.get<UserDto[]>("/users");
  return users.map(mapUser);
}

export async function getDiscoveryFindings(): Promise<DiscoveryFinding[]> {
  const findings = await dashboardClient.get<DiscoveryFindingDto[]>("/discovery");
  return findings.map(mapDiscoveryFinding);
}

export async function getAttentionAlerts(): Promise<AttentionAlert[]> {
  const alerts = await dashboardClient.get<AttentionAlertDto[]>("/attention");
  return alerts.map(mapAttentionAlert);
}

export async function getActivityEvents(): Promise<ActivityEvent[]> {
  const events = await dashboardClient.get<TimelineEventDto[]>("/activity");
  return events.map(mapActivityEvent);
}
