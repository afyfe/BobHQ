import DataTable, { type Column } from "../components/ui/DataTable";
import PageHeader from "../components/ui/PageHeader";
import StatusPill from "../components/ui/StatusPill";
import { auditRecords, type AuditRecord } from "../data/mockDashboardData";

const columns: Column<AuditRecord>[] = [
  { key: "question", header: "Question / action", render: (record) => <strong>{record.question}</strong> },
  { key: "tenant", header: "Tenant", render: (record) => record.tenant },
  { key: "user", header: "User", render: (record) => record.user },
  { key: "confidence", header: "Confidence", render: (record) => `${Math.round(record.confidence * 100)}%` },
  { key: "sources", header: "Sources", render: (record) => record.sourceCount },
  { key: "timestamp", header: "Timestamp", render: (record) => record.timestamp },
  { key: "status", header: "Status", render: (record) => <StatusPill status={record.status} /> },
];

export default function AuditPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Explainability model"
        title="Audit / Explainability"
        description="Future audit trail for answers, actions, confidence, source grounding, and operator review."
      />
      <DataTable columns={columns} rows={auditRecords} getRowKey={(record) => record.id} />
    </div>
  );
}
