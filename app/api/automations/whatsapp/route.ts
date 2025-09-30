import { NextResponse } from "next/server";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

// 👇 Your recipient data
const testRecipients = [
  { 
    name: "Ahmad", 
    phone: "+923091403454", 
    educationMail: "ahmad.student@oqa.com", 
    extraField3: "Student ID: S-50034", 
    extraText: "Password: TempP123" 
  }, 
  { 
    name: "Ali", 
    phone: "+923104558187", 
    educationMail: "ali.student@oqa.com", 
    extraField3: "Instructor ID: T-87654",
    extraText: "Click link to set password." 
  },
];

export async function POST() {
  const results: any[] = [];

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
              // IMPORTANT: Using the latest template name from your last request. 
              // Verify this is the exact, case-sensitive, approved name.
              name: "student_onboarded_2025", 
              language: { code: "en" }, 
              components: [
                
                // 🛑 NEW: HEADER COMPONENT (for static text Header)
                // If the Header is present in the template, it sometimes must be defined here.
                {
                  type: "header",
                  // No 'parameters' array is needed here since your header has no {{variables}}
                },
                
                // **BODY COMPONENT** - Sends all 4 dynamic fields
                {
                  type: "body",
                  parameters: [
                    // Field 1: {{1}} (Name)
                    {
                      type: "text",
                      text: recipient.name, 
                    },
                    // Field 2: {{2}} (Educational Mail)
                    {
                      type: "text",
                      text: recipient.educationMail, 
                    },
                    // Field 3: {{3}} (Extra Field 3)
                    {
                      type: "text",
                      text: recipient.extraField3, 
                    },
                    // Field 4: {{4}} (Extra Text)
                    {
                      type: "text",
                      text: recipient.extraText, 
                    },
                  ],
                },

                // 🛑 NEW: FOOTER COMPONENT (for static text Footer)
                {
                    type: "footer"
                    // No 'parameters' array is needed here since your footer has no {{variables}}
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