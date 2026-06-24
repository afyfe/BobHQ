import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import DataTable, { type Column } from "../components/ui/DataTable";
import ErrorPanel from "../components/ui/ErrorPanel";
import LoadingState from "../components/ui/LoadingState";
import MetricCard from "../components/ui/MetricCard";
import PageHeader from "../components/ui/PageHeader";
import StatusPill from "../components/ui/StatusPill";
import { useServiceData } from "../hooks/useServiceData";
import { formatNumber } from "../lib/status";
import { getActivityEvents, getAuditEntries } from "../services/dashboardService";
import { getConnectorTelemetryForTenant } from "../services/connectorTelemetryService";
import { getTenant } from "../services/tenantService";
import type { ActivityEvent, AuditEntry, Connector, Tenant } from "../types/dashboard";

type TenantDetailsData = {
  tenant: Tenant;
  connectors: Connector[];
  auditEntries: AuditEntry[];
  activityEvents: ActivityEvent[];
};

const connectorColumns: Column<Connector>[] = [
  { key: "name", header: "Connector", render: (connector) => <strong>{connector.name}</strong> },
  { key: "type", header: "Type", render: (connector) => connector.type },
  { key: "status", header: "Status", render: (connector) => <StatusPill status={connector.status} /> },
  { key: "lastRun", header: "Last run", render: (connector) => connector.lastRun },
  { key: "items", header: "Items processed", render: (connector) => formatNumber(connector.itemsProcessed) },
  { key: "signals", header: "Warnings / Errors", render: (connector) => `${connector.warningCount} / ${connector.errorCount}` },
];

const userPlaceholderColumns: Column<{ id: string; name: string; role: string; status: string }>[] = [
  { key: "name", header: "User", render: (user) => <strong>{user.name}</strong> },
  { key: "role", header: "Role", render: (user) => user.role },
  { key: "status", header: "Status", render: (user) => user.status },
];

const knowledgePlaceholderColumns: Column<{ id: string; source: string; status: string; freshness: string }>[] = [
  { key: "source", header: "Source", render: (source) => <strong>{source.source}</strong> },
  { key: "status", header: "Status", render: (source) => source.status },
  { key: "freshness", header: "Freshness", render: (source) => source.freshness },
];

const activityColumns: Column<ActivityEvent | AuditEntry>[] = [
  {
    key: "type",
    header: "Type",
    render: (item) => ("eventType" in item ? item.eventType : "Audit"),
  },
  {
    key: "description",
    header: "Activity",
    render: (item) => (
      <div className="table-primary">
        <strong>{"description" in item ? item.description : item.question}</strong>
        <span>{"time" in item ? item.time : item.timestamp}</span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (item) => <StatusPill status={item.status} />,
  },
];

export default function AdminTenantDetailsPage() {
  const { tenantId } = useParams();
  const loadTenantDetails = useCallback(() => {
    if (!tenantId) {
      throw new Error("Tenant id is required.");
    }

    return getTenantDetails(tenantId);
  }, [tenantId]);

  const { data, error, isLoading } = useServiceData(loadTenantDetails);

  if (isLoading) {
    return <LoadingState label="Loading tenant details" />;
  }

  if (error || !data) {
    return <ErrorPanel message={error?.message ?? "Tenant details are unavailable."} />;
  }

  const recentActivity = [...data.activityEvents, ...data.auditEntries].slice(0, 8);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Tenant details"
        title={data.tenant.name}
        description="Read-only tenant view across ingestion, access, knowledge, and recent operational activity."
      />

      <div className="toolbar">
        <Link className="button button--quiet" to="/admin">
          Back to tenants
        </Link>
      </div>

      <section className="page-stack" aria-label="Overview">
        <div className="section-heading">
          <h2>Overview</h2>
          <p>Tenant identity and current footprint.</p>
        </div>
        <div className="metrics-grid metrics-grid--compact">
          <MetricCard label="Tenant" value={data.tenant.name} />
          <MetricCard label="Plan" value={data.tenant.plan} />
          <MetricCard label="Status" value={data.tenant.status} />
          <MetricCard label="Created" value={data.tenant.createdAt ?? "-"} />
          <MetricCard label="Users" value={data.tenant.users} />
          <MetricCard label="Connectors" value={data.tenant.connectors} />
          <MetricCard label="Documents indexed" value={data.tenant.documentsIndexed} />
        </div>
      </section>

      <section className="panel">
        <SectionHeader title="Connectors" description="Connectors assigned to this tenant." />
        {data.connectors.length > 0 ? (
          <DataTable columns={connectorColumns} rows={data.connectors} getRowKey={(connector) => connector.id} />
        ) : (
          <div className="state-panel">No connectors assigned yet.</div>
        )}
      </section>

      <section className="panel">
        <SectionHeader title="Users" description="Future user management surface." />
        <DataTable columns={userPlaceholderColumns} rows={[]} getRowKey={(user) => user.id} />
        <div className="state-panel">User management is not implemented yet.</div>
      </section>

      <section className="panel">
        <SectionHeader title="Knowledge" description="Indexed source inventory placeholder." />
        <DataTable columns={knowledgePlaceholderColumns} rows={[]} getRowKey={(source) => source.id} />
        <div className="state-panel">Indexed source details will appear here.</div>
      </section>

      <section className="panel">
        <SectionHeader title="Activity" description="Recent audit and operational events." />
        {recentActivity.length > 0 ? (
          <DataTable columns={activityColumns} rows={recentActivity} getRowKey={(item) => item.id} />
        ) : (
          <div className="state-panel">No recent audit or activity events.</div>
        )}
      </section>
    </div>
  );
}

async function getTenantDetails(tenantId: string): Promise<TenantDetailsData> {
  const tenant = await getTenant(tenantId);
  const [connectors, auditEntries, activityEvents] = await Promise.all([
    getConnectorTelemetryForTenant(tenantId),
    getAuditEntries(),
    getActivityEvents(),
  ]);

  return {
    tenant,
    connectors,
    auditEntries: auditEntries.filter((entry) => entry.tenant === tenant.name),
    activityEvents: activityEvents.filter((event) => event.tenant === tenant.name),
  };
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="panel__header">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}
