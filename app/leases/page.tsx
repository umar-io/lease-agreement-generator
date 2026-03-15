"use client";

import { useState } from "react";
import { Shell } from "@/app/_components/shell";
import {
  Plus, Search, Download, Eye, Send, MoreHorizontal,
  Home, Building, KeyRound, ScrollText ,ArrowUpDown,
} from "lucide-react";

const ALL_LEASES = [
  { id:"LF-001", tenant:"James Adeyemi",   property:"12 Victoria Island, Apt 4B",   type:"APARTMENT",  status:"SIGNED",   date:"Mar 10, 2025", amount:"₦450,000",   agent:"Umar" },
  { id:"LF-002", tenant:"Amaka Obi",        property:"Plot 7 Lekki Phase 1",          type:"HOUSE",      status:"PENDING",  date:"Mar 12, 2025", amount:"₦1,200,000", agent:"Umar" },
  { id:"LF-003", tenant:"Chidi Nwosu",      property:"44 Ikeja GRA, Unit 2",          type:"APARTMENT",  status:"SIGNED",   date:"Mar 8,  2025", amount:"₦320,000",   agent:"Umar" },
  { id:"LF-004", tenant:"Fatima Bello",     property:"Suite 5, Marina Business Hub",  type:"COMMERCIAL", status:"DRAFT",    date:"Mar 14, 2025", amount:"₦2,800,000", agent:"Umar" },
  { id:"LF-005", tenant:"Emmanuel Eze",     property:"3 Wuse II, Room B",             type:"ROOM",       status:"PENDING",  date:"Mar 13, 2025", amount:"₦85,000",    agent:"Umar" },
  { id:"LF-006", tenant:"Ngozi Okafor",     property:"18 Banana Island Drive",        type:"HOUSE",      status:"SIGNED",   date:"Mar 6,  2025", amount:"₦3,500,000", agent:"Umar" },
  { id:"LF-007", tenant:"Seun Adebayo",     property:"22 Adeola Odeku, Office 3",     type:"COMMERCIAL", status:"SIGNED",   date:"Feb 28, 2025", amount:"₦1,750,000", agent:"Umar" },
  { id:"LF-008", tenant:"Kemi Ogundimu",    property:"9 Ajose Adeogun, Apt 12A",      type:"APARTMENT",  status:"EXPIRED",  date:"Feb 20, 2025", amount:"₦390,000",   agent:"Umar" },
  { id:"LF-009", tenant:"Ibrahim Musa",     property:"Plot 22 Guzape District",       type:"HOUSE",      status:"SIGNED",   date:"Feb 15, 2025", amount:"₦900,000",   agent:"Umar" },
  { id:"LF-010", tenant:"Tunde Bakare",     property:"Room 4, Yaba Student Lodge",    type:"ROOM",       status:"PENDING",  date:"Mar 14, 2025", amount:"₦60,000",    agent:"Umar" },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  APARTMENT:  <Home size={12} strokeWidth={1.5} />,
  HOUSE:      <Building size={12} strokeWidth={1.5} />,
  ROOM:       <KeyRound size={12} strokeWidth={1.5} />,
  COMMERCIAL: <ScrollText size={12} strokeWidth={1.5} />,
};

const STATUS_CONFIG: Record<string, { color:string; bg:string; dot:string }> = {
  SIGNED:  { color:"#4caf78", bg:"rgba(76,175,120,.1)",  dot:"#4caf78" },
  PENDING: { color:"var(--gold)", bg:"rgba(201,168,76,.1)", dot:"var(--gold)" },
  DRAFT:   { color:"rgba(10,10,10,.4)", bg:"rgba(10,10,10,.05)", dot:"rgba(10,10,10,.3)" },
  EXPIRED: { color:"var(--accent)", bg:"rgba(200,64,42,.08)", dot:"var(--accent)" },
};

export default function LeasesPage() {
  const [search, setSearch]   = useState("");
  const [status, setStatus]   = useState("ALL");
  const [type, setType]       = useState("ALL");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc"|"desc">("asc");
  const [selected, setSelected] = useState<string[]>([]);

  const statuses = ["ALL", "SIGNED", "PENDING", "DRAFT", "EXPIRED"];
  const types    = ["ALL", "APARTMENT", "HOUSE", "ROOM", "COMMERCIAL"];

  function toggleSort(field: string) {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  }

  function toggleSelect(id: string) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  const filtered = ALL_LEASES
    .filter(l => status === "ALL" || l.status === status)
    .filter(l => type   === "ALL" || l.type   === type)
    .filter(l =>
      l.tenant.toLowerCase().includes(search.toLowerCase()) ||
      l.property.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase())
    );

  const counts = statuses.slice(1).reduce((acc, s) => {
    acc[s] = ALL_LEASES.filter(l => l.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <style>{`
        .leases-stat-row{
          display:grid; grid-template-columns:repeat(4,1fr); gap:12px;
          margin-bottom:28px;
        }
        @media(max-width:900px){ .leases-stat-row{ grid-template-columns:repeat(2,1fr); } }
        @media(max-width:480px){ .leases-stat-row{ grid-template-columns:1fr; } }

        .leases-stat{
          background:var(--cream);
          border:1px solid color-mix(in srgb,var(--ink) 8%,transparent);
          padding:18px 20px;
          display:flex; align-items:center; justify-content:space-between;
        }
        .leases-stat-left{ display:flex; flex-direction:column; gap:4px; }
        .leases-stat-num{
          font-family:var(--font-display); font-size:32px;
          letter-spacing:.02em; color:var(--ink); line-height:1;
        }
        .leases-stat-label{ font-size:10px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); }
        .leases-stat-dot{ width:10px; height:10px; border-radius:50%; }

        .leases-checkbox{
          width:16px; height:16px;
          border:1.5px solid color-mix(in srgb,var(--ink) 20%,transparent);
          background:var(--cream); appearance:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0; transition:background .2s, border-color .2s;
        }
        .leases-checkbox:checked{ background:var(--ink); border-color:var(--ink); }
        .leases-checkbox:checked::after{
          content:''; display:block;
          width:4px; height:7px;
          border-right:1.5px solid var(--paper); border-bottom:1.5px solid var(--paper);
          transform:rotate(45deg) translate(-1px,-1px);
        }

        .leases-bulk-bar{
          display:flex; align-items:center; gap:12px;
          padding:12px 18px;
          background:var(--ink); color:var(--paper);
          margin-bottom:12px;
          animation:pgSlideUp .3s ease both;
        }
        .leases-bulk-text{ font-size:12px; font-weight:600; letter-spacing:.04em; flex:1; }
        .leases-bulk-btn{
          background:rgba(245,240,232,.12); border:1px solid rgba(245,240,232,.15);
          color:var(--paper); font-family:var(--font-body);
          font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
          padding:6px 14px; cursor:pointer; transition:background .2s;
        }
        .leases-bulk-btn:hover{ background:rgba(245,240,232,.2); }
        .leases-bulk-btn.danger{ color:var(--accent); }

        .sort-btn{
          background:none; border:none; cursor:pointer;
          display:inline-flex; align-items:center; gap:4px;
          font-size:9px; font-weight:700; letter-spacing:.18em; text-transform:uppercase;
          color:var(--muted); transition:color .2s;
        }
        .sort-btn:hover{ color:var(--ink); }
      `}</style>

      <Shell
        title="All Leases"
        breadcrumb="Leases"
        topbarRight={
          <>
            <div className="pg-search">
              <Search size={13} color="var(--muted)" strokeWidth={1.5} />
              <input placeholder="Search leases..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="pg-select" value={type} onChange={e => setType(e.target.value)}>
              {types.map(t => <option key={t}>{t}</option>)}
            </select>
            <button className="pg-btn ghost" style={{ gap:6 }}>
              <Download size={13} strokeWidth={1.5} /> Export
            </button>
            <button className="pg-btn" style={{ gap:8 }}>
              <Plus size={14} strokeWidth={2} /> New Lease
            </button>
          </>
        }
      >
        {/* Stat strip */}
        <div className="leases-stat-row pg-a1">
          {[
            { label:"Total",   num:ALL_LEASES.length, dot:"var(--ink)" },
            { label:"Signed",  num:counts.SIGNED,     dot:"#4caf78" },
            { label:"Pending", num:counts.PENDING,    dot:"var(--gold)" },
            { label:"Expired", num:counts.EXPIRED,    dot:"var(--accent)" },
          ].map(s => (
            <div key={s.label} className="leases-stat">
              <div className="leases-stat-left">
                <span className="leases-stat-num">{s.num}</span>
                <span className="leases-stat-label">{s.label}</span>
              </div>
              <div className="leases-stat-dot" style={{ background:s.dot }} />
            </div>
          ))}
        </div>

        {/* Status tabs */}
        <div className="pg-tabs pg-a2">
          {statuses.map(s => (
            <button key={s} className={`pg-tab ${status === s ? "active" : ""}`}
              onClick={() => setStatus(s)}>
              {s === "ALL" ? `All (${ALL_LEASES.length})` : `${s} (${counts[s] ?? 0})`}
            </button>
          ))}
        </div>

        {/* Bulk action bar */}
        {selected.length > 0 && (
          <div className="leases-bulk-bar">
            <span className="leases-bulk-text">{selected.length} selected</span>
            <button className="leases-bulk-btn"><Send size={11} style={{ display:"inline", marginRight:5 }} />Send All</button>
            <button className="leases-bulk-btn"><Download size={11} style={{ display:"inline", marginRight:5 }} />Export</button>
            <button className="leases-bulk-btn danger">Delete</button>
            <button className="leases-bulk-btn" onClick={() => setSelected([])}>Clear</button>
          </div>
        )}

        {/* Table */}
        <div className="pg-table-wrap pg-a3">
          {filtered.length > 0 ? (
            <table className="pg-table">
              <thead>
                <tr>
                  <th style={{ width:40 }}>
                    <input type="checkbox" className="leases-checkbox"
                      checked={selected.length === filtered.length}
                      onChange={() => setSelected(selected.length === filtered.length ? [] : filtered.map(l => l.id))}
                    />
                  </th>
                  <th><button className="sort-btn" onClick={() => toggleSort("id")}>ID <ArrowUpDown size={10} /></button></th>
                  <th><button className="sort-btn" onClick={() => toggleSort("tenant")}>Tenant <ArrowUpDown size={10} /></button></th>
                  <th>Type</th>
                  <th>Status</th>
                  <th><button className="sort-btn" onClick={() => toggleSort("date")}>Date <ArrowUpDown size={10} /></button></th>
                  <th><button className="sort-btn" onClick={() => toggleSort("amount")}>Amount <ArrowUpDown size={10} /></button></th>
                  <th style={{ width:80 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => {
                  const sc = STATUS_CONFIG[l.status];
                  return (
                    <tr key={l.id}>
                      <td>
                        <input type="checkbox" className="leases-checkbox"
                          checked={selected.includes(l.id)}
                          onChange={() => toggleSelect(l.id)}
                        />
                      </td>
                      <td>
                        <span style={{ fontFamily:"var(--font-display)", fontSize:14, letterSpacing:".06em", color:"var(--accent)" }}>{l.id}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight:600, fontSize:13 }}>{l.tenant}</div>
                        <div style={{ fontSize:11, color:"var(--muted)", marginTop:2, maxWidth:200 }}>{l.property}</div>
                      </td>
                      <td>
                        <span className="pg-badge" style={{ border:"1px solid color-mix(in srgb,var(--ink) 14%,transparent)", color:"var(--muted)" }}>
                          {TYPE_ICONS[l.type]} {l.type}
                        </span>
                      </td>
                      <td>
                        <span className="pg-badge" style={{ color:sc.color, background:sc.bg }}>
                          <span style={{ width:5,height:5,borderRadius:"50%",background:sc.dot,display:"inline-block",flexShrink:0 }} />
                          {l.status}
                        </span>
                      </td>
                      <td style={{ fontSize:12, color:"var(--muted)", whiteSpace:"nowrap" }}>{l.date}</td>
                      <td style={{ fontFamily:"var(--font-display)", fontSize:15, letterSpacing:".02em" }}>{l.amount}</td>
                      <td>
                        <button className="pg-icon-btn" title="View"><Eye size={13} strokeWidth={1.5} /></button>
                        <button className="pg-icon-btn" title="More" style={{ marginLeft:4 }}><MoreHorizontal size={13} strokeWidth={1.5} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="pg-empty">
              <div className="pg-empty-icon"><Search size={24} strokeWidth={1.5} /></div>
              <p className="pg-empty-title">No Results</p>
              <p className="pg-empty-sub">No leases match your current filters.</p>
              <button className="pg-btn" onClick={() => { setSearch(""); setStatus("ALL"); setType("ALL"); }}>
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="pg-a4" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:20, flexWrap:"wrap", gap:12 }}>
          <span style={{ fontSize:11, color:"var(--muted)", letterSpacing:".04em" }}>
            Showing {filtered.length} of {ALL_LEASES.length} leases
          </span>
          <div style={{ display:"flex", gap:6 }}>
            {[1,2,3].map(p => (
              <button key={p} style={{
                width:32, height:32,
                background: p === 1 ? "var(--ink)" : "var(--cream)",
                color: p === 1 ? "var(--paper)" : "var(--ink)",
                border:"1px solid color-mix(in srgb,var(--ink) 12%,transparent)",
                fontSize:12, fontWeight:700, cursor:"pointer",
              }}>{p}</button>
            ))}
          </div>
        </div>
      </Shell>
    </>
  );
}