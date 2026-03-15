import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  Settings,
  LogOut,
  Plus,
  Search,
  Bell,
  ChevronRight,
  MoreHorizontal,
  ScrollText,
  ArrowUpRight,
  Users,
  Menu,
  Eye,
  Send
} from "lucide-react";
import { sideBarProps } from "@/app/types";

const Sidebar:React.FC<sideBarProps> = ({ sidebarOpen, setSidebarOpen, activeNav, setActiveNav, STATS , showWizard , setShowWizard , search , setSearch , filtered, STATUS_CONFIG, TYPE_ICONS}) => {
  return (
    <div className="db-layout">
      {/* ─── SIDEBAR ─── */}
      <aside className={`db-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="db-sidebar-inner">
          <div className="db-wordmark">LEEZIGN</div>

          <nav className="db-nav">
            <span className="db-nav-section">Main</span>
            {[
              {
                key: "dashboard",
                label: "Dashboard",
                icon: <LayoutDashboard size={15} strokeWidth={1.5} />,
                href: "/dashboard",
              },
              {
                key: "leases",
                label: "All Leases",
                icon: <FileText size={15} strokeWidth={1.5} />,
                href: "/leases",
              },
              {
                key: "templates",
                label: "Templates",
                icon: <ScrollText size={15} strokeWidth={1.5} />,
                href: "/templates",
              },
              {
                key: "drafts",
                label: "Drafts",
                icon: <PenSquare size={15} strokeWidth={1.5} />,
                href: "/drafts",
              },
            ].map((n) => (
              <Link
                key={n.key}
                className={`db-nav-item ${activeNav === n.key ? "active" : ""}`}
                onClick={() => {
                  setActiveNav(n.key);
                  setSidebarOpen(false);
                }}
                href={n.href}
              >
                {n.icon} {n.label}
              </Link>
            ))}

            <span className="db-nav-section">Account</span>
            {[
              {
                key: "tenants",
                label: "Tenants",
                icon: <Users size={15} strokeWidth={1.5} />,
              },
              {
                key: "settings",
                label: "Settings",
                icon: <Settings size={15} strokeWidth={1.5} />,
              },
            ].map((n) => (
              <button
                key={n.key}
                className={`db-nav-item ${activeNav === n.key ? "active" : ""}`}
                onClick={() => {
                  setActiveNav(n.key);
                  setSidebarOpen(false);
                }}
              >
                {n.icon} {n.label}
              </button>
            ))}
          </nav>

          <div className="db-sidebar-footer">
            <div className="db-user-row">
              <div className="db-avatar">U</div>
              <div>
                <div className="db-user-name">Umar</div>
                <div className="db-user-email">umar@leaseflow.io</div>
              </div>
            </div>
            <Link
              href="/auth/login"
              className="db-nav-item"
              style={{ marginTop: 4 }}
            >
              <LogOut size={15} strokeWidth={1.5} /> Sign Out
            </Link>
          </div>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main className="db-main">
        {/* Topbar */}
        <div className="db-topbar">
          <div className="db-topbar-left">
            <button
              className="db-mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} color="var(--ink)" strokeWidth={1.5} />
            </button>
            <h1 className="db-page-title">Dashboard</h1>
            <span className="db-page-badge">March 2025</span>
          </div>
          <div className="db-topbar-right">
            <div className="db-search-wrap">
              <Search size={13} color="var(--muted)" strokeWidth={1.5} />
              <input
                className="db-search-input"
                placeholder="Search leases..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="db-icon-btn">
              <Bell size={15} strokeWidth={1.5} />
              <div className="db-notif-dot" />
            </button>
            <button className="db-new-btn" onClick={() => setShowWizard(true)}>
              <Plus size={14} strokeWidth={2} /> New Lease
            </button>
          </div>
        </div>

        <div className="db-content">
          {/* Stats */}
          <div className="db-stats-grid">
            {STATS.map((s:any, i:number) => (
              <div
                key={i}
                className={`db-stat-card ${s.accent ? "accent" : ""}`}
              >
                <div className="db-stat-top">
                  <div className="db-stat-icon">{s.icon}</div>
                  <span className="db-stat-delta">{s.delta}</span>
                </div>
                <div className="db-stat-value">{s.value}</div>
                <div className="db-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div
            className="db-section-header"
            style={{
              animation: "slideUp .5s cubic-bezier(.77,0,.18,1) .15s both",
            }}
          >
            <span className="db-section-title">Quick Actions</span>
          </div>
          <div className="db-quick-row">
            {[
              {
                icon: <Plus size={16} strokeWidth={1.5} />,
                title: "New Lease",
                desc: "Start from a template",
                action: () => setShowWizard(true),
              },
              {
                icon: <FileText size={16} strokeWidth={1.5} />,
                title: "View Templates",
                desc: "Browse all 4 types",
                action: () => {},
              },
              {
                icon: <Send size={16} strokeWidth={1.5} />,
                title: "Pending Sends",
                desc: "6 awaiting signature",
                action: () => {},
              },
              {
                icon: <ArrowUpRight size={16} strokeWidth={1.5} />,
                title: "Analytics",
                desc: "View lease insights",
                action: () => {},
              },
            ].map((q, i) => (
              <div key={i} className="db-quick-card" onClick={q.action}>
                <div className="db-quick-icon">{q.icon}</div>
                <div className="db-quick-title">{q.title}</div>
                <div className="db-quick-desc">{q.desc}</div>
              </div>
            ))}
          </div>

          {/* Leases table */}
          <div className="db-section-header">
            <span className="db-section-title">Recent Leases</span>
            <a href="#" className="db-view-all">
              View All <ChevronRight size={11} strokeWidth={2} />
            </a>
          </div>

          <div className="db-table-wrap">
            {filtered.length > 0 ? (
              <table className="db-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tenant</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((l:any) => {
                    const sc = STATUS_CONFIG[l.status];
                    return (
                      <tr key={l.id}>
                        <td>
                          <span className="db-lease-id">{l.id}</span>
                        </td>
                        <td>
                          <div className="db-tenant-name">{l.tenant}</div>
                          <div className="db-tenant-prop">{l.property}</div>
                        </td>
                        <td>
                          <span className="db-type-badge">
                            {TYPE_ICONS[l.type]} {l.type}
                          </span>
                        </td>
                        <td>
                          <span
                            className="db-status-badge"
                            style={{ color: sc.color, background: sc.bg }}
                          >
                            {sc.icon} {l.status}
                          </span>
                        </td>
                        <td
                          style={{
                            fontSize: 12,
                            color: "var(--muted)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {l.date}
                        </td>
                        <td>
                          <span className="db-amount">{l.amount}</span>
                        </td>
                        <td>
                          <button className="db-action-btn" title="View">
                            <Eye size={13} strokeWidth={1.5} />
                          </button>
                          <button className="db-action-btn" title="More">
                            <MoreHorizontal size={13} strokeWidth={1.5} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="db-empty">
                <div className="db-empty-icon">
                  <Search size={22} strokeWidth={1.5} />
                </div>
                <p style={{ fontSize: 13, fontWeight: 500 }}>
                  No leases match "{search}"
                </p>
                <button
                  onClick={() => setSearch("")}
                  style={{
                    fontSize: 11,
                    color: "var(--accent)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                  }}
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sidebar;
