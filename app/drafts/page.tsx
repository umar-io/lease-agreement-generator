"use client";

import { useState } from "react";
import { Shell } from "@/app/_components/shell";
import {
  PenSquare, Trash2, Send, Eye, Plus, Search,
  Clock, Home, Building, KeyRound, ScrollText, AlertCircle,
} from "lucide-react";

const DRAFTS = [
  {
    id:"DFT-001", title:"Fatima Bello — Commercial Lease",
    type:"COMMERCIAL", lastEdited:"2 hours ago",
    progress:80, missing:["Rent commencement date","Landlord signature"],
    property:"Suite 5, Marina Business Hub", tenant:"Fatima Bello",
    amount:"₦2,800,000",
  },
  {
    id:"DFT-002", title:"New House Lease — Ikoyi",
    type:"HOUSE", lastEdited:"Yesterday",
    progress:45, missing:["Tenant name","Contact details","Lease start date"],
    property:"4 Glover Road, Ikoyi", tenant:"—",
    amount:"—",
  },
  {
    id:"DFT-003", title:"Tunde Bakare — Room Rental",
    type:"ROOM", lastEdited:"3 days ago",
    progress:60, missing:["Monthly rent amount","Security deposit"],
    property:"Room 4, Yaba Student Lodge", tenant:"Tunde Bakare",
    amount:"—",
  },
  {
    id:"DFT-004", title:"Untitled Apartment Lease",
    type:"APARTMENT", lastEdited:"1 week ago",
    progress:15, missing:["Property address","Tenant info","All financial terms"],
    property:"—", tenant:"—",
    amount:"—",
  },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  APARTMENT:  <Home size={16} strokeWidth={1.5} />,
  HOUSE:      <Building size={16} strokeWidth={1.5} />,
  ROOM:       <KeyRound size={16} strokeWidth={1.5} />,
  COMMERCIAL: <ScrollText size={16} strokeWidth={1.5} />,
};

const TYPE_COLOR: Record<string, string> = {
  APARTMENT:"rgba(76,175,120,.1)", HOUSE:"rgba(201,168,76,.1)",
  ROOM:"rgba(10,10,10,.06)", COMMERCIAL:"rgba(200,64,42,.08)",
};
const TYPE_ACCENT: Record<string, string> = {
  APARTMENT:"#4caf78", HOUSE:"var(--gold)", ROOM:"var(--muted)", COMMERCIAL:"var(--accent)",
};

function ProgressRing({ pct, color }: { pct: number; color: string }) {
  const r = 20, circ = 2 * Math.PI * r;
  return (
    <svg width="52" height="52" style={{ flexShrink:0 }}>
      <circle cx="26" cy="26" r={r} fill="none" stroke="color-mix(in srgb,var(--ink) 8%,transparent)" strokeWidth="2.5" />
      <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="2.5"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
        strokeLinecap="round" transform="rotate(-90 26 26)"
        style={{ transition:"stroke-dashoffset .5s ease" }}
      />
      <text x="26" y="30" textAnchor="middle" fill="var(--ink)"
        style={{ fontSize:11, fontFamily:"var(--font-display)", letterSpacing:".02em" }}>
        {pct}%
      </text>
    </svg>
  );
}

export default function DraftsPage() {
  const [search, setSearch] = useState("");
  const [drafts, setDrafts] = useState(DRAFTS);
  const [deleting, setDeleting] = useState<string | null>(null);

  function deleteDraft(id: string) {
    setDeleting(id);
    setTimeout(() => {
      setDrafts(d => d.filter(x => x.id !== id));
      setDeleting(null);
    }, 400);
  }

  const filtered = drafts.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.property.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        .draft-card{
          background:var(--cream);
          border:1px solid color-mix(in srgb,var(--ink) 8%,transparent);
          padding:24px;
          display:flex; flex-direction:column; gap:18px;
          transition:transform .25s, box-shadow .25s, opacity .3s;
        }
        .draft-card:hover{
          transform:translateY(-3px);
          box-shadow:5px 5px 0 color-mix(in srgb,var(--ink) 10%,transparent);
        }
        .draft-card.deleting{ opacity:0; transform:scale(.97); }

        .draft-top{ display:flex; align-items:flex-start; gap:16px; }
        .draft-icon{
          width:44px; height:44px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          border:1px solid color-mix(in srgb,var(--ink) 10%,transparent);
        }
        .draft-title{
          font-family:var(--font-display);
          font-size:clamp(15px,2vw,18px); letter-spacing:.04em; color:var(--ink);
          margin-bottom:4px; line-height:1.1;
        }
        .draft-meta{ font-size:11px; color:var(--muted); display:flex; align-items:center; gap:6px; }

        .draft-details{
          display:grid; grid-template-columns:1fr 1fr; gap:8px;
        }
        .draft-detail{
          display:flex; flex-direction:column; gap:3px;
          padding:10px 12px;
          background:color-mix(in srgb,var(--ink) 3%,transparent);
          border:1px solid color-mix(in srgb,var(--ink) 6%,transparent);
        }
        .draft-detail-label{ font-size:9px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); }
        .draft-detail-val{ font-size:12px; font-weight:500; color:var(--ink); }

        .draft-missing{
          display:flex; flex-direction:column; gap:6px;
          padding:12px 14px;
          border:1px solid color-mix(in srgb,var(--accent) 25%,transparent);
          background:color-mix(in srgb,var(--accent) 4%,transparent);
          border-left:3px solid var(--accent);
        }
        .draft-missing-title{ font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--accent); display:flex; align-items:center; gap:6px; }
        .draft-missing-item{ font-size:11px; color:var(--muted); display:flex; align-items:center; gap:6px; }
        .draft-missing-dot{ width:4px; height:4px; border-radius:50%; background:var(--accent); flex-shrink:0; }

        .draft-footer{ display:flex; gap:8px; align-items:center; }

        .draft-progress-bar{
          flex:1; height:3px;
          background:color-mix(in srgb,var(--ink) 8%,transparent);
          overflow:hidden;
        }
        .draft-progress-fill{
          height:100%; transition:width .5s ease;
        }

        /* Empty */
        .drafts-empty{
          padding:100px 24px;
          display:flex; flex-direction:column; align-items:center; gap:16px; text-align:center;
        }
      `}</style>

      <Shell
        title="Drafts"
        breadcrumb="Drafts"
        topbarRight={
          <>
            <div className="pg-search">
              <Search size={13} color="var(--muted)" strokeWidth={1.5} />
              <input placeholder="Search drafts..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="pg-btn">
              <Plus size={14} strokeWidth={2} /> New Draft
            </button>
          </>
        }
      >
        {/* Summary bar */}
        <div className="pg-a1" style={{ display:"flex", gap:12, marginBottom:28, flexWrap:"wrap" }}>
          {[
            { label:`${drafts.length} total drafts`, color:"var(--ink)" },
            { label:`${drafts.filter(d=>d.progress>=75).length} near complete`, color:"#4caf78" },
            { label:`${drafts.filter(d=>d.progress<50).length} need attention`, color:"var(--accent)" },
          ].map(s => (
            <div key={s.label} style={{
              padding:"10px 18px",
              background:"var(--cream)",
              border:`1px solid color-mix(in srgb,var(--ink) 8%,transparent)`,
              borderLeft:`3px solid ${s.color}`,
              fontSize:12, fontWeight:600, color:"var(--ink)",
            }}>{s.label}</div>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="pg-card-grid pg-a2">
            {filtered.map(d => (
              <div key={d.id} className={`draft-card ${deleting === d.id ? "deleting" : ""}`}>

                {/* Top */}
                <div className="draft-top">
                  <div className="draft-icon"
                    style={{ background:TYPE_COLOR[d.type], borderColor:`${TYPE_ACCENT[d.type]}25`, color:TYPE_ACCENT[d.type] }}>
                    {TYPE_ICONS[d.type]}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <h3 className="draft-title">{d.title}</h3>
                    <div className="draft-meta">
                      <Clock size={10} strokeWidth={1.5} /> {d.lastEdited}
                      <span style={{ opacity:.4 }}>·</span>
                      <span style={{ fontFamily:"var(--font-display)", fontSize:11, letterSpacing:".06em", color:"var(--accent)" }}>{d.id}</span>
                    </div>
                  </div>
                  <ProgressRing pct={d.progress} color={d.progress >= 75 ? "#4caf78" : d.progress >= 50 ? "var(--gold)" : "var(--accent)"} />
                </div>

                {/* Detail grid */}
                <div className="draft-details">
                  <div className="draft-detail">
                    <span className="draft-detail-label">Property</span>
                    <span className="draft-detail-val">{d.property}</span>
                  </div>
                  <div className="draft-detail">
                    <span className="draft-detail-label">Tenant</span>
                    <span className="draft-detail-val">{d.tenant}</span>
                  </div>
                </div>

                {/* Missing fields */}
                {d.missing.length > 0 && (
                  <div className="draft-missing">
                    <div className="draft-missing-title">
                      <AlertCircle size={11} strokeWidth={1.5} /> Missing Fields
                    </div>
                    {d.missing.map(m => (
                      <div key={m} className="draft-missing-item">
                        <div className="draft-missing-dot" /> {m}
                      </div>
                    ))}
                  </div>
                )}

                {/* Progress bar */}
                <div className="draft-progress-bar">
                  <div className="draft-progress-fill"
                    style={{
                      width:`${d.progress}%`,
                      background: d.progress >= 75 ? "#4caf78" : d.progress >= 50 ? "var(--gold)" : "var(--accent)",
                    }} />
                </div>

                {/* Actions */}
                <div className="draft-footer">
                  <button className="pg-btn" style={{ flex:1, height:38, fontSize:10 }}>
                    <PenSquare size={12} strokeWidth={1.5} /> Continue Editing
                  </button>
                  <button className="pg-icon-btn" title="Preview"><Eye size={13} strokeWidth={1.5} /></button>
                  <button className="pg-icon-btn" title="Send" disabled={d.progress < 80}>
                    <Send size={13} strokeWidth={1.5} />
                  </button>
                  <button className="pg-icon-btn" title="Delete"
                    style={{ color:"var(--accent)" }}
                    onClick={() => deleteDraft(d.id)}>
                    <Trash2 size={13} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="drafts-empty pg-a2">
            <div className="pg-empty-icon"><PenSquare size={24} strokeWidth={1.5} /></div>
            <p className="pg-empty-title">No Drafts</p>
            <p className="pg-empty-sub">
              {search ? `No drafts match "${search}".` : "Start a new lease and save it as a draft to continue later."}
            </p>
            {search
              ? <button className="pg-btn" onClick={() => setSearch("")}>Clear Search</button>
              : <button className="pg-btn"><Plus size={13} strokeWidth={2} /> New Draft</button>
            }
          </div>
        )}
      </Shell>
    </>
  );
}