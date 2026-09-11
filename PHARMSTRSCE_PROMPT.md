# Pharmatrace — Universal Build Prompt (v2, with Supply-Chain Requirements)

Copy everything below the line into a new Lovable project. It recreates the app exactly as built.

---

Build a mobile-first web application called **Pharmatrace** — a medicine authentication and counterfeit-detection platform backed by a full pack-level supply-chain ledger. It must look like a funded healthcare startup product, fully responsive, suitable for a project exhibition.

## Design system (strict)

- **Theme:** Premium dark mode ONLY (no light mode). Deep black background, emerald green highlights, modern startup aesthetic, glassmorphism UI.
- **Background:** near-black (`oklch(0.125 0.006 162)` family). Primary/emerald accent around `oklch(0.74 0.165 158)`. Destructive red around `oklch(0.63 0.225 25)`.
- **Fonts:** Space Grotesk for headings, DM Sans for body (load via Google Fonts `<link>` in the root route, never `@import` in CSS).
- **Reusable glass utilities** in global CSS: `.glass`, `.glass-strong`, `.glass-input`, plus glow helpers (`.glow-emerald`, `.glow-danger`, `.text-glow`) and animations: scanline, pulse ring, grid pan, rise-in.
- **Semantic design tokens only** — never hardcode `text-white`, `bg-black`, or hex colors in components.
- Dark mode via `className="dark"` on `<html>`.

## Structure

Single-page app at `/` with **tabbed navigation** — desktop top nav bar, mobile fixed bottom nav. Tabs: **Shop Verify**, **QR Scanner**, **Dashboard**. Premium hero header with the Pharmatrace logo mark (pill/capsule motif in emerald), tagline, and live-status indicators.

## Screen 1 — Shop Verification

- Nearby pharmacy search (Google Places via the Lovable Google Maps connector when enabled; otherwise a seeded pharmacy list). Default center Jaipur, India (26.9124, 75.7873), 3 km radius, max 10 results, "Use my location" geolocation button.
- Results list: shop name, address, distance, **Google rating**, and a **separate PharmaTrace trust score** — the two must never be conflated. Verified shops get a green "Verified" badge; low-trust shops get a red "Risky" badge with the flag "Low community trust score — verify medicine before purchase".
- Dark-styled map beside the list with green pins (verified), red pins (risky), emerald dot for the user.
- Filter input, mini stat cards (verified, risky, avg rating).
- Selecting a shop feeds the scanner's "store mismatch" check.

## Screen 2 — QR Medicine Scanner

- Futuristic camera viewport with animated emerald scanline, corner brackets, pulsing rings.
- Scanning resolves a **unique pack serial** (independent of batch and product IDs) and runs **real verification logic against the seeded database** — no hardcoded results.
- Verification must: verify the exact pack serial; verify the complete supply-chain history; verify the pharmacy that recorded the sale; compare the selected store with the actual selling pharmacy; detect duplicate sales; block expired, recalled, missing, or stolen packs.
- **Verification outcomes:** Supply Chain Verified · Suspicious · Expired · Recalled · Under Review · Unable to Verify · Service Unavailable · Package Unreadable.
- Verified results render the supply chain timeline (Manufacturer → Distributor/Shipment → Pharmacy → Patient) with timestamps, locations, batch and serial, animated vertical line. Failures render the specific fraud/blocking reason.
- **Demo scenarios** (each a real record in the seed): genuine pack, copied serial, expired pack, recalled pack, unknown serial, missing pack, stolen pack, store mismatch, under review, service failure, billing correction.
- Consumer scans are **read-only** and must never modify records.

## Screen 3 — Manufacturer / Regulator Dashboard

- Analytics cards: total scans, counterfeit alerts, flagged shops, verification rate.
- Counterfeit telemetry table: fraudulent serials (monospace), timestamps, shop, city, medicine, risk pill, status.
- Scan-trend chart (emerald) showing scans vs counterfeit detections.
- **Complete audit trail** for every shipment, receipt, transfer, sale, recall, correction, theft report and missing report. No record is ever deleted; corrections and reversals preserve history.
- Operator actions: create batches, generate pack serials, ship packs, initiate recalls (manufacturer); receive shipments, sell medicines, transfer stock, report missing/stolen (pharmacy).
- **"Reset Demo Database"** button restoring all seeded presentation scenarios.

## Data model

Records for manufacturers, pharmacies, batches, individual packs, shipments, transfers, sales, recalls, alerts and audit history.

Pack lifecycle: `MANUFACTURED → IN_TRANSIT → IN_STOCK → SOLD`
Additional statuses: `EXPIRED`, `RECALLED`, `MISSING`, `STOLEN`, `QUARANTINED`, `UNDER_REVIEW`.

Rules:
- Pharmacy-to-pharmacy transfers require sender initiation and receiver confirmation.
- Returned medicines become `QUARANTINED`, never straight back to `IN_STOCK`.
- Corrections and reversals preserve full audit history; nothing is deleted.

## Disclaimers (must appear in the UI)

- PharmaTrace validates supply-chain records only. It does not verify chemical composition, storage conditions, or physical authenticity of medicine contents.
- Copy-resistance notice: copying packaging does not create valid manufacturer, shipment, transfer or sale records. However, a perfect copy of a genuinely sold medicine may remain physically indistinguishable through digital verification alone.

## Technical requirements

- TanStack Start conventions; seeded in-memory demo database (resettable). Google Places search + map only if the Google Maps connector is enabled, via `createServerFn` in `src/lib/places.functions.ts`.
- Fully responsive; polished loading, empty and hover states; lucide-react icons.
- SEO: unique title/description, `og:type`, `twitter:card`.
