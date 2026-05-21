import { useEffect, useState } from "react";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import MetricCard from "../components/ui/MetricCard";
import PageHeader from "../components/ui/PageHeader";
import StatusPill from "../components/ui/StatusPill";
import { formatNumber } from "../lib/status";
import { getDashboardOverview } from "../services/dashboardService";
import type { DashboardOverview } from "../types/dashboard";

export default function OverviewPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);

  useEffect(() => {
    void getDashboardOverview().then(setOverview);
  }, []);

  if (!overview) {
    return null;
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Operational overview"
        title="AskBob control centre"
        description="A single cockpit for tenant health, ingestion flow, index freshness, and explainable AI activity."
      />

      <section className="metrics-grid">
        {overview.metrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} value={metric.value} delta={metric.delta} />
        ))}
      </section>

      <div className="split-grid">
        <section className="panel">
          <div className="panel__header">
            <div>
              <h2>Tenant Pulse</h2>
              <p>Active customers and ingestion footprint.</p>
            </div>
          </div>
          <div className="tenant-pulse">
            {overview.tenants.map((tenant) => (
              <article key={tenant.id} className="tenant-row">
                <div>
                  <h3>{tenant.name}</h3>
                  <p>{tenant.plan} / {tenant.users} users / {tenant.connectors} connectors</p>
                </div>
                <div>
                  <StatusPill status={tenant.status} />
                  <span>{formatNumber(tenant.documentsIndexed)} indexed</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel__header">
            <div>
              <h2>Connector Health</h2>
              <p>Current ingestion lane state.</p>
            </div>
          </div>
          <div className="connector-health">
            {overview.connectors.slice(0, 4).map((connector) => (
              <article key={connector.id}>
                <div>
                  <h3>{connector.name}</h3>
                  <p>{connector.tenant}</p>
                </div>
                <StatusPill status={connector.status} />
              </article>
            ))}
          </div>
        </section>
      </div>

      <ActivityFeed items={overview.recentActivity} />
    </div>
  );
}
