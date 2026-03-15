"use client";

import { useState } from "react";
import {
  FileText,
  PenSquare,
  ChevronRight,
  Home,
  Building,
  KeyRound,
  ScrollText,
  CheckCircle2,
  Clock,
  Send,
  TrendingUp,
  X,
  Zap,
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

export default function DashboardClient({ user }: { user: any }) {
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
    

      {showWizard && <NewLeaseWizard onClose={() => setShowWizard(false)} />}

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
