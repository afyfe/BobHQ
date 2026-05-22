import DataTable, { type Column } from "../components/ui/DataTable";
import ErrorPanel from "../components/ui/ErrorPanel";
import LoadingState from "../components/ui/LoadingState";
import PageHeader from "../components/ui/PageHeader";
import StatusPill from "../components/ui/StatusPill";
import { useServiceData } from "../hooks/useServiceData";
import { formatNumber } from "../lib/status";
import { getConnectors } from "../services/dashboardService";
import type { Connector } from "../types/dashboard";

const columns: Column<Connector>[] = [
  { key: "name", header: "Connector", render: (connector) => <strong>{connector.name}</strong> },
  { key: "tenant", header: "Tenant", render: (connector) => connector.tenant },
  { key: "status", header: "Status", render: (connector) => <StatusPill status={connector.status} /> },
  { key: "sync", header: "Last successful sync", render: (connector) => connector.lastSuccessfulSync },
  { key: "age", header: "Last sync age", render: (connector) => connector.lastSyncAge },
  { key: "progress", header: "Sync progress", render: (connector) => connector.syncProgress ?? "-" },
  { key: "error", header: "Last error", render: (connector) => connector.lastError },
  { key: "failures", header: "Failures", render: (connector) => connector.failureCount },
  { key: "items", header: "Items indexed", render: (connector) => formatNumber(connector.itemsIndexed) },
  { key: "enabled", header: "Enabled", render: (connector) => (connector.enabled ? "Enabled" : "Disabled") },
];

export default function ConnectorsPage() {
  const { data: connectors, error, isLoading } = useServiceData(getConnectors);

  if (isLoading) {
    return <LoadingState label="Loading connector health" />;
  }

  if (error || !connectors) {
    return <ErrorPanel message={error?.message ?? "Connector data is unavailable."} />;
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Modular ingestion"
        title="Connectors"
        description="Source connectors, sync freshness, and clear failure signals for the ingestion surface."
      />
      <DataTable columns={columns} rows={connectors} getRowKey={(connector) => connector.id} />
    </div>
  );
}
