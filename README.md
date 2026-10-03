# CFDE Fall 2026 Meeting — Event Page

Single-page registration and travel site for the **CFDE CONNECT Fall 2026 Meeting**,
October 13–14, 2026, at the Ida and Cecil Green Faculty Club, UC San Diego.

Static HTML/CSS/JS — no build step, no dependencies. Deploys to Vercel as-is.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole page |
| `styles.css` | Styling (brand palette sampled from the CFDE CONNECT / CONNECT ICC marks) |
| `script.js` | Mobile nav toggle + sticky-header state |
| `assets/` | CFDE CONNECT logo, CONNECT ICC logo, favicon |
| `vercel.json` | Clean URLs, asset caching, security headers |

## Local preview

```bash
npx serve .
```

## Deploy to Vercel

1. Push this folder to a new GitHub repo (e.g. `cfde-fall-2026`).
2. In Vercel: **Add New → Project → Import** the repo.
3. Framework preset: **Other**. Leave build command and output directory empty —
   it is a static site, Vercel serves the repo root.
4. Deploy.

Or from this directory:

```bash
npx vercel --prod
```

## Domain setup

Two options were discussed. Pick one, then **update the `<link rel="canonical">`
and `og:url` in `index.html` to match.**

### Option A — `fall2026.cfdeconnect.org` (in use)

A subdomain is the lowest-risk path: it does not touch the existing WordPress site.

1. Vercel → Project → **Settings → Domains** → add `fall2026.cfdeconnect.org`.
2. Vercel shows a CNAME target. In the DNS host for `cfdeconnect.org`, add:

   | Type | Name | Value |
   |---|---|---|
   | CNAME | `fall2026` | `cname.vercel-dns.com` |

3. Wait for propagation (usually minutes). Vercel issues the TLS certificate automatically.

**Where is DNS actually managed?** Checked on 2026-08-04 — `cfdeconnect.org` answers from
**Bluehost** nameservers (`ns1.bluehost.com`, `ns2.bluehost.com`), so the CNAME goes in the
**Bluehost DNS zone editor**, not GoDaddy, even if GoDaddy is the registrar. Re-check before
you start in case nameservers have moved:

```bash
dig NS cfdeconnect.org +short
```

### Option B — `cfdeconnect.org/cfde-fall-2026`

A path on the apex domain cannot point at Vercel by DNS alone — the apex already serves
WordPress. Choose one of:

- **Rebuild the page in WordPress** as a normal page at that slug, reusing this design.
  Most consistent with the existing site, but duplicates the markup.
- **Reverse proxy** the path from the web host to the Vercel deployment
  (`.htaccess` / nginx rule on the WordPress server). Works, but adds a moving part
  and needs host-level access.

Option A is the recommendation for getting live this week; the page can be migrated
or linked from the main site menu afterward.

## Content updates

Everything is plain HTML in `index.html`, no templating.

- **Agenda** — each day is a tab panel (`#panel-day1`, `#panel-day2`) holding an
  `<ol class="agenda__list">`; each row is one `<li class="slot">` with time, session,
  moderator, and room. Rows with extra details (`slot--expandable`) keep them in a
  `<div class="slot__more">` and open on click — the toggle button's `aria-controls`
  must match that div's `id`. Tech Showcase tracks and Working Group rooms are the
  `<div class="breakouts">` blocks under Sessions 3 and 6.
- **Room guide** — `<ul class="rooms">` in the Venue section repeats which sessions use
  which room. Update it whenever a room assignment changes in the agenda.
- **Registration** — closed on October 2, 2026. The page no longer links to the Google
  Form; late requests go to `cfde.icc@gmail.com` via the "Registration is closed" card
  (`<div class="closed">`) and the hero status line. To reopen, restore a form link in
  the registration section and put a Register button back in the nav and hero.
- **Hotels** — each is one `<li class="hotel">` in `<section id="hotels">`.

## Notes

- There is **no room block** for this meeting; the hotel section says so explicitly
  and links to each hotel's own booking site.
- Hotel proximity labels ("Walk to campus" / "Short drive") are approximate and measured
  to the UC San Diego campus generally, not to the Faculty Club — the page states this.
- Remote participation is mentioned as "link shared with registrants"; add the actual
  link or platform once known.
