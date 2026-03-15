"use client";

import { useState } from "react";
import { login } from "@/app/auth/action";
import { useActionState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle, Chrome } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(login, undefined);
  const [focused, setFocused] = useState<string | null>(null);

  return (
    <>
      <style>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10%  { transform: translate(-2%, -3%); }
          20%  { transform: translate(3%, 1%); }
          30%  { transform: translate(-1%, 4%); }
          40%  { transform: translate(4%, -2%); }
          50%  { transform: translate(-3%, 3%); }
          60%  { transform: translate(1%, -4%); }
          70%  { transform: translate(-4%, 2%); }
          80%  { transform: translate(2%, -1%); }
          90%  { transform: translate(-1%, -3%); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(.96); }
          to   { opacity: 1; transform: scale(1); }
        }

        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 30%, transparent); }
          50%       { box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 10%, transparent); }
        }

        .login-page {
          min-height: 100svh;
          background: var(--paper);
          display: grid;
          grid-template-columns: 1fr;
          overflow: hidden;
          position: relative;
        }

        @media (min-width: 1024px) {
          .login-page { grid-template-columns: 1fr 1fr; }
        }

        /* ── LEFT PANEL ── */
        .login-left {
          display: none;
          position: relative;
          background: var(--ink);
          overflow: hidden;
          padding: 48px;
          flex-direction: column;
          justify-content: space-between;
        }

        @media (min-width: 1024px) {
          .login-left { display: flex; }
        }

        /* Grid overlay */
        .login-left::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(245,240,232,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,240,232,.04) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* Grain */
        .login-left::after {
          content: '';
          position: absolute; inset: -50%;
          width: 200%; height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: .04;
          animation: grain 8s steps(1) infinite;
          pointer-events: none;
          z-index: 0;
        }

        .login-left > * { position: relative; z-index: 1; }

        /* Big background number */
        .left-bg-num {
          position: absolute;
          bottom: -40px; right: -20px;
          font-family: var(--font-display);
          font-size: clamp(200px, 22vw, 320px);
          line-height: 1;
          color: var(--paper);
          opacity: .03;
          user-select: none;
          pointer-events: none;
          z-index: 0;
          letter-spacing: -.02em;
        }

        /* ── RIGHT PANEL ── */
        .login-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: clamp(32px, 6vw, 80px) clamp(24px, 5vw, 64px);
          position: relative;
          background: var(--paper);
        }

        /* Subtle grid on right too */
        .login-right::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(color-mix(in srgb, var(--ink) 3%, transparent) 1px, transparent 1px),
            linear-gradient(90deg, color-mix(in srgb, var(--ink) 3%, transparent) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* ── FORM CARD ── */
        .login-card {
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 1;
          animation: scaleIn .5s cubic-bezier(.77,0,.18,1) both;
        }

        /* ── FIELD ── */
        .field-wrap {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .field-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: var(--muted);
          transition: color .2s;
        }

        .field-label.active { color: var(--ink); }

        .field-input {
          width: 100%;
          height: 52px;
          padding: 0 16px;
          background: var(--cream);
          border: 1px solid color-mix(in srgb, var(--ink) 12%, transparent);
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--ink);
          outline: none;
          transition: border-color .2s, background .2s, box-shadow .2s;
          border-radius: 0;
          appearance: none;
        }

        .field-input::placeholder { color: color-mix(in srgb, var(--muted) 60%, transparent); }

        .field-input:focus {
          border-color: var(--ink);
          background: var(--paper);
          box-shadow: 4px 4px 0 var(--ink);
        }

        .field-input.error {
          border-color: var(--accent);
          box-shadow: 4px 4px 0 var(--accent);
        }

        /* Password wrapper */
        .pw-wrap { position: relative; }

        .pw-toggle {
          position: absolute; right: 0; top: 0; bottom: 0;
          width: 52px;
          display: flex; align-items: center; justify-content: center;
          color: var(--muted);
          background: none; border: none;
          cursor: pointer;
          transition: color .2s;
        }

        .pw-toggle:hover { color: var(--ink); }

        /* ── SUBMIT ── */
        .submit-btn {
          width: 100%;
          height: 52px;
          background: var(--ink);
          color: var(--paper);
          border: none;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          cursor: pointer;
          transition: background .25s, transform .2s, box-shadow .2s;
          position: relative;
          overflow: hidden;
        }

        .submit-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: var(--accent);
          transform: translateX(-101%);
          transition: transform .4s cubic-bezier(.77,0,.18,1);
        }

        .submit-btn:hover::before { transform: translateX(0); }
        .submit-btn:hover { box-shadow: 6px 6px 0 color-mix(in srgb, var(--ink) 20%, transparent); }
        .submit-btn > * { position: relative; z-index: 1; }
        .submit-btn:active { transform: translate(2px, 2px); box-shadow: none; }
        .submit-btn:disabled { opacity: .6; cursor: not-allowed; }
        .submit-btn:disabled::before { display: none; }

        /* ── GOOGLE BTN ── */
        .google-btn {
          width: 100%;
          height: 48px;
          background: transparent;
          border: 1px solid color-mix(in srgb, var(--ink) 14%, transparent);
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--ink);
          display: flex; align-items: center; justify-content: center; gap: 10px;
          cursor: pointer;
          transition: border-color .2s, background .2s, transform .2s;
        }

        .google-btn:hover {
          border-color: var(--ink);
          background: color-mix(in srgb, var(--ink) 4%, transparent);
          transform: translateY(-1px);
        }

        .google-btn:disabled { opacity: .5; cursor: not-allowed; }

        /* ── DIVIDER ── */
        .or-row {
          display: flex; align-items: center; gap: 16px;
        }

        .or-line { flex: 1; height: 1px; background: color-mix(in srgb, var(--ink) 10%, transparent); }

        .or-text {
          font-size: 9px; font-weight: 700;
          letter-spacing: .2em; text-transform: uppercase;
          color: var(--muted);
          white-space: nowrap;
        }

        /* ── ERROR BANNER ── */
        .error-banner {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 14px 16px;
          border: 1px solid var(--accent);
          border-left: 4px solid var(--accent);
          background: color-mix(in srgb, var(--accent) 5%, transparent);
          animation: slideUp .3s ease both;
        }

        .error-text {
          font-size: 13px; line-height: 1.5;
          color: var(--accent);
        }

        /* ── LEFT PANEL ELEMENTS ── */
        .left-wordmark {
          font-family: var(--font-display);
          font-size: clamp(24px, 3vw, 32px);
          letter-spacing: .1em;
          color: var(--paper);
        }

        .left-headline {
          font-family: var(--font-display);
          font-size: clamp(52px, 5vw, 80px);
          line-height: .88;
          letter-spacing: .02em;
        }

        .left-serif {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: clamp(52px, 5vw, 80px);
          line-height: .88;
        }

        .left-stat {
          display: flex; flex-direction: column; gap: 4px;
          padding: 24px 0;
          border-top: 1px solid rgba(245,240,232,.08);
        }

        .left-stat-num {
          font-family: var(--font-display);
          font-size: clamp(32px, 3.5vw, 48px);
          color: var(--paper);
          line-height: 1;
        }

        .left-stat-label {
          font-size: 11px; font-weight: 500;
          letter-spacing: .08em;
          color: rgba(245,240,232,.4);
        }

        .left-tag {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 12px;
          border: 1px solid rgba(245,240,232,.12);
          font-size: 10px; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase;
          color: rgba(245,240,232,.5);
        }

        .left-feature {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 16px 0;
          border-top: 1px solid rgba(245,240,232,.06);
        }

        .left-feature-dot {
          width: 6px; height: 6px;
          background: var(--accent);
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .left-feature-text {
          font-size: 13px; line-height: 1.6;
          color: rgba(245,240,232,.55);
          font-weight: 300;
        }

        /* Animate children in staggered */
        .anim-1 { animation: slideIn .6s cubic-bezier(.77,0,.18,1) .1s both; }
        .anim-2 { animation: slideIn .6s cubic-bezier(.77,0,.18,1) .2s both; }
        .anim-3 { animation: slideIn .6s cubic-bezier(.77,0,.18,1) .3s both; }
        .anim-4 { animation: slideIn .6s cubic-bezier(.77,0,.18,1) .4s both; }
        .anim-5 { animation: slideIn .6s cubic-bezier(.77,0,.18,1) .5s both; }

        .anim-up-1 { animation: slideUp .6s cubic-bezier(.77,0,.18,1) .15s both; }
        .anim-up-2 { animation: slideUp .6s cubic-bezier(.77,0,.18,1) .25s both; }
        .anim-up-3 { animation: slideUp .6s cubic-bezier(.77,0,.18,1) .35s both; }
        .anim-up-4 { animation: slideUp .6s cubic-bezier(.77,0,.18,1) .45s both; }
        .anim-up-5 { animation: slideUp .6s cubic-bezier(.77,0,.18,1) .55s both; }
        .anim-up-6 { animation: slideUp .6s cubic-bezier(.77,0,.18,1) .65s both; }

        /* Mobile top bar */
        .mobile-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 40px;
        }

        @media (min-width: 1024px) { .mobile-bar { display: none; } }

        /* Forgot link */
        .forgot-link {
          font-size: 11px; font-weight: 600;
          letter-spacing: .08em; text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          transition: color .2s;
        }

        .forgot-link:hover { color: var(--accent); }

        /* Register link */
        .register-row {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding-top: 28px;
          border-top: 1px solid color-mix(in srgb, var(--ink) 8%, transparent);
        }

        .register-text { font-size: 12px; color: var(--muted); letter-spacing: .02em; }

        .register-link {
          font-size: 12px; font-weight: 700;
          letter-spacing: .08em; text-transform: uppercase;
          color: var(--ink); text-decoration: none;
          display: inline-flex; align-items: center; gap: 4px;
          transition: color .2s;
        }

        .register-link:hover { color: var(--accent); }

        /* Accent bar at top of card */
        .card-accent-bar {
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, var(--accent), var(--gold));
          margin-bottom: 40px;
        }
      `}</style>

      <div className="login-page">

        {/* ─── LEFT PANEL ─── */}
        <div className="login-left">
          <span className="left-bg-num">LF</span>

          {/* Top */}
          <div>
            <div className="left-tag anim-1">
              <span style={{ width: 6, height: 6, background: "var(--accent)", borderRadius: "50%", display: "inline-block" }} />
              LEASE GENERATION PLATFORM
            </div>
          </div>

          {/* Centre copy */}
          <div>
            <div className="anim-2" style={{ marginBottom: 32 }}>
              <div className="left-headline" style={{ color: "var(--paper)" }}>FROM</div>
              <div className="left-headline" style={{ color: "var(--accent)" }}>BLANK PAGE</div>
              <div className="left-serif" style={{ color: "var(--paper)" }}>to signed.</div>
            </div>

            <p className="anim-3" style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(245,240,232,.45)", fontWeight: 300, maxWidth: 340, marginBottom: 40 }}>
              Generate a complete, legally-binding lease in under 5 minutes. Smart templates. Built-in e-signature.
            </p>

            {/* Feature list */}
            <div className="anim-4">
              {[
                "State-specific clauses activated automatically",
                "E-signature built-in — no DocuSign needed",
                "50+ state templates, updated quarterly",
              ].map((f, i) => (
                <div key={i} className="left-feature">
                  <div className="left-feature-dot" />
                  <span className="left-feature-text">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="anim-5" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
            {[
              ["< 5 min", "To first lease"],
              ["10k+", "Leases signed"],
              ["50+", "State templates"],
            ].map(([n, l], i) => (
              <div key={i} className="left-stat" style={{ paddingRight: i < 2 ? 20 : 0, paddingLeft: i > 0 ? 20 : 0, borderRight: i < 2 ? "1px solid rgba(245,240,232,.08)" : "none" }}>
                <span className="left-stat-num" style={{ color: i === 0 ? "var(--accent)" : "var(--paper)" }}>{n}</span>
                <span className="left-stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── RIGHT PANEL ─── */}
        <div className="login-right">

          {/* Mobile top wordmark + register link */}
          <div className="mobile-bar" style={{ width: "100%", maxWidth: 420 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: ".1em", color: "var(--ink)" }}>
              LEASEFLOW
            </span>
            <Link href="/auth/register" className="register-link">
              Register <ArrowRight size={11} />
            </Link>
          </div>

          <div className="login-card">

            {/* Accent bar */}
            <div className="card-accent-bar anim-up-1" />

            {/* Heading */}
            <div className="anim-up-2" style={{ marginBottom: 36 }}>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 52px)", lineHeight: .9, letterSpacing: ".02em", color: "var(--ink)", marginBottom: 12 }}>
                WELCOME<br />
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--accent)" }}>back.</span>
              </h1>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65, fontWeight: 300, maxWidth: 320 }}>
                Sign in to your account to manage leases, templates, and e-signatures.
              </p>
            </div>

            {/* Error */}
            {state?.error && (
              <div className="error-banner" style={{ marginBottom: 24 }}>
                <AlertCircle size={15} color="var(--accent)" style={{ flexShrink: 0, marginTop: 1 }} />
                <span className="error-text">{state.error}</span>
              </div>
            )}

            {/* Form */}
            <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Email */}
              <div className="field-wrap anim-up-3">
                <label
                  htmlFor="email"
                  className={`field-label ${focused === "email" ? "active" : ""}`}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  disabled={isPending}
                  className={`field-input ${state?.error ? "error" : ""}`}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                />
              </div>

              {/* Password */}
              <div className="field-wrap anim-up-4">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label
                    htmlFor="password"
                    className={`field-label ${focused === "password" ? "active" : ""}`}
                    style={{ marginBottom: 0 }}
                  >
                    Password
                  </label>
                  <Link href="/auth/forgot-password" className="forgot-link" tabIndex={-1}>
                    Forgot?
                  </Link>
                </div>
                <div className="pw-wrap">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    disabled={isPending}
                    className={`field-input ${state?.error ? "error" : ""}`}
                    style={{ paddingRight: 52 }}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                  >
                    {showPassword
                      ? <EyeOff size={16} strokeWidth={1.5} />
                      : <Eye size={16} strokeWidth={1.5} />
                    }
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="anim-up-5">
                <button
                  type="submit"
                  disabled={isPending}
                  className="submit-btn"
                >
                  {isPending
                    ? <Loader2 size={16} strokeWidth={1.5} style={{ animation: "spin 1s linear infinite" }} />
                    : <><span>Sign In</span><ArrowRight size={14} strokeWidth={2} /></>
                  }
                </button>
              </div>

              {/* Divider */}
              <div className="or-row anim-up-5">
                <div className="or-line" />
                <span className="or-text">Or continue with</span>
                <div className="or-line" />
              </div>

              {/* Google */}
              <div className="anim-up-6">
                <button
                  type="button"
                  disabled={isPending}
                  className="google-btn"
                >
                  {/* Google G SVG */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" stroke="none"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" stroke="none"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" stroke="none"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" stroke="none"/>
                  </svg>
                  <span>Google</span>
                </button>
              </div>
            </form>

            {/* Register row */}
            <div className="register-row" style={{ marginTop: 32 }}>
              <span className="register-text">Don't have an account?</span>
              <Link href="/auth/register" className="register-link">
                Register <ArrowRight size={11} />
              </Link>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}