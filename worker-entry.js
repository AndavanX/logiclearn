// Worker entry point for the logiclearn-git Worker (serves logiclearn.net).
//
// This project's source files use the Cloudflare Pages Functions convention
// (functions/api/contact.js, file-based routing), but production actually
// runs as a plain Worker with a static-assets binding rather than a Pages
// project. This thin adapter routes POST /api/contact to that same handler
// and falls through to the ASSETS binding (this directory, minus the files
// listed in .assetsignore) for everything else.
import { onRequestPost as contactOnRequestPost } from "./functions/api/contact.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact" && request.method === "POST") {
      return contactOnRequestPost({ request, env, ctx });
    }

    return env.ASSETS.fetch(request);
  },
};
