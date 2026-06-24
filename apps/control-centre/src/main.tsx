import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import AdminTenantDetailsPage from "./pages/AdminTenantDetailsPage";
import AdminTenantsPage from "./pages/AdminTenantsPage";
import AuditPage from "./pages/AuditPage";
import ConnectorsPage from "./pages/ConnectorsPage";
import DiscoveryPage from "./pages/DiscoveryPage";
import JobsPage from "./pages/JobsPage";
import KnowledgePage from "./pages/KnowledgePage";
import OverviewPage from "./pages/OverviewPage";
import TenantsPage from "./pages/TenantsPage";
import UsersPage from "./pages/UsersPage";
import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/overview" replace /> },
      { path: "overview", element: <OverviewPage /> },
      { path: "admin", element: <AdminTenantsPage /> },
      { path: "admin/tenants/:tenantId", element: <AdminTenantDetailsPage /> },
      { path: "tenants", element: <TenantsPage /> },
      { path: "connectors", element: <ConnectorsPage /> },
      { path: "jobs", element: <JobsPage /> },
      { path: "knowledge", element: <KnowledgePage /> },
      { path: "audit", element: <AuditPage /> },
      { path: "discovery", element: <DiscoveryPage /> },
      { path: "users", element: <UsersPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
