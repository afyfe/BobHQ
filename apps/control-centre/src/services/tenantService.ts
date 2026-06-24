import { createApiClient } from "../lib/apiClient";
import type { Tenant, TenantManagementDto, TenantStatus } from "../types/dashboard";

const tenantClient = createApiClient();

const tenantStatusMap: Record<string, TenantStatus> = {
  active: "Active",
  paused: "Paused",
  warning: "Warning",
};

export async function getTenantManagementList(): Promise<Tenant[]> {
  const tenants = await tenantClient.get<TenantManagementDto[]>("/tenants");
  return tenants.map(mapTenant);
}

export async function getTenant(tenantId: string): Promise<Tenant> {
  const tenant = await tenantClient.get<TenantManagementDto>(`/tenants/${tenantId}`);
  return mapTenant(tenant);
}

export async function createTenant(input: { name: string; planName?: string }): Promise<Tenant> {
  const tenant = await tenantClient.post<TenantManagementDto, { name: string; planName?: string }>("/tenants", input);
  return mapTenant(tenant);
}

function mapTenant(dto: TenantManagementDto): Tenant {
  return {
    id: dto.tenantId,
    name: dto.name,
    plan: dto.planName,
    status: normaliseTenantStatus(dto.status),
    users: dto.userCount,
    connectors: dto.connectorCount,
    documentsIndexed: dto.documentsIndexed,
    lastActivity: formatRelativeTime(dto.lastActivityUtc),
    createdAt: formatDateTime(dto.createdUtc),
    updatedAt: formatDateTime(dto.updatedUtc),
  };
}

function normaliseTenantStatus(status: string): TenantStatus {
  return tenantStatusMap[status.toLowerCase()] ?? "Warning";
}

function formatRelativeTime(value: string | null): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
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
    return `${Math.floor(elapsedMs / minuteMs)} min ago`;
  }

  if (elapsedMs < dayMs) {
    return `${Math.floor(elapsedMs / hourMs)} hr ago`;
  }

  return `${Math.floor(elapsedMs / dayMs)} days ago`;
}

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
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
