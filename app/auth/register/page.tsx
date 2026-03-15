"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { signup } from "../action";
import { useActionState } from "react";
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [focused, setFocused] = useState<string | null>(null);
  const [strength, setStrength] = useState(0); // 0–4
  const passwordRef = useRef<HTMLInputElement>(null);
  const [state, formAction, isPending] = useActionState(signup, undefined);

  function calcStrength(val: string) {
    let s = 0;
    if (val.length >= 8)              s++;
    if (/[A-Z]/.test(val))            s++;
    if (/[0-9]/.test(val))            s++;
    if (/[^A-Za-z0-9]/.test(val))     s++;
    setStrength(s);
  }

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "var(--accent)", "var(--gold)", "var(--gold)", "#4caf78"][strength];

  return (
    <>
      <style>{`
        @keyframes grain {
          0%, 100% { transform: translate(0,0); }
          10%  { transform: translate(-2%,-3%); }
          20%  { transform: translate(3%,1%); }
          30%  { transform: translate(-1%,4%); }
          40%  { transform: translate(4%,-2%); }
          50%  { transform: translate(-3%,3%); }
          60%  { transform: translate(1%,-4%); }
          70%  { transform: translate(-4%,2%); }
          80%  { transform: translate(2%,-1%); }
          90%  { transform: translate(-1%,-3%); }
        }
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
        @keyframes fadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }

        /* ── PAGE ── */
        .reg-page {
          min-height: 100svh;
          background: var(--paper);
          display: grid;
          grid-template-columns: 1fr;
          overflow: hidden;
          position: relative;
        }
        @media (min-width: 1024px) {
          .reg-page { grid-template-columns: 1fr 1fr; }
        }

        /* ── LEFT PANEL (form side) ── */
        .reg-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: clamp(32px,6vw,72px) clamp(24px,5vw,64px);
          position: relative;
          background: var(--paper);
          overflow-y: auto;
        }
        .reg-left::before {
          content:'';
          position:absolute; inset:0;
          background-image:
            linear-gradient(color-mix(in srgb,var(--ink) 3%,transparent) 1px,transparent 1px),
            linear-gradient(90deg,color-mix(in srgb,var(--ink) 3%,transparent) 1px,transparent 1px);
          background-size:60px 60px;
          pointer-events:none;
        }

        /* ── RIGHT PANEL ── */
        .reg-right {
          display: none;
          position: relative;
          background: var(--ink);
          overflow: hidden;
          padding: 48px;
          flex-direction: column;
          justify-content: space-between;
        }
        @media (min-width: 1024px) {
          .reg-right { display: flex; }
        }
        .reg-right::before {
          content:'';
          position:absolute; inset:0;
          background-image:
            linear-gradient(rgba(245,240,232,.04) 1px,transparent 1px),
            linear-gradient(90deg,rgba(245,240,232,.04) 1px,transparent 1px);
          background-size:60px 60px;
          pointer-events:none;
        }
        .reg-right::after {
          content:'';
          position:absolute; inset:-50%;
          width:200%; height:200%;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity:.04;
          animation:grain 8s steps(1) infinite;
          pointer-events:none;
          z-index:0;
        }
        .reg-right > * { position:relative; z-index:1; }

        .right-bg-num {
          position:absolute; bottom:-40px; right:-20px;
          font-family:var(--font-display);
          font-size:clamp(180px,20vw,300px);
          line-height:1; color:var(--paper); opacity:.03;
          user-select:none; pointer-events:none; z-index:0;
          letter-spacing:-.02em;
        }

        /* ── FORM CARD ── */
        .reg-card {
          width:100%; max-width:420px;
          position:relative; z-index:1;
          animation:scaleIn .5s cubic-bezier(.77,0,.18,1) both;
        }

        /* Accent bar */
        .card-accent-bar {
          width:100%; height:3px;
          background:linear-gradient(90deg,var(--accent),var(--gold));
          margin-bottom:36px;
        }

        /* ── FIELDS ── */
        .field-wrap { display:flex; flex-direction:column; gap:8px; }

        .field-label {
          font-size:10px; font-weight:700;
          letter-spacing:.16em; text-transform:uppercase;
          color:var(--muted); transition:color .2s;
        }
        .field-label.active { color:var(--ink); }

        .field-input {
          width:100%; height:52px;
          padding:0 16px;
          background:var(--cream);
          border:1px solid color-mix(in srgb,var(--ink) 12%,transparent);
          font-family:var(--font-body); font-size:14px; color:var(--ink);
          outline:none; appearance:none; border-radius:0;
          transition:border-color .2s, background .2s, box-shadow .2s;
        }
        .field-input::placeholder { color:color-mix(in srgb,var(--muted) 60%,transparent); }
        .field-input:focus {
          border-color:var(--ink);
          background:var(--paper);
          box-shadow:4px 4px 0 var(--ink);
        }
        .field-input.error {
          border-color:var(--accent);
          box-shadow:4px 4px 0 var(--accent);
        }
        .field-input.valid {
          border-color:#4caf78;
          box-shadow:4px 4px 0 color-mix(in srgb,#4caf78 30%,transparent);
        }

        .pw-wrap { position:relative; }
        .pw-toggle {
          position:absolute; right:0; top:0; bottom:0; width:52px;
          display:flex; align-items:center; justify-content:center;
          color:var(--muted); background:none; border:none; cursor:pointer;
          transition:color .2s;
        }
        .pw-toggle:hover { color:var(--ink); }

        /* ── PASSWORD STRENGTH ── */
        .strength-row {
          display:flex; align-items:center; gap:8px; margin-top:8px;
        }
        .strength-bars {
          display:flex; gap:4px; flex:1;
        }
        .strength-bar {
          flex:1; height:2px;
          background:color-mix(in srgb,var(--ink) 10%,transparent);
          transition:background .3s;
        }

        /* ── PASSWORD MISMATCH ── */
        .mismatch-msg {
          font-size:11px; color:var(--accent);
          letter-spacing:.04em; margin-top:6px;
          animation:fadeIn .2s ease both;
          display:flex; align-items:center; gap:6px;
        }

        /* ── TERMS ── */
        .terms-row {
          display:flex; align-items:flex-start; gap:12px;
          padding:4px 0;
        }
        .terms-checkbox {
          width:18px; height:18px; flex-shrink:0;
          border:1.5px solid color-mix(in srgb,var(--ink) 25%,transparent);
          background:var(--cream);
          appearance:none; cursor:pointer; margin-top:1px;
          transition:background .2s, border-color .2s;
          position:relative;
        }
        .terms-checkbox:checked {
          background:var(--ink);
          border-color:var(--ink);
        }
        .terms-checkbox:checked::after {
          content:'';
          position:absolute; top:3px; left:5px;
          width:5px; height:8px;
          border-right:2px solid var(--paper);
          border-bottom:2px solid var(--paper);
          transform:rotate(45deg);
        }
        .terms-text {
          font-size:12px; color:var(--muted);
          line-height:1.65; font-weight:300;
        }
        .terms-link {
          color:var(--ink); font-weight:700;
          text-decoration:underline;
          text-underline-offset:3px;
          text-decoration-color:color-mix(in srgb,var(--ink) 25%,transparent);
          transition:color .2s;
        }
        .terms-link:hover { color:var(--accent); }

        /* ── SUBMIT ── */
        .submit-btn {
          width:100%; height:52px;
          background:var(--ink); color:var(--paper);
          border:none; font-family:var(--font-body);
          font-size:12px; font-weight:700;
          letter-spacing:.16em; text-transform:uppercase;
          display:flex; align-items:center; justify-content:center; gap:10px;
          cursor:pointer; position:relative; overflow:hidden;
          transition:box-shadow .2s, transform .2s;
        }
        .submit-btn::before {
          content:'';
          position:absolute; inset:0;
          background:var(--accent);
          transform:translateX(-101%);
          transition:transform .4s cubic-bezier(.77,0,.18,1);
        }
        .submit-btn:hover::before { transform:translateX(0); }
        .submit-btn:hover { box-shadow:6px 6px 0 color-mix(in srgb,var(--ink) 20%,transparent); }
        .submit-btn > * { position:relative; z-index:1; }
        .submit-btn:active { transform:translate(2px,2px); box-shadow:none; }
        .submit-btn:disabled { opacity:.6; cursor:not-allowed; }
        .submit-btn:disabled::before { display:none; }

        /* ── SOCIAL BTNS ── */
        .social-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

        .social-btn {
          height:48px;
          background:transparent;
          border:1px solid color-mix(in srgb,var(--ink) 14%,transparent);
          font-family:var(--font-body);
          font-size:11px; font-weight:600;
          letter-spacing:.1em; text-transform:uppercase;
          color:var(--ink);
          display:flex; align-items:center; justify-content:center; gap:9px;
          cursor:pointer;
          transition:border-color .2s, background .2s, transform .2s;
        }
        .social-btn:hover {
          border-color:var(--ink);
          background:color-mix(in srgb,var(--ink) 4%,transparent);
          transform:translateY(-1px);
        }
        .social-btn:disabled { opacity:.5; cursor:not-allowed; }

        /* ── OR DIVIDER ── */
        .or-row { display:flex; align-items:center; gap:14px; }
        .or-line { flex:1; height:1px; background:color-mix(in srgb,var(--ink) 10%,transparent); }
        .or-text {
          font-size:9px; font-weight:700;
          letter-spacing:.2em; text-transform:uppercase;
          color:var(--muted); white-space:nowrap;
        }

        /* ── ERROR BANNER ── */
        .error-banner {
          display:flex; align-items:flex-start; gap:10px;
          padding:14px 16px;
          border:1px solid var(--accent);
          border-left:4px solid var(--accent);
          background:color-mix(in srgb,var(--accent) 5%,transparent);
          animation:slideUp .3s ease both;
        }
        .error-text { font-size:13px; line-height:1.5; color:var(--accent); }

        /* ── LOGIN ROW ── */
        .login-row {
          display:flex; align-items:center; justify-content:center; gap:8px;
          padding-top:28px;
          border-top:1px solid color-mix(in srgb,var(--ink) 8%,transparent);
        }
        .login-text  { font-size:12px; color:var(--muted); }
        .login-link  {
          font-size:12px; font-weight:700;
          letter-spacing:.08em; text-transform:uppercase;
          color:var(--ink); text-decoration:none;
          display:inline-flex; align-items:center; gap:4px;
          transition:color .2s;
        }
        .login-link:hover { color:var(--accent); }

        /* ── MOBILE BAR ── */
        .mobile-bar {
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom:36px; width:100%; max-width:420px;
        }
        @media (min-width:1024px) { .mobile-bar { display:none; } }

        /* ── RIGHT PANEL ELEMENTS ── */
        .right-tag {
          display:inline-flex; align-items:center; gap:8px;
          padding:6px 12px;
          border:1px solid rgba(245,240,232,.12);
          font-size:10px; font-weight:700;
          letter-spacing:.16em; text-transform:uppercase;
          color:rgba(245,240,232,.5);
        }
        .right-headline {
          font-family:var(--font-display);
          font-size:clamp(44px,4.5vw,72px);
          line-height:.88; letter-spacing:.02em;
        }
        .right-serif {
          font-family:var(--font-serif);
          font-style:italic;
          font-size:clamp(44px,4.5vw,72px);
          line-height:.88;
        }

        /* Testimonial */
        .testimonial-card {
          border:1px solid rgba(245,240,232,.08);
          padding:32px;
          position:relative;
        }
        .testi-quote-mark {
          font-family:var(--font-display);
          font-size:80px; line-height:1;
          color:var(--accent); opacity:.4;
          position:absolute; top:12px; left:24px;
        }

        /* Step checklist */
        .step-item {
          display:flex; align-items:flex-start; gap:14px;
          padding:16px 0;
          border-top:1px solid rgba(245,240,232,.06);
        }
        .step-num-badge {
          width:24px; height:24px; flex-shrink:0;
          border:1px solid rgba(245,240,232,.2);
          display:flex; align-items:center; justify-content:center;
          font-family:var(--font-display); font-size:13px;
          color:var(--paper); margin-top:1px;
        }

        /* Stat row */
        .right-stat {
          display:flex; flex-direction:column; gap:4px;
          padding:20px 0;
          border-top:1px solid rgba(245,240,232,.08);
        }
        .right-stat-num {
          font-family:var(--font-display);
          font-size:clamp(28px,3vw,42px);
          line-height:1;
        }
        .right-stat-label {
          font-size:10px; font-weight:500;
          letter-spacing:.08em;
          color:rgba(245,240,232,.4);
        }

        /* Stagger animations */
        .anim-1  { animation:slideIn .6s cubic-bezier(.77,0,.18,1) .1s both; }
        .anim-2  { animation:slideIn .6s cubic-bezier(.77,0,.18,1) .2s both; }
        .anim-3  { animation:slideIn .6s cubic-bezier(.77,0,.18,1) .3s both; }
        .anim-4  { animation:slideIn .6s cubic-bezier(.77,0,.18,1) .4s both; }
        .anim-5  { animation:slideIn .6s cubic-bezier(.77,0,.18,1) .5s both; }

        .anim-up-1 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .1s  both; }
        .anim-up-2 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .2s  both; }
        .anim-up-3 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .3s  both; }
        .anim-up-4 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .4s  both; }
        .anim-up-5 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .5s  both; }
        .anim-up-6 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .6s  both; }
        .anim-up-7 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .7s  both; }
        .anim-up-8 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .8s  both; }
      `}</style>

      <div className="reg-page">

        {/* ─── LEFT — FORM ─── */}
        <div className="reg-left">

          {/* Mobile top bar */}
          <div className="mobile-bar">
            <span style={{ fontFamily:"var(--font-display)", fontSize:22, letterSpacing:".1em", color:"var(--ink)" }}>
              LEASEFLOW
            </span>
            <Link href="/auth/login" className="login-link">
              Sign In <ArrowRight size={11} />
            </Link>
          </div>

          <div className="reg-card">

            {/* Accent bar */}
            <div className="card-accent-bar anim-up-1" />

            {/* Heading */}
            <div className="anim-up-2" style={{ marginBottom:32 }}>
              <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(34px,5vw,52px)", lineHeight:.9, letterSpacing:".02em", color:"var(--ink)", marginBottom:10 }}>
                GET STARTED<br />
                <span style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", color:"var(--accent)" }}>for free.</span>
              </h1>
              <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.65, fontWeight:300, maxWidth:340 }}>
                Join thousands of property managers generating professional, court-ready leases in minutes.
              </p>
            </div>

            {/* Error */}
            {state?.error && (
              <div className="error-banner" style={{ marginBottom:24 }}>
                <AlertCircle size={15} color="var(--accent)" style={{ flexShrink:0, marginTop:1 }} />
                <span className="error-text">{state.error}</span>
              </div>
            )}

            <form action={formAction} style={{ display:"flex", flexDirection:"column", gap:18 }}>

              {/* Email */}
              <div className="field-wrap anim-up-3">
                <label htmlFor="email" className={`field-label ${focused === "email" ? "active" : ""}`}>
                  Email Address
                </label>
                <input
                  id="email" name="email" type="email"
                  placeholder="name@company.com"
                  required disabled={isPending}
                  className="field-input"
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                />
              </div>

              {/* Password */}
              <div className="field-wrap anim-up-4">
                <label htmlFor="password" className={`field-label ${focused === "password" ? "active" : ""}`}>
                  Password
                </label>
                <div className="pw-wrap">
                  <input
                    id="password" name="password" ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    required minLength={8} disabled={isPending}
                    className="field-input"
                    style={{ paddingRight:52 }}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    onChange={e => calcStrength(e.target.value)}
                  />
                  <button type="button" className="pw-toggle" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                    {showPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                  </button>
                </div>

                {/* Strength meter — only shows once user starts typing */}
                {strength > 0 && (
                  <div className="strength-row">
                    <div className="strength-bars">
                      {[1,2,3,4].map(i => (
                        <div
                          key={i}
                          className="strength-bar"
                          style={{ background: i <= strength ? strengthColor : undefined }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize:10, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:strengthColor, minWidth:40 }}>
                      {strengthLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="field-wrap anim-up-5">
                <label htmlFor="confirm-password" className={`field-label ${focused === "confirm" ? "active" : ""}`}>
                  Confirm Password
                </label>
                <div className="pw-wrap">
                  <input
                    id="confirm-password" name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    required disabled={isPending}
                    className={`field-input ${!passwordMatch ? "error" : ""}`}
                    style={{ paddingRight:52 }}
                    onFocus={() => setFocused("confirm")}
                    onBlur={() => setFocused(null)}
                    onChange={e => {
                      const pw = passwordRef.current?.value ?? "";
                      setPasswordMatch(e.target.value === pw || e.target.value === "");
                    }}
                  />
                  <button type="button" className="pw-toggle" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                    {showConfirm ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                  </button>
                </div>
                {!passwordMatch && (
                  <p className="mismatch-msg">
                    <AlertCircle size={11} />
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="terms-row anim-up-6">
                <input
                  id="terms" name="terms" type="checkbox"
                  className="terms-checkbox"
                  required disabled={isPending}
                />
                <label htmlFor="terms" className="terms-text">
                  I agree to the{" "}
                  <Link href="/terms" className="terms-link">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="terms-link">Privacy Policy</Link>.
                </label>
              </div>

              {/* Submit */}
              <div className="anim-up-7">
                <button
                  type="submit"
                  disabled={isPending || !passwordMatch}
                  className="submit-btn"
                >
                  {isPending
                    ? <Loader2 size={16} strokeWidth={1.5} style={{ animation:"spin 1s linear infinite" }} />
                    : <><span>Create Account</span><ArrowRight size={14} strokeWidth={2} /></>
                  }
                </button>
              </div>

              {/* OR */}
              <div className="or-row anim-up-7">
                <div className="or-line" />
                <span className="or-text">Or continue with</span>
                <div className="or-line" />
              </div>

              {/* Social */}
              <div className="social-grid anim-up-8">
                <button type="button" disabled={isPending} className="social-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" stroke="none"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" stroke="none"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" stroke="none"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" stroke="none"/>
                  </svg>
                  Google
                </button>
                <button type="button" disabled={isPending} className="social-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}>
                    <path d="M11.4 24H0V12.6L11.4 24Z" fill="#F25022" stroke="none"/>
                    <path d="M24 24H12.6V12.6L24 24Z" fill="#00A4EF" stroke="none"/>
                    <path d="M11.4 11.4H0V0L11.4 11.4Z" fill="#FFB900" stroke="none"/>
                    <path d="M24 11.4H12.6V0L24 11.4Z" fill="#7FBA00" stroke="none"/>
                  </svg>
                  Microsoft
                </button>
              </div>
            </form>

            {/* Login row */}
            <div className="login-row" style={{ marginTop:32 }}>
              <span className="login-text">Already have an account?</span>
              <Link href="/auth/login" className="login-link">
                Sign In <ArrowRight size={11} />
              </Link>
            </div>

          </div>
        </div>

        {/* ─── RIGHT — VISUAL ─── */}
        <div className="reg-right">
          <span className="right-bg-num">02</span>

          {/* Top tag */}
          <div>
            <div className="right-tag anim-1">
              <span style={{ width:6, height:6, background:"var(--accent)", borderRadius:"50%", display:"inline-block", flexShrink:0 }} />
              Join 10,000+ landlords
            </div>
          </div>

          {/* Centre */}
          <div>
            {/* Headline */}
            <div className="anim-2" style={{ marginBottom:40 }}>
              <div className="right-headline" style={{ color:"var(--paper)" }}>READY IN</div>
              <div className="right-headline" style={{ color:"var(--accent)" }}>5 MINUTES,</div>
              <div className="right-serif" style={{ color:"var(--paper)" }}>legally sound.</div>
            </div>

            {/* Steps */}
            <div className="anim-3">
              {[
                ["01", "Fill in tenant & property details once"],
                ["02", "Pick your state — clauses apply automatically"],
                ["03", "Customise, send, and get it signed"],
              ].map(([n, t]) => (
                <div key={n} className="step-item">
                  <div className="step-num-badge">{n}</div>
                  <span style={{ fontSize:13, lineHeight:1.6, color:"rgba(245,240,232,.55)", fontWeight:300 }}>{t}</span>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="testimonial-card anim-4" style={{ marginTop:40 }}>
              <span className="testi-quote-mark">"</span>
              <p style={{ fontSize:14, lineHeight:1.75, color:"rgba(245,240,232,.7)", fontWeight:300, marginTop:36, marginBottom:24 }}>
                This platform transformed how we manage our properties. Legally compliant and incredibly fast to use.
              </p>
              <div style={{ display:"flex", alignItems:"center", gap:14, borderTop:"1px solid rgba(245,240,232,.08)", paddingTop:20 }}>
                <div style={{ width:40, height:40, background:"color-mix(in srgb,var(--accent) 20%,transparent)", border:"1px solid rgba(245,240,232,.12)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontSize:18, color:"var(--paper)", flexShrink:0 }}>
                  SC
                </div>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:"var(--paper)", letterSpacing:".02em" }}>Sarah Chen</p>
                  <p style={{ fontSize:11, color:"rgba(245,240,232,.4)", marginTop:2, letterSpacing:".04em" }}>Property Manager · Urban Living</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="anim-5" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:0 }}>
            {[
              ["< 5 min", "To first lease", true],
              ["10k+",    "Leases signed",  false],
              ["50+",     "State templates", false],
            ].map(([n, l, accent], i) => (
              <div
                key={String(i)}
                className="right-stat"
                style={{
                  paddingRight: i < 2 ? 16 : 0,
                  paddingLeft:  i > 0 ? 16 : 0,
                  borderRight:  i < 2 ? "1px solid rgba(245,240,232,.08)" : "none",
                }}
              >
                <span className="right-stat-num" style={{ color: accent ? "var(--accent)" : "var(--paper)" }}>{n}</span>
                <span className="right-stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}