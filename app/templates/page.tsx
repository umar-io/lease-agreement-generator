"use client";

import { useState } from "react";
import { Shell } from "@/app/_components/shell";
import {
  Plus, Home, Building, KeyRound, ScrollText,
  ArrowRight, Star, Copy, Eye, MoreHorizontal,
  Zap, CheckCircle2, Clock,
} from "lucide-react";

const TEMPLATES = [
  {
    id:"TPL-01", name:"Standard Apartment Lease",
    type:"APARTMENT", icon:<Home size={22} strokeWidth={1.5} />,
    clauses:12, uses:38, lastUsed:"Mar 10, 2025",
    tags:["Residential","Fixed-term","Lagos"],
    starred:true, description:"Full residential apartment lease with standard Lagos state clauses, utilities, and maintenance terms.",
  },
  {
    id:"TPL-02", name:"Detached House Agreement",
    type:"HOUSE", icon:<Building size={22} strokeWidth={1.5} />,
    clauses:15, uses:14, lastUsed:"Feb 28, 2025",
    tags:["Residential","Long-term","Abuja"],
    starred:true, description:"Comprehensive single-family home lease including garden, parking, and all FCT statutory requirements.",
  },
  {
    id:"TPL-03", name:"Room Rental Agreement",
    type:"ROOM", icon:<KeyRound size={22} strokeWidth={1.5} />,
    clauses:8, uses:22, lastUsed:"Mar 13, 2025",
    tags:["Shared","Short-term","Flexible"],
    starred:false, description:"Lightweight room rental for shared living arrangements. Includes house-rules addendum.",
  },
  {
    id:"TPL-04", name:"Commercial Office Lease",
    type:"COMMERCIAL", icon:<ScrollText size={22} strokeWidth={1.5} />,
    clauses:20, uses:7, lastUsed:"Mar 7, 2025",
    tags:["Commercial","Office","Full-service"],
    starred:false, description:"Detailed commercial lease for office spaces. Includes service charge schedule and break clause options.",
  },
  {
    id:"TPL-05", name:"Short-Stay Apartment",
    type:"APARTMENT", icon:<Home size={22} strokeWidth={1.5} />,
    clauses:9, uses:11, lastUsed:"Mar 12, 2025",
    tags:["Residential","Short-let","Flexible"],
    starred:false, description:"6-month or less furnished apartment agreement. Includes deposit schedule and check-in policy.",
  },
  {
    id:"TPL-06", name:"Retail / Shop Lease",
    type:"COMMERCIAL", icon:<ScrollText size={22} strokeWidth={1.5} />,
    clauses:18, uses:4, lastUsed:"Jan 15, 2025",
    tags:["Commercial","Retail","Street-level"],
    starred:false, description:"Retail unit lease with signage rights, opening-hours clause, and turnover rent option.",
  },
];

const TYPE_COLOR: Record<string, string> = {
  APARTMENT:  "rgba(76,175,120,.1)",
  HOUSE:      "rgba(201,168,76,.1)",
  ROOM:       "rgba(10,10,10,.06)",
  COMMERCIAL: "rgba(200,64,42,.08)",
};

const TYPE_ACCENT: Record<string, string> = {
  APARTMENT:  "#4caf78",
  HOUSE:      "var(--gold)",
  ROOM:       "var(--muted)",
  COMMERCIAL: "var(--accent)",
};

export default function TemplatesPage() {
  const [filter, setFilter] = useState("ALL");
  const [starred, setStarred] = useState<string[]>(
    TEMPLATES.filter(t => t.starred).map(t => t.id)
  );
  const [view, setView] = useState<"grid"|"list">("grid");

  const types = ["ALL","APARTMENT","HOUSE","ROOM","COMMERCIAL"];
  const filtered = TEMPLATES.filter(t => filter === "ALL" || t.type === filter);

  return (
    <>
      <style>{`
        .tpl-card{
          background:var(--cream);
          border:1px solid color-mix(in srgb,var(--ink) 8%,transparent);
          display:flex; flex-direction:column;
          overflow:hidden;
          transition:transform .25s, box-shadow .25s;
        }
        .tpl-card:hover{
          transform:translateY(-4px);
          box-shadow:6px 6px 0 color-mix(in srgb,var(--ink) 10%,transparent);
        }
        .tpl-card-header{
          padding:24px 24px 20px;
          display:flex; align-items:flex-start; justify-content:space-between; gap:12px;
        }
        .tpl-icon-wrap{
          width:52px; height:52px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          border:1px solid color-mix(in srgb,var(--ink) 10%,transparent);
        }
        .tpl-star{
          background:none; border:none; cursor:pointer;
          color:rgba(10,10,10,.25); transition:color .2s;
          padding:2px;
        }
        .tpl-star.active{ color:var(--gold); }
        .tpl-card-body{ padding:0 24px 20px; flex:1; }
        .tpl-name{
          font-family:var(--font-display);
          font-size:clamp(16px,2vw,20px); letter-spacing:.04em; color:var(--ink);
          margin-bottom:8px;
        }
        .tpl-desc{ font-size:12px; color:var(--muted); line-height:1.6; margin-bottom:16px; }
        .tpl-tags{ display:flex; gap:6px; flex-wrap:wrap; margin-bottom:16px; }
        .tpl-tag{
          font-size:9px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
          padding:2px 9px;
          border:1px solid color-mix(in srgb,var(--ink) 12%,transparent);
          color:var(--muted);
        }
        .tpl-meta{
          display:flex; gap:20px; align-items:center;
          font-size:11px; color:var(--muted); letter-spacing:.03em;
        }
        .tpl-meta-item{ display:flex; align-items:center; gap:5px; }
        .tpl-card-footer{
          padding:16px 24px;
          border-top:1px solid color-mix(in srgb,var(--ink) 7%,transparent);
          display:flex; gap:8px;
        }
        .tpl-use-btn{
          flex:1; height:40px;
          background:var(--ink); color:var(--paper);
          border:none; font-family:var(--font-body);
          font-size:10px; font-weight:700; letter-spacing:.14em; text-transform:uppercase;
          display:flex; align-items:center; justify-content:center; gap:7px;
          cursor:pointer; position:relative; overflow:hidden;
          transition:box-shadow .2s;
        }
        .tpl-use-btn::before{
          content:''; position:absolute; inset:0;
          background:var(--accent);
          transform:translateX(-101%);
          transition:transform .4s cubic-bezier(.77,0,.18,1);
        }
        .tpl-use-btn:hover::before{ transform:translateX(0); }
        .tpl-use-btn > *{ position:relative; z-index:1; }

        .tpl-type-badge{
          display:inline-block;
          padding:3px 10px;
          font-size:8px; font-weight:700; letter-spacing:.14em; text-transform:uppercase;
          margin-bottom:10px;
        }

        /* list view */
        .tpl-list-row{
          display:flex; align-items:center; gap:0;
          padding:18px 20px;
          border-bottom:1px solid color-mix(in srgb,var(--ink) 6%,transparent);
          transition:background .15s;
        }
        .tpl-list-row:last-child{ border-bottom:none; }
        .tpl-list-row:hover{ background:color-mix(in srgb,var(--ink) 2%,transparent); }

        /* empty state custom */
        .tpl-empty-card{
          border:1.5px dashed color-mix(in srgb,var(--ink) 15%,transparent);
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          padding:48px 24px; gap:12px; cursor:pointer;
          transition:border-color .2s, background .2s; text-align:center;
          min-height:280px;
        }
        .tpl-empty-card:hover{
          border-color:var(--accent);
          background:color-mix(in srgb,var(--accent) 3%,transparent);
        }
      `}</style>

      <Shell
        title="Templates"
        breadcrumb="Templates"
        topbarRight={
          <>
            <div style={{ display:"flex", gap:0, border:"1px solid color-mix(in srgb,var(--ink) 12%,transparent)" }}>
              {(["grid","list"] as const).map(v => (
                <button key={v} onClick={() => setView(v)}
                  style={{
                    width:36, height:36,
                    background: view === v ? "var(--ink)" : "var(--cream)",
                    color: view === v ? "var(--paper)" : "var(--muted)",
                    border:"none", cursor:"pointer", fontSize:10, fontWeight:700,
                    letterSpacing:".1em", textTransform:"uppercase",
                  }}>
                  {v === "grid" ? "⊞" : "≡"}
                </button>
              ))}
            </div>
            <button className="pg-btn">
              <Plus size={14} strokeWidth={2} /> New Template
            </button>
          </>
        }
      >
        {/* Type tabs */}
        <div className="pg-tabs pg-a1">
          {types.map(t => (
            <button key={t} className={`pg-tab ${filter === t ? "active" : ""}`}
              onClick={() => setFilter(t)}>
              {t === "ALL" ? `All (${TEMPLATES.length})` : `${t} (${TEMPLATES.filter(x => x.type === t).length})`}
            </button>
          ))}
        </div>

        {view === "grid" ? (
          <div className="pg-card-grid pg-a2">
            {filtered.map(t => (
              <div key={t.id} className="tpl-card">
                <div className="tpl-card-header">
                  <div className="tpl-icon-wrap"
                    style={{ background:TYPE_COLOR[t.type], borderColor:`${TYPE_ACCENT[t.type]}30`, color:TYPE_ACCENT[t.type] }}>
                    {t.icon}
                  </div>
                  <button
                    className={`tpl-star ${starred.includes(t.id) ? "active" : ""}`}
                    onClick={() => setStarred(s => s.includes(t.id) ? s.filter(x => x !== t.id) : [...s, t.id])}>
                    <Star size={16} fill={starred.includes(t.id) ? "var(--gold)" : "none"} strokeWidth={1.5} />
                  </button>
                </div>
                <div className="tpl-card-body">
                  <span className="tpl-type-badge"
                    style={{ background:TYPE_COLOR[t.type], color:TYPE_ACCENT[t.type] }}>
                    {t.type}
                  </span>
                  <h3 className="tpl-name">{t.name}</h3>
                  <p className="tpl-desc">{t.description}</p>
                  <div className="tpl-tags">
                    {t.tags.map(tag => <span key={tag} className="tpl-tag">{tag}</span>)}
                  </div>
                  <div className="tpl-meta">
                    <div className="tpl-meta-item">
                      <CheckCircle2 size={11} strokeWidth={1.5} color={TYPE_ACCENT[t.type]} />
                      {t.clauses} clauses
                    </div>
                    <div className="tpl-meta-item">
                      <Zap size={11} strokeWidth={1.5} color="var(--muted)" />
                      Used {t.uses}×
                    </div>
                  </div>
                </div>
                <div className="tpl-card-footer">
                  <button className="tpl-use-btn">
                    Use Template <ArrowRight size={12} strokeWidth={2} />
                  </button>
                  <button className="pg-icon-btn"><Copy size={13} strokeWidth={1.5} /></button>
                  <button className="pg-icon-btn"><Eye size={13} strokeWidth={1.5} /></button>
                </div>
              </div>
            ))}

            {/* Add template card */}
            <div className="tpl-empty-card">
              <div style={{ width:48, height:48, border:"1.5px dashed color-mix(in srgb,var(--ink) 20%,transparent)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Plus size={20} strokeWidth={1.5} color="var(--muted)" />
              </div>
              <p style={{ fontSize:13, fontWeight:600, color:"var(--muted)" }}>Create Custom Template</p>
              <p style={{ fontSize:11, color:"var(--muted)", opacity:.7, maxWidth:180 }}>
                Build a reusable lease template from scratch
              </p>
            </div>
          </div>
        ) : (
          /* List view */
          <div className="pg-table-wrap pg-a2">
            {filtered.map(t => (
              <div key={t.id} className="tpl-list-row">
                <div style={{ width:44, height:44, flexShrink:0, background:TYPE_COLOR[t.type], border:`1px solid ${TYPE_ACCENT[t.type]}30`, display:"flex", alignItems:"center", justifyContent:"center", color:TYPE_ACCENT[t.type], marginRight:16 }}>
                  {t.icon}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:13 }}>{t.name}</div>
                  <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{t.clauses} clauses · Used {t.uses}× · {t.lastUsed}</div>
                </div>
                <span className="tpl-type-badge" style={{ background:TYPE_COLOR[t.type], color:TYPE_ACCENT[t.type], marginRight:16 }}>{t.type}</span>
                <div style={{ display:"flex", gap:6 }}>
                  <button className="pg-btn" style={{ padding:"8px 16px", fontSize:10 }}>Use <ArrowRight size={11} /></button>
                  <button className="pg-icon-btn"><MoreHorizontal size={13} strokeWidth={1.5} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Shell>
    </>
  );
}