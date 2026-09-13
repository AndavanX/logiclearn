// Cloudflare Pages Function — POST /api/contact
// Sends contact form submissions via Resend (https://resend.com).
//
// Setup required before this actually sends mail:
//   1. Create a free Resend account and verify a sending domain (e.g. logiclearn.net).
//   2. Create an API key in Resend.
//   3. Add it as a secret on this Pages project:
//        npx wrangler pages secret put RESEND_API_KEY --project-name=logiclearn
//      (or: Cloudflare dashboard -> Pages project -> Settings -> Environment variables -> Encrypt)
//   4. Update FROM_ADDRESS below to an address on your verified domain, and
//      TO_ADDRESS to where you want submissions delivered.
//
// Until RESEND_API_KEY is set, this returns a friendly error instead of failing silently.

const FROM_ADDRESS = "LogicLearn Website <no-reply@logiclearn.net>";
const TO_ADDRESS = "hello@logiclearn.net";

const INTEREST_LABELS = {
  business: "AI Automation for Business",
  training: "AI Training for Students",
  awareness: "Scam Awareness Session",
  other: "Something Else",
};

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const { name, email, interest, message, website } = data ?? {};

  // Honeypot field: hidden from real users via CSS, bots tend to fill every field.
  // Pretend success so bots don't learn to skip it.
  if (website) {
    return json({ ok: true });
  }

  if (!name || !email || !message) {
    return json({ error: "Name, email, and message are required." }, 400);
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Please provide a valid email address." }, 400);
  }

  if (!env.RESEND_API_KEY) {
    return json(
      { error: "The contact form isn't fully configured yet — please email hello@logiclearn.net directly." },
      500,
    );
  }

  const interestLabel = INTEREST_LABELS[interest] || "Not specified";

  let resendRes;
  try {
    resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [TO_ADDRESS],
        reply_to: email,
        subject: `New contact form message — ${interestLabel}`,
        text: `From: ${name} <${email}>\nInterested in: ${interestLabel}\n\n${message}`,
      }),
    });
  } catch (err) {
    console.error("Resend request failed:", err);
    return json({ error: "Network error sending your message. Please email hello@logiclearn.net directly." }, 502);
  }

  if (!resendRes.ok) {
    console.error("Resend error:", resendRes.status, await resendRes.text());
    return json({ error: "Something went wrong sending your message. Please email hello@logiclearn.net directly." }, 502);
  }

  return json({ ok: true });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
