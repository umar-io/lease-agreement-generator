Week 1 — Project Bootstrap
├── next-app with TypeScript + Tailwind (already done — your UI)
├── Better Auth setup (email/password + Google OAuth)
├── Drizzle ORM + Supabase Postgres connection
├── Schema design (users, leases, tenants, templates)
└── Environment config (.env, Vercel project)

Week 2 — Auth Flow End-to-End
├── Login / Register / Forgot Password wired to Better Auth
├── Session middleware (protect /dashboard routes)
├── User table in Postgres (id, email, name, created_at)
└── Test: can a real user sign up, log in, and land on dashboard?

Week 3 — Database Schema + API Routes
├── Leases table (id, user_id, tenant_id, status, type, amount, dates)
├── Tenants table (id, user_id, name, email, phone, employment)
├── Templates table (id, type, clauses JSON, state, version)
├── Drafts table (id, user_id, lease_data JSON, progress, last_edited)
└── Next.js Server Actions for each CRUD operation

Week 4 — Wire UI to Real Data
├── Dashboard stats pulling from real Postgres queries
├── Leases page showing real rows
├── Tenants page with real create/read
├── Drafts auto-saving to database every 2 minutes
└── Test: end-to-end flow, no mock data anywhere

Week 5 — Template Engine
├── Build clause library in database (JSON structure per template type)
├── Variable substitution system ({{tenant_name}}, {{property_address}})
├── State-specific clause injection (Lagos vs Abuja vs Rivers rules)
└── Template versioning (so old leases don't break when template changes)

Week 6 — PDF Generation
├── Install pdf-lib
├── Build lease PDF layout (letterhead, sections, numbering, signatures)
├── Variable fill from wizard form data
├── Embed timestamp + unique lease ID in footer
└── Test: generated PDF is court-presentable

Week 7 — File Storage (Cloudflare R2)
├── R2 bucket setup (one bucket: leases/, drafts/, signatures/)
├── Signed URL generation (tenant gets a private link, expires in 24hrs)
├── Upload generated PDF to R2 on lease creation
├── Store R2 object key in Postgres leases table
└── Viewer page: fetch signed URL → render PDF in browser

Week 8 — E-Signature System
├── react-signature-canvas on tenant-facing signing page
├── Signing page is a public route (/sign/[token]) with JWT token
├── On sign: embed signature image into PDF using pdf-lib
├── Write audit log (signed_at, ip_address, user_agent, lease_id)
├── Update lease status to SIGNED
└── Send confirmation email to both landlord and tenant

Week 9 — Email System
├── Resend (best DX, 3000 free emails/month)
├── Transactional emails: lease sent, lease signed, reminder
├── Email templates matching LeaseFlow brand (React Email)
└── 7-day reminder for pending signatures

Week 10 — Hardening + QA
├── Error handling on every Server Action
├── Loading states on every form
├── Mobile test on real device
├── Rate limiting on auth routes (better-auth has this built in)
└── End-to-end test: create lease → send → sign → download PDF

Week 11-12 — Payments
├── Paystack (not Stripe — Nigerian cards, bank transfer, USSD)
├── Three plans: Free (3 leases/month), Pro (₦5,000/month), Agency (₦15,000/month)
├── Webhook handler: payment confirmed → upgrade user plan in database
├── Plan enforcement: middleware checks lease count before creation
└── Billing history page (already in your Settings UI)

Week 13 — Notifications + Reminders
├── Cron job (Vercel Cron or Upstash QStash)
├── Daily job: find leases expiring in 30/14/7 days → send email
├── Daily job: find leases pending signature > 48hrs → send reminder
└── In-app notification bell (real data now)

Week 14 — Analytics + Reporting
├── Dashboard stats from real queries (not mock data)
├── Lease value totals, monthly trends
├── Tenant reliability score (payment history, lease renewals)
└── Export: CSV of all leases for a date range

Week 15-16 — Polish + Launch Prep
├── Onboarding flow (first-time user walkthrough)
├── Empty states that guide new users to create first lease
├── SEO for landing page (Next.js metadata API)
├── Terms of Service + Privacy Policy pages (you'll write these well)
└── Public launch: ProductHunt, Twitter, Nigerian property Facebook groups