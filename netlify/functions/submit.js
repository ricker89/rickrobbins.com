// Netlify Function — submits waitlist email to GHL RickRobbins.com sub-account

const LOCATION_ID = "L88sOLbYiVWLKDj3Ozqe";

// Bot rejection thresholds
const MIN_ELAPSED_MS = 2000;       // sub-2s submit = bot
const MAX_GMAIL_DOTS = 2;          // gmail-dot-trick spam typically has 3+ dots in local part
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function looksLikeBot({ email, website, elapsed }) {
  // 1) Honeypot filled = bot
  if (typeof website === "string" && website.trim() !== "") {
    return "honeypot";
  }
  // 2) Submitted faster than a human can read = bot
  if (typeof elapsed === "number" && elapsed >= 0 && elapsed < MIN_ELAPSED_MS) {
    return "too-fast";
  }
  // 3) Gmail dot-trick (gmail ignores dots in local part — spammers use this for "unique" addresses)
  if (typeof email === "string") {
    const at = email.lastIndexOf("@");
    if (at > 0) {
      const local = email.slice(0, at).toLowerCase();
      const domain = email.slice(at + 1).toLowerCase();
      const isGmail = domain === "gmail.com" || domain === "googlemail.com";
      if (isGmail) {
        const dotCount = (local.match(/\./g) || []).length;
        if (dotCount > MAX_GMAIL_DOTS) return "gmail-dot-trick";
      }
    }
  }
  return null;
}

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { email, source, website, elapsed } = body;

    if (!email || !EMAIL_RE.test(String(email))) {
      return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400 });
    }

    const botReason = looksLikeBot({ email, website, elapsed });
    if (botReason) {
      // Pretend success so the bot doesn't learn what tripped it
      return new Response(JSON.stringify({ success: true, ignored: true }), { status: 200 });
    }

    const apiKey = process.env.GHL_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Server not configured" }), { status: 500 });
    }

    const response = await fetch("https://services.leadconnectorhq.com/contacts/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
      body: JSON.stringify({
        locationId: LOCATION_ID,
        email: email,
        source: source || "Website Waitlist",
        tags: ["waitlist", "website-leads"],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // GHL may return 400 if contact already exists — treat that as success
      if (data?.message?.includes?.("already exists") || response.status === 400) {
        return new Response(JSON.stringify({ success: true, existing: true }), { status: 200 });
      }
      return new Response(JSON.stringify({ error: "Submission failed", details: data }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, contact: data.contact }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
