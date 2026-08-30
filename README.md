# LogicLearn — Static Site

A simple static HTML starter site deployed on Cloudflare Pages.

## Files
- `index.html` — Main page
- `styles.css` — Styling
- `script.js` — JavaScript

## Deploy
This project is deployed to Cloudflare Pages as project `logiclearn`.

To redeploy updates, use the Cloudflare dashboard or Wrangler CLI:
```bash
npx wrangler pages deploy . --project-name=logiclearn
```

## Custom Domain
- `logiclearn.net` is attached via a flattened CNAME to `logiclearn.pages.dev`.

## Next Steps
Edit `index.html`, `styles.css`, and `script.js` to build out your site.
When ready to migrate to Next.js, create a new Pages project and reassign the domain.