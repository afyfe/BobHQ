import { useEffect, useState } from "react";
import DataTable, { type Column } from "../components/ui/DataTable";
import PageHeader from "../components/ui/PageHeader";
import StatusPill from "../components/ui/StatusPill";
import { getDiscoveryFindings } from "../services/dashboardService";
import type { DiscoveryFinding } from "../types/dashboard";

const columns: Column<DiscoveryFinding>[] = [
  { key: "finding", header: "Finding", render: (finding) => <strong>{finding.finding}</strong> },
  { key: "tenant", header: "Tenant", render: (finding) => finding.tenant },
  { key: "severity", header: "Severity", render: (finding) => <StatusPill status={finding.severity} /> },
  { key: "confidence", header: "Confidence", render: (finding) => `${Math.round(finding.confidence * 100)}%` },
  { key: "action", header: "Recommended next action", render: (finding) => finding.recommendedAction },
];

export default function DiscoveryPage() {
  const [findings, setFindings] = useState<DiscoveryFinding[]>([]);

  useEffect(() => {
    void getDiscoveryFindings().then(setFindings);
  }, []);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Discovery intelligence"
        title="Discovery"
        description="Future AskBob intelligence for finding hidden operational risk across systems, identities, content, and knowledge coverage."
      />
      <section className="discovery-hero">
        <div>
          <span>Signature capability</span>
          <h2>Surface what operators do not yet know to ask.</h2>
        </div>
        <p>
          Mock intelligence signals are grouped for triage now, ready to become real discovery workflows later.
        </p>
      </section>
      <DataTable columns={columns} rows={findings} getRowKey={(finding) => finding.id} />
    </div>
  );
}
