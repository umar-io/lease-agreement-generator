// app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { login } from "@/app/auth/action";
import { useActionState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import "./style/login.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending]  = useActionState(login, undefined);
  const [focused, setFocused]           = useState<string | null>(null);

  return (
    <>
    

      <div className="login-page">

        {/* ─── LEFT PANEL ─── */}
        <div className="login-left">
          <span className="left-bg-num">LF</span>

          <div>
            <div className="left-tag anim-1">
              <span style={{ width: 6, height: 6, background: "var(--accent)", borderRadius: "50%", display: "inline-block" }} />
              LEASE GENERATION PLATFORM
            </div>
          </div>

          <div>
            <div className="anim-2" style={{ marginBottom: 32 }}>
              <div className="left-headline" style={{ color: "var(--paper)" }}>FROM</div>
              <div className="left-headline" style={{ color: "var(--accent)" }}>BLANK PAGE</div>
              <div className="left-serif"    style={{ color: "var(--paper)" }}>to signed.</div>
            </div>

            <p className="anim-3" style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(245,240,232,.45)", fontWeight: 300, maxWidth: 340, marginBottom: 40 }}>
              Generate a complete, legally-binding lease in under 5 minutes. Smart templates. Built-in e-signature.
            </p>

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

          <div className="anim-5" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
            {[
              ["< 5 min", "To first lease"],
              ["10k+",    "Leases signed"],
              ["50+",     "State templates"],
            ].map(([n, l], i) => (
              <div key={i} className="left-stat" style={{
                paddingRight: i < 2 ? 20 : 0,
                paddingLeft:  i > 0 ? 20 : 0,
                borderRight:  i < 2 ? "1px solid rgba(245,240,232,.08)" : "none",
              }}>
                <span className="left-stat-num" style={{ color: i === 0 ? "var(--accent)" : "var(--paper)" }}>{n}</span>
                <span className="left-stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── RIGHT PANEL ─── */}
        <div className="login-right">

          {/* Mobile bar */}
          <div className="mobile-bar" style={{ width: "100%", maxWidth: 420 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: ".1em", color: "var(--ink)" }}>
              LEEZIGN
            </span>
            <Link href="/auth/register" className="register-link">
              Register <ArrowRight size={11} />
            </Link>
          </div>

          <div className="login-card">

            <div className="card-accent-bar anim-up-1" />

            {/* Heading */}
            <div className="anim-up-2" style={{ marginBottom: 36 }}>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px,5vw,52px)", lineHeight: .9, letterSpacing: ".02em", color: "var(--ink)", marginBottom: 12 }}>
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
                <label htmlFor="email" className={`field-label ${focused === "email" ? "active" : ""}`}>
                  Email Address
                </label>
                <input
                  id="email" name="email" type="email"
                  placeholder="name@company.com"
                  required disabled={isPending}
                  className={`field-input ${state?.error ? "error" : ""}`}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                />
              </div>

              {/* Password */}
              <div className="field-wrap anim-up-4">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label htmlFor="password" className={`field-label ${focused === "password" ? "active" : ""}`} style={{ marginBottom: 0 }}>
                    Password
                  </label>
                  <Link href="/auth/forgot-password" className="forgot-link" tabIndex={-1}>
                    Forgot?
                  </Link>
                </div>
                <div className="pw-wrap">
                  <input
                    id="password" name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required disabled={isPending}
                    className={`field-input ${state?.error ? "error" : ""}`}
                    style={{ paddingRight: 52 }}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                  />
                  <button type="button" className="pw-toggle"
                    onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                    {showPassword
                      ? <EyeOff size={16} strokeWidth={1.5} />
                      : <Eye size={16} strokeWidth={1.5} />
                    }
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="anim-up-5">
                <button type="submit" disabled={isPending} className="submit-btn">
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
                <button type="button" disabled={isPending} className="google-btn">
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
              <span className="register-text">Don&apos;t have an account?</span>
              <Link href="/auth/register" className="register-link">
                Register <ArrowRight size={11} />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
