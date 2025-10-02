import { NextResponse } from "next/server";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

// 👇 UPDATED RECIPIENTS: Only need data for the 2 body fields and the dynamic button link
const testRecipients = [
  { 
    name: "Ahmad", 
    phone: "+923091403454", 
    // {{1}} = name, {{2}} = footer text, Dynamic URL parameter
    onboardingLinkToken: "user12345", // This will be the dynamic part of the button URL
  }, 
  { 
    name: "Ali", 
    phone: "+923104558187", 
    onboardingLinkToken: "user67890",
  },
];

export async function POST() {
  const results: any[] = [];
  
  // Base URL for the dynamic button link (the fixed part)
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
              name: "onboarding_reminder", // 👈 NEW TEMPLATE NAME
              language: { code: "en" }, 
              components: [
                
                // Static Header/Footer components removed for a cleaner payload
                
                // **BODY COMPONENT** - Sends 2 dynamic fields
                {
                  type: "body",
                  parameters: [
                    // Field 1: {{1}} (Name)
                    {
                      type: "text",
                      text: recipient.name, 
                    },
                    // Field 2: {{2}} (The text *after* the button text)
                    {
                      type: "text",
                      // This field is usually for a personalized closing line or contact info
                      text: "BarakAllahu Feek, OQA Team", 
                    },
                  ],
                },

                // 🛑 NEW: BUTTONS COMPONENT 
                // This component passes the dynamic part of the URL/phone number.
                {
                    type: "button",
                    sub_type: "url", // Assuming the button is a Call-to-Action (URL) button
                    index: 0, // This is the index of the button (0 for the first button)
                    parameters: [
                        {
                            type: "text",
                            // This text completes the URL defined in the template: 
                            // e.g., "https://www.youroqa.com/start-trial/{{1}}" 
                            text: recipient.onboardingLinkToken,
                        },
                    ],
                }
                
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