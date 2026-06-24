import { createApiClient } from "../lib/apiClient";
import type {
  Connector,
  ConnectorHealthTelemetryDto,
  ConnectorRunTelemetryDto,
  ConnectorStatus,
} from "../types/dashboard";

const connectorClient = createApiClient();

const connectorStatusMap: Record<string, ConnectorStatus> = {
  healthy: "Healthy",
  syncing: "Syncing",
  degraded: "Degraded",
  disabled: "Disabled",
  failed: "Failed",
};

export function getConnectorLatestRuns(): Promise<ConnectorRunTelemetryDto[]> {
  return connectorClient.get<ConnectorRunTelemetryDto[]>("/connectors/latest");
}

export function getConnectorHealth(): Promise<ConnectorHealthTelemetryDto[]> {
  return connectorClient.get<ConnectorHealthTelemetryDto[]>("/connectors/health");
}

export function getConnectorRuns(limit = 100): Promise<ConnectorRunTelemetryDto[]> {
  return connectorClient.get<ConnectorRunTelemetryDto[]>(`/connectors/runs?limit=${limit}`);
}

export async function getConnectorTelemetry(): Promise<Connector[]> {
  const [healthRecords, latestRuns, runs] = await Promise.all([
    getConnectorHealth(),
    getConnectorLatestRuns(),
    getConnectorRuns(),
  ]);

  const latestByConnectorId = new Map(latestRuns.map((run) => [run.connectorId, run]));
  const healthByConnectorId = new Map(healthRecords.map((health) => [health.connectorId, health]));
  const connectorIds = new Set([...healthByConnectorId.keys(), ...latestByConnectorId.keys()]);
  const runCountsByConnectorId = runs.reduce((counts, run) => {
    counts.set(run.connectorId, (counts.get(run.connectorId) ?? 0) + 1);
    return counts;
  }, new Map<string, number>());

  return [...connectorIds]
    .map((connectorId) =>
      mapConnectorTelemetry(
        connectorId,
        healthByConnectorId.get(connectorId),
        latestByConnectorId.get(connectorId),
        runCountsByConnectorId.get(connectorId) ?? 0,
      ),
    )
    .sort((first, second) => first.name.localeCompare(second.name));
}

function mapConnectorTelemetry(
  connectorId: string,
  health: ConnectorHealthTelemetryDto | undefined,
  latestRun: ConnectorRunTelemetryDto | undefined,
  runCount: number,
): Connector {
  const completedUtc = latestRun?.completedUtc ?? health?.lastRunCompletedUtc;
  const status = normaliseConnectorStatus(health?.status ?? latestRun?.status ?? "Degraded");
  const itemsProcessed = health?.itemsProcessed ?? latestRun?.itemsProcessed ?? 0;
  const warningCount = health?.warningCount ?? latestRun?.warningCount ?? 0;
  const errorCount = health?.errorCount ?? latestRun?.errorCount ?? 0;
  const duration = latestRun ? formatDuration(latestRun.durationMilliseconds) : undefined;

  return {
    id: connectorId,
    name: health?.connectorName ?? latestRun?.connectorName ?? "Unknown connector",
    type: health?.connectorType ?? latestRun?.connectorType ?? "-",
    tenant: health?.tenantName ?? latestRun?.tenantName ?? "-",
    status,
    lastSuccessfulSync: formatDateTime(completedUtc),
    lastRun: formatDateTime(completedUtc),
    lastError: errorCount > 0 ? `${errorCount} error${errorCount === 1 ? "" : "s"}` : "-",
    itemsIndexed: itemsProcessed,
    itemsProcessed,
    warningCount,
    errorCount,
    enabled: status !== "Disabled",
    syncProgress: duration ? `${formatNumber(itemsProcessed)} items / ${duration}` : undefined,
    lastSyncAge: formatRelativeTime(completedUtc),
    failureCount: errorCount,
    latestRun: latestRun
      ? {
          id: latestRun.connectorRunId,
          connectorId,
          status: normaliseConnectorStatus(latestRun.status),
          progressText: runCount > 1 ? `${runCount} recent runs` : undefined,
          startedAt: formatDateTime(latestRun.startedUtc),
          completedAt: formatDateTime(latestRun.completedUtc),
          failureCount: latestRun.errorCount,
        }
      : undefined,
  };
}

function normaliseConnectorStatus(status: string): ConnectorStatus {
  return connectorStatusMap[status.toLowerCase()] ?? "Degraded";
}

function formatDateTime(value: string | undefined): string {
  const date = value ? new Date(value) : null;

  if (!date || Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function formatRelativeTime(value: string | undefined): string {
  const date = value ? new Date(value) : null;

  if (!date || Number.isNaN(date.getTime())) {
    return "-";
  }

  const elapsedMs = Date.now() - date.getTime();
  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  if (elapsedMs < minuteMs) {
    return "just now";
  }

  if (elapsedMs < hourMs) {
    return `${Math.floor(elapsedMs / minuteMs)}m ago`;
  }

  if (elapsedMs < dayMs) {
    return `${Math.floor(elapsedMs / hourMs)}h ago`;
  }

  if (elapsedMs < 7 * dayMs) {
    return `${Math.floor(elapsedMs / dayMs)}d ago`;
  }

  return formatDateTime(value);
}

function formatDuration(durationMilliseconds: number): string {
  if (!Number.isFinite(durationMilliseconds) || durationMilliseconds <= 0) {
    return "under 1s";
  }

  if (durationMilliseconds < 1000) {
    return `${Math.round(durationMilliseconds)}ms`;
  }

  const seconds = durationMilliseconds / 1000;

  if (seconds < 60) {
    return `${seconds.toFixed(seconds >= 10 ? 0 : 1)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  return `${minutes}m ${remainingSeconds}s`;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-GB").format(value);
}
