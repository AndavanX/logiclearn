# LogicLearn — Static Site

A static HTML site deployed on Cloudflare Pages, covering three areas:
AI automation for small businesses, AI training for students, and AI scam
awareness.

## Pages
- `index.html` — Landing page, links out to the three pillars below
- `services.html` — AI automation for small business
- `training.html` — AI training for students
- `awareness.html` — AI scam awareness (includes a printable checklist)
- `about.html` — Mission
- `contact.html` — Contact form
- `styles.css` / `script.js` — Shared styling and behavior (mobile nav, form handling)
- `functions/api/contact.js` — Cloudflare Pages Function that emails contact form submissions via [Resend](https://resend.com)

## Deploy
This project is deployed to Cloudflare Pages as project `logiclearn`.

To redeploy updates, use the Cloudflare dashboard or Wrangler CLI:
```bash
npx wrangler pages deploy . --project-name=logiclearn
```

## Contact form setup
The form on `contact.html` posts to `/api/contact` (a Cloudflare Pages Function),
which sends mail through Resend. Until it's configured, the form shows a
friendly error and falls back to a direct `mailto:` link.

To activate it:
1. Create a free account at [resend.com](https://resend.com) and verify a
   sending domain (e.g. `logiclearn.net`).
2. Create an API key in Resend.
3. Add it as a secret on the Pages project:
   ```bash
   npx wrangler pages secret put RESEND_API_KEY --project-name=logiclearn
   ```
   (or via the Cloudflare dashboard: Pages project → Settings → Environment
   variables → add `RESEND_API_KEY` as encrypted)
4. Update `FROM_ADDRESS` / `TO_ADDRESS` in `functions/api/contact.js` to real
   addresses on your verified domain.

To test locally with functions: `npx wrangler pages dev .`

## Custom Domain
- `logiclearn.net` is attached via a flattened CNAME to `logiclearn.pages.dev`.

## Next Steps
When ready to migrate to Next.js, create a new Pages project and reassign the domain.