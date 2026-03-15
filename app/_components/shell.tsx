"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, ScrollText, PenSquare,
  Users, Settings, LogOut, Menu, X, ChevronRight,
} from "lucide-react";

const NAV = [
  { key: "dashboard", label: "Dashboard",  href: "/dashboard",           icon: <LayoutDashboard size={15} strokeWidth={1.5} /> },
  { key: "leases",    label: "All Leases", href: "/leases",    icon: <FileText size={15} strokeWidth={1.5} /> },
  { key: "templates", label: "Templates",  href: "/templates", icon: <ScrollText size={15} strokeWidth={1.5} /> },
  { key: "drafts",    label: "Drafts",     href: "/drafts",    icon: <PenSquare size={15} strokeWidth={1.5} /> },
  { key: "tenants",   label: "Tenants",    href: "/tenants",   icon: <Users size={15} strokeWidth={1.5} /> },
  { key: "settings",  label: "Settings",   href: "/settings",  icon: <Settings size={15} strokeWidth={1.5} /> },
];

export const SHELL_STYLES = `
  /* ── LAYOUT ── */
  .shell-layout {
    min-height:100svh;
    background:var(--paper);
    display:grid;
    grid-template-columns:240px 1fr;
  }
  @media(max-width:900px){ .shell-layout{grid-template-columns:1fr;} }

  /* ── SIDEBAR ── */
  .shell-sidebar {
    background:var(--ink);
    display:flex; flex-direction:column;
    position:relative; overflow:hidden;
  }
  .shell-sidebar::before {
    content:''; position:absolute; inset:0;
    background-image:
      linear-gradient(rgba(245,240,232,.03) 1px,transparent 1px),
      linear-gradient(90deg,rgba(245,240,232,.03) 1px,transparent 1px);
    background-size:40px 40px; pointer-events:none;
  }
  @media(max-width:900px){
    .shell-sidebar{
      position:fixed; inset:0; right:auto;
      width:260px; z-index:300;
      transform:translateX(-100%);
      transition:transform .35s cubic-bezier(.77,0,.18,1);
    }
    .shell-sidebar.open{ transform:translateX(0); }
  }
  .shell-sidebar-inner{ position:relative;z-index:1;display:flex;flex-direction:column;height:100%; }

  .shell-wordmark{
    padding:28px 24px 24px;
    font-family:var(--font-display);
    font-size:22px; letter-spacing:.1em; color:var(--paper);
    border-bottom:1px solid rgba(245,240,232,.06); flex-shrink:0;
  }

  .shell-nav{ padding:16px 12px; flex:1; display:flex; flex-direction:column; gap:2px; overflow-y:auto; }
  .shell-nav-section{
    font-size:9px; font-weight:700; letter-spacing:.2em; text-transform:uppercase;
    color:rgba(245,240,232,.25); padding:16px 12px 8px;
  }
  .shell-nav-item{
    display:flex; align-items:center; gap:12px;
    padding:11px 12px;
    font-size:12px; font-weight:500; letter-spacing:.02em;
    color:rgba(245,240,232,.45);
    background:none; border:none; cursor:pointer;
    text-decoration:none; width:100%;
    transition:color .2s, background .2s;
    position:relative;
  }
  .shell-nav-item:hover{ color:rgba(245,240,232,.85); background:rgba(245,240,232,.04); }
  .shell-nav-item.active{ color:var(--paper); background:rgba(245,240,232,.07); }
  .shell-nav-item.active::before{
    content:''; position:absolute; left:0; top:0; bottom:0;
    width:3px; background:var(--accent);
  }

  .shell-sidebar-footer{
    padding:16px 12px 24px;
    border-top:1px solid rgba(245,240,232,.06);
  }
  .shell-user-row{ display:flex; align-items:center; gap:12px; padding:10px 12px; }
  .shell-avatar{
    width:36px; height:36px; flex-shrink:0;
    background:color-mix(in srgb,var(--accent) 20%,transparent);
    border:1px solid rgba(245,240,232,.12);
    display:flex; align-items:center; justify-content:center;
    font-family:var(--font-display); font-size:16px; color:var(--paper);
  }
  .shell-user-name{ font-size:12px; font-weight:600; color:var(--paper); }
  .shell-user-email{ font-size:10px; color:rgba(245,240,232,.35); margin-top:2px; }

  /* ── MAIN ── */
  .shell-main{ display:flex; flex-direction:column; min-height:100svh; overflow:hidden; }

  .shell-topbar{
    display:flex; align-items:center; justify-content:space-between;
    padding:20px clamp(20px,3vw,36px);
    border-bottom:1px solid color-mix(in srgb,var(--ink) 8%,transparent);
    background:var(--paper);
    position:sticky; top:0; z-index:10; flex-shrink:0;
  }
  .shell-topbar-left{ display:flex; align-items:center; gap:14px; }
  .shell-mobile-btn{
    display:none; background:none; border:none; cursor:pointer; padding:4px;
  }
  @media(max-width:900px){ .shell-mobile-btn{ display:flex; align-items:center; } }

  .shell-page-title{
    font-family:var(--font-display);
    font-size:clamp(18px,2.5vw,26px); letter-spacing:.04em; color:var(--ink);
  }
  .shell-breadcrumb{
    display:flex; align-items:center; gap:6px;
    font-size:10px; font-weight:600; letter-spacing:.1em; text-transform:uppercase;
    color:var(--muted);
  }

  .shell-topbar-right{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; justify-content:flex-end; }

  .shell-content{ padding:clamp(20px,3vw,36px); overflow-y:auto; flex:1; }

  .shell-overlay{
    display:none; position:fixed; inset:0;
    background:rgba(10,10,10,.5); z-index:299;
  }
  @media(max-width:900px){ .shell-overlay.show{ display:block; } }

  /* ── SHARED COMPONENTS ── */
  .pg-btn{
    display:inline-flex; align-items:center; justify-content:center; gap:8px;
    padding:11px 22px;
    background:var(--ink); color:var(--paper);
    border:none; font-family:var(--font-body);
    font-size:11px; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
    cursor:pointer; position:relative; overflow:hidden;
    transition:box-shadow .2s; white-space:nowrap;
    text-decoration:none;
  }
  .pg-btn::before{
    content:''; position:absolute; inset:0;
    background:var(--accent);
    transform:translateX(-101%);
    transition:transform .4s cubic-bezier(.77,0,.18,1);
  }
  .pg-btn:hover::before{ transform:translateX(0); }
  .pg-btn:hover{ box-shadow:4px 4px 0 color-mix(in srgb,var(--ink) 18%,transparent); }
  .pg-btn > *{ position:relative; z-index:1; }
  .pg-btn.ghost{
    background:transparent; color:var(--ink);
    border:1.5px solid color-mix(in srgb,var(--ink) 20%,transparent);
  }
  .pg-btn.ghost::before{ background:var(--ink); }
  .pg-btn.ghost:hover{ color:var(--paper); }
  .pg-btn.danger{ background:var(--accent); }
  .pg-btn.danger::before{ background:color-mix(in srgb,var(--accent) 70%,#000); }

  .pg-badge{
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 10px;
    font-size:9px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
    white-space:nowrap;
  }

  .pg-search{
    display:flex; align-items:center; gap:10px;
    padding:10px 16px;
    background:var(--cream);
    border:1px solid color-mix(in srgb,var(--ink) 10%,transparent);
    transition:border-color .2s, box-shadow .2s;
  }
  .pg-search:focus-within{
    border-color:var(--ink);
    box-shadow:3px 3px 0 var(--accent);
  }
  .pg-search input{
    background:none; border:none; outline:none;
    font-family:var(--font-body); font-size:12px; color:var(--ink);
    width:clamp(120px,18vw,240px);
  }
  .pg-search input::placeholder{ color:var(--muted); }

  .pg-select{
    height:40px; padding:0 12px;
    background:var(--cream);
    border:1px solid color-mix(in srgb,var(--ink) 10%,transparent);
    font-family:var(--font-body); font-size:12px; color:var(--ink);
    outline:none; appearance:none; cursor:pointer;
    transition:border-color .2s;
    min-width:120px;
  }
  .pg-select:focus{ border-color:var(--ink); }

  /* table */
  .pg-table-wrap{
    border:1px solid color-mix(in srgb,var(--ink) 8%,transparent);
    overflow:hidden; overflow-x:auto;
  }
  .pg-table{ width:100%; border-collapse:collapse; min-width:580px; }
  .pg-table th{
    padding:11px 18px;
    font-size:9px; font-weight:700; letter-spacing:.18em; text-transform:uppercase;
    color:var(--muted); background:var(--cream);
    border-bottom:1px solid color-mix(in srgb,var(--ink) 8%,transparent);
    text-align:left; white-space:nowrap;
  }
  .pg-table td{
    padding:14px 18px; font-size:13px; color:var(--ink);
    border-bottom:1px solid color-mix(in srgb,var(--ink) 5%,transparent);
    vertical-align:middle;
  }
  .pg-table tr:last-child td{ border-bottom:none; }
  .pg-table tr:hover td{ background:color-mix(in srgb,var(--ink) 2%,transparent); }

  /* card grid */
  .pg-card-grid{
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
    gap:16px;
  }

  .pg-card{
    background:var(--cream);
    border:1px solid color-mix(in srgb,var(--ink) 8%,transparent);
    padding:24px;
    position:relative; overflow:hidden;
    transition:transform .25s, box-shadow .25s;
  }
  .pg-card:hover{
    transform:translateY(-3px);
    box-shadow:5px 5px 0 color-mix(in srgb,var(--ink) 10%,transparent);
  }

  /* action icon btn */
  .pg-icon-btn{
    width:30px; height:30px;
    background:none;
    border:1px solid color-mix(in srgb,var(--ink) 12%,transparent);
    display:inline-flex; align-items:center; justify-content:center;
    cursor:pointer; color:var(--muted);
    transition:background .2s, color .2s, border-color .2s;
  }
  .pg-icon-btn:hover{ background:var(--ink); color:var(--paper); border-color:var(--ink); }

  /* empty state */
  .pg-empty{
    padding:80px 24px;
    display:flex; flex-direction:column; align-items:center; gap:16px;
    text-align:center;
  }
  .pg-empty-icon{
    width:64px; height:64px;
    border:1px solid color-mix(in srgb,var(--ink) 12%,transparent);
    display:flex; align-items:center; justify-content:center;
    color:var(--muted);
  }
  .pg-empty-title{ font-family:var(--font-display); font-size:22px; letter-spacing:.04em; color:var(--ink); }
  .pg-empty-sub{ font-size:13px; color:var(--muted); max-width:280px; line-height:1.6; }

  /* section header */
  .pg-section-header{
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:18px; flex-wrap:wrap; gap:12px;
  }
  .pg-section-title{
    font-family:var(--font-display);
    font-size:clamp(16px,2vw,22px); letter-spacing:.04em; color:var(--ink);
  }

  /* filter bar */
  .pg-filter-bar{
    display:flex; align-items:center; gap:10px;
    flex-wrap:wrap; margin-bottom:20px;
  }

  /* tab strip */
  .pg-tabs{ display:flex; gap:0; border-bottom:1px solid color-mix(in srgb,var(--ink) 10%,transparent); margin-bottom:24px; }
  .pg-tab{
    padding:12px 20px;
    font-size:11px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
    color:var(--muted); background:none; border:none; cursor:pointer;
    border-bottom:2px solid transparent; transition:color .2s, border-color .2s;
    white-space:nowrap;
  }
  .pg-tab.active{ color:var(--ink); border-bottom-color:var(--accent); }
  .pg-tab:hover{ color:var(--ink); }

  /* page animations */
  @keyframes pgSlideUp{
    from{ opacity:0; transform:translateY(18px); }
    to  { opacity:1; transform:translateY(0); }
  }
  .pg-a1{ animation:pgSlideUp .5s cubic-bezier(.77,0,.18,1) .05s both; }
  .pg-a2{ animation:pgSlideUp .5s cubic-bezier(.77,0,.18,1) .15s both; }
  .pg-a3{ animation:pgSlideUp .5s cubic-bezier(.77,0,.18,1) .25s both; }
  .pg-a4{ animation:pgSlideUp .5s cubic-bezier(.77,0,.18,1) .35s both; }
`;

interface ShellProps {
  children: React.ReactNode;
  title: string;
  breadcrumb?: string;
  topbarRight?: React.ReactNode;
}

export function Shell({ children, title, breadcrumb, topbarRight }: ShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <style>{SHELL_STYLES}</style>

      <div className="shell-overlay show" style={{ display: sidebarOpen ? undefined : "none" }}
        onClick={() => setSidebarOpen(false)} />

      <div className="shell-layout">
        {/* Sidebar */}
        <aside className={`shell-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="shell-sidebar-inner">
            <div className="shell-wordmark">LEEZIGN</div>
            <nav className="shell-nav">
              <span className="shell-nav-section">Main</span>
              {NAV.slice(0, 4).map(n => (
                <Link key={n.key} href={n.href}
                  className={`shell-nav-item ${pathname === n.href ? "active" : ""}`}
                  onClick={() => setSidebarOpen(false)}>
                  {n.icon} {n.label}
                </Link>
              ))}
              <span className="shell-nav-section">Account</span>
              {NAV.slice(4).map(n => (
                <Link key={n.key} href={n.href}
                  className={`shell-nav-item ${pathname === n.href ? "active" : ""}`}
                  onClick={() => setSidebarOpen(false)}>
                  {n.icon} {n.label}
                </Link>
              ))}
            </nav>
            <div className="shell-sidebar-footer">
              <div className="shell-user-row">
                <div className="shell-avatar">U</div>
                <div>
                  <div className="shell-user-name">Umar</div>
                  <div className="shell-user-email">umar@leaseflow.io</div>
                </div>
              </div>
              <Link href="/auth/login" className="shell-nav-item" style={{ marginTop: 4 }}>
                <LogOut size={15} strokeWidth={1.5} /> Sign Out
              </Link>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="shell-main">
          <div className="shell-topbar">
            <div className="shell-topbar-left">
              <button className="shell-mobile-btn" onClick={() => setSidebarOpen(true)}>
                <Menu size={20} color="var(--ink)" strokeWidth={1.5} />
              </button>
              <div>
                {breadcrumb && (
                  <div className="shell-breadcrumb">
                    <span>Dashboard</span>
                    <ChevronRight size={10} strokeWidth={2} />
                    <span style={{ color: "var(--ink)" }}>{breadcrumb}</span>
                  </div>
                )}
                <h1 className="shell-page-title">{title}</h1>
              </div>
            </div>
            <div className="shell-topbar-right">{topbarRight}</div>
          </div>
          <div className="shell-content">{children}</div>
        </main>
      </div>
    </>
  );
}