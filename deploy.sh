#!/usr/bin/env bash
# Publish logiclearn.net.
#
# Production is a Cloudflare Worker named "logiclearn-git" with a static
# assets binding (not a Pages project, despite functions/ using the Pages
# Functions convention — see worker-entry.js for the adapter). It is NOT
# connected to this GitHub repo via CI; pushing to GitHub does nothing on
# its own. This script is how you actually publish.
#
# It stages an explicit allowlist of public files into a throwaway temp
# directory and deploys from there, rather than pointing wrangler at the
# repo root directly. That matters: `.assetsignore` reliably excludes
# functions/, worker-entry.js, and wrangler.toml, but in testing it did NOT
# exclude .git at the repo root — deploying from the repo root risks
# publishing your entire git history as public static assets. Staging a
# clean directory avoids that risk by construction instead of by hoping an
# ignore pattern is honored.
#
# Usage: ./deploy.sh   (requires `npx wrangler login` once beforehand)

set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

# All root-level .html files are public pages (this is a flat static site,
# nothing non-public is ever named *.html at the root) — globbed instead of
# hand-listed so a new page doesn't silently get left out of deploys.
PUBLIC_ASSETS=(
  styles.css script.js logo-icon.svg logo-full.svg site.webmanifest
  favicon-16.png favicon-32.png apple-touch-icon.png icon-192.png icon-512.png og-image.png
)

STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

mkdir -p "$STAGE/functions/api"
for f in *.html; do
  cp "$f" "$STAGE/$f"
done
for f in "${PUBLIC_ASSETS[@]}"; do
  cp "$f" "$STAGE/$f"
done
cp functions/api/contact.js "$STAGE/functions/api/contact.js"
cp worker-entry.js "$STAGE/worker-entry.js"
cp wrangler.toml "$STAGE/wrangler.toml"
printf 'functions\nworker-entry.js\nwrangler.toml\n.wrangler\n' > "$STAGE/.assetsignore"

echo "Staged $(find "$STAGE" -type f | wc -l | tr -d ' ') files in $STAGE:"
find "$STAGE" -type f -printf '  %P\n' 2>/dev/null || find "$STAGE" -type f | sed "s|$STAGE/|  |"

(cd "$STAGE" && npx wrangler deploy)

echo
echo "Published. Verify at https://logiclearn.net"
