import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Overview", to: "/overview", icon: "O" },
  { label: "Tenants", to: "/tenants", icon: "T" },
  { label: "Connectors", to: "/connectors", icon: "C" },
  { label: "Jobs", to: "/jobs", icon: "J" },
  { label: "Knowledge", to: "/knowledge", icon: "K" },
  { label: "Audit", to: "/audit", icon: "A" },
  { label: "Discovery", to: "/discovery", icon: "D" },
  { label: "Users", to: "/users", icon: "U" },
];

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand">
          <span className="brand__mark">B</span>
          <div>
            <strong>BobHQ</strong>
            <span>AskBob Control</span>
          </div>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <NavLink className="nav-link" to={item.to} key={item.to}>
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <span>MORSE</span>
          <strong>Modular cockpit for internal operations</strong>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div>
            <span className="topbar__label">Environment</span>
            <strong>Internal Preview</strong>
            <span className="topbar__updated">Last updated 3 mins ago</span>
          </div>
          <div className="topbar__status">
            <span className="live-dot" aria-hidden="true" />
            <span className="system-signal" aria-hidden="true" />
            Systems nominal
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
