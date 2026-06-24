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
  {
    key: "name",
    header: "Connector",
    render: (connector) => (
      <div className="table-primary">
        <strong>{connector.name}</strong>
        <span>{connector.tenant}</span>
      </div>
    ),
  },
  { key: "type", header: "Type", render: (connector) => connector.type },
  { key: "status", header: "Status", render: (connector) => <StatusPill status={connector.status} /> },
  {
    key: "lastRun",
    header: "Last run",
    render: (connector) => (
      <div className="table-primary">
        <span>{connector.lastRun}</span>
        <small>{connector.lastSyncAge}</small>
      </div>
    ),
  },
  { key: "items", header: "Items processed", render: (connector) => formatNumber(connector.itemsProcessed) },
  {
    key: "signals",
    header: "Warnings / Errors",
    render: (connector) => `${connector.warningCount} / ${connector.errorCount}`,
  },
];

export default function ConnectorsPage() {
  const { data: connectors, error, isLoading, isRefreshing, reload } = useServiceData(getConnectors);

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
      <div className="toolbar">
        <span>{connectors.length} live connectors</span>
        <button className="button" type="button" onClick={reload} disabled={isRefreshing}>
          {isRefreshing ? "Refreshing" : "Refresh"}
        </button>
      </div>
      {connectors.length > 0 ? (
        <DataTable
          columns={columns}
          rows={connectors}
          getRowKey={(connector) => connector.id}
          getRowClassName={(connector) => (connector.status === "Degraded" ? "table-row--degraded" : undefined)}
        />
      ) : (
        <div className="state-panel">No connector telemetry has been recorded yet.</div>
      )}
    </div>
  );
}
