import { useEffect, useState } from "react";
import DataTable, { type Column } from "../components/ui/DataTable";
import MetricCard from "../components/ui/MetricCard";
import PageHeader from "../components/ui/PageHeader";
import StatusPill from "../components/ui/StatusPill";
import { getJobs } from "../services/dashboardService";
import type { Job } from "../types/dashboard";

const columns: Column<Job>[] = [
  { key: "id", header: "Job", render: (job) => <strong>{job.id}</strong> },
  { key: "type", header: "Type", render: (job) => job.type },
  { key: "tenant", header: "Tenant", render: (job) => job.tenant },
  { key: "status", header: "Status", render: (job) => <StatusPill status={job.status} /> },
  { key: "retry", header: "Retries", render: (job) => job.retryCount },
  { key: "created", header: "Created", render: (job) => job.createdAt },
  { key: "completed", header: "Completed", render: (job) => job.completedAt },
  { key: "failure", header: "Failure", render: (job) => job.failureMessage || "-" },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    void getJobs().then(setJobs);
  }, []);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Processing queue"
        title="Jobs"
        description="Queue state, retry posture, completion timing, and failures that need operator attention."
      />
      <section className="metrics-grid metrics-grid--compact">
        <MetricCard label="Queued" value={jobs.filter((job) => job.status === "Queued").length} delta="awaiting workers" />
        <MetricCard label="Running" value={jobs.filter((job) => job.status === "Running").length} delta="in flight" />
        <MetricCard label="Completed" value={jobs.filter((job) => job.status === "Completed").length} delta="latest batch" />
        <MetricCard label="Failed" value={jobs.filter((job) => job.status === "Failed").length} delta="needs triage" />
      </section>
      <DataTable columns={columns} rows={jobs} getRowKey={(job) => job.id} />
    </div>
  );
}
