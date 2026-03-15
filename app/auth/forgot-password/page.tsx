"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setSent(true);
  }

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateX(-16px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity:0; transform:scale(.96); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes spin {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
        @keyframes grain {
          0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)}
          20%{transform:translate(3%,1%)} 30%{transform:translate(-1%,4%)}
          40%{transform:translate(4%,-2%)} 50%{transform:translate(-3%,3%)}
          60%{transform:translate(1%,-4%)} 70%{transform:translate(-4%,2%)}
          80%{transform:translate(2%,-1%)} 90%{transform:translate(-1%,-3%)}
        }
        @keyframes checkPop {
          0%   { transform:scale(0) rotate(-10deg); opacity:0; }
          60%  { transform:scale(1.15) rotate(2deg); opacity:1; }
          100% { transform:scale(1) rotate(0deg); opacity:1; }
        }
        @keyframes dash {
          from { stroke-dashoffset: 60; }
          to   { stroke-dashoffset: 0; }
        }

        .fp-page {
          min-height:100svh;
          background:var(--ink);
          display:flex;
          align-items:center;
          justify-content:center;
          position:relative;
          overflow:hidden;
          padding:clamp(24px,5vw,48px);
        }

        /* Grid overlay */
        .fp-page::before {
          content:'';
          position:absolute; inset:0;
          background-image:
            linear-gradient(rgba(245,240,232,.04) 1px,transparent 1px),
            linear-gradient(90deg,rgba(245,240,232,.04) 1px,transparent 1px);
          background-size:60px 60px;
          pointer-events:none;
        }

        /* Grain */
        .fp-page::after {
          content:'';
          position:absolute; inset:-50%;
          width:200%; height:200%;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity:.04;
          animation:grain 8s steps(1) infinite;
          pointer-events:none;
        }

        /* Big bg text */
        .fp-bg-text {
          position:absolute;
          font-family:var(--font-display);
          font-size:clamp(120px,22vw,320px);
          line-height:1;
          color:var(--paper);
          opacity:.025;
          user-select:none;
          pointer-events:none;
          letter-spacing:-.02em;
          bottom:-20px; right:-20px;
          z-index:0;
        }

        .fp-card {
          width:100%;
          max-width:460px;
          position:relative;
          z-index:1;
          animation:scaleIn .5s cubic-bezier(.77,0,.18,1) both;
        }

        /* Accent bar */
        .fp-accent-bar {
          width:100%; height:3px;
          background:linear-gradient(90deg,var(--accent),var(--gold));
          margin-bottom:40px;
        }

        /* Back link */
        .fp-back {
          display:inline-flex; align-items:center; gap:8px;
          font-size:10px; font-weight:700;
          letter-spacing:.16em; text-transform:uppercase;
          color:rgba(245,240,232,.35);
          text-decoration:none;
          transition:color .2s;
          margin-bottom:32px;
        }
        .fp-back:hover { color:rgba(245,240,232,.7); }

        /* Wordmark */
        .fp-wordmark {
          font-family:var(--font-display);
          font-size:clamp(20px,3vw,26px);
          letter-spacing:.1em;
          color:var(--paper);
          display:block;
          margin-bottom:40px;
        }

        /* Heading */
        .fp-h1 {
          font-family:var(--font-display);
          font-size:clamp(40px,6vw,72px);
          line-height:.88;
          letter-spacing:.02em;
          color:var(--paper);
          margin-bottom:8px;
        }
        .fp-h1-serif {
          font-family:var(--font-serif);
          font-style:italic;
          font-size:clamp(40px,6vw,72px);
          line-height:.88;
          color:var(--accent);
          display:block;
          margin-bottom:20px;
        }
        .fp-sub {
          font-size:13px; line-height:1.65;
          color:rgba(245,240,232,.45);
          font-weight:300;
          margin-bottom:40px;
        }

        /* Field */
        .fp-field { display:flex; flex-direction:column; gap:8px; margin-bottom:24px; }
        .fp-label {
          font-size:10px; font-weight:700;
          letter-spacing:.16em; text-transform:uppercase;
          color:rgba(245,240,232,.35);
          transition:color .2s;
        }
        .fp-label.active { color:rgba(245,240,232,.8); }

        .fp-input-wrap { position:relative; }
        .fp-input-icon {
          position:absolute; left:16px; top:50%; transform:translateY(-50%);
          color:rgba(245,240,232,.25);
          pointer-events:none;
          transition:color .2s;
        }
        .fp-input-icon.active { color:rgba(245,240,232,.6); }

        .fp-input {
          width:100%; height:52px;
          padding:0 16px 0 46px;
          background:rgba(245,240,232,.06);
          border:1px solid rgba(245,240,232,.12);
          font-family:var(--font-body); font-size:14px;
          color:var(--paper);
          outline:none; appearance:none; border-radius:0;
          transition:border-color .2s, background .2s, box-shadow .2s;
        }
        .fp-input::placeholder { color:rgba(245,240,232,.2); }
        .fp-input:focus {
          border-color:rgba(245,240,232,.4);
          background:rgba(245,240,232,.09);
          box-shadow:4px 4px 0 var(--accent);
        }

        /* Submit */
        .fp-btn {
          width:100%; height:52px;
          background:var(--paper); color:var(--ink);
          border:none; font-family:var(--font-body);
          font-size:12px; font-weight:700;
          letter-spacing:.16em; text-transform:uppercase;
          display:flex; align-items:center; justify-content:center; gap:10px;
          cursor:pointer; position:relative; overflow:hidden;
          transition:box-shadow .2s, transform .2s;
        }
        .fp-btn::before {
          content:'';
          position:absolute; inset:0;
          background:var(--accent);
          transform:translateX(-101%);
          transition:transform .4s cubic-bezier(.77,0,.18,1);
        }
        .fp-btn:hover::before { transform:translateX(0); }
        .fp-btn:hover { color:var(--paper); box-shadow:6px 6px 0 rgba(245,240,232,.15); }
        .fp-btn > * { position:relative; z-index:1; }
        .fp-btn:active { transform:translate(2px,2px); box-shadow:none; }
        .fp-btn:disabled { opacity:.5; cursor:not-allowed; }
        .fp-btn:disabled::before { display:none; }

        /* Success state */
        .fp-success {
          display:flex; flex-direction:column; align-items:flex-start; gap:0;
          animation:slideUp .5s cubic-bezier(.77,0,.18,1) both;
        }
        .fp-check-circle {
          width:64px; height:64px;
          border:2px solid var(--accent);
          display:flex; align-items:center; justify-content:center;
          margin-bottom:32px;
          animation:checkPop .5s cubic-bezier(.77,0,.18,1) .1s both;
        }
        .fp-check-svg {
          stroke-dasharray:60;
          stroke-dashoffset:60;
          animation:dash .4s ease .4s forwards;
        }

        /* Stagger */
        .a1 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .1s both; }
        .a2 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .2s both; }
        .a3 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .3s both; }
        .a4 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .4s both; }
        .a5 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .5s both; }
      `}</style>

      <div className="fp-page">
        <span className="fp-bg-text">FP</span>

        <div className="fp-card">
          <div className="fp-accent-bar a1" />

          {/* Wordmark */}
          <span className="fp-wordmark a1">LEEZIGN</span>

          {!sent ? (
            <>
              {/* Heading */}
              <div className="a2">
                <h1 className="fp-h1">FORGOT</h1>
                <span className="fp-h1-serif">password?</span>
                <p className="fp-sub">
                  No stress. Enter your account email and we'll send a reset code straight to your inbox.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="fp-field a3">
                  <label className={`fp-label ${focused ? "active" : ""}`}>
                    Email Address
                  </label>
                  <div className="fp-input-wrap">
                    <Mail size={15} className={`fp-input-icon ${focused ? "active" : ""}`} strokeWidth={1.5} />
                    <input
                      type="email"
                      className="fp-input"
                      placeholder="name@company.com"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                    />
                  </div>
                </div>

                <div className="a4">
                  <button type="submit" className="fp-btn" disabled={loading || !email}>
                    {loading
                      ? <Loader2 size={16} strokeWidth={1.5} style={{ animation:"spin 1s linear infinite" }} />
                      : <><span>Send Reset Code</span><ArrowRight size={14} strokeWidth={2} /></>
                    }
                  </button>
                </div>
              </form>

              <div className="a5" style={{ marginTop:32 }}>
                <Link href="/auth/login" className="fp-back">
                  <ArrowLeft size={12} strokeWidth={2} /> Back to Sign In
                </Link>
              </div>
            </>
          ) : (
            <div className="fp-success">
              <div className="fp-check-circle">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <polyline
                    points="5,14 11,20 23,8"
                    stroke="var(--accent)" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    className="fp-check-svg"
                  />
                </svg>
              </div>
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(32px,5vw,52px)", lineHeight:.9, color:"var(--paper)", marginBottom:8 }}>
                CHECK YOUR
              </h2>
              <span style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:"clamp(32px,5vw,52px)", lineHeight:.9, color:"var(--accent)", display:"block", marginBottom:20 }}>
                inbox.
              </span>
              <p style={{ fontSize:13, color:"rgba(245,240,232,.45)", lineHeight:1.7, fontWeight:300, marginBottom:40, maxWidth:360 }}>
                We've sent a 6-digit code to <strong style={{ color:"rgba(245,240,232,.8)", fontWeight:600 }}>{email}</strong>. It expires in 15 minutes.
              </p>
              <Link
                href="/auth/verify-code"
                className="fp-btn"
                style={{ display:"inline-flex", width:"100%", height:52, alignItems:"center", justifyContent:"center", gap:10, background:"var(--paper)", color:"var(--ink)", textDecoration:"none", fontSize:12, fontWeight:700, letterSpacing:".16em", textTransform:"uppercase", position:"relative", overflow:"hidden", transition:"box-shadow .2s" }}
              >
                <span style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:10 }}>
                  Enter Code <ArrowRight size={14} strokeWidth={2} />
                </span>
              </Link>
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                style={{ marginTop:16, background:"none", border:"none", cursor:"pointer" }}
              >
                <span className="fp-back" style={{ marginBottom:0 }}>
                  <ArrowLeft size={12} strokeWidth={2} /> Use a different email
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}