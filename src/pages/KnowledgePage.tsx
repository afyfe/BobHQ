import DataTable, { type Column } from "../components/ui/DataTable";
import PageHeader from "../components/ui/PageHeader";
import StatusPill from "../components/ui/StatusPill";
import { knowledgeSources, type KnowledgeSource } from "../data/mockDashboardData";
import { formatNumber } from "../lib/status";

const columns: Column<KnowledgeSource>[] = [
  { key: "source", header: "Knowledge source", render: (source) => <strong>{source.source}</strong> },
  { key: "tenant", header: "Tenant", render: (source) => source.tenant },
  { key: "status", header: "Status", render: (source) => <StatusPill status={source.status} /> },
  { key: "documents", header: "Documents", render: (source) => formatNumber(source.documents) },
  { key: "emails", header: "Emails", render: (source) => formatNumber(source.emails) },
  { key: "freshness", header: "Freshness", render: (source) => source.freshness },
];

export default function KnowledgePage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Knowledge index"
        title="Knowledge Index"
        description="Index composition and freshness across source systems before any backend wiring is introduced."
      />
      <DataTable columns={columns} rows={knowledgeSources} getRowKey={(source) => source.id} />
    </div>
  );
}
