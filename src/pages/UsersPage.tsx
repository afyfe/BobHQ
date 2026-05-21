import DataTable, { type Column } from "../components/ui/DataTable";
import PageHeader from "../components/ui/PageHeader";
import StatusPill from "../components/ui/StatusPill";
import { users, type User } from "../data/mockDashboardData";

const columns: Column<User>[] = [
  { key: "name", header: "User", render: (user) => <strong>{user.name}</strong> },
  { key: "email", header: "Email", render: (user) => user.email },
  { key: "role", header: "Role", render: (user) => user.role },
  { key: "tenant", header: "Tenant scope", render: (user) => user.tenant },
  { key: "status", header: "Status", render: (user) => <StatusPill status={user.status} /> },
  { key: "lastSeen", header: "Last seen", render: (user) => user.lastSeen },
];

export default function UsersPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Role-based access"
        title="Users"
        description="Human operators and tenant-scoped users, kept deliberately simple for the control-centre foundation."
      />
      <DataTable columns={columns} rows={users} getRowKey={(user) => user.id} />
    </div>
  );
}
