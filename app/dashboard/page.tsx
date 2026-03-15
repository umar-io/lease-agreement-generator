"use client";

import { useState } from "react";
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
  Home,
  Building,
  KeyRound,
  ScrollText,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  Eye,
  TrendingUp,
  Users,
  Zap,
  Menu,
  X,
} from "lucide-react";
import Sidebar from "@/app/_components/sidebar";

// ── MOCK DATA ─────────────────────────────────
const LEASES = [
  {
    id: "LF-001",
    tenant: "James Adeyemi",
    property: "12 Victoria Island, Apt 4B",
    type: "APARTMENT",
    status: "SIGNED",
    date: "Mar 10, 2025",
    amount: "₦450,000",
  },
  {
    id: "LF-002",
    tenant: "Amaka Obi",
    property: "Plot 7 Lekki Phase 1",
    type: "HOUSE",
    status: "PENDING",
    date: "Mar 12, 2025",
    amount: "₦1,200,000",
  },
  {
    id: "LF-003",
    tenant: "Chidi Nwosu",
    property: "44 Ikeja GRA, Unit 2",
    type: "APARTMENT",
    status: "SIGNED",
    date: "Mar 8, 2025",
    amount: "₦320,000",
  },
  {
    id: "LF-004",
    tenant: "Fatima Bello",
    property: "Suite 5, Marina Business Hub",
    type: "COMMERCIAL",
    status: "DRAFT",
    date: "Mar 14, 2025",
    amount: "₦2,800,000",
  },
  {
    id: "LF-005",
    tenant: "Emmanuel Eze",
    property: "3 Wuse II, Room B",
    type: "ROOM",
    status: "PENDING",
    date: "Mar 13, 2025",
    amount: "₦85,000",
  },
  {
    id: "LF-006",
    tenant: "Ngozi Okafor",
    property: "18 Banana Island Drive",
    type: "HOUSE",
    status: "SIGNED",
    date: "Mar 6, 2025",
    amount: "₦3,500,000",
  },
];

const STATS = [
  {
    label: "Total Leases",
    value: "48",
    delta: "+12%",
    icon: <FileText size={18} strokeWidth={1.5} />,
    accent: false,
  },
  {
    label: "Signed This Month",
    value: "14",
    delta: "+8%",
    icon: <CheckCircle2 size={18} strokeWidth={1.5} />,
    accent: true,
  },
  {
    label: "Pending Signature",
    value: "6",
    delta: "-2",
    icon: <Clock size={18} strokeWidth={1.5} />,
    accent: false,
  },
  {
    label: "Total Value",
    value: "₦48.2M",
    delta: "+23%",
    icon: <TrendingUp size={18} strokeWidth={1.5} />,
    accent: false,
  },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  APARTMENT: <Home size={13} strokeWidth={1.5} />,
  HOUSE: <Building size={13} strokeWidth={1.5} />,
  ROOM: <KeyRound size={13} strokeWidth={1.5} />,
  COMMERCIAL: <ScrollText size={13} strokeWidth={1.5} />,
};

const STATUS_CONFIG: Record<
  string,
  { color: string; bg: string; icon: React.ReactNode }
> = {
  SIGNED: {
    color: "#4caf78",
    bg: "rgba(76,175,120,.12)",
    icon: <CheckCircle2 size={11} strokeWidth={2} />,
  },
  PENDING: {
    color: "var(--gold)",
    bg: "rgba(201,168,76,.12)",
    icon: <Clock size={11} strokeWidth={2} />,
  },
  DRAFT: {
    color: "rgba(245,240,232,.4)",
    bg: "rgba(245,240,232,.06)",
    icon: <PenSquare size={11} strokeWidth={2} />,
  },
};

// ── NEW LEASE WIZARD ──────────────────────────
const STEPS = ["Property", "Tenant", "Terms", "Review"];

function NewLeaseWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [type, setType] = useState("");

  const types = [
    {
      key: "APARTMENT",
      label: "Apartment",
      icon: <Home size={22} strokeWidth={1.5} />,
      clauses: "12 clauses",
    },
    {
      key: "HOUSE",
      label: "House",
      icon: <Building size={22} strokeWidth={1.5} />,
      clauses: "15 clauses",
    },
    {
      key: "ROOM",
      label: "Room",
      icon: <KeyRound size={22} strokeWidth={1.5} />,
      clauses: "8 clauses",
    },
    {
      key: "COMMERCIAL",
      label: "Commercial",
      icon: <ScrollText size={22} strokeWidth={1.5} />,
      clauses: "20 clauses",
    },
  ];

  return (
    <div className="wz-overlay">
      <div className="wz-panel">
        {/* Header */}
        <div className="wz-header">
          <div>
            <span className="wz-eyebrow">NEW LEASE</span>
            <h2 className="wz-title">{STEPS[step]}</h2>
          </div>
          <button className="wz-close" onClick={onClose}>
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Progress */}
        <div className="wz-progress-row">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`wz-step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
            >
              <div className="wz-step-dot">
                {i < step ? (
                  <CheckCircle2 size={12} strokeWidth={2} />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span className="wz-step-label">{s}</span>
            </div>
          ))}
          <div className="wz-progress-line">
            <div
              className="wz-progress-fill"
              style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="wz-body">
          {step === 0 && (
            <div className="wz-step-content">
              <p className="wz-step-desc">
                Choose the property type to load the correct template and state
                clauses.
              </p>
              <div className="wz-type-grid">
                {types.map((t) => (
                  <button
                    key={t.key}
                    className={`wz-type-card ${type === t.key ? "selected" : ""}`}
                    onClick={() => setType(t.key)}
                  >
                    <div className="wz-type-icon">{t.icon}</div>
                    <span className="wz-type-label">{t.label}</span>
                    <span className="wz-type-clauses">{t.clauses}</span>
                  </button>
                ))}
              </div>
              <div className="wz-field">
                <label className="wz-label">Property Address</label>
                <input
                  className="wz-input"
                  placeholder="e.g. 12 Victoria Island, Apt 4B, Lagos"
                />
              </div>
              <div className="wz-row">
                <div className="wz-field">
                  <label className="wz-label">Unit / Apartment No.</label>
                  <input className="wz-input" placeholder="e.g. Apt 4B" />
                </div>
                <div className="wz-field">
                  <label className="wz-label">State</label>
                  <select className="wz-input">
                    <option>Lagos</option>
                    <option>Abuja (FCT)</option>
                    <option>Rivers</option>
                    <option>Oyo</option>
                    <option>Kano</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="wz-step-content">
              <p className="wz-step-desc">
                Enter the tenant's details. These will auto-fill throughout the
                document.
              </p>
              <div className="wz-row">
                <div className="wz-field">
                  <label className="wz-label">First Name</label>
                  <input className="wz-input" placeholder="James" />
                </div>
                <div className="wz-field">
                  <label className="wz-label">Last Name</label>
                  <input className="wz-input" placeholder="Adeyemi" />
                </div>
              </div>
              <div className="wz-field">
                <label className="wz-label">Email Address</label>
                <input
                  className="wz-input"
                  type="email"
                  placeholder="james@email.com"
                />
              </div>
              <div className="wz-field">
                <label className="wz-label">Phone Number</label>
                <input className="wz-input" placeholder="+234 801 234 5678" />
              </div>
              <div className="wz-field">
                <label className="wz-label">Employer / Occupation</label>
                <input
                  className="wz-input"
                  placeholder="e.g. Software Engineer at Flutterwave"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="wz-step-content">
              <p className="wz-step-desc">
                Set the lease terms. All amounts in Naira (₦).
              </p>
              <div className="wz-row">
                <div className="wz-field">
                  <label className="wz-label">Start Date</label>
                  <input className="wz-input" type="date" />
                </div>
                <div className="wz-field">
                  <label className="wz-label">Duration</label>
                  <select className="wz-input">
                    <option>6 Months</option>
                    <option>1 Year</option>
                    <option>2 Years</option>
                    <option>Custom</option>
                  </select>
                </div>
              </div>
              <div className="wz-row">
                <div className="wz-field">
                  <label className="wz-label">Monthly Rent (₦)</label>
                  <input className="wz-input" placeholder="450,000" />
                </div>
                <div className="wz-field">
                  <label className="wz-label">Security Deposit (₦)</label>
                  <input className="wz-input" placeholder="900,000" />
                </div>
              </div>
              <div className="wz-field">
                <label className="wz-label">Special Clauses (optional)</label>
                <textarea
                  className="wz-input"
                  rows={3}
                  style={{
                    height: "auto",
                    padding: "12px 16px",
                    resize: "vertical",
                  }}
                  placeholder="e.g. No pets allowed. Tenant responsible for generator fuel..."
                />
              </div>
              <div className="wz-toggle-row">
                <label className="wz-label" style={{ marginBottom: 0 }}>
                  Include Pet Addendum
                </label>
                <div className="wz-toggle" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="wz-step-content">
              <p className="wz-step-desc">
                Review your lease summary before sending for signature.
              </p>
              {[
                ["Property", "12 Victoria Island, Apt 4B, Lagos"],
                ["Type", type || "Apartment"],
                ["Tenant", "James Adeyemi"],
                ["Email", "james@email.com"],
                ["Duration", "1 Year — Apr 1, 2025 to Mar 31, 2026"],
                ["Rent", "₦450,000 / month"],
                ["Deposit", "₦900,000"],
              ].map(([k, v]) => (
                <div key={k} className="wz-review-row">
                  <span className="wz-review-key">{k}</span>
                  <span className="wz-review-val">{v}</span>
                </div>
              ))}
              <div className="wz-review-notice">
                <Zap size={13} color="var(--gold)" />
                <span>
                  State-specific clauses for <strong>Lagos</strong> will be
                  applied automatically.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="wz-footer">
          {step > 0 ? (
            <button
              className="wz-btn-back"
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </button>
          ) : (
            <div />
          )}
          {step < STEPS.length - 1 ? (
            <button
              className="wz-btn-next"
              onClick={() => setStep((s) => s + 1)}
            >
              Continue <ChevronRight size={14} strokeWidth={2} />
            </button>
          ) : (
            <button className="wz-btn-send">
              <Send size={14} strokeWidth={2} /> Send for Signature
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD ────────────────────────────────
export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [search, setSearch] = useState("");

  const filtered = LEASES.filter(
    (l) =>
      l.tenant.toLowerCase().includes(search.toLowerCase()) ||
      l.property.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity:0; } to { opacity:1; }
        }
        @keyframes slideRight {
          from { opacity:0; transform:translateX(-20px); }
          to   { opacity:1; transform:translateX(0); }
        }

        /* ── LAYOUT ── */
        .db-layout {
          min-height:100svh;
          background:var(--paper);
          display:grid;
          grid-template-columns:240px 1fr;
          grid-template-rows:1fr;
        }
        @media (max-width:900px) {
          .db-layout { grid-template-columns:1fr; }
        }

        /* ── SIDEBAR ── */
        .db-sidebar {
          background:var(--ink);
          display:flex; flex-direction:column;
          padding:0;
          position:relative; overflow:hidden;
          grid-row:1;
        }
        @media (max-width:900px) {
          .db-sidebar {
            position:fixed; inset:0; right:auto;
            width:260px; z-index:300;
            transform:translateX(-100%);
            transition:transform .35s cubic-bezier(.77,0,.18,1);
          }
          .db-sidebar.open { transform:translateX(0); }
        }

        /* Grid overlay in sidebar */
        .db-sidebar::before {
          content:'';
          position:absolute; inset:0;
          background-image:
            linear-gradient(rgba(245,240,232,.03) 1px,transparent 1px),
            linear-gradient(90deg,rgba(245,240,232,.03) 1px,transparent 1px);
          background-size:40px 40px;
          pointer-events:none;
        }

        .db-sidebar-inner { position:relative; z-index:1; display:flex; flex-direction:column; height:100%; }

        .db-wordmark {
          padding:28px 24px 24px;
          font-family:var(--font-display);
          font-size:22px; letter-spacing:.1em; color:var(--paper);
          border-bottom:1px solid rgba(245,240,232,.06);
          flex-shrink:0;
        }

        .db-nav { padding:16px 12px; flex:1; display:flex; flex-direction:column; gap:2px; overflow-y:auto; }

        .db-nav-section {
          font-size:9px; font-weight:700;
          letter-spacing:.2em; text-transform:uppercase;
          color:rgba(245,240,232,.25);
          padding:16px 12px 8px;
        }

        .db-nav-item {
          display:flex; align-items:center; gap:12px;
          padding:11px 12px;
          font-size:12px; font-weight:500; letter-spacing:.02em;
          color:rgba(245,240,232,.45);
          background:none; border:none; cursor:pointer;
          text-decoration:none; width:100%;
          transition:color .2s, background .2s;
          position:relative;
        }
        .db-nav-item:hover { color:rgba(245,240,232,.85); background:rgba(245,240,232,.04); }
        .db-nav-item.active { color:var(--paper); background:rgba(245,240,232,.07); }
        .db-nav-item.active::before {
          content:'';
          position:absolute; left:0; top:0; bottom:0;
          width:3px; background:var(--accent);
        }

        .db-sidebar-footer {
          padding:16px 12px 24px;
          border-top:1px solid rgba(245,240,232,.06);
        }
        .db-user-row {
          display:flex; align-items:center; gap:12px; padding:10px 12px;
        }
        .db-avatar {
          width:36px; height:36px; flex-shrink:0;
          background:color-mix(in srgb,var(--accent) 20%,transparent);
          border:1px solid rgba(245,240,232,.12);
          display:flex; align-items:center; justify-content:center;
          font-family:var(--font-display); font-size:16px; color:var(--paper);
        }
        .db-user-name { font-size:12px; font-weight:600; color:var(--paper); }
        .db-user-email { font-size:10px; color:rgba(245,240,232,.35); margin-top:2px; }

        /* ── MAIN ── */
        .db-main {
          display:flex; flex-direction:column;
          min-height:100svh;
          overflow:hidden;
        }

        /* Topbar */
        .db-topbar {
          display:flex; align-items:center; justify-content:space-between;
          padding:20px clamp(20px,3vw,36px);
          border-bottom:1px solid color-mix(in srgb,var(--ink) 8%,transparent);
          background:var(--paper);
          position:sticky; top:0; z-index:10;
          flex-shrink:0;
        }
        .db-topbar-left { display:flex; align-items:center; gap:16px; }
        .db-mobile-menu-btn {
          display:none; background:none; border:none; cursor:pointer; padding:4px;
        }
        @media (max-width:900px) { .db-mobile-menu-btn { display:flex; align-items:center; } }

        .db-page-title {
          font-family:var(--font-display);
          font-size:clamp(18px,2.5vw,26px);
          letter-spacing:.04em; color:var(--ink);
        }
        .db-page-badge {
          font-size:9px; font-weight:700; letter-spacing:.14em; text-transform:uppercase;
          padding:3px 10px;
          border:1px solid color-mix(in srgb,var(--ink) 15%,transparent);
          color:var(--muted);
        }

        .db-topbar-right { display:flex; align-items:center; gap:12px; }
        .db-search-wrap {
          display:flex; align-items:center; gap:10px;
          padding:10px 16px;
          background:var(--cream);
          border:1px solid color-mix(in srgb,var(--ink) 10%,transparent);
          width:clamp(160px,20vw,280px);
          transition:border-color .2s, box-shadow .2s;
        }
        .db-search-wrap:focus-within {
          border-color:var(--ink);
          box-shadow:3px 3px 0 var(--accent);
        }
        .db-search-input {
          background:none; border:none; outline:none;
          font-family:var(--font-body); font-size:12px; color:var(--ink);
          width:100%;
        }
        .db-search-input::placeholder { color:var(--muted); }

        .db-icon-btn {
          width:40px; height:40px;
          background:var(--cream);
          border:1px solid color-mix(in srgb,var(--ink) 10%,transparent);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:background .2s, border-color .2s;
          position:relative;
        }
        .db-icon-btn:hover { background:var(--ink); color:var(--paper); border-color:var(--ink); }
        .db-notif-dot {
          position:absolute; top:8px; right:8px;
          width:6px; height:6px; border-radius:50%;
          background:var(--accent);
        }

        .db-new-btn {
          display:flex; align-items:center; gap:8px;
          padding:10px 20px;
          background:var(--ink); color:var(--paper);
          border:none; font-family:var(--font-body);
          font-size:11px; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
          cursor:pointer; position:relative; overflow:hidden;
          transition:box-shadow .2s;
          white-space:nowrap;
        }
        .db-new-btn::before {
          content:''; position:absolute; inset:0;
          background:var(--accent);
          transform:translateX(-101%);
          transition:transform .4s cubic-bezier(.77,0,.18,1);
        }
        .db-new-btn:hover::before { transform:translateX(0); }
        .db-new-btn:hover { box-shadow:4px 4px 0 color-mix(in srgb,var(--ink) 20%,transparent); }
        .db-new-btn > * { position:relative; z-index:1; }

        /* ── CONTENT ── */
        .db-content { padding:clamp(20px,3vw,36px); overflow-y:auto; flex:1; }

        /* Stats grid */
        .db-stats-grid {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:14px;
          margin-bottom:clamp(24px,3vw,36px);
          animation:slideUp .5s cubic-bezier(.77,0,.18,1) .1s both;
        }
        @media (max-width:1100px) { .db-stats-grid { grid-template-columns:repeat(2,1fr); } }
        @media (max-width:500px)  { .db-stats-grid { grid-template-columns:1fr; } }

        .db-stat-card {
          background:var(--cream);
          border:1px solid color-mix(in srgb,var(--ink) 8%,transparent);
          padding:24px 22px;
          position:relative; overflow:hidden;
          transition:transform .25s, box-shadow .25s;
        }
        .db-stat-card:hover {
          transform:translateY(-3px);
          box-shadow:4px 4px 0 color-mix(in srgb,var(--ink) 10%,transparent);
        }
        .db-stat-card.accent { border-left:3px solid var(--accent); }
        .db-stat-top {
          display:flex; justify-content:space-between; align-items:flex-start;
          margin-bottom:16px;
        }
        .db-stat-icon {
          width:36px; height:36px;
          background:color-mix(in srgb,var(--ink) 6%,transparent);
          border:1px solid color-mix(in srgb,var(--ink) 10%,transparent);
          display:flex; align-items:center; justify-content:center;
          color:var(--ink);
        }
        .db-stat-card.accent .db-stat-icon { background:color-mix(in srgb,var(--accent) 8%,transparent); color:var(--accent); }
        .db-stat-delta {
          font-size:10px; font-weight:700; letter-spacing:.06em;
          padding:3px 8px;
          background:color-mix(in srgb,#4caf78 10%,transparent);
          color:#4caf78;
        }
        .db-stat-value {
          font-family:var(--font-display);
          font-size:clamp(28px,3vw,40px);
          letter-spacing:.02em; color:var(--ink); line-height:1;
          margin-bottom:6px;
        }
        .db-stat-label {
          font-size:11px; color:var(--muted);
          letter-spacing:.04em; font-weight:500;
        }

        /* Section header */
        .db-section-header {
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom:16px;
          animation:slideUp .5s cubic-bezier(.77,0,.18,1) .2s both;
        }
        .db-section-title {
          font-family:var(--font-display);
          font-size:clamp(16px,2vw,22px);
          letter-spacing:.04em; color:var(--ink);
        }
        .db-view-all {
          display:inline-flex; align-items:center; gap:6px;
          font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
          color:var(--muted); text-decoration:none;
          transition:color .2s;
        }
        .db-view-all:hover { color:var(--accent); }

        /* Table */
        .db-table-wrap {
          border:1px solid color-mix(in srgb,var(--ink) 8%,transparent);
          overflow:hidden;
          animation:slideUp .5s cubic-bezier(.77,0,.18,1) .3s both;
          overflow-x:auto;
        }

        .db-table { width:100%; border-collapse:collapse; min-width:640px; }

        .db-table th {
          padding:12px 18px;
          font-size:9px; font-weight:700; letter-spacing:.18em; text-transform:uppercase;
          color:var(--muted);
          background:var(--cream);
          border-bottom:1px solid color-mix(in srgb,var(--ink) 8%,transparent);
          text-align:left; white-space:nowrap;
        }

        .db-table td {
          padding:15px 18px;
          font-size:13px; color:var(--ink);
          border-bottom:1px solid color-mix(in srgb,var(--ink) 5%,transparent);
          vertical-align:middle;
        }

        .db-table tr:last-child td { border-bottom:none; }

        .db-table tr:hover td { background:color-mix(in srgb,var(--ink) 2%,transparent); }

        .db-lease-id {
          font-family:var(--font-display);
          font-size:14px; letter-spacing:.06em; color:var(--accent);
        }

        .db-tenant-name { font-weight:600; font-size:13px; }
        .db-tenant-prop { font-size:11px; color:var(--muted); margin-top:2px; max-width:220px; }

        .db-type-badge {
          display:inline-flex; align-items:center; gap:5px;
          padding:3px 9px;
          font-size:9px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
          border:1px solid color-mix(in srgb,var(--ink) 14%,transparent);
          color:var(--muted);
          white-space:nowrap;
        }

        .db-status-badge {
          display:inline-flex; align-items:center; gap:5px;
          padding:4px 10px;
          font-size:9px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
          white-space:nowrap;
        }

        .db-amount { font-family:var(--font-display); font-size:15px; letter-spacing:.02em; }

        .db-action-btn {
          width:30px; height:30px;
          background:none;
          border:1px solid color-mix(in srgb,var(--ink) 12%,transparent);
          display:inline-flex; align-items:center; justify-content:center;
          cursor:pointer; color:var(--muted);
          transition:background .2s, color .2s, border-color .2s;
          margin-left:4px;
        }
        .db-action-btn:hover { background:var(--ink); color:var(--paper); border-color:var(--ink); }

        /* Quick actions */
        .db-quick-row {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:12px;
          margin-bottom:clamp(24px,3vw,36px);
          animation:slideUp .5s cubic-bezier(.77,0,.18,1) .15s both;
        }
        @media (max-width:800px) { .db-quick-row { grid-template-columns:repeat(2,1fr); } }

        .db-quick-card {
          background:var(--cream);
          border:1px solid color-mix(in srgb,var(--ink) 8%,transparent);
          padding:20px;
          cursor:pointer;
          transition:transform .25s, box-shadow .25s, background .25s;
          position:relative; overflow:hidden;
        }
        .db-quick-card::before {
          content:''; position:absolute; inset:0;
          background:var(--ink);
          transform:translateY(101%);
          transition:transform .4s cubic-bezier(.77,0,.18,1);
        }
        .db-quick-card:hover::before { transform:translateY(0); }
        .db-quick-card:hover { color:var(--paper); }
        .db-quick-card > * { position:relative; z-index:1; }
        .db-quick-icon {
          width:36px; height:36px;
          border:1px solid color-mix(in srgb,var(--ink) 14%,transparent);
          display:flex; align-items:center; justify-content:center;
          margin-bottom:12px;
          transition:border-color .2s;
        }
        .db-quick-card:hover .db-quick-icon { border-color:rgba(245,240,232,.2); }
        .db-quick-title { font-size:12px; font-weight:700; letter-spacing:.04em; margin-bottom:4px; }
        .db-quick-desc  { font-size:11px; color:var(--muted); transition:color .2s; }
        .db-quick-card:hover .db-quick-desc { color:rgba(245,240,232,.5); }

        /* Mobile overlay */
        .db-sidebar-overlay {
          display:none;
          position:fixed; inset:0;
          background:rgba(10,10,10,.5);
          z-index:299;
        }
        @media (max-width:900px) {
          .db-sidebar-overlay.show { display:block; }
        }

        /* ── WIZARD ── */
        .wz-overlay {
          position:fixed; inset:0;
          background:rgba(10,10,10,.6);
          backdrop-filter:blur(4px);
          z-index:400;
          display:flex; align-items:flex-end; justify-content:flex-end;
          animation:fadeIn .2s ease both;
        }
        @media (min-width:640px) {
          .wz-overlay { align-items:stretch; }
        }

        .wz-panel {
          width:100%;
          max-width:560px;
          background:var(--paper);
          display:flex; flex-direction:column;
          max-height:100svh;
          overflow:hidden;
          animation:slideRight .35s cubic-bezier(.77,0,.18,1) both;
        }

        .wz-header {
          display:flex; justify-content:space-between; align-items:flex-start;
          padding:28px 32px 20px;
          border-bottom:1px solid color-mix(in srgb,var(--ink) 8%,transparent);
          flex-shrink:0;
        }
        .wz-eyebrow {
          font-size:9px; font-weight:700; letter-spacing:.2em;
          color:var(--accent); display:block; margin-bottom:4px;
        }
        .wz-title {
          font-family:var(--font-display);
          font-size:clamp(22px,3vw,32px); letter-spacing:.04em;
          color:var(--ink);
        }
        .wz-close {
          width:36px; height:36px;
          background:var(--cream);
          border:1px solid color-mix(in srgb,var(--ink) 10%,transparent);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; flex-shrink:0;
          transition:background .2s;
        }
        .wz-close:hover { background:var(--ink); color:var(--paper); }

        .wz-progress-row {
          display:flex; align-items:center; gap:0;
          padding:20px 32px;
          border-bottom:1px solid color-mix(in srgb,var(--ink) 8%,transparent);
          position:relative;
          flex-shrink:0;
        }
        .wz-progress-line {
          position:absolute; left:32px; right:32px; top:50%;
          height:1px; background:color-mix(in srgb,var(--ink) 10%,transparent);
          z-index:0;
        }
        .wz-progress-fill {
          position:absolute; inset-y:0; left:0;
          background:var(--accent);
          transition:width .4s ease;
        }
        .wz-step {
          display:flex; flex-direction:column; align-items:center; gap:6px;
          flex:1; position:relative; z-index:1;
        }
        .wz-step-dot {
          width:28px; height:28px;
          background:var(--paper);
          border:1.5px solid color-mix(in srgb,var(--ink) 18%,transparent);
          display:flex; align-items:center; justify-content:center;
          font-size:11px; font-weight:700; color:var(--muted);
          transition:background .3s, border-color .3s, color .3s;
        }
        .wz-step.active .wz-step-dot { border-color:var(--accent); color:var(--accent); background:color-mix(in srgb,var(--accent) 6%,transparent); }
        .wz-step.done  .wz-step-dot  { background:var(--ink); border-color:var(--ink); color:var(--paper); }
        .wz-step-label { font-size:9px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); }
        .wz-step.active .wz-step-label { color:var(--ink); }

        .wz-body { flex:1; overflow-y:auto; padding:28px 32px; }
        .wz-step-content { display:flex; flex-direction:column; gap:18px; }
        .wz-step-desc { font-size:13px; color:var(--muted); line-height:1.6; margin-bottom:4px; }

        .wz-type-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
        @media (max-width:480px) { .wz-type-grid { grid-template-columns:repeat(2,1fr); } }

        .wz-type-card {
          padding:18px 12px;
          background:var(--cream);
          border:1.5px solid color-mix(in srgb,var(--ink) 10%,transparent);
          display:flex; flex-direction:column; align-items:center; gap:8px;
          cursor:pointer; transition:border-color .2s, background .2s;
        }
        .wz-type-card:hover { border-color:color-mix(in srgb,var(--ink) 30%,transparent); }
        .wz-type-card.selected { border-color:var(--accent); background:color-mix(in srgb,var(--accent) 4%,transparent); }
        .wz-type-icon { color:var(--ink); }
        .wz-type-card.selected .wz-type-icon { color:var(--accent); }
        .wz-type-label { font-size:11px; font-weight:700; letter-spacing:.06em; }
        .wz-type-clauses { font-size:9px; color:var(--muted); letter-spacing:.06em; }

        .wz-field { display:flex; flex-direction:column; gap:7px; }
        .wz-label { font-size:10px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); }
        .wz-input {
          width:100%; height:46px;
          padding:0 14px;
          background:var(--cream);
          border:1px solid color-mix(in srgb,var(--ink) 12%,transparent);
          font-family:var(--font-body); font-size:13px; color:var(--ink);
          outline:none; appearance:none; border-radius:0;
          transition:border-color .2s, box-shadow .2s;
        }
        .wz-input:focus { border-color:var(--ink); box-shadow:3px 3px 0 var(--accent); }
        .wz-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        @media (max-width:420px) { .wz-row { grid-template-columns:1fr; } }

        .wz-toggle-row {
          display:flex; align-items:center; justify-content:space-between;
          padding:14px 0;
          border-top:1px solid color-mix(in srgb,var(--ink) 8%,transparent);
        }
        .wz-toggle {
          width:44px; height:24px;
          background:color-mix(in srgb,var(--ink) 15%,transparent);
          border-radius:12px; position:relative; cursor:pointer;
          transition:background .2s;
        }
        .wz-toggle::after {
          content:''; position:absolute;
          top:3px; left:3px;
          width:18px; height:18px;
          background:var(--paper); border-radius:50%;
          transition:transform .2s;
        }

        .wz-review-row {
          display:flex; justify-content:space-between; align-items:flex-start;
          padding:12px 0;
          border-bottom:1px solid color-mix(in srgb,var(--ink) 6%,transparent);
          gap:20px;
        }
        .wz-review-row:last-of-type { border-bottom:none; }
        .wz-review-key { font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); flex-shrink:0; }
        .wz-review-val { font-size:13px; color:var(--ink); font-weight:500; text-align:right; }

        .wz-review-notice {
          display:flex; align-items:center; gap:10px;
          padding:14px 16px;
          background:color-mix(in srgb,var(--gold) 8%,transparent);
          border:1px solid color-mix(in srgb,var(--gold) 20%,transparent);
          border-left:3px solid var(--gold);
          font-size:12px; color:var(--ink); margin-top:8px;
        }

        .wz-footer {
          display:flex; justify-content:space-between; align-items:center;
          padding:20px 32px;
          border-top:1px solid color-mix(in srgb,var(--ink) 8%,transparent);
          flex-shrink:0;
        }
        .wz-btn-back {
          background:none; border:none; cursor:pointer;
          font-family:var(--font-body); font-size:12px; font-weight:600;
          letter-spacing:.1em; text-transform:uppercase; color:var(--muted);
          transition:color .2s; padding:12px 0;
        }
        .wz-btn-back:hover { color:var(--ink); }
        .wz-btn-next {
          display:inline-flex; align-items:center; gap:8px;
          padding:13px 28px;
          background:var(--ink); color:var(--paper);
          border:none; font-family:var(--font-body);
          font-size:12px; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
          cursor:pointer; transition:background .25s;
        }
        .wz-btn-next:hover { background:var(--accent); }
        .wz-btn-send {
          display:inline-flex; align-items:center; gap:8px;
          padding:13px 28px;
          background:var(--accent); color:var(--paper);
          border:none; font-family:var(--font-body);
          font-size:12px; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
          cursor:pointer; transition:opacity .2s;
        }
        .wz-btn-send:hover { opacity:.85; }

        /* Empty state */
        .db-empty {
          padding:60px 20px;
          display:flex; flex-direction:column; align-items:center; gap:16px;
          color:var(--muted);
        }
        .db-empty-icon {
          width:56px; height:56px;
          border:1px solid color-mix(in srgb,var(--ink) 12%,transparent);
          display:flex; align-items:center; justify-content:center;
          color:var(--muted);
        }
      `}</style>

      {/* Wizard */}
      {showWizard && <NewLeaseWizard onClose={() => setShowWizard(false)} />}

      {/* Sidebar overlay (mobile) */}
      <div
        className={`db-sidebar-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        STATS={STATS}
        showWizard={showWizard}
        setShowWizard={setShowWizard}
        search={search}
        setSearch={setSearch}
        filtered={filtered}
        STATUS_CONFIG={STATUS_CONFIG}
        TYPE_ICONS={TYPE_ICONS}
      />
    </>
  );
}
