"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Loader2, RefreshCw } from "lucide-react";

const CODE_LENGTH = 6;

export default function VerifyCodePage() {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    setResendCooldown(60);
  }, []);
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  function handleChange(i: number, val: string) {
    if (!/^\d*$/.test(val)) return;
    const next = [...digits];
    next[i] = val.slice(-1);
    setDigits(next);
    setError("");
    if (val && i < CODE_LENGTH - 1) inputs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    const next = [...digits];
    pasted.split("").forEach((c, i) => { next[i] = c; });
    setDigits(next);
    inputs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < CODE_LENGTH) { setError("Please enter all 6 digits."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    // navigate to reset-password
    window.location.href = "/auth/reset-password";
  }

  async function handleResend() {
    setResendCooldown(60);
    setDigits(Array(CODE_LENGTH).fill(""));
    inputs.current[0]?.focus();
  }

  const filled = digits.filter(Boolean).length;

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
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%    {transform:translateX(-8px)}
          40%    {transform:translateX(8px)}
          60%    {transform:translateX(-5px)}
          80%    {transform:translateX(5px)}
        }

        .vc-page {
          min-height:100svh;
          background:var(--ink);
          display:flex; align-items:center; justify-content:center;
          position:relative; overflow:hidden;
          padding:clamp(24px,5vw,48px);
        }
        .vc-page::before {
          content:'';
          position:absolute; inset:0;
          background-image:
            linear-gradient(rgba(245,240,232,.04) 1px,transparent 1px),
            linear-gradient(90deg,rgba(245,240,232,.04) 1px,transparent 1px);
          background-size:60px 60px;
          pointer-events:none;
        }
        .vc-page::after {
          content:'';
          position:absolute; inset:-50%;
          width:200%; height:200%;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity:.04;
          animation:grain 8s steps(1) infinite;
          pointer-events:none;
        }

        .vc-bg-text {
          position:absolute;
          font-family:var(--font-display);
          font-size:clamp(120px,20vw,280px);
          line-height:1; color:var(--paper); opacity:.025;
          user-select:none; pointer-events:none;
          bottom:-20px; right:-10px; z-index:0;
          letter-spacing:-.02em;
        }

        .vc-card {
          width:100%; max-width:480px;
          position:relative; z-index:1;
          animation:scaleIn .5s cubic-bezier(.77,0,.18,1) both;
        }

        .vc-accent-bar {
          width:100%; height:3px;
          background:linear-gradient(90deg,var(--accent),var(--gold));
          margin-bottom:40px;
        }

        .vc-wordmark {
          font-family:var(--font-display);
          font-size:clamp(20px,3vw,26px);
          letter-spacing:.1em; color:var(--paper);
          display:block; margin-bottom:40px;
        }

        .vc-h1 {
          font-family:var(--font-display);
          font-size:clamp(36px,6vw,64px);
          line-height:.88; color:var(--paper);
          margin-bottom:6px;
        }
        .vc-h1-serif {
          font-family:var(--font-serif);
          font-style:italic;
          font-size:clamp(36px,6vw,64px);
          line-height:.88; color:var(--accent);
          display:block; margin-bottom:20px;
        }
        .vc-sub {
          font-size:13px; line-height:1.65;
          color:rgba(245,240,232,.45); font-weight:300;
          margin-bottom:48px;
        }

        /* OTP grid */
        .vc-otp-row {
          display:grid;
          grid-template-columns:repeat(6,1fr);
          gap:10px;
          margin-bottom:12px;
        }
        .vc-digit {
          height:64px;
          background:rgba(245,240,232,.06);
          border:1px solid rgba(245,240,232,.12);
          font-family:var(--font-display);
          font-size:clamp(22px,4vw,32px);
          letter-spacing:.02em;
          color:var(--paper);
          text-align:center;
          outline:none; border-radius:0; appearance:none;
          transition:border-color .2s, background .2s, box-shadow .2s;
          caret-color:transparent;
        }
        .vc-digit:focus {
          border-color:rgba(245,240,232,.5);
          background:rgba(245,240,232,.1);
          box-shadow:4px 4px 0 var(--accent);
        }
        .vc-digit.filled {
          border-color:var(--accent);
          color:var(--accent);
        }
        .vc-digit.error-state {
          border-color:var(--accent);
          animation:shake .4s ease;
        }

        /* Progress bar under digits */
        .vc-progress {
          height:2px;
          background:rgba(245,240,232,.08);
          margin-bottom:32px;
          position:relative;
          overflow:hidden;
        }
        .vc-progress-fill {
          position:absolute; inset-y:0; left:0;
          background:linear-gradient(90deg,var(--accent),var(--gold));
          transition:width .2s ease;
        }

        .vc-error {
          font-size:11px; color:var(--accent);
          letter-spacing:.04em; margin-bottom:20px;
          display:flex; align-items:center; gap:6px;
        }

        /* Submit */
        .vc-btn {
          width:100%; height:52px;
          background:var(--paper); color:var(--ink);
          border:none; font-family:var(--font-body);
          font-size:12px; font-weight:700;
          letter-spacing:.16em; text-transform:uppercase;
          display:flex; align-items:center; justify-content:center; gap:10px;
          cursor:pointer; position:relative; overflow:hidden;
          transition:box-shadow .2s, transform .2s;
        }
        .vc-btn::before {
          content:''; position:absolute; inset:0;
          background:var(--accent);
          transform:translateX(-101%);
          transition:transform .4s cubic-bezier(.77,0,.18,1);
        }
        .vc-btn:hover::before { transform:translateX(0); }
        .vc-btn:hover { color:var(--paper); box-shadow:6px 6px 0 rgba(245,240,232,.15); }
        .vc-btn > * { position:relative; z-index:1; }
        .vc-btn:active { transform:translate(2px,2px); box-shadow:none; }
        .vc-btn:disabled { opacity:.4; cursor:not-allowed; }
        .vc-btn:disabled::before { display:none; }

        /* Resend */
        .vc-resend {
          margin-top:20px;
          display:flex; align-items:center; justify-content:center; gap:8px;
          font-size:12px; color:rgba(245,240,232,.35);
        }
        .vc-resend-btn {
          background:none; border:none; cursor:pointer;
          font-size:12px; font-weight:700; letter-spacing:.08em;
          text-transform:uppercase; color:rgba(245,240,232,.6);
          display:inline-flex; align-items:center; gap:6px;
          transition:color .2s;
        }
        .vc-resend-btn:hover { color:var(--accent); }
        .vc-resend-btn:disabled { opacity:.35; cursor:not-allowed; }

        .vc-back {
          display:inline-flex; align-items:center; gap:8px;
          font-size:10px; font-weight:700;
          letter-spacing:.16em; text-transform:uppercase;
          color:rgba(245,240,232,.3); text-decoration:none;
          transition:color .2s; margin-top:32px;
        }
        .vc-back:hover { color:rgba(245,240,232,.6); }

        .a1 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .1s both; }
        .a2 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .2s both; }
        .a3 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .3s both; }
        .a4 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .4s both; }
        .a5 { animation:slideUp .6s cubic-bezier(.77,0,.18,1) .5s both; }
      `}</style>

      <div className="vc-page">
        <span className="vc-bg-text">VC</span>

        <div className="vc-card">
          <div className="vc-accent-bar a1" />
          <span className="vc-wordmark a1">LEEZIGn</span>

          <div className="a2">
            <h1 className="vc-h1">VERIFY</h1>
            <span className="vc-h1-serif">your code.</span>
            <p className="vc-sub">
              Enter the 6-digit code sent to your email. It expires in&nbsp;
              <strong style={{ color:"rgba(245,240,232,.7)", fontWeight:600 }}>15 minutes</strong>.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Digit inputs */}
            <div className="vc-otp-row a3" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={el => { inputs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  className={`vc-digit ${d ? "filled" : ""} ${error ? "error-state" : ""}`}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onFocus={e => e.target.select()}
                />
              ))}
            </div>

            {/* Progress */}
            <div className="vc-progress a3">
              <div className="vc-progress-fill" style={{ width:`${(filled / CODE_LENGTH) * 100}%` }} />
            </div>

            {error && (
              <p className="vc-error a3">
                <span>✕</span> {error}
              </p>
            )}

            <div className="a4">
              <button
                type="submit"
                className="vc-btn"
                disabled={loading || filled < CODE_LENGTH}
              >
                {loading
                  ? <Loader2 size={16} strokeWidth={1.5} style={{ animation:"spin 1s linear infinite" }} />
                  : <><span>Verify Code</span><ArrowRight size={14} strokeWidth={2} /></>
                }
              </button>
            </div>

            <div className="vc-resend a5">
              <span>Didn't receive it?</span>
              <button
                type="button"
                className="vc-resend-btn"
                disabled={resendCooldown > 0}
                onClick={handleResend}
              >
                <RefreshCw size={11} strokeWidth={2} />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
              </button>
            </div>
          </form>

          <Link href="/auth/forgot-password" className="vc-back">
            <ArrowLeft size={12} strokeWidth={2} /> Back
          </Link>
        </div>
      </div>
    </>
  );
}