# LogicLearn — Static Site

A static HTML site covering three areas: AI automation for small businesses,
AI training for students, and AI scam awareness.

## Pages
- `index.html` — Landing page, links out to the three pillars below
- `services.html` — AI automation for small business
- `training.html` — AI training for students
- `awareness.html` — AI scam awareness (includes a printable checklist)
- `about.html` — Mission
- `contact.html` — Contact form
- `styles.css` / `script.js` — Shared styling and behavior (mobile nav, form handling)
- `logo-icon.svg` / `logo-full.svg` — Brand mark (icon-only, used sitewide via `<img>`; full lockup kept as a standalone asset)
- `functions/api/contact.js` — Handler that emails contact form submissions via [Resend](https://resend.com) (see `worker-entry.js`)

## Deploy
**This repo's GitHub remote is not connected to anything that auto-deploys.**
Pushing to GitHub only updates the GitHub copy — it does not publish the site.

Production (`logiclearn.net`) is a Cloudflare **Worker** named `logiclearn-git`
with a static-assets binding, attached to the domain via a Workers Custom
Domain — it is a separate resource from the `logiclearn` Cloudflare *Pages*
project that also exists on this account (that Pages project is unused;
its only domain is `logiclearn.pages.dev`, not `logiclearn.net`).

To publish:
```bash
npx wrangler login   # once, opens a browser to authenticate
./deploy.sh
```
`deploy.sh` stages an explicit allowlist of public files into a throwaway
temp directory and deploys from there — see the comment at the top of the
script for why (short version: deploying straight from the repo root risks
publishing `.git` as public static assets; `.assetsignore` did not reliably
exclude it in testing).

`worker-entry.js` is the actual Worker entry point: it routes
`POST /api/contact` to `functions/api/contact.js`'s handler and falls
through to the static-assets binding for everything else. The `functions/`
directory itself uses the Pages Functions file-routing convention, but
since production runs as a plain Worker (not Pages), that convention isn't
auto-wired — `worker-entry.js` is the adapter that makes it work.

## Contact form setup
The form on `contact.html` posts to `/api/contact`, which sends mail through
Resend. Until it's configured, the form shows a friendly error and falls
back to a direct `mailto:` link. As of this writing, **no `RESEND_API_KEY`
is set on the `logiclearn-git` Worker**, so the form is not yet sending mail
in production.

To activate it:
1. Create a free account at [resend.com](https://resend.com) and verify a
   sending domain (e.g. `logiclearn.net`).
2. Create an API key in Resend.
3. Add it as a secret **on the Worker** (not the `logiclearn` Pages project):
   ```bash
   npx wrangler secret put RESEND_API_KEY --name logiclearn-git
   ```
4. Update `FROM_ADDRESS` / `TO_ADDRESS` in `functions/api/contact.js` to real
   addresses on your verified domain, then redeploy with `./deploy.sh`.

To test locally: `npx wrangler dev` (uses `wrangler.toml` / `worker-entry.js`
directly from the repo root; local dev doesn't need the staged-directory
trick that `deploy.sh` uses for publishing).

## Custom Domain
- `logiclearn.net` is a Cloudflare Workers Custom Domain pointed at the
  `logiclearn-git` Worker (Cloudflare dashboard → Workers & Pages →
  `logiclearn-git` → Settings → Domains & Routes).

## Next Steps
When ready to migrate to Next.js, you'll likely want to move off this
Worker-with-static-assets setup onto whatever hosting the framework expects.