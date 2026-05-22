import DataTable, { type Column } from "../components/ui/DataTable";
import ErrorPanel from "../components/ui/ErrorPanel";
import LoadingState from "../components/ui/LoadingState";
import PageHeader from "../components/ui/PageHeader";
import StatusPill from "../components/ui/StatusPill";
import { useServiceData } from "../hooks/useServiceData";
import { formatNumber } from "../lib/status";
import { getKnowledgeItems } from "../services/dashboardService";
import type { KnowledgeItem } from "../types/dashboard";

const columns: Column<KnowledgeItem>[] = [
  { key: "source", header: "Knowledge source", render: (source) => <strong>{source.source}</strong> },
  { key: "tenant", header: "Tenant", render: (source) => source.tenant },
  { key: "status", header: "Status", render: (source) => <StatusPill status={source.status} /> },
  { key: "documents", header: "Documents", render: (source) => formatNumber(source.documents) },
  { key: "emails", header: "Emails", render: (source) => formatNumber(source.emails) },
  { key: "freshness", header: "Freshness", render: (source) => source.freshness },
];

export default function KnowledgePage() {
  const { data: knowledgeItems, error, isLoading } = useServiceData(getKnowledgeItems);

  if (isLoading) {
    return <LoadingState label="Loading knowledge index" />;
  }

  if (error || !knowledgeItems) {
    return <ErrorPanel message={error?.message ?? "Knowledge data is unavailable."} />;
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Knowledge index"
        title="Knowledge Index"
        description="Index composition and freshness across source systems before any backend wiring is introduced."
      />
      <DataTable columns={columns} rows={knowledgeItems} getRowKey={(source) => source.id} />
    </div>
  );
}
