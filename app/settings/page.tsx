"use client";

import { useState } from "react";
import { Shell } from "@/app/_components/shell";
import {
  User, Bell, Shield, CreditCard, Building2,
  Save, Eye, EyeOff, CheckCircle2, AlertCircle,
  Zap, Trash2, Download, ToggleLeft, ToggleRight,
  ChevronRight, LogOut,
} from "lucide-react";

const SECTIONS = [
  { key:"profile",       label:"Profile",        icon:<User size={15} strokeWidth={1.5} /> },
  { key:"notifications", label:"Notifications",  icon:<Bell size={15} strokeWidth={1.5} /> },
  { key:"security",      label:"Security",       icon:<Shield size={15} strokeWidth={1.5} /> },
  { key:"billing",       label:"Billing",        icon:<CreditCard size={15} strokeWidth={1.5} /> },
  { key:"company",       label:"Company",        icon:<Building2 size={15} strokeWidth={1.5} /> },
];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex" }}>
      {on
        ? <ToggleRight size={28} color="var(--accent)" strokeWidth={1.5} />
        : <ToggleLeft size={28} color="rgba(10,10,10,.25)" strokeWidth={1.5} />
      }
    </button>
  );
}

function SettingRow({ label, desc, children }: { label:string; desc?:string; children:React.ReactNode }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:24, padding:"20px 0", borderBottom:"1px solid color-mix(in srgb,var(--ink) 7%,transparent)" }}>
      <div style={{ maxWidth:380 }}>
        <p style={{ fontSize:13, fontWeight:600, color:"var(--ink)", marginBottom:desc ? 4 : 0 }}>{label}</p>
        {desc && <p style={{ fontSize:12, color:"var(--muted)", lineHeight:1.55 }}>{desc}</p>}
      </div>
      <div style={{ flexShrink:0 }}>{children}</div>
    </div>
  );
}

function SectionCard({ title, children }: { title:string; children:React.ReactNode }) {
  return (
    <div style={{ background:"var(--cream)", border:"1px solid color-mix(in srgb,var(--ink) 8%,transparent)", marginBottom:20 }}>
      <div style={{ padding:"18px 24px", borderBottom:"1px solid color-mix(in srgb,var(--ink) 7%,transparent)", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:3, height:18, background:"var(--accent)" }} />
        <h3 style={{ fontFamily:"var(--font-display)", fontSize:16, letterSpacing:".06em", color:"var(--ink)" }}>{title}</h3>
      </div>
      <div style={{ padding:"0 24px 8px" }}>{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const [notifs, setNotifs] = useState({
    leasesSigned:  true,
    pendingRemind: true,
    expiryAlert:   true,
    marketing:     false,
    weeklyReport:  true,
    smsAlerts:     false,
  });

  const [prefs, setPrefs] = useState({
    twoFactor: false,
    autoSave:  true,
    darkMode:  false,
  });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <>
      <style>{`
        .settings-layout{
          display:grid;
          grid-template-columns:200px 1fr;
          gap:24px;
          align-items:start;
        }
        @media(max-width:700px){ .settings-layout{ grid-template-columns:1fr; } }

        .settings-sidebar{
          background:var(--cream);
          border:1px solid color-mix(in srgb,var(--ink) 8%,transparent);
          overflow:hidden;
          position:sticky; top:80px;
        }
        @media(max-width:700px){ .settings-sidebar{ position:static; } }

        .settings-nav-item{
          display:flex; align-items:center; gap:10px;
          padding:13px 16px;
          font-size:12px; font-weight:500; letter-spacing:.02em;
          color:var(--muted);
          background:none; border:none; cursor:pointer;
          width:100%; text-align:left;
          border-left:3px solid transparent;
          transition:color .2s, background .2s, border-color .2s;
          border-bottom:1px solid color-mix(in srgb,var(--ink) 5%,transparent);
        }
        .settings-nav-item:last-child{ border-bottom:none; }
        .settings-nav-item:hover{ color:var(--ink); background:color-mix(in srgb,var(--ink) 3%,transparent); }
        .settings-nav-item.active{
          color:var(--ink); font-weight:600;
          background:color-mix(in srgb,var(--ink) 4%,transparent);
          border-left-color:var(--accent);
        }

        .settings-field{ display:flex; flex-direction:column; gap:7px; }
        .settings-label{
          font-size:10px; font-weight:700;
          letter-spacing:.14em; text-transform:uppercase; color:var(--muted);
        }
        .settings-input{
          width:100%; height:46px; padding:0 14px;
          background:var(--paper);
          border:1px solid color-mix(in srgb,var(--ink) 12%,transparent);
          font-family:var(--font-body); font-size:13px; color:var(--ink);
          outline:none; appearance:none; border-radius:0;
          transition:border-color .2s, box-shadow .2s;
        }
        .settings-input:focus{ border-color:var(--ink); box-shadow:3px 3px 0 var(--accent); }
        .settings-input:disabled{ background:var(--cream); color:var(--muted); cursor:not-allowed; }

        .settings-pw-wrap{ position:relative; }
        .settings-pw-toggle{
          position:absolute; right:0; top:0; bottom:0; width:46px;
          display:flex; align-items:center; justify-content:center;
          background:none; border:none; cursor:pointer;
          color:var(--muted); transition:color .2s;
        }
        .settings-pw-toggle:hover{ color:var(--ink); }

        .settings-grid{ display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        @media(max-width:500px){ .settings-grid{ grid-template-columns:1fr; } }

        .settings-avatar-wrap{
          display:flex; align-items:center; gap:20px; margin-bottom:20px;
          padding:20px 0;
          border-bottom:1px solid color-mix(in srgb,var(--ink) 7%,transparent);
        }
        .settings-avatar{
          width:72px; height:72px;
          background:color-mix(in srgb,var(--accent) 20%,transparent);
          border:2px solid color-mix(in srgb,var(--accent) 30%,transparent);
          display:flex; align-items:center; justify-content:center;
          font-family:var(--font-display); font-size:28px; color:var(--ink);
          flex-shrink:0;
        }

        .plan-card{
          padding:20px;
          border:1px solid color-mix(in srgb,var(--ink) 10%,transparent);
          background:var(--paper);
          display:flex; align-items:center; justify-content:space-between; gap:20px;
          margin-bottom:16px;
          flex-wrap:wrap; gap:16px;
        }
        .plan-badge{
          padding:3px 12px;
          background:var(--ink); color:var(--paper);
          font-size:9px; font-weight:700; letter-spacing:.16em; text-transform:uppercase;
        }
        .plan-badge.pro{ background:var(--accent); }

        .danger-zone{
          border:1px solid color-mix(in srgb,var(--accent) 30%,transparent);
          background:color-mix(in srgb,var(--accent) 3%,transparent);
        }

        .saved-toast{
          position:fixed; bottom:28px; right:28px;
          display:flex; align-items:center; gap:10px;
          padding:14px 20px;
          background:var(--ink); color:var(--paper);
          font-size:12px; font-weight:600; letter-spacing:.06em;
          border-left:3px solid #4caf78;
          animation:toastIn .3s cubic-bezier(.77,0,.18,1) both;
          z-index:999;
        }
        @keyframes toastIn{
          from{ opacity:0; transform:translateY(12px); }
          to  { opacity:1; transform:translateY(0); }
        }
      `}</style>

      {saved && (
        <div className="saved-toast">
          <CheckCircle2 size={15} color="#4caf78" strokeWidth={1.5} />
          Settings saved successfully
        </div>
      )}

      <Shell
        title="Settings"
        breadcrumb="Settings"
        topbarRight={
          <button className="pg-btn" onClick={handleSave}>
            <Save size={13} strokeWidth={1.5} /> Save Changes
          </button>
        }
      >
        <div className="settings-layout pg-a1">

          {/* Settings nav */}
          <div className="settings-sidebar">
            {SECTIONS.map(s => (
              <button key={s.key}
                className={`settings-nav-item ${activeSection === s.key ? "active" : ""}`}
                onClick={() => setActiveSection(s.key)}>
                {s.icon} {s.label}
              </button>
            ))}
            <button className="settings-nav-item" style={{ color:"var(--accent)", marginTop:4 }}>
              <LogOut size={15} strokeWidth={1.5} /> Sign Out
            </button>
          </div>

          {/* Content */}
          <div>

            {/* ── PROFILE ── */}
            {activeSection === "profile" && (
              <div className="pg-a2">
                <SectionCard title="Profile Information">
                  {/* Avatar */}
                  <div className="settings-avatar-wrap">
                    <div className="settings-avatar">U</div>
                    <div>
                      <p style={{ fontSize:13, fontWeight:600, marginBottom:6 }}>Profile Photo</p>
                      <p style={{ fontSize:12, color:"var(--muted)", marginBottom:10 }}>JPG or PNG, max 2MB</p>
                      <div style={{ display:"flex", gap:8 }}>
                        <button className="pg-btn" style={{ height:32, padding:"0 14px", fontSize:10 }}>Upload</button>
                        <button className="pg-btn ghost" style={{ height:32, padding:"0 14px", fontSize:10 }}>Remove</button>
                      </div>
                    </div>
                  </div>

                  <div className="settings-grid" style={{ paddingTop:4 }}>
                    {[
                      { label:"First Name", placeholder:"Umar", type:"text" },
                      { label:"Last Name",  placeholder:"—",    type:"text" },
                    ].map(f => (
                      <div key={f.label} className="settings-field">
                        <label className="settings-label">{f.label}</label>
                        <input className="settings-input" defaultValue={f.placeholder} type={f.type} />
                      </div>
                    ))}
                    <div className="settings-field" style={{ gridColumn:"1/-1" }}>
                      <label className="settings-label">Email Address</label>
                      <input className="settings-input" defaultValue="umar@leaseflow.io" type="email" />
                    </div>
                    <div className="settings-field">
                      <label className="settings-label">Phone Number</label>
                      <input className="settings-input" placeholder="+234 800 000 0000" />
                    </div>
                    <div className="settings-field">
                      <label className="settings-label">Timezone</label>
                      <select className="settings-input" style={{ height:46 }}>
                        <option>Africa/Lagos (WAT +1)</option>
                        <option>Africa/Abidjan (GMT +0)</option>
                        <option>Europe/London (GMT +0)</option>
                      </select>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Preferences">
                  <SettingRow label="Auto-save Drafts" desc="Automatically save draft leases every 2 minutes while editing.">
                    <Toggle on={prefs.autoSave} onToggle={() => setPrefs(p => ({ ...p, autoSave:!p.autoSave }))} />
                  </SettingRow>
                  <SettingRow label="Dark Mode" desc="Switch the dashboard to a dark colour scheme.">
                    <Toggle on={prefs.darkMode} onToggle={() => setPrefs(p => ({ ...p, darkMode:!p.darkMode }))} />
                  </SettingRow>
                  <SettingRow label="Default Currency">
                    <select className="settings-input" style={{ height:36, minWidth:120 }}>
                      <option>₦ Naira (NGN)</option>
                      <option>$ Dollar (USD)</option>
                      <option>£ Pound (GBP)</option>
                    </select>
                  </SettingRow>
                  <div style={{ paddingBottom:8 }} />
                </SectionCard>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeSection === "notifications" && (
              <div className="pg-a2">
                <SectionCard title="Email Notifications">
                  {[
                    { key:"leasesSigned",  label:"Lease Signed",           desc:"Get notified when a tenant signs a lease via email." },
                    { key:"pendingRemind", label:"Pending Signature Reminders", desc:"Daily digest of leases still awaiting signature." },
                    { key:"expiryAlert",   label:"Lease Expiry Alerts",    desc:"30, 14, and 7 days before a lease expires." },
                    { key:"weeklyReport",  label:"Weekly Summary",         desc:"A summary of all lease activity for the past week." },
                    { key:"marketing",     label:"Product Updates",        desc:"New features, tips, and platform announcements." },
                  ].map(n => (
                    <SettingRow key={n.key} label={n.label} desc={n.desc}>
                      <Toggle on={notifs[n.key as keyof typeof notifs]}
                        onToggle={() => setNotifs(p => ({ ...p, [n.key]:!p[n.key as keyof typeof notifs] }))} />
                    </SettingRow>
                  ))}
                  <div style={{ paddingBottom:8 }} />
                </SectionCard>

                <SectionCard title="SMS Notifications">
                  <SettingRow label="SMS Alerts" desc="Receive critical notifications via SMS (additional charges may apply).">
                    <Toggle on={notifs.smsAlerts}
                      onToggle={() => setNotifs(p => ({ ...p, smsAlerts:!p.smsAlerts }))} />
                  </SettingRow>
                  <div style={{ paddingBottom:8 }} />
                </SectionCard>
              </div>
            )}

            {/* ── SECURITY ── */}
            {activeSection === "security" && (
              <div className="pg-a2">
                <SectionCard title="Change Password">
                  <div style={{ paddingTop:4, display:"flex", flexDirection:"column", gap:16, paddingBottom:8 }}>
                    <div className="settings-field">
                      <label className="settings-label">Current Password</label>
                      <div className="settings-pw-wrap">
                        <input type={showPw ? "text" : "password"} className="settings-input" placeholder="••••••••" style={{ paddingRight:46 }} />
                        <button type="button" className="settings-pw-toggle" onClick={() => setShowPw(v => !v)}>
                          {showPw ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
                        </button>
                      </div>
                    </div>
                    <div className="settings-grid">
                      <div className="settings-field">
                        <label className="settings-label">New Password</label>
                        <input type="password" className="settings-input" placeholder="Min. 8 characters" />
                      </div>
                      <div className="settings-field">
                        <label className="settings-label">Confirm Password</label>
                        <input type="password" className="settings-input" placeholder="Repeat password" />
                      </div>
                    </div>
                    <button className="pg-btn" style={{ alignSelf:"flex-start", height:40, fontSize:10 }}>
                      Update Password
                    </button>
                  </div>
                </SectionCard>

                <SectionCard title="Two-Factor Authentication">
                  <SettingRow label="Enable 2FA" desc="Add an extra layer of security using an authenticator app or SMS code.">
                    <Toggle on={prefs.twoFactor} onToggle={() => setPrefs(p => ({ ...p, twoFactor:!p.twoFactor }))} />
                  </SettingRow>
                  <div style={{ paddingBottom:8 }} />
                </SectionCard>

                <SectionCard title="Active Sessions">
                  {[
                    { device:"Chrome on Windows", location:"Lagos, Nigeria", time:"Now", current:true },
                    { device:"Safari on iPhone",  location:"Lagos, Nigeria", time:"2 hours ago", current:false },
                  ].map(s => (
                    <div key={s.device} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0", borderBottom:"1px solid color-mix(in srgb,var(--ink) 6%,transparent)", gap:16 }}>
                      <div>
                        <p style={{ fontSize:13, fontWeight:600, marginBottom:3 }}>{s.device}</p>
                        <p style={{ fontSize:11, color:"var(--muted)" }}>{s.location} · {s.time}</p>
                      </div>
                      {s.current
                        ? <span style={{ fontSize:9, fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", padding:"3px 10px", background:"rgba(76,175,120,.1)", color:"#4caf78" }}>Current</span>
                        : <button className="pg-btn danger" style={{ height:32, padding:"0 14px", fontSize:10 }}>Revoke</button>
                      }
                    </div>
                  ))}
                  <div style={{ paddingBottom:8 }} />
                </SectionCard>
              </div>
            )}

            {/* ── BILLING ── */}
            {activeSection === "billing" && (
              <div className="pg-a2">
                <SectionCard title="Current Plan">
                  <div style={{ paddingTop:8, paddingBottom:8 }}>
                    <div className="plan-card">
                      <div>
                        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                          <span style={{ fontFamily:"var(--font-display)", fontSize:22, letterSpacing:".04em" }}>PRO PLAN</span>
                          <span className="plan-badge pro">Active</span>
                        </div>
                        <p style={{ fontSize:12, color:"var(--muted)" }}>Unlimited leases · E-signature · All templates · Priority support</p>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontFamily:"var(--font-display)", fontSize:32, letterSpacing:".02em" }}>$29</div>
                        <div style={{ fontSize:11, color:"var(--muted)" }}>per month</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                      <button className="pg-btn ghost" style={{ height:38, fontSize:10 }}>Upgrade to Agency</button>
                      <button className="pg-btn ghost" style={{ height:38, fontSize:10, color:"var(--accent)" }}>Cancel Plan</button>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Payment Method">
                  <SettingRow label="Card ending in ••••  4242" desc="Expires 08/2027 · Visa">
                    <div style={{ display:"flex", gap:8 }}>
                      <button className="pg-btn ghost" style={{ height:32, padding:"0 14px", fontSize:10 }}>Update</button>
                    </div>
                  </SettingRow>
                  <div style={{ paddingBottom:8 }} />
                </SectionCard>

                <SectionCard title="Billing History">
                  {[
                    { date:"Mar 1, 2025",  amount:"$29.00", status:"Paid" },
                    { date:"Feb 1, 2025",  amount:"$29.00", status:"Paid" },
                    { date:"Jan 1, 2025",  amount:"$29.00", status:"Paid" },
                  ].map(b => (
                    <div key={b.date} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid color-mix(in srgb,var(--ink) 6%,transparent)", gap:16 }}>
                      <div>
                        <p style={{ fontSize:13, fontWeight:600 }}>Pro Plan</p>
                        <p style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{b.date}</p>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <span style={{ fontFamily:"var(--font-display)", fontSize:16 }}>{b.amount}</span>
                        <span style={{ fontSize:9, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", padding:"2px 9px", background:"rgba(76,175,120,.1)", color:"#4caf78" }}>{b.status}</span>
                        <button className="pg-icon-btn"><Download size={13} strokeWidth={1.5} /></button>
                      </div>
                    </div>
                  ))}
                  <div style={{ paddingBottom:8 }} />
                </SectionCard>
              </div>
            )}

            {/* ── COMPANY ── */}
            {activeSection === "company" && (
              <div className="pg-a2">
                <SectionCard title="Company Information">
                  <div style={{ display:"flex", flexDirection:"column", gap:16, paddingTop:4, paddingBottom:8 }}>
                    <div className="settings-field">
                      <label className="settings-label">Company Name</label>
                      <input className="settings-input" placeholder="e.g. Citywide Properties Ltd." />
                    </div>
                    <div className="settings-grid">
                      <div className="settings-field">
                        <label className="settings-label">Business Type</label>
                        <select className="settings-input" style={{ height:46 }}>
                          <option>Individual Landlord</option>
                          <option>Property Agency</option>
                          <option>Real Estate Company</option>
                        </select>
                      </div>
                      <div className="settings-field">
                        <label className="settings-label">RC Number</label>
                        <input className="settings-input" placeholder="e.g. RC123456" />
                      </div>
                    </div>
                    <div className="settings-field">
                      <label className="settings-label">Office Address</label>
                      <input className="settings-input" placeholder="Full business address" />
                    </div>
                    <div className="settings-field">
                      <label className="settings-label">Lease Footer Note</label>
                      <textarea className="settings-input" rows={3}
                        style={{ height:"auto", padding:"12px 14px", resize:"vertical" }}
                        placeholder="Text that appears at the bottom of every generated lease (e.g. company disclaimer)" />
                    </div>
                  </div>
                </SectionCard>

                <div style={{ border:"1px solid color-mix(in srgb,var(--accent) 25%,transparent)", background:"color-mix(in srgb,var(--accent) 3%,transparent)" }}>
                  <div style={{ padding:"18px 24px", borderBottom:"1px solid color-mix(in srgb,var(--accent) 15%,transparent)", display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:3, height:18, background:"var(--accent)" }} />
                    <h3 style={{ fontFamily:"var(--font-display)", fontSize:16, letterSpacing:".06em", color:"var(--accent)" }}>Danger Zone</h3>
                  </div>
                  <div style={{ padding:"8px 24px 16px" }}>
                    <SettingRow label="Export All Data" desc="Download a ZIP of all your leases, templates, and tenant data.">
                      <button className="pg-btn ghost" style={{ height:36, padding:"0 16px", fontSize:10 }}>
                        <Download size={12} strokeWidth={1.5} /> Export
                      </button>
                    </SettingRow>
                    <SettingRow label="Delete Account" desc="Permanently delete your account and all associated data. This cannot be undone.">
                      <button className="pg-btn danger" style={{ height:36, padding:"0 16px", fontSize:10 }}>
                        <Trash2 size={12} strokeWidth={1.5} /> Delete
                      </button>
                    </SettingRow>
                    <div style={{ paddingBottom:8 }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Shell>
    </>
  );
}