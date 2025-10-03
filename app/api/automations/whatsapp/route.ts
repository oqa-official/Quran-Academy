import { NextResponse } from "next/server";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

// 👇 Static test recipient
const testRecipients = [
  { 
    name: "Ahmad", 
    phone: "+923104558187", 
    onboardingLinkToken: "user12345", 
  }, 
  { 
    name: "Maqsood", 
    phone: "+9231091403454", 
    onboardingLinkToken: "user12345", 
  }, 
];

export async function POST() {
  const results: any[] = [];
  
  // Base URL for the dynamic link
  const BASE_ONBOARDING_URL = "https://www.youroqa.com/start-trial/";

  for (const recipient of testRecipients) {
    try {
      const res = await fetch(
        `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: recipient.phone,
            type: "template",
            template: {
              // ✅ must match EXACT approved template name
              name: "onboarding_reminder",
              // ✅ use the language code as approved (check in WhatsApp Manager)
              language: { code: "en_GB" }, 
              components: [
                {
                  type: "body",
                  parameters: [
                    // {{1}} → student name
                    {
                      type: "text",
                      text: recipient.name,
                    },
                    // {{2}} → link
                    {
                      type: "text",
                      text: `${BASE_ONBOARDING_URL}${recipient.onboardingLinkToken}`,
                    },
                  ],
                },
              ],
            },
          }),
        }
      );

      const data = await res.json();

      results.push({
        phone: recipient.phone,
        name: recipient.name,
        success: res.ok,
        response: data,
      });
    } catch (err: any) {
      results.push({
        phone: recipient.phone,
        name: recipient.name,
        success: false,
        error: err.message,
      });
    }
  }

  return NextResponse.json({ sent: results }, { status: 200 });
}
