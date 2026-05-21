import { useEffect, useState } from "react";
import DataTable, { type Column } from "../components/ui/DataTable";
import PageHeader from "../components/ui/PageHeader";
import StatusPill from "../components/ui/StatusPill";
import { formatNumber } from "../lib/status";
import { getConnectors } from "../services/dashboardService";
import type { Connector } from "../types/dashboard";

const columns: Column<Connector>[] = [
  { key: "name", header: "Connector", render: (connector) => <strong>{connector.name}</strong> },
  { key: "tenant", header: "Tenant", render: (connector) => connector.tenant },
  { key: "status", header: "Status", render: (connector) => <StatusPill status={connector.status} /> },
  { key: "sync", header: "Last successful sync", render: (connector) => connector.lastSuccessfulSync },
  { key: "error", header: "Last error", render: (connector) => connector.lastError },
  { key: "items", header: "Items indexed", render: (connector) => formatNumber(connector.itemsIndexed) },
  { key: "enabled", header: "Enabled", render: (connector) => (connector.enabled ? "Enabled" : "Disabled") },
];

export default function ConnectorsPage() {
  const [connectors, setConnectors] = useState<Connector[]>([]);

  useEffect(() => {
    void getConnectors().then(setConnectors);
  }, []);

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
