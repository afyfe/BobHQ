import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import DataTable, { type Column } from "../components/ui/DataTable";
import ErrorPanel from "../components/ui/ErrorPanel";
import LoadingState from "../components/ui/LoadingState";
import PageHeader from "../components/ui/PageHeader";
import StatusPill from "../components/ui/StatusPill";
import { useServiceData } from "../hooks/useServiceData";
import { formatNumber } from "../lib/status";
import { getTenants } from "../services/dashboardService";
import { createTenant } from "../services/tenantService";
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
  const navigate = useNavigate();
  const { data: tenants, error, isLoading, isRefreshing, reload } = useServiceData(getTenants);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const canCreateTenants = isProtectedAdminHost();

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

      {!canCreateTenants ? (
        <div className="state-panel state-panel--warning">
          Tenant creation is enabled only on hq.askbob.live behind Cloudflare Access.
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

      <DataTable
        columns={columns}
        rows={tenants}
        getRowKey={(tenant) => tenant.id}
        onRowClick={(tenant) => navigate(`/admin/tenants/${tenant.id}`)}
      />

      {isCreateModalOpen ? (
        <CreateTenantModal
          canCreateTenants={canCreateTenants}
          onClose={() => setCreateModalOpen(false)}
          onCreated={() => {
            setCreateModalOpen(false);
            reload();
          }}
        />
      ) : null}
    </div>
  );
}

type CreateTenantModalProps = {
  canCreateTenants: boolean;
  onClose: () => void;
  onCreated: () => void;
};

function CreateTenantModal({ canCreateTenants, onClose, onCreated }: CreateTenantModalProps) {
  const [name, setName] = useState("");
  const [planName, setPlanName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canCreateTenants || isSubmitting) {
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      await createTenant({
        name: name.trim(),
        planName: planName.trim() || undefined,
      });
      onCreated();
    } catch (error) {
      setErrorMessage(getTenantErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <form className="modal" role="dialog" aria-modal="true" aria-labelledby="create-tenant-title" onSubmit={handleSubmit}>
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
            <input
              type="text"
              placeholder="Northwind Legal"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={!canCreateTenants || isSubmitting}
              required
            />
          </label>
          <label className="field">
            <span>Plan name</span>
            <input
              type="text"
              placeholder="Internal Preview"
              value={planName}
              onChange={(event) => setPlanName(event.target.value)}
              disabled={!canCreateTenants || isSubmitting}
            />
          </label>
        </div>

        {!canCreateTenants ? (
          <div className="state-panel state-panel--warning">
            Tenant creation is available on hq.askbob.live after Cloudflare Access.
          </div>
        ) : null}

        {errorMessage ? (
          <div className="state-panel state-panel--error">
            <p>{errorMessage}</p>
          </div>
        ) : null}

        <div className="modal__actions">
          <button className="button button--quiet" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="button" type="submit" disabled={!canCreateTenants || isSubmitting}>
            {isSubmitting ? "Creating" : "Create tenant"}
          </button>
        </div>
      </form>
    </div>
  );
}

function isProtectedAdminHost(): boolean {
  return window.location.hostname === "hq.askbob.live";
}

function getTenantErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Tenant could not be created.";
  }

  try {
    const payload = JSON.parse(error.message) as { message?: string };
    return payload.message ?? error.message;
  } catch {
    return error.message;
  }
}
