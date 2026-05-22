import DataTable, { type Column } from "../components/ui/DataTable";
import ErrorPanel from "../components/ui/ErrorPanel";
import LoadingState from "../components/ui/LoadingState";
import PageHeader from "../components/ui/PageHeader";
import StatusPill from "../components/ui/StatusPill";
import { useServiceData } from "../hooks/useServiceData";
import { getAuditEntries } from "../services/dashboardService";
import type { AuditEntry } from "../types/dashboard";

const columns: Column<AuditEntry>[] = [
  { key: "question", header: "Question / action", render: (record) => <strong>{record.question}</strong> },
  { key: "tenant", header: "Tenant", render: (record) => record.tenant },
  { key: "user", header: "User", render: (record) => record.user },
  { key: "confidence", header: "Confidence", render: (record) => `${Math.round(record.confidence * 100)}%` },
  { key: "sources", header: "Sources", render: (record) => record.sourceCount },
  { key: "explainability", header: "Explainability", render: (record) => <StatusPill status={record.explainabilityStatus} /> },
  { key: "timestamp", header: "Timestamp", render: (record) => record.timestamp },
  { key: "status", header: "Status", render: (record) => <StatusPill status={record.status} /> },
];

export default function AuditPage() {
  const { data: auditEntries, error, isLoading } = useServiceData(getAuditEntries);

  if (isLoading) {
    return <LoadingState label="Loading explainability trail" />;
  }

  if (error || !auditEntries) {
    return <ErrorPanel message={error?.message ?? "Audit data is unavailable."} />;
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Explainability model"
        title="Audit / Explainability"
        description="Future audit trail for answers, actions, confidence, source grounding, and operator review."
      />
      <DataTable columns={columns} rows={auditEntries} getRowKey={(record) => record.id} />
    </div>
  );
}
