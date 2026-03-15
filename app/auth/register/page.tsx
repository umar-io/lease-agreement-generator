"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { signup } from "../action";
import { useActionState } from "react";
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import "./style/register.css"

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