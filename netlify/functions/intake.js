// Netlify Function — submits intake form data to GHL as a tagged contact

const LOCATION_ID = "L88sOLbYiVWLKDj3Ozqe";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { name, email, phone, who, where, seeking, budget } = body;

    if (!email || !EMAIL_RE.test(String(email))) {
      return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400 });
    }
    if (!name || !phone) {
      return new Response(JSON.stringify({ error: "Name and phone required" }), { status: 400 });
    }

    const apiKey = process.env.GHL_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Server not configured" }), { status: 500 });
    }

    const tags = ["website-intake"];

    // Split name into first/last
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Build custom fields for the intake answers
    const customFields = [];
    if (who) customFields.push({ id: "uEzEHWP29Zt403t5lJlE", field_value: who });
    if (where) customFields.push({ id: "4BGOYXZCpuxuWGYHu4x2", field_value: where });
    if (seeking) customFields.push({ id: "H2bXfmbSBBcFV0I3l5XN", field_value: seeking });
    if (budget) customFields.push({ id: "yt0izaqFfP5sO9zCSE60", field_value: budget });

    const contactPayload = {
      locationId: LOCATION_ID,
      firstName,
      lastName,
      email,
      phone,
      source: "Website Intake Form",
      tags,
    };

    contactPayload.customFields = customFields;

    const response = await fetch("https://services.leadconnectorhq.com/contacts/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
      body: JSON.stringify(contactPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      // Contact already exists — update their tags instead
      if (data?.message?.includes?.("already exists") || response.status === 400) {
        // Try to find and update the existing contact
        const searchRes = await fetch(
          `https://services.leadconnectorhq.com/contacts/search/duplicate?locationId=${LOCATION_ID}&email=${encodeURIComponent(email)}`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              Version: "2021-07-28",
            },
          }
        );
        const searchData = await searchRes.json();
        const contactId = searchData?.contact?.id;

        if (contactId) {
          // Update existing contact with new tags
          await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              Version: "2021-07-28",
            },
            body: JSON.stringify({
              tags,
              customFields,
              source: "Website Intake Form",
            }),
          });
        }
        return new Response(JSON.stringify({ success: true, existing: true }), { status: 200 });
      }
      return new Response(JSON.stringify({ error: "Submission failed", details: data }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, contact: data.contact }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
