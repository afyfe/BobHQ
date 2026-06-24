import { useState } from "react";
import DataTable, { type Column } from "../components/ui/DataTable";
import ErrorPanel from "../components/ui/ErrorPanel";
import LoadingState from "../components/ui/LoadingState";
import PageHeader from "../components/ui/PageHeader";
import StatusPill from "../components/ui/StatusPill";
import { useServiceData } from "../hooks/useServiceData";
import { formatNumber } from "../lib/status";
import { getTenants } from "../services/dashboardService";
import type { Tenant } from "../types/dashboard";

const columns: Column<Tenant>[] = [
  {
    key: "name",
    header: "Tenant",
    render: (tenant) => (
      <div className="table-primary">
        <strong>{tenant.name}</strong>
        <span>{tenant.id}</span>
      </div>
    ),
  },
  { key: "plan", header: "Plan", render: (tenant) => tenant.plan },
  { key: "status", header: "Status", render: (tenant) => <StatusPill status={tenant.status} /> },
  { key: "users", header: "Users", render: (tenant) => tenant.users },
  { key: "connectors", header: "Connectors", render: (tenant) => tenant.connectors },
  { key: "documents", header: "Documents", render: (tenant) => formatNumber(tenant.documentsIndexed) },
  { key: "created", header: "Created", render: (tenant) => tenant.createdAt ?? "-" },
];

export default function AdminTenantsPage() {
  const { data: tenants, error, isLoading, isRefreshing, reload } = useServiceData(getTenants);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const hasAuthContext = hasExternalAuthContext();

  if (isLoading) {
    return <LoadingState label="Loading tenant management" />;
  }

  if (error || !tenants) {
    return <ErrorPanel message={error?.message ?? "Tenant management data is unavailable."} />;
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Admin"
        title="Tenant management"
        description="Tenant records for the AskBob control plane, prepared for Cloudflare Access protection."
      />

      {!hasAuthContext ? (
        <div className="state-panel state-panel--warning">
          Cloudflare Access context not detected. Keep tenant creation disabled until hq.askbob.live is protected.
        </div>
      ) : null}

      <div className="toolbar">
        <span>{tenants.length} tenants</span>
        <div className="toolbar__actions">
          <button className="button" type="button" onClick={reload} disabled={isRefreshing}>
            {isRefreshing ? "Refreshing" : "Refresh"}
          </button>
          <button className="button" type="button" onClick={() => setCreateModalOpen(true)}>
            Create tenant
          </button>
        </div>
      </div>

      <DataTable columns={columns} rows={tenants} getRowKey={(tenant) => tenant.id} />

      {isCreateModalOpen ? <CreateTenantPlaceholderModal onClose={() => setCreateModalOpen(false)} /> : null}
    </div>
  );
}

function CreateTenantPlaceholderModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="create-tenant-title">
        <div className="modal__header">
          <div>
            <p className="page-header__eyebrow">Admin</p>
            <h2 id="create-tenant-title">Create tenant</h2>
          </div>
          <button className="button button--quiet" type="button" onClick={onClose} aria-label="Close">
            Close
          </button>
        </div>

        <div className="form-grid">
          <label className="field">
            <span>Tenant name</span>
            <input type="text" placeholder="Northwind Legal" disabled />
          </label>
          <label className="field">
            <span>Plan name</span>
            <input type="text" placeholder="Internal Preview" disabled />
          </label>
        </div>

        <div className="state-panel state-panel--warning">
          Creation stays paused in the shell until Cloudflare Access is confirmed for hq.askbob.live.
        </div>

        <div className="modal__actions">
          <button className="button button--quiet" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="button" type="button" disabled>
            Creation disabled
          </button>
        </div>
      </section>
    </div>
  );
}

function hasExternalAuthContext(): boolean {
  return window.location.hostname === "hq.askbob.live" || import.meta.env.VITE_ASKBOB_AUTH_CONTEXT === "cloudflare-access";
}
