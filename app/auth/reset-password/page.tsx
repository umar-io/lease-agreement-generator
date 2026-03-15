"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [showCf, setShowCf]         = useState(false);
  const [focused, setFocused]       = useState<string | null>(null);
  const [loading, setLoading]       = useState(false);
  const [done, setDone]             = useState(false);

  function calcStrength(v: string) {
    let s = 0;
    if (v.length >= 8)          s++;
    if (/[A-Z]/.test(v))        s++;
    if (/[0-9]/.test(v))        s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    return s;
  }

  const strength      = calcStrength(password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "var(--accent)", "var(--gold)", "var(--gold)", "#4caf78"][strength];
  const match         = confirm === "" || password === confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setDone(true);
  }

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity:0; transform:scale(.96); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
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

        .rp-page {
          min-height:100svh;
          background:var(--ink);
          display:flex; align-items:center; justify-content:center;
          position:relative; overflow:hidden;
          padding:clamp(24px,5vw,48px);
        }
        .rp-page::before {
          content:'';
          position:absolute; inset:0;
          background-image:
            linear-gradient(rgba(245,240,232,.04) 1px,transparent 1px),
            linear-gradient(90deg,rgba(245,240,232,.04) 1px,transparent 1px);
          background-size:60px 60px;
          pointer-events:none;
        }
        .rp-page::after {
          content:'';
          position:absolute; inset:-50%; width:200%; height:200%;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity:.04;
          animation:grain 8s steps(1) infinite;
          pointer-events:none;
        }

        .rp-bg-text {
          position:absolute;
          font-family:var(--font-display);
          font-size:clamp(120px,20vw,280px);
          line-height:1; color:var(--paper); opacity:.025;
          user-select:none; pointer-events:none;
          bottom:-20px; right:-10px; z-index:0;
          letter-spacing:-.02em;
        }

        .rp-card {
          width:100%; max-width:460px;
          position:relative; z-index:1;
          animation:scaleIn .5s cubic-bezier(.77,0,.18,1) both;
        }

        .rp-accent-bar {
          width:100%; height:3px;
          background:linear-gradient(90deg,var(--accent),var(--gold));
          margin-bottom:40px;
        }

        .rp-wordmark {
          font-family:var(--font-display);
          font-size:clamp(20px,3vw,26px);
          letter-spacing:.1em; color:var(--paper);
          display:block; margin-bottom:40px;
        }

        .rp-h1 {
          font-family:var(--font-display);
          font-size:clamp(36px,6vw,64px);
          line-height:.88; color:var(--paper); margin-bottom:6px;
        }
        .rp-h1-serif {
          font-family:var(--font-serif);
          font-style:italic;
          font-size:clamp(36px,6vw,64px);
          line-height:.88; color:var(--accent);
          display:block; margin-bottom:20px;
        }
        .rp-sub {
          font-size:13px; line-height:1.65;
          color:rgba(245,240,232,.45); font-weight:300;
          margin-bottom:40px;
        }

        /* Fields */
        .rp-field { display:flex; flex-direction:column; gap:8px; }
        .rp-label {
          font-size:10px; font-weight:700;
          letter-spacing:.16em; text-transform:uppercase;
          color:rgba(245,240,232,.35); transition:color .2s;
        }
        .rp-label.active { color:rgba(245,240,232,.8); }

        .rp-pw-wrap { position:relative; }
        .rp-input {
          width:100%; height:52px;
          padding:0 52px 0 16px;
          background:rgba(245,240,232,.06);
          border:1px solid rgba(245,240,232,.12);
          font-family:var(--font-body); font-size:14px;
          color:var(--paper); outline:none;
          appearance:none; border-radius:0;
          transition:border-color .2s, background .2s, box-shadow .2s;
        }
        .rp-input::placeholder { color:rgba(245,240,232,.2); }
        .rp-input:focus {
          border-color:rgba(245,240,232,.4);
          background:rgba(245,240,232,.09);
          box-shadow:4px 4px 0 var(--accent);
        }
        .rp-input.error {
          border-color:var(--accent);
          box-shadow:4px 4px 0 color-mix(in srgb,var(--accent) 40%,transparent);
        }
        .rp-pw-toggle {
          position:absolute; right:0; top:0; bottom:0; width:52px;
          display:flex; align-items:center; justify-content:center;
          background:none; border:none; cursor:pointer;
          color:rgba(245,240,232,.3); transition:color .2s;
        }
        .rp-pw-toggle:hover { color:rgba(245,240,232,.7); }

        /* Strength */
        .rp-strength-row {
          display:flex; align-items:center; gap:8px; margin-top:8px;
        }
        .rp-strength-bars { display:flex; gap:4px; flex:1; }
        .rp-strength-bar {
          flex:1; height:2px;
          background:rgba(245,240,232,.1);
          transition:background .3s;
        }
        .rp-strength-label {
          font-size:9px; font-weight:700;
          letter-spacing:.12em; text-transform:uppercase;
          min-width:40px;
        }

        /* Mismatch */
        .rp-mismatch {
          font-size:11px; color:var(--accent);
          letter-spacing:.04em; margin-top:6px;
          display:flex; align-items:center; gap:6px;
        }

        /* Requirements */
        .rp-req-list {
          display:grid; grid-template-columns:1fr 1fr;
          gap:8px; margin-top:12px;
        }
        .rp-req {
          display:flex; align-items:center; gap:7px;
          font-size:11px; color:rgba(245,240,232,.3);
          transition:color .25s;
        }
        .rp-req.met { color:rgba(245,240,232,.7); }
        .rp-req-dot {
          width:5px; height:5px; border-radius:50%;
          background:rgba(245,240,232,.2);
          flex-shrink:0; transition:background .25s;
        }
        .rp-req.met .rp-req-dot { background:#4caf78; }

        /* Submit */
        .rp-btn {
          width:100%; height:52px;
          background:var(--paper); color:var(--ink);
          border:none; font-family:var(--font-body);
          font-size:12px; font-weight:700;
          letter-spacing:.16em; text-transform:uppercase;
          display:flex; align-items:center; justify-content:center; gap:10px;
          cursor:pointer; position:relative; overflow:hidden;
          transition:box-shadow .2s, transform .2s;
        }
        .rp-btn::before {
          content:''; position:absolute; inset:0;
          background:var(--accent);
          transform:translateX(-101%);
          transition:transform .4s cubic-bezier(.77,0,.18,1);
        }
        .rp-btn:hover::before { transform:translateX(0); }
        .rp-btn:hover { color:var(--paper); box-shadow:6px 6px 0 rgba(245,240,232,.15); }
        .rp-btn > * { position:relative; z-index:1; }
        .rp-btn:active { transform:translate(2px,2px); box-shadow:none; }
        .rp-btn:disabled { opacity:.4; cursor:not-allowed; }
        .rp-btn:disabled::before { display:none; }

        /* Done state */
        .rp-done {
          display:flex; flex-direction:column; align-items:flex-start;
          animation:slideUp .5s cubic-bezier(.77,0,.18,1) both;
        }
        .rp-shield {
          width:64px; height:64px;
          border:2px solid #4caf78;
          display:flex; align-items:center; justify-content:center;
          margin-bottom:32px;
          animation:checkPop .5s cubic-bezier(.77,0,.18,1) .1s both;
        }

        .a1 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .1s both; }
        .a2 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .2s both; }
        .a3 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .3s both; }
        .a4 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .4s both; }
        .a5 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .5s both; }
        .a6 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .6s both; }
      `}</style>

      <div className="rp-page">
        <span className="rp-bg-text">RP</span>

        <div className="rp-card">
          <div className="rp-accent-bar a1" />
          <span className="rp-wordmark a1">LEEZIGN</span>

          {!done ? (
            <>
              <div className="a2">
                <h1 className="rp-h1">RESET YOUR</h1>
                <span className="rp-h1-serif">password.</span>
                <p className="rp-sub">Choose a strong new password for your account. You'll be signed in immediately after.</p>
              </div>

              <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:20 }}>

                {/* New password */}
                <div className="rp-field a3">
                  <label className={`rp-label ${focused === "pw" ? "active" : ""}`}>New Password</label>
                  <div className="rp-pw-wrap">
                    <input
                      type={showPw ? "text" : "password"}
                      placeholder="Create a strong password"
                      required minLength={8}
                      className="rp-input"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onFocus={() => setFocused("pw")}
                      onBlur={() => setFocused(null)}
                    />
                    <button type="button" className="rp-pw-toggle" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                      {showPw ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                    </button>
                  </div>

                  {/* Strength meter */}
                  {password && (
                    <div className="rp-strength-row">
                      <div className="rp-strength-bars">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="rp-strength-bar"
                            style={{ background: i <= strength ? strengthColor : undefined }} />
                        ))}
                      </div>
                      <span className="rp-strength-label" style={{ color:strengthColor }}>{strengthLabel}</span>
                    </div>
                  )}

                  {/* Requirements */}
                  {password && (
                    <div className="rp-req-list">
                      {[
                        ["8+ characters",  password.length >= 8],
                        ["Uppercase letter", /[A-Z]/.test(password)],
                        ["Number",         /[0-9]/.test(password)],
                        ["Special char",   /[^A-Za-z0-9]/.test(password)],
                      ].map(([label, met]) => (
                        <div key={String(label)} className={`rp-req ${met ? "met" : ""}`}>
                          <div className="rp-req-dot" />
                          {label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm */}
                <div className="rp-field a4">
                  <label className={`rp-label ${focused === "cf" ? "active" : ""}`}>Confirm Password</label>
                  <div className="rp-pw-wrap">
                    <input
                      type={showCf ? "text" : "password"}
                      placeholder="Repeat your password"
                      required
                      className={`rp-input ${!match ? "error" : ""}`}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      onFocus={() => setFocused("cf")}
                      onBlur={() => setFocused(null)}
                    />
                    <button type="button" className="rp-pw-toggle" onClick={() => setShowCf(v => !v)} tabIndex={-1}>
                      {showCf ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                    </button>
                  </div>
                  {!match && <p className="rp-mismatch"><span>✕</span> Passwords do not match</p>}
                </div>

                <div className="a5">
                  <button type="submit" className="rp-btn" disabled={loading || !match || strength < 2 || !password || !confirm}>
                    {loading
                      ? <Loader2 size={16} strokeWidth={1.5} style={{ animation:"spin 1s linear infinite" }} />
                      : <><span>Set New Password</span><ArrowRight size={14} strokeWidth={2} /></>
                    }
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="rp-done">
              <div className="rp-shield">
                <ShieldCheck size={28} color="#4caf78" strokeWidth={1.5} />
              </div>
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(32px,5vw,52px)", lineHeight:.9, color:"var(--paper)", marginBottom:8 }}>
                PASSWORD
              </h2>
              <span style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:"clamp(32px,5vw,52px)", lineHeight:.9, color:"#4caf78", display:"block", marginBottom:20 }}>
                updated.
              </span>
              <p style={{ fontSize:13, color:"rgba(245,240,232,.45)", lineHeight:1.7, fontWeight:300, marginBottom:40, maxWidth:340 }}>
                Your password has been reset successfully. You can now sign in with your new credentials.
              </p>
              <Link
                href="/auth/login"
                style={{
                  display:"inline-flex", alignItems:"center", justifyContent:"center", gap:10,
                  width:"100%", height:52,
                  background:"var(--paper)", color:"var(--ink)",
                  textDecoration:"none",
                  fontSize:12, fontWeight:700, letterSpacing:".16em", textTransform:"uppercase",
                }}
              >
                Sign In to Dashboard <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}