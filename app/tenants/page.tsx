"use client";

import { useState } from "react";
import { Shell } from "@/app/_components/shell";
import {
  Plus, Search, Eye, Mail, Phone, MoreHorizontal,
  FileText, CheckCircle2, Clock, X, User,
  MapPin, Briefcase, Calendar,
} from "lucide-react";

const TENANTS = [
  { id:"TNT-001", name:"James Adeyemi",   email:"james@email.com",    phone:"+234 801 234 5678", leases:2, active:true,  lastLease:"Mar 10, 2025", location:"Victoria Island, Lagos",  job:"Software Engineer",     initials:"JA", color:"#4caf78" },
  { id:"TNT-002", name:"Amaka Obi",        email:"amaka@email.com",    phone:"+234 802 345 6789", leases:1, active:true,  lastLease:"Mar 12, 2025", location:"Lekki Phase 1, Lagos",   job:"Marketing Manager",     initials:"AO", color:"var(--gold)" },
  { id:"TNT-003", name:"Chidi Nwosu",      email:"chidi@email.com",    phone:"+234 803 456 7890", leases:3, active:true,  lastLease:"Mar 8,  2025", location:"Ikeja GRA, Lagos",       job:"Civil Engineer",        initials:"CN", color:"var(--accent)" },
  { id:"TNT-004", name:"Fatima Bello",     email:"fatima@email.com",   phone:"+234 804 567 8901", leases:1, active:false, lastLease:"Mar 14, 2025", location:"Marina, Lagos",          job:"Business Owner",        initials:"FB", color:"#9b59b6" },
  { id:"TNT-005", name:"Emmanuel Eze",     email:"emma@email.com",     phone:"+234 805 678 9012", leases:1, active:true,  lastLease:"Mar 13, 2025", location:"Wuse II, Abuja",         job:"Student",               initials:"EE", color:"#3498db" },
  { id:"TNT-006", name:"Ngozi Okafor",     email:"ngozi@email.com",    phone:"+234 806 789 0123", leases:4, active:true,  lastLease:"Mar 6,  2025", location:"Banana Island, Lagos",   job:"Medical Doctor",        initials:"NO", color:"#e67e22" },
  { id:"TNT-007", name:"Seun Adebayo",     email:"seun@email.com",     phone:"+234 807 890 1234", leases:2, active:true,  lastLease:"Feb 28, 2025", location:"Adeola Odeku, Lagos",    job:"Entrepreneur",          initials:"SA", color:"#1abc9c" },
  { id:"TNT-008", name:"Ibrahim Musa",     email:"ibrahim@email.com",  phone:"+234 808 901 2345", leases:1, active:true,  lastLease:"Feb 15, 2025", location:"Guzape, Abuja",          job:"Civil Servant",         initials:"IM", color:"#c0392b" },
];

interface Tenant {
  id:string; name:string; email:string; phone:string;
  leases:number; active:boolean; lastLease:string;
  location:string; job:string; initials:string; color:string;
}

function TenantDrawer({ tenant, onClose }: { tenant: Tenant; onClose: () => void }) {
  return (
    <div style={{
      position:"fixed", inset:0,
      background:"rgba(10,10,10,.5)", backdropFilter:"blur(3px)",
      zIndex:400, display:"flex", justifyContent:"flex-end",
      animation:"fadeInBg .2s ease both",
    }} onClick={onClose}>
      <div style={{
        width:"100%", maxWidth:440,
        background:"var(--paper)",
        display:"flex", flexDirection:"column",
        animation:"slideFromRight .35s cubic-bezier(.77,0,.18,1) both",
        overflowY:"auto",
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding:"28px 28px 20px", borderBottom:"1px solid color-mix(in srgb,var(--ink) 8%,transparent)", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div style={{ display:"flex", gap:16, alignItems:"center" }}>
            <div style={{ width:56, height:56, background:tenant.color, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontSize:22, color:"var(--paper)", flexShrink:0 }}>
              {tenant.initials}
            </div>
            <div>
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:22, letterSpacing:".04em", color:"var(--ink)", marginBottom:4 }}>{tenant.name}</h2>
              <span style={{ fontFamily:"var(--font-display)", fontSize:12, letterSpacing:".08em", color:"var(--accent)" }}>{tenant.id}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, background:"var(--cream)", border:"1px solid color-mix(in srgb,var(--ink) 10%,transparent)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* Status */}
        <div style={{ padding:"16px 28px", background:tenant.active ? "rgba(76,175,120,.06)" : "rgba(200,64,42,.05)", borderBottom:"1px solid color-mix(in srgb,var(--ink) 6%,transparent)", display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:tenant.active ? "#4caf78" : "var(--accent)" }} />
          <span style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:tenant.active ? "#4caf78" : "var(--accent)" }}>
            {tenant.active ? "Active Tenant" : "Inactive"}
          </span>
        </div>

        {/* Details */}
        <div style={{ padding:"24px 28px", display:"flex", flexDirection:"column", gap:20, flex:1 }}>
          {[
            { icon:<Mail size={14} strokeWidth={1.5} />,     label:"Email",      val:tenant.email },
            { icon:<Phone size={14} strokeWidth={1.5} />,    label:"Phone",      val:tenant.phone },
            { icon:<MapPin size={14} strokeWidth={1.5} />,   label:"Location",   val:tenant.location },
            { icon:<Briefcase size={14} strokeWidth={1.5} />, label:"Occupation", val:tenant.job },
            { icon:<Calendar size={14} strokeWidth={1.5} />, label:"Last Lease", val:tenant.lastLease },
          ].map(row => (
            <div key={row.label} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
              <div style={{ width:32, height:32, flexShrink:0, background:"var(--cream)", border:"1px solid color-mix(in srgb,var(--ink) 10%,transparent)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--muted)" }}>
                {row.icon}
              </div>
              <div>
                <div style={{ fontSize:9, fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", color:"var(--muted)", marginBottom:3 }}>{row.label}</div>
                <div style={{ fontSize:13, color:"var(--ink)", fontWeight:500 }}>{row.val}</div>
              </div>
            </div>
          ))}

          <div style={{ padding:"16px", background:"var(--cream)", border:"1px solid color-mix(in srgb,var(--ink) 8%,transparent)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", color:"var(--muted)", marginBottom:4 }}>Total Leases</div>
              <div style={{ fontFamily:"var(--font-display)", fontSize:36, letterSpacing:".02em", color:"var(--ink)" }}>{tenant.leases}</div>
            </div>
            <button className="pg-btn" style={{ height:38, fontSize:10 }}>
              <FileText size={12} strokeWidth={1.5} /> View Leases
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding:"20px 28px", borderTop:"1px solid color-mix(in srgb,var(--ink) 8%,transparent)", display:"flex", gap:10 }}>
          <button className="pg-btn" style={{ flex:1, height:40, fontSize:10 }}>
            <Plus size={12} strokeWidth={2} /> New Lease
          </button>
          <button className="pg-btn ghost" style={{ height:40, padding:"0 16px", fontSize:10 }}>
            <Mail size={12} strokeWidth={1.5} /> Email
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TenantsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL"|"ACTIVE"|"INACTIVE">("ALL");
  const [selected, setSelected] = useState<Tenant | null>(null);

  const filtered = TENANTS
    .filter(t => filter === "ALL" || (filter === "ACTIVE" ? t.active : !t.active))
    .filter(t =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <>
      <style>{`
        @keyframes fadeInBg{ from{opacity:0} to{opacity:1} }
        @keyframes slideFromRight{
          from{ opacity:0; transform:translateX(24px); }
          to  { opacity:1; transform:translateX(0); }
        }

        .tenant-card{
          background:var(--cream);
          border:1px solid color-mix(in srgb,var(--ink) 8%,transparent);
          padding:22px;
          display:flex; flex-direction:column; gap:16px;
          transition:transform .25s, box-shadow .25s; cursor:pointer;
        }
        .tenant-card:hover{
          transform:translateY(-3px);
          box-shadow:5px 5px 0 color-mix(in srgb,var(--ink) 10%,transparent);
        }
        .tenant-avatar{
          width:48px; height:48px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          font-family:var(--font-display); font-size:18px; color:var(--paper);
        }
        .tenant-name{ font-weight:700; font-size:14px; color:var(--ink); }
        .tenant-meta{ font-size:11px; color:var(--muted); }
        .tenant-row{ display:flex; align-items:center; gap:12px; }
        .tenant-stat{
          flex:1; padding:12px;
          background:color-mix(in srgb,var(--ink) 3%,transparent);
          border:1px solid color-mix(in srgb,var(--ink) 6%,transparent);
          display:flex; flex-direction:column; gap:3px;
        }
        .tenant-stat-num{
          font-family:var(--font-display); font-size:22px;
          letter-spacing:.02em; color:var(--ink); line-height:1;
        }
        .tenant-stat-label{ font-size:9px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); }
        .tenant-active-dot{
          width:7px; height:7px; border-radius:50%;
          display:inline-block; margin-right:5px;
        }

        .tenants-summary{
          display:flex; gap:12px; margin-bottom:24px; flex-wrap:wrap;
        }
        .tenants-summary-card{
          padding:16px 20px;
          background:var(--cream);
          border:1px solid color-mix(in srgb,var(--ink) 8%,transparent);
          display:flex; align-items:center; gap:14px;
        }
        .tenants-summary-num{ font-family:var(--font-display); font-size:36px; letter-spacing:.02em; color:var(--ink); line-height:1; }
        .tenants-summary-label{ font-size:10px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); }
      `}</style>

      {selected && <TenantDrawer tenant={selected} onClose={() => setSelected(null)} />}

      <Shell
        title="Tenants"
        breadcrumb="Tenants"
        topbarRight={
          <>
            <div className="pg-search">
              <Search size={13} color="var(--muted)" strokeWidth={1.5} />
              <input placeholder="Search tenants..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="pg-select" value={filter} onChange={e => setFilter(e.target.value as any)}>
              <option value="ALL">All Tenants</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <button className="pg-btn">
              <Plus size={14} strokeWidth={2} /> Add Tenant
            </button>
          </>
        }
      >
        {/* Summary */}
        <div className="tenants-summary pg-a1">
          {[
            { label:"Total Tenants", num:TENANTS.length, accent:"var(--ink)" },
            { label:"Active", num:TENANTS.filter(t=>t.active).length, accent:"#4caf78" },
            { label:"Inactive", num:TENANTS.filter(t=>!t.active).length, accent:"var(--accent)" },
            { label:"Avg. Leases", num:"1.9", accent:"var(--gold)" },
          ].map(s => (
            <div key={s.label} className="tenants-summary-card" style={{ borderLeft:`3px solid ${s.accent}` }}>
              <div className="tenants-summary-num" style={{ color:s.accent }}>{s.num}</div>
              <div className="tenants-summary-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="pg-card-grid pg-a2">
            {filtered.map(t => (
              <div key={t.id} className="tenant-card" onClick={() => setSelected(t)}>
                <div className="tenant-row">
                  <div className="tenant-avatar" style={{ background:t.color }}>{t.initials}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div className="tenant-name">{t.name}</div>
                    <div className="tenant-meta" style={{ display:"flex", alignItems:"center", gap:4 }}>
                      <span className="tenant-active-dot" style={{ background:t.active ? "#4caf78" : "var(--accent)" }} />
                      {t.active ? "Active" : "Inactive"}
                    </div>
                  </div>
                  <button className="pg-icon-btn" onClick={e => { e.stopPropagation(); }}><MoreHorizontal size={13} strokeWidth={1.5} /></button>
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:6, fontSize:12, color:"var(--muted)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <Mail size={11} strokeWidth={1.5} /> {t.email}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <MapPin size={11} strokeWidth={1.5} /> {t.location}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <Briefcase size={11} strokeWidth={1.5} /> {t.job}
                  </div>
                </div>

                <div className="tenant-row">
                  <div className="tenant-stat">
                    <span className="tenant-stat-num">{t.leases}</span>
                    <span className="tenant-stat-label">Leases</span>
                  </div>
                  <div style={{ flex:2, fontSize:11, color:"var(--muted)", paddingLeft:12 }}>
                    <div style={{ fontSize:9, fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", marginBottom:3 }}>Last Lease</div>
                    <div style={{ fontWeight:500, color:"var(--ink)" }}>{t.lastLease}</div>
                  </div>
                </div>

                <div style={{ display:"flex", gap:8 }}>
                  <button className="pg-btn" style={{ flex:1, height:36, fontSize:10 }} onClick={e => { e.stopPropagation(); setSelected(t); }}>
                    <Eye size={12} strokeWidth={1.5} /> View Profile
                  </button>
                  <button className="pg-icon-btn" onClick={e => e.stopPropagation()}><Mail size={13} strokeWidth={1.5} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="pg-empty pg-a2">
            <div className="pg-empty-icon"><User size={24} strokeWidth={1.5} /></div>
            <p className="pg-empty-title">No Tenants Found</p>
            <p className="pg-empty-sub">{search ? `No tenants match "${search}"` : "Add your first tenant to get started."}</p>
            {search
              ? <button className="pg-btn" onClick={() => setSearch("")}>Clear Search</button>
              : <button className="pg-btn"><Plus size={13} strokeWidth={2} /> Add Tenant</button>
            }
          </div>
        )}
      </Shell>
    </>
  );
}