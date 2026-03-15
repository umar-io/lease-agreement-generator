"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Home, User, FileText, PenSquare, Send,
  CheckCircle2, Building, ParkingCircle, Sparkles,
  ScrollText, KeyRound, ArrowUpRight, Menu, X,
} from "lucide-react";
import Link from "next/link";

// ─────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink:    #0a0a0a;
      --paper:  #f5f0e8;
      --cream:  #ede8dc;
      --accent: #c8402a;
      --gold:   #c9a84c;
      --muted:  #7a7468;
      --font-display: 'Bebas Neue', sans-serif;
      --font-serif:   'Instrument Serif', serif;
      --font-body:    'DM Sans', sans-serif;
      --px: clamp(20px, 5vw, 40px);
      --section-py: clamp(72px, 10vw, 160px);
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--paper);
      color: var(--ink);
      font-family: var(--font-body);
      overflow-x: hidden;
    }

    /* ── NOISE ── */
    body::before {
      content: ''; position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
      opacity: .03; pointer-events: none; z-index: 999;
    }

    /* ── MARQUEE ── */
    .marquee-track { display: flex; width: max-content; animation: marquee 28s linear infinite; }
    @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

    /* ── GRID BG ── */
    .grid-bg {
      background-image:
        linear-gradient(rgba(10,10,10,.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(10,10,10,.04) 1px, transparent 1px);
      background-size: 80px 80px;
    }

    /* ── TYPE ── */
    .display { font-family: var(--font-display); letter-spacing: .02em; line-height: .92; }
    .serif-italic { font-family: var(--font-serif); font-style: italic; }

    .rule { border: none; border-top: 1px solid rgba(10,10,10,.12); }

    .step-num {
      font-family: var(--font-display); font-size: clamp(64px, 10vw, 140px); line-height: 1;
      color: var(--ink); opacity: .06; position: absolute; top: -12px; right: 14px;
      pointer-events: none; user-select: none;
    }

    /* ── BUTTONS ── */
    .btn-primary {
      display: inline-flex; align-items: center; justify-content: center; gap: 10px;
      padding: 15px 28px; background: var(--ink); color: var(--paper);
      font-family: var(--font-body); font-size: 12px; font-weight: 600;
      letter-spacing: .12em; text-transform: uppercase; text-decoration: none;
      transition: background .25s, transform .25s; white-space: nowrap;
    }
    .btn-primary:hover { background: var(--accent); transform: translateY(-2px); }

    .btn-ghost {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 14px 24px; border: 1.5px solid var(--ink); color: var(--ink);
      font-family: var(--font-body); font-size: 12px; font-weight: 600;
      letter-spacing: .12em; text-transform: uppercase; text-decoration: none;
      background: transparent; transition: background .25s, color .25s, transform .25s; white-space: nowrap;
    }
    .btn-ghost:hover { background: var(--ink); color: var(--paper); transform: translateY(-2px); }

    /* ── CARDS ── */
    .step-card {
      padding: clamp(24px, 4vw, 48px) clamp(20px, 3vw, 40px);
      background: var(--cream); border: 1px solid rgba(10,10,10,.1);
      position: relative; overflow: hidden;
    }
    @media (pointer: fine) {
      .step-card:hover { box-shadow: 8px 8px 0 var(--ink); transform: translate(-4px,-4px); transition: box-shadow .2s, transform .2s; }
    }

    .type-card {
      padding: clamp(24px, 4vw, 48px) clamp(20px, 3vw, 40px);
      border: 1px solid rgba(10,10,10,.12); background: var(--cream);
      position: relative; overflow: hidden; transition: color .3s, transform .3s;
    }
    .type-card::before {
      content: ''; position: absolute; inset: 0; background: var(--ink);
      transform: translateY(101%); transition: transform .4s cubic-bezier(.77,0,.18,1); z-index: 0;
    }
    @media (pointer: fine) {
      .type-card:hover::before { transform: translateY(0); }
      .type-card:hover { color: var(--paper); transform: translateY(-4px); }
    }
    .type-card > * { position: relative; z-index: 1; }

    .feature-card {
      padding: clamp(24px, 4vw, 52px) clamp(20px, 3vw, 44px);
      border: 1px solid rgba(10,10,10,.12); background: var(--cream);
      transition: transform .3s, box-shadow .3s;
    }
    @media (pointer: fine) {
      .feature-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(10,10,10,.08); }
    }

    .testimonial {
      padding: clamp(24px, 4vw, 48px); border: 1px solid rgba(10,10,10,.1);
      background: var(--cream); position: relative;
    }
    .testimonial-quote {
      font-family: var(--font-display); font-size: clamp(44px, 6vw, 88px);
      line-height: 1; color: var(--accent); opacity: .5;
      position: absolute; top: 18px; left: 24px;
    }

    .pricing-card {
      padding: clamp(28px, 4vw, 52px) clamp(22px, 3vw, 44px);
      border: 1px solid rgba(10,10,10,.12); background: var(--cream);
      position: relative; transition: transform .3s;
    }
    .pricing-card.featured { background: var(--ink); color: var(--paper); }
    @media (pointer: fine) { .pricing-card:hover { transform: translateY(-6px); } }

    .faq-item { border-top: 1px solid rgba(10,10,10,.12); padding: 22px 0; cursor: pointer; }
    .faq-item:last-child { border-bottom: 1px solid rgba(10,10,10,.12); }

    /* ── SCROLL BOUNCE ── */
    @keyframes bounce {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50%       { transform: translateX(-50%) translateY(8px); }
    }
    .scroll-bounce { animation: bounce 2s ease-in-out infinite; }

    .animated-underline {
      background-image: linear-gradient(var(--accent), var(--accent));
      background-repeat: no-repeat; background-size: 0% 2px;
      background-position: 0 100%; transition: background-size .4s ease;
    }
    .animated-underline:hover { background-size: 100% 2px; }

    /* ── MOBILE MENU ── */
    .mobile-menu {
      position: fixed; inset: 0; background: var(--ink); z-index: 200;
      display: flex; flex-direction: column;
      padding: 24px var(--px);
    }

    /* ── LAYOUT UTILITIES ── */
    .section-inner { max-width: 1400px; margin: 0 auto; padding: 0 var(--px); }

    .section-label {
      display: flex; align-items: center; gap: 14px;
      margin-bottom: clamp(32px, 5vw, 72px);
    }

    .section-header-row {
      display: flex; flex-direction: column; gap: 20px;
      margin-bottom: clamp(36px, 5vw, 80px);
    }
    @media (min-width: 768px) {
      .section-header-row { flex-direction: row; justify-content: space-between; align-items: flex-end; }
    }

    /* ── HERO STATS GRID ── */
    .stats-row {
      display: grid; grid-template-columns: 1fr 1fr;
      border-top: 1px solid rgba(10,10,10,.1); margin-top: clamp(40px, 6vw, 80px);
    }
    .stat-cell {
      padding: clamp(18px, 3vw, 32px) 0;
      border-right: 1px solid rgba(10,10,10,.1);
      border-bottom: 1px solid rgba(10,10,10,.1);
      padding-right: clamp(12px, 2vw, 24px);
    }
    .stat-cell:nth-child(even) {
      border-right: none;
      padding-left: clamp(12px, 2vw, 24px); padding-right: 0;
    }
    .stat-cell:nth-child(3), .stat-cell:nth-child(4) { border-bottom: none; }
    @media (min-width: 769px) {
      .stats-row { grid-template-columns: repeat(4, 1fr); }
      .stat-cell { border-bottom: none; border-right: 1px solid rgba(10,10,10,.1); padding: 28px 0 0; padding-right: 28px; }
      .stat-cell:last-child { border-right: none; padding-right: 0; }
      .stat-cell:nth-child(even) { padding-left: 28px; }
      .stat-cell:nth-child(1) { padding-left: 0; }
    }

    /* ── HERO CTA ROW ── */
    .hero-cta-row { display: flex; flex-direction: column; gap: 12px; align-items: stretch; }
    @media (min-width: 480px) { .hero-cta-row { flex-direction: row; align-items: center; } }

    /* ── NAV ── */
    .nav-links { display: none; }
    @media (min-width: 768px) { .nav-links { display: flex; align-items: center; gap: 32px; } }
    .nav-hamburger { display: flex; }
    @media (min-width: 768px) { .nav-hamburger { display: none; } }

    /* ── GRIDS ── */
    .steps-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
    @media (min-width: 580px) { .steps-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1024px) { .steps-grid { grid-template-columns: repeat(3, 1fr); } }

    .types-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    @media (min-width: 900px) { .types-grid { grid-template-columns: repeat(4, 1fr); gap: 14px; } }

    .features-layout { display: grid; grid-template-columns: 1fr; gap: 40px; }
    @media (min-width: 900px) { .features-layout { grid-template-columns: 1fr 1fr; gap: 0; } }

    .testi-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
    @media (min-width: 680px) { .testi-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1100px) { .testi-grid { grid-template-columns: repeat(3, 1fr); } }

    .pricing-grid { display: grid; grid-template-columns: 1fr; gap: 18px; }
    @media (min-width: 640px) { .pricing-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1000px) { .pricing-grid { grid-template-columns: repeat(3, 1fr); } }

    .faq-layout { display: grid; grid-template-columns: 1fr; gap: 40px; }
    @media (min-width: 900px) { .faq-layout { grid-template-columns: 1fr 1fr; gap: 80px; } }

    .footer-top { display: flex; flex-direction: column; gap: 36px; margin-bottom: 48px; }
    @media (min-width: 768px) { .footer-top { flex-direction: row; justify-content: space-between; align-items: flex-start; } }

    .footer-links { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; }
    @media (min-width: 480px) { .footer-links { grid-template-columns: repeat(3, 1fr); } }

    .footer-bottom { display: flex; flex-direction: column; gap: 10px; }
    @media (min-width: 600px) { .footer-bottom { flex-direction: row; justify-content: space-between; align-items: center; } }

    @media (max-height: 600px) { .scroll-indicator { display: none !important; } }
  `}</style>
);

// ─────────────────────────────────────────────
// MARQUEE
// ─────────────────────────────────────────────
const marqueeItems = ["LEASE GENERATION","·","E-SIGNATURE","·","LEGAL COMPLIANCE","·","SMART VARIABLES","·","INSTANT DELIVERY","·","50+ STATE TEMPLATES","·"];
function MarqueeBar({ inverted = false }) {
  return (
    <div style={{ background: inverted ? "var(--ink)" : "var(--accent)", overflow: "hidden", padding: "11px 0" }}>
      <div className="marquee-track" style={{ animationDirection: inverted ? "reverse" : "normal" }}>
        {[...marqueeItems, ...marqueeItems].map((t, i) => (
          <span key={i} style={{ color: "var(--paper)", fontFamily: "var(--font-display)", fontSize: "clamp(11px, 1.6vw, 17px)", letterSpacing: ".08em", paddingRight: "22px", whiteSpace: "nowrap" }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "18px var(--px)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        transition: "background .3s, border-bottom .3s",
        background: scrolled ? "rgba(245,240,232,.92)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(10,10,10,.08)" : "none",
        mixBlendMode: scrolled ? "normal" : "multiply",
      }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 3vw, 30px)", letterSpacing: ".1em" }}>
          LEEZIGN
        </span>

        {/* Desktop */}
        <div className="nav-links">
          {["PRODUCT","PRICING","LEGAL"].map(l => (
            <a key={l} href="#" className="animated-underline"
              style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textDecoration: "none", color: "var(--ink)" }}>
              {l}
            </a>
          ))}
          <a href="/dashboard" className="btn-primary" style={{ padding: "10px 20px" }}>SIGN IN</a>
        </div>

        {/* Mobile hamburger */}
        <button className="nav-hamburger" onClick={() => setMenuOpen(true)}
          style={{ background: "none", border: "none", padding: 6, cursor: "pointer", alignItems: "center" }}>
          <Menu size={22} color="var(--ink)" />
        </button>
      </nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: .38, ease: [.77, 0, .18, 1] }}
            className="mobile-menu"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 56 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 26, letterSpacing: ".1em", color: "var(--paper)" }}>LEEZIGN</span>
              <button onClick={() => setMenuOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <X size={22} color="var(--paper)" />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              {["PRODUCT","PRICING","LEGAL","SIGN IN"].map((l, i) => (
                <motion.a
                  key={l}
                  href={l === "SIGN IN" ? "/dashboard" : "#"}
                  initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: .08 + i * .06 }}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(36px, 10vw, 60px)", letterSpacing: ".04em",
                    color: l === "SIGN IN" ? "var(--accent)" : "var(--paper)",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(245,240,232,.07)",
                    paddingBottom: 18, marginBottom: 18,
                  }}
                >{l}</motion.a>
              ))}
            </div>

            <p style={{ fontSize: 10, color: "rgba(245,240,232,.25)", letterSpacing: ".08em" }}>© {new Date().getFullYear()} LEEZIGN</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section ref={ref} className="grid-bg" style={{
      minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "flex-end",
      paddingTop: "clamp(110px, 18vw, 180px)", paddingBottom: "clamp(56px, 8vw, 100px)",
      overflow: "hidden", position: "relative",
    }}>
      <motion.div style={{
        y, position: "absolute", top: "50%", right: "-2%", transform: "translateY(-55%)",
        fontFamily: "var(--font-display)", fontSize: "clamp(140px, 30vw, 480px)",
        lineHeight: 1, color: "var(--ink)", opacity: .04,
        userSelect: "none", pointerEvents: "none", zIndex: 0,
      }}>01</motion.div>

      <div className="section-inner" style={{ position: "relative", zIndex: 1, width: "100%" }}>

        {/* Eyebrow pill */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .2 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: "clamp(24px, 4vw, 48px)", padding: "7px 13px", border: "1px solid rgba(10,10,10,.14)", background: "var(--cream)" }}>
          <Sparkles size={12} color="var(--accent)" />
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--muted)" }}>
            LEASE GENERATION PLATFORM
          </span>
        </motion.div>

        {/* Stacked headline */}
        {[
          { text: "FROM",       serif: false, red: false },
          { text: "BLANK PAGE", serif: false, red: true  },
          { text: "to signed.", serif: true,  red: false },
        ].map((line, i) => (
          <div key={i} style={{ overflow: "hidden" }}>
            <motion.h1
              initial={{ y: "110%" }} animate={{ y: 0 }}
              transition={{ duration: .85, ease: [.77, 0, .18, 1], delay: .3 + i * .14 }}
              className={line.serif ? "serif-italic" : "display"}
              style={{
                fontSize: "clamp(60px, 13vw, 200px)", lineHeight: .88, display: "block",
                color: line.red ? "var(--accent)" : "var(--ink)", marginBottom: 2,
              }}
            >{line.text}</motion.h1>
          </div>
        ))}

        {/* Subtext + CTAs */}
        <div style={{
          display: "flex", flexWrap: "wrap", alignItems: "flex-end",
          justifyContent: "space-between", gap: "clamp(20px, 4vw, 40px)",
          marginTop: "clamp(28px, 5vw, 60px)",
        }}>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .8 }}
            style={{ maxWidth: 360, fontSize: "clamp(13px, 1.8vw, 16px)", lineHeight: 1.7, color: "var(--muted)", fontWeight: 300 }}>
            Generate a complete, legally-binding lease in under 5 minutes. Smart templates. Built-in e-signature. State-aware clauses.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .95 }}
            className="hero-cta-row">
            <a href="/dashboard" className="btn-primary">CREATE FIRST LEASE <ArrowRight size={13} /></a>
            <a href="#how" className="btn-ghost">SEE HOW <ArrowUpRight size={13} /></a>
          </motion.div>
        </div>

        {/* Stats 2×2 on mobile → 4 columns on desktop */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
          className="stats-row">
          {[
            ["< 5 min", "Time to first lease", true],
            ["50+",     "State templates",     false],
            ["99.9%",   "Legal compliance",    false],
            ["10k+",    "Leases generated",    false],
          ].map(([n, l, accent], i) => (
            <div key={i} className="stat-cell">
              <div className="display" style={{ fontSize: "clamp(26px, 4vw, 52px)", color: accent ? "var(--accent)" : "var(--ink)" }}>{n}</div>
              <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4, fontWeight: 500, letterSpacing: ".04em" }}>{l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-bounce scroll-indicator" style={{
        position: "absolute", bottom: 24, left: "50%",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
      }}>
        <span style={{ fontSize: 8, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--muted)" }}>SCROLL</span>
        <div style={{ width: 1, height: 28, background: "linear-gradient(var(--ink), transparent)" }} />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────
const steps = [
  { icon: <User size={19} />, title: "Tenant Information", desc: "Full name, contact info, employment details, and rental history in one clean form.", tag: "PEOPLE" },
  { icon: <Home size={19} />, title: "Property Details", desc: "Address, unit specs, square footage, bedrooms, and bathrooms pre-populated from your portfolio.", tag: "PROPERTY" },
  { icon: <ParkingCircle size={19} />, title: "Parking & Amenities", desc: "Assign parking spots, storage, pets, and any building-specific rules automatically.", tag: "EXTRAS" },
  { icon: <Building size={19} />, title: "Property Type", desc: "Pick from apartment, house, commercial, or room lease. Template switches instantly.", tag: "TEMPLATE" },
  { icon: <PenSquare size={19} />, title: "Review & Customize", desc: "Add special clauses, pet addendums, or custom terms without leaving the platform.", tag: "REVIEW" },
  { icon: <Send size={19} />, title: "Send for Signature", desc: "Tenant receives a one-click e-signature link via email or SMS. Track every view and sign.", tag: "SIGN" },
];

function HowItWorks() {
  return (
    <section id="how" style={{ padding: "var(--section-py) 0", background: "var(--paper)" }}>
      <div className="section-inner">
        <div className="section-label">
          <div style={{ width: 36, height: 1, background: "var(--accent)" }} />
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted)" }}>Simple Process</span>
        </div>

        <div className="section-header-row">
          <div>
            <h2 className="display" style={{ fontSize: "clamp(48px, 9vw, 140px)", lineHeight: .88 }}>SIX</h2>
            <h2 className="serif-italic" style={{ fontSize: "clamp(48px, 9vw, 140px)", lineHeight: .88, color: "var(--accent)" }}>Steps</h2>
          </div>
          <p style={{ maxWidth: 320, fontSize: "clamp(13px, 1.6vw, 15px)", lineHeight: 1.75, color: "var(--muted)", fontWeight: 300 }}>
            A guided wizard walks you through every detail. The result: a professional, court-ready lease in minutes.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: .6, ease: [.77, 0, .18, 1], delay: i * .07 }}
              className="step-card"
            >
              <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
                <div style={{ width: 42, height: 42, border: "1px solid rgba(10,10,10,.15)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--paper)", flexShrink: 0 }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--accent)", border: "1px solid var(--accent)", padding: "3px 8px" }}>
                  {s.tag}
                </span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px, 2.5vw, 28px)", letterSpacing: ".04em", marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--muted)", fontWeight: 300 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// PROPERTY TYPES
// ─────────────────────────────────────────────
const types = [
  { icon: <Home size={26} />, name: "APARTMENT", clauses: "12 CLAUSES", detail: "Standard multi-unit residential" },
  { icon: <Building size={26} />, name: "HOUSE", clauses: "15 CLAUSES", detail: "Single-family detached property" },
  { icon: <KeyRound size={26} />, name: "ROOM", clauses: "8 CLAUSES", detail: "Shared living, room rental" },
  { icon: <ScrollText size={26} />, name: "COMMERCIAL", clauses: "20 CLAUSES", detail: "Office, retail, warehouse" },
];

function PropertyTypes() {
  return (
    <section style={{ padding: "var(--section-py) 0", background: "var(--cream)" }}>
      <div className="section-inner">
        <div className="section-label">
          <div style={{ width: 36, height: 1, background: "var(--accent)" }} />
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted)" }}>Choose Template</span>
        </div>

        <div className="section-header-row">
          <div>
            <h2 className="display" style={{ fontSize: "clamp(48px, 9vw, 140px)", lineHeight: .88 }}>PROPERTY</h2>
            <h2 className="serif-italic" style={{ fontSize: "clamp(48px, 9vw, 140px)", lineHeight: .88, color: "var(--accent)" }}>Types</h2>
          </div>
          <p style={{ maxWidth: 280, fontSize: "clamp(13px, 1.6vw, 15px)", lineHeight: 1.75, color: "var(--muted)", fontWeight: 300 }}>
            Four professionally-drafted templates. Each auto-activates the right state-specific clauses.
          </p>
        </div>

        <div className="types-grid">
          {types.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * .1 }}
              className="type-card"
            >
              <div style={{ marginBottom: 20 }}>{t.icon}</div>
              <h3 className="display" style={{ fontSize: "clamp(20px, 3vw, 40px)", letterSpacing: ".04em", marginBottom: 5 }}>{t.name}</h3>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", opacity: .5, marginBottom: 10 }}>{t.clauses}</p>
              <p style={{ fontSize: 12, lineHeight: 1.6, opacity: .65 }}>{t.detail}</p>
              <div style={{ marginTop: "clamp(20px, 3vw, 36px)", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 9, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" }}>
                USE TEMPLATE <ArrowRight size={10} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FEATURES
// ─────────────────────────────────────────────
const features = [
  { icon: <FileText size={24} />, title: "SMART VARIABLES",  body: "Fill once, populate everywhere. Names, dates, and amounts auto-fill across the entire document — no copy-pasting, no errors.", accent: false },
  { icon: <CheckCircle2 size={24} />, title: "LEGAL COMPLIANCE", body: "State-specific clauses automatically activate based on property location. Updated quarterly by our legal team.", accent: true  },
  { icon: <PenSquare size={24} />, title: "E-SIGNATURE READY", body: "Built-in signature flows with timestamped audit trails. Legally admissible in all 50 states. No DocuSign account needed.", accent: false },
];

function Features() {
  return (
    <section style={{ padding: "var(--section-py) 0", background: "var(--paper)", borderTop: "1px solid rgba(10,10,10,.1)" }}>
      <div className="section-inner">
        <div className="section-label">
          <div style={{ width: 36, height: 1, background: "var(--accent)" }} />
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted)" }}>Why Us</span>
        </div>

        <div className="features-layout">
          <div>
            <h2 className="display" style={{ fontSize: "clamp(48px, 8vw, 120px)", lineHeight: .88 }}>EVERY-</h2>
            <h2 className="display" style={{ fontSize: "clamp(48px, 8vw, 120px)", lineHeight: .88 }}>THING</h2>
            <h2 className="serif-italic" style={{ fontSize: "clamp(48px, 8vw, 120px)", lineHeight: .88, color: "var(--accent)" }}>you need.</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {features.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * .12 }}
                className="feature-card"
                style={{ borderLeft: f.accent ? "4px solid var(--accent)" : "4px solid transparent", borderTop: i === 0 ? "1px solid rgba(10,10,10,.12)" : "none" }}
              >
                <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                  <div style={{ width: 46, height: 46, border: "1px solid rgba(10,10,10,.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: f.accent ? "var(--accent)" : "var(--ink)" }}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="display" style={{ fontSize: 19, letterSpacing: ".06em", marginBottom: 8 }}>{f.title}</h3>
                    <p style={{ fontSize: 13, lineHeight: 1.75, color: "var(--muted)", fontWeight: 300 }}>{f.body}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────
const testimonials = [
  { quote: "I used to spend 2 hours on every lease. Now it's 4 minutes. Leezign paid for itself in the first week.", name: "Marcus T.", role: "Property Manager, Chicago", n: 14 },
  { quote: "The state compliance feature alone is worth the subscription. I stopped paying $400/hr for a lawyer to review every contract.", name: "Priya S.", role: "Landlord, California", n: 3 },
  { quote: "Our agency manages 220 units. Leezign is the only software that actually reduced our admin overhead.", name: "Derek W.", role: "Operations Director, RE Group", n: 220 },
];

function Testimonials() {
  return (
    <section style={{ padding: "var(--section-py) 0", background: "var(--paper)", borderTop: "1px solid rgba(10,10,10,.1)" }}>
      <div className="section-inner">
        <div className="section-label">
          <div style={{ width: 36, height: 1, background: "var(--accent)" }} />
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted)" }}>Social Proof</span>
        </div>

        <div className="testi-grid">
          {testimonials.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * .1 }}
              className="testimonial"
            >
              <span className="testimonial-quote">"</span>
              <p style={{ fontSize: "clamp(13px, 1.6vw, 15px)", lineHeight: 1.75, marginTop: 40, marginBottom: 32, fontWeight: 300 }}>{t.quote}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".04em" }}>{t.name}</p>
                  <p style={{ fontSize: 10, color: "var(--muted)", marginTop: 3, letterSpacing: ".06em" }}>{t.role}</p>
                </div>
                <div className="display" style={{ fontSize: 40, color: "var(--accent)", opacity: .18 }}>{t.n}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// PRICING
// ─────────────────────────────────────────────
const plans = [
  { name: "STARTER", price: "Free", period: "forever", perks: ["3 leases / month", "Standard templates", "PDF export", "Email support"], featured: false },
  { name: "PRO", price: "$29", period: "per month", perks: ["Unlimited leases", "All 4 property types", "E-signature built-in", "Priority support", "State compliance updates", "Custom clauses"], featured: true },
  { name: "AGENCY", price: "$79", period: "per month", perks: ["Everything in Pro", "10 team seats", "White-label PDF", "API access", "Dedicated manager"], featured: false },
];

function Pricing() {
  return (
    <section style={{ padding: "var(--section-py) 0", background: "var(--cream)", borderTop: "1px solid rgba(10,10,10,.1)" }}>
      <div className="section-inner">
        <div style={{ textAlign: "center", marginBottom: "clamp(40px, 6vw, 96px)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <div style={{ width: 36, height: 1, background: "var(--accent)" }} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted)" }}>Pricing</span>
            <div style={{ width: 36, height: 1, background: "var(--accent)" }} />
          </div>
          <h2 className="display" style={{ fontSize: "clamp(48px, 9vw, 140px)", lineHeight: .88 }}>SIMPLE</h2>
          <h2 className="serif-italic" style={{ fontSize: "clamp(48px, 9vw, 140px)", lineHeight: .88, color: "var(--accent)" }}>Pricing</h2>
        </div>

        <div className="pricing-grid">
          {plans.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * .1 }}
              className={`pricing-card ${p.featured ? "featured" : ""}`}
            >
              {p.featured && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--accent)", color: "var(--paper)", fontSize: 9, fontWeight: 700, letterSpacing: ".16em", padding: "3px 12px", whiteSpace: "nowrap" }}>
                  MOST POPULAR
                </div>
              )}
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", opacity: .55, marginBottom: 18 }}>{p.name}</p>
              <span className="display" style={{ fontSize: "clamp(40px, 5vw, 64px)" }}>{p.price}</span>
              <p style={{ fontSize: 11, opacity: .5, marginTop: 4, marginBottom: 28, letterSpacing: ".06em" }}>{p.period}</p>
              <hr className="rule" style={{ marginBottom: 24, opacity: p.featured ? .15 : 1 }} />
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
                {p.perks.map((k, j) => (
                  <li key={j} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                    <CheckCircle2 size={13} color={p.featured ? "var(--gold)" : "var(--accent)"} style={{ flexShrink: 0 }} />
                    {k}
                  </li>
                ))}
              </ul>
              <a href="/dashboard" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "14px 24px",
                background: p.featured ? "var(--paper)" : "var(--ink)",
                color: p.featured ? "var(--ink)" : "var(--paper)",
                fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase",
                textDecoration: "none",
              }}>
                GET STARTED <ArrowRight size={12} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────
const faqs = [
  { q: "Are the leases legally binding?", a: "Yes. All Leezign leases are drafted to meet state-specific requirements and are fully enforceable. E-signatures comply with the ESIGN Act and UETA." },
  { q: "Can I add custom clauses?", a: "Absolutely. The editor lets you add freeform clauses, pet addendums, maintenance riders, or any special terms — while keeping the base template compliant." },
  { q: "What states are covered?", a: "All 50 U.S. states. State-specific clauses (notice periods, security deposit caps, habitability standards) auto-apply based on the property address you enter." },
  { q: "How does e-signature work?", a: "After you finalize the lease, the tenant receives an email with a secure link. They review and sign with one click. You get notified instantly and both parties receive a signed PDF." },
  { q: "Do I need any other software?", a: "No. Leezign handles generation, delivery, e-signature, and storage in one platform. No DocuSign, no Word templates, no PDF editors needed." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section style={{ padding: "var(--section-py) 0", background: "var(--cream)", borderTop: "1px solid rgba(10,10,10,.1)" }}>
      <div className="section-inner">
        <div className="faq-layout">
          <div>
            <div className="section-label">
              <div style={{ width: 36, height: 1, background: "var(--accent)" }} />
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted)" }}>FAQ</span>
            </div>
            <h2 className="display" style={{ fontSize: "clamp(44px, 7vw, 110px)", lineHeight: .88 }}>COMMON</h2>
            <h2 className="serif-italic" style={{ fontSize: "clamp(44px, 7vw, 110px)", lineHeight: .88, color: "var(--accent)" }}>Questions</h2>
            <p style={{ marginTop: 28, fontSize: "clamp(13px, 1.6vw, 15px)", lineHeight: 1.75, color: "var(--muted)", maxWidth: 300, fontWeight: 300 }}>
              Still have questions? Email us at{" "}
              <span style={{ color: "var(--ink)", fontWeight: 500 }}>hello@leezign.io</span>
            </p>
          </div>

          <div>
            {faqs.map((f, i) => (
              <div key={i} className="faq-item" onClick={() => setOpen(open === i ? null : i)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: "clamp(13px, 1.8vw, 16px)", fontWeight: 600, letterSpacing: ".01em" }}>{f.q}</span>
                  <motion.span
                    animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: .22 }}
                    style={{ fontSize: 22, color: "var(--accent)", flexShrink: 0, fontWeight: 300, lineHeight: 1, display: "block" }}
                  >+</motion.span>
                </div>
                <AnimatePresence>
                  {open === i && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: .28 }}
                      style={{ fontSize: 13, lineHeight: 1.75, color: "var(--muted)", overflow: "hidden", marginTop: 12, fontWeight: 300 }}
                    >{f.a}</motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// CTA FINAL
// ─────────────────────────────────────────────
function CTAFinal() {
  return (
    <section style={{ padding: "var(--section-py) 0", background: "var(--ink)", overflow: "hidden", position: "relative" }}>
      <div className="display" style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        fontSize: "clamp(100px, 28vw, 400px)", color: "var(--paper)", opacity: .03,
        whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none",
      }}>SIGNED</div>

      <div className="section-inner" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="display" style={{ fontSize: "clamp(64px, 14vw, 200px)", lineHeight: .86, color: "var(--paper)" }}>READY</h2>
          <h2 className="serif-italic" style={{ fontSize: "clamp(64px, 14vw, 200px)", lineHeight: .86, color: "var(--accent)" }}>to start?</h2>
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .2 }}
          style={{ color: "rgba(245,240,232,.48)", fontSize: "clamp(13px, 1.8vw, 16px)", lineHeight: 1.75, maxWidth: 420, margin: "clamp(24px, 4vw, 40px) auto", fontWeight: 300 }}>
          Join 10,000+ landlords and property managers who've moved from Word docs to signed leases.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .35 }}
          style={{ display: "flex", justifyContent: "center", padding: "0 var(--px)" }}>
          <a href="/dashboard" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
            padding: "17px 36px", width: "100%", maxWidth: 340,
            background: "var(--accent)", color: "var(--paper)",
            fontSize: 12, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase",
            textDecoration: "none",
          }}>
            CREATE FREE ACCOUNT <ArrowRight size={13} />
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: .5 }}
          style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "12px 28px", marginTop: 36 }}>
          {["⚡ 5 MIN SETUP", "🔒 BANK-LEVEL SECURITY", "📋 NO CREDIT CARD"].map((b, i) => (
            <span key={i} style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".12em", color: "rgba(245,240,232,.32)" }}>{b}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ padding: "clamp(40px, 8vw, 72px) var(--px) 32px", background: "var(--ink)", borderTop: "1px solid rgba(245,240,232,.06)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="footer-top">
          <div>
            <div className="display" style={{ fontSize: "clamp(28px, 5vw, 44px)", color: "var(--paper)", letterSpacing: ".06em", marginBottom: 10 }}>LEEZIGN</div>
            <p style={{ fontSize: 12, color: "rgba(245,240,232,.3)", maxWidth: 220, lineHeight: 1.7 }}>Lease generation platform for modern landlords and property managers.</p>
          </div>
          <div className="footer-links">
            {[
              { title: "PRODUCT", links: ["Features", "Pricing", "Templates", "API"] },
              { title: "LEGAL", links: ["Privacy", "Terms", "ESIGN Policy", "Compliance"] },
              { title: "COMPANY", links: ["About", "Blog", "Careers", "Contact"] },
            ].map((col, i) => (
              <div key={i}>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(245,240,232,.26)", marginBottom: 14 }}>{col.title}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map((l, j) => (
                    <a key={j} href="#" style={{ fontSize: 12, color: "rgba(245,240,232,.52)", textDecoration: "none" }}>{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid rgba(245,240,232,.07)", marginBottom: 24 }} />

        <div className="footer-bottom">
          <span style={{ fontSize: 10, color: "rgba(245,240,232,.2)", letterSpacing: ".07em" }}>© {new Date().getFullYear()} LEEZIGN. ALL RIGHTS RESERVED.</span>
          <span style={{ fontSize: 10, color: "rgba(245,240,232,.15)", letterSpacing: ".06em" }}>BUILT FOR LANDLORDS WHO MOVE FAST</span>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <GlobalStyles />
      <div style={{ background: "var(--paper)", color: "var(--ink)" }}>
        <Nav />
        <Hero />
        <MarqueeBar />
        <HowItWorks />
        <MarqueeBar inverted />
        <PropertyTypes />
        <Features />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTAFinal />
        <Footer />
      </div>
    </>
  );
}