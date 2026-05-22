import DataTable, { type Column } from "../components/ui/DataTable";
import ErrorPanel from "../components/ui/ErrorPanel";
import LoadingState from "../components/ui/LoadingState";
import PageHeader from "../components/ui/PageHeader";
import StatusPill from "../components/ui/StatusPill";
import { useServiceData } from "../hooks/useServiceData";
import { formatNumber } from "../lib/status";
import { getTenants } from "../services/dashboardService";
import type { Tenant } from "../types/dashboard";

const columns: Column<Tenant>[] = [
  { key: "name", header: "Tenant", render: (tenant) => <strong>{tenant.name}</strong> },
  { key: "plan", header: "Plan", render: (tenant) => tenant.plan },
  { key: "status", header: "Status", render: (tenant) => <StatusPill status={tenant.status} /> },
  { key: "users", header: "Users", render: (tenant) => tenant.users },
  { key: "connectors", header: "Connectors", render: (tenant) => tenant.connectors },
  { key: "documents", header: "Documents indexed", render: (tenant) => formatNumber(tenant.documentsIndexed) },
  { key: "activity", header: "Last activity", render: (tenant) => tenant.lastActivity },
];

export default function TenantsPage() {
  const { data: tenants, error, isLoading } = useServiceData(getTenants);

  if (isLoading) {
    return <LoadingState label="Loading tenants" />;
  }

  if (error || !tenants) {
    return <ErrorPanel message={error?.message ?? "Tenant data is unavailable."} />;
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Role-based tenancy"
        title="Tenants"
        description="Customer workspaces, operational state, and knowledge footprint without drifting into generic account admin."
      />
      <DataTable columns={columns} rows={tenants} getRowKey={(tenant) => tenant.id} />
    </div>
  );
}
