// Netlify Function — submits survey responses to GHL RickRobbins.com sub-account

const LOCATION_ID = "L88sOLbYiVWLKDj3Ozqe";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      website,
      instagram,
      otherLinks,
      businessType,
      investmentReadiness,
      focusAreas,
      desiredOutcome,
      journeyStage,
    } = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400 });
    }

    const apiKey = process.env.GHL_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Server not configured" }), { status: 500 });
    }

    // Build contact payload with custom fields
    // Update these custom field keys to match your GHL custom field IDs
    const payload = {
      locationId: LOCATION_ID,
      firstName: firstName || "",
      lastName: lastName || "",
      email: email,
      website: website || "",
      source: "Website Survey",
      tags: ["survey", "website-leads"],
      customFields: [
        { key: "focus_areas", field_value: focusAreas || "" },
        { key: "desired_outcome", field_value: desiredOutcome || "" },
        { key: "jjourney_stage", field_value: journeyStage || "" },
        { key: "business_type", field_value: businessType || "" },
        { key: "investment_readiness", field_value: investmentReadiness || "" },
      ],
    };

    if (instagram) {
      payload.customFields.push({ key: "instagram", field_value: instagram });
    }
    if (otherLinks) {
      payload.customFields.push({ key: "other_links", field_value: otherLinks });
    }

    const response = await fetch("https://services.leadconnectorhq.com/contacts/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      // If contact already exists, update them instead
      if (data?.message?.includes?.("already exists") || response.status === 400) {
        // Search for existing contact by email
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
          // Update existing contact with survey data
          const updateRes = await fetch(
            `https://services.leadconnectorhq.com/contacts/${contactId}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                Version: "2021-07-28",
              },
              body: JSON.stringify({
                firstName: firstName || undefined,
                lastName: lastName || undefined,
                tags: ["survey", "website-leads"],
                customFields: payload.customFields,
              }),
            }
          );

          if (updateRes.ok) {
            return new Response(JSON.stringify({ success: true, updated: true }), { status: 200 });
          }
        }

        // Even if update fails, treat as success so user sees thank-you
        return new Response(JSON.stringify({ success: true, existing: true }), { status: 200 });
      }
      return new Response(JSON.stringify({ error: "Submission failed", details: data }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, contact: data.contact }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
