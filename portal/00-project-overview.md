# Sacred Sons Members Portal

**community.sacredsons.com** · Live in production since mid-2026

Sacred Sons is a global men's-work organization that runs over 100 events a year across North America, Europe and Latin America, from weekend Immersions to four-day retreats to multi-phase leadership training. Before this project, the operation ran on WordPress/WooCommerce, GoHighLevel, Circle, Notion, Zoom, Google Calendar, WhatsApp and a long list of spreadsheets, each holding a separate piece of the member's story.

This portal replaces that patchwork with one product. It is a full-stack membership platform where a person can find a program, pay for it, take the course, join their cohort's calls and private forum, submit journals, and build a visible record of their growth. The staff run the whole event calendar from the same place: rosters, room assignments, approvals, attendance and email.

## What it does

- **Commerce:** Stripe checkout is built at request time from each event's ticket data. Webhooks grant course and event access automatically. The portal also handles payment plans, coupons, affiliate attribution and an internal points economy.
- **Learning:** eight gated courses with a framed course reader and signed Cloudflare Stream video. Quizzes are graded on the server, and journal submissions are reviewed in the portal by facilitators.
- **Cohorts:** every online cohort ("pod") automatically gets its own Zoom series, Google Calendar invites, a private Discourse board and a realtime chat room. A live progress grid shows modules, call attendance and quiz results for each member.
- **Events:** a public calendar with list, month and map views. The event-creation and approval workflow mints SKUs automatically. Rosters sync from WooCommerce every hour, and a drag-and-drop room board assigns beds.
- **Community:** member profiles with earned rank badges, a searchable directory, a world map of members and events, and service-hour tracking with a rules engine.
- **Operations:** role-based admin with audit logging, "view as member" impersonation for support, in-app bug reporting with automatic error capture, per-page SEO overrides, and a live knowledge feed for the AI sales assistant.

## By the numbers

| | |
|---|---|
| Member records | **3,455** (281 active accounts) |
| Event attendance records | **5,013** across **143** events |
| Course and program enrollments | **598** |
| Journal submissions | **726** |
| Screens | **83** |
| Server endpoints | **128** |
| Database | **57** tables, **159** migrations, row-level security throughout |
| Codebase | **100,000+** lines of TypeScript, **1,229** commits in five months |
| Integrated services | **13**: Clerk, Supabase, Stripe, GoHighLevel, Zoom, Google Calendar/Drive, Discourse, Cloudflare Stream, Slack, Notion, WooCommerce, Mapbox, Netlify |

## Stack

Next.js 14 (App Router) · React · TypeScript · Tailwind · Supabase Postgres with row-level security and realtime · Clerk auth bridged to Supabase by JWT · Stripe Embedded Checkout and webhooks · Netlify with GitHub Actions CI/CD · Netlify scheduled functions for time-sensitive jobs.

## Why it matters

The hard part of this project wasn't any single feature. It was making a dozen external systems agree with each other while real members were using the product every day. Every purchase, roster change, call recording and journal entry flows to the right place automatically. Each place where data used to vanish silently was rebuilt to save the data first and report the failure loudly. The result is one source of truth for an organization that runs events on four continents.
