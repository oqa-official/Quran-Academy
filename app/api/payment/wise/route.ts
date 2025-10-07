import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db/db";
import Student from "@/models/student.model";
import inquireModel from "@/models/inquire.model";
// import { wiseClient } from "@/lib/wiseClient";

import crypto from "crypto"; // ✅ Added for UUID

// export async function POST(req: Request) {
//     try {
//         await connectToDB();
//         const { parentInquiry } = await req.json();

//         if (!parentInquiry)
//             return NextResponse.json({ error: "Missing parentInquiry" }, { status: 400 });

//         console.log("🟡 Step 1: Fetching inquiry...");
//         const inquiry = await inquireModel.findById(parentInquiry);
//         if (!inquiry)
//             return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });

//         console.log("🟡 Step 2: Fetching students...");
//         const students = await Student.find({
//             parentInquiry,
//             status: { $ne: "quit" },
//         });

//         if (students.length === 0)
//             return NextResponse.json({ error: "No active students found" }, { status: 400 });

//         const totalFee = students.reduce((sum, s) => sum + (s.price || 0), 0);
//         const amount = Number(totalFee.toFixed(2));
//         console.log("💰 Total Fee:", amount);

//         // 3️⃣ Get Wise profile
//         console.log("🟡 Step 3: Getting Wise profile...");
//         const profilesRes = await wiseClient.get("/v1/profiles");
//         console.log("✅ Profiles Response:", profilesRes.data);

//         const profile =
//             profilesRes.data.find((p: any) => p.type === "business") ||
//             profilesRes.data.find((p: any) => p.type === "personal");

//         if (!profile)
//             return NextResponse.json({ error: "No valid Wise profile found" }, { status: 400 });

//         console.log("✅ Using Profile:", profile.id, profile.type);

//         // 4️⃣ Create quote
//         console.log("🟡 Step 4: Creating quote...");
//         const quoteRes = await wiseClient.post(`/v3/profiles/${profile.id}/quotes`, {
//             sourceCurrency: "USD",
//             targetCurrency: "USD",
//             sourceAmount: amount,
//         });

//         console.log("✅ Quote Response:", quoteRes.status, quoteRes.data);
//         const quote = quoteRes.data;

//         // 5️⃣ Create recipient
//         // 5️⃣ Create recipient
//         // 🟡 Step 5: Creating recipient...
//         // 🟡 Step 5: Creating recipient...
//         console.log("🟡 Step 5: Creating recipient...");

//         const recipientPayload = {
//             profile: profile.id,
//             accountHolderName: inquiry.name || "Parent Account",
//             currency: "USD",
//             type: "aba", // for US domestic transfer
//             details: {
//                 legalType: "PRIVATE",
//                 abartn: "111000025", // ✅ Sandbox routing number
//                 accountNumber: "123456789", // ✅ Sandbox account number
//                 accountType: "CHECKING",
//                 address: {
//                     country: "US",
//                     city: "New York",
//                     postCode: "10001",
//                     firstLine: "123 Main Street",
//                 },
//             },
//         };

//         console.log("📦 Recipient Payload:", JSON.stringify(recipientPayload, null, 2));

//         // ✅ Use /v1/accounts instead of /v2/accounts for Sandbox (important)
//         const recipientRes = await wiseClient.post(
//             `/v1/accounts`,
//             recipientPayload,
//             {
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             }
//         );

//         console.log("✅ Recipient Response:", recipientRes.status, recipientRes.data);
//         const recipient = recipientRes.data;


//         // 6️⃣ Create transfer
//         console.log("🟡 Step 6: Creating transfer...");
//         const transferRes = await wiseClient.post("/v1/transfers", {
//             targetAccount: recipient.id,
//             quoteUuid: quote.id,
//             customerTransactionId: crypto.randomUUID(), // ✅ FIXED
//             details: {
//                 reference: `Fee Payment for ${students.length} student(s)`,
//             },
//         });

//         console.log("✅ Transfer Response:", transferRes.status, transferRes.data);
//         const transfer = transferRes.data;

//         // 7️⃣ Mock payment link (sandbox)
//         const mockLink = `https://sandbox.wise.com/transfer/${transfer.id}/review`;

//         // 8️⃣ Save to DB
//         inquiry.wise_payment_link = mockLink;
//         await inquiry.save();

//         console.log("✅ Saved Wise link to inquiry:", mockLink);

//         return NextResponse.json({ url: mockLink }, { status: 200 });
//     } catch (err: any) {
//         console.error("❌ Wise payment error (Full Dump):", {
//             message: err.message,
//             response: err.response?.data,
//             status: err.response?.status,
//             stack: err.stack,
//         });

//         return NextResponse.json(
//             { error: err.response?.data || err.message },
//             { status: 500 }
//         );
//     }
// }

export async function GET() {
    try {
        const { data } = await wiseClient.get("/profiles");
        console.log("✅ Wise profiles:", data);
        return NextResponse.json({ success: true, profiles: data });
    } catch (error: any) {
        console.error("❌ Wise error:", error.response?.data || error.message);
        return NextResponse.json({ error: error.response?.data || error.message }, { status: 500 });
    }
}







import axios from "axios";

const wiseClient = axios.create({
  baseURL: "https://api.sandbox.transferwise.tech",
  headers: {
    Authorization: `Bearer ${process.env.WISE_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export async function POST() {
  try {
    // 1️⃣ Get profile
    console.log("🟡 Step 1: Getting profile...");
    const profilesRes = await wiseClient.get("/v1/profiles");
    const profile =
      profilesRes.data.find((p: any) => p.type === "business") ||
      profilesRes.data.find((p: any) => p.type === "personal");

    if (!profile) throw new Error("No Wise profile found");

    console.log("✅ Using Profile:", profile.id);

    // 2️⃣ Create quote (USD → USD)
    console.log("🟡 Step 2: Creating quote...");
    const quoteRes = await wiseClient.post(`/v3/profiles/${profile.id}/quotes`, {
      sourceCurrency: "USD",
      targetCurrency: "USD",
      sourceAmount: 50, // test amount
    });
    const quote = quoteRes.data;
    console.log("✅ Quote ID:", quote.id);

    // 3️⃣ Create recipient (sandbox dummy data)
    console.log("🟡 Step 3: Creating recipient...");
    const recipientRes = await wiseClient.post("/v1/accounts", {
      profile: profile.id,
      accountHolderName: "John Doe",
      currency: "USD",
      type: "aba",
      details: {
        legalType: "PRIVATE",
        abartn: "111000025", // ✅ Sandbox routing number
        accountNumber: "123456789",
        accountType: "CHECKING",
        address: {
          country: "US",
          state: "NY",
          city: "New York",
          postCode: "10001",
          firstLine: "123 Main Street",
        },
      },
    });

    const recipient = recipientRes.data;
    console.log("✅ Recipient ID:", recipient.id);

    // 4️⃣ Create transfer
    console.log("🟡 Step 4: Creating transfer...");
    const transferRes = await wiseClient.post("/v1/transfers", {
      targetAccount: recipient.id,
      quoteUuid: quote.id,
      customerTransactionId: crypto.randomUUID(),
      details: {
        reference: "Test Fee Payment",
      },
    });

    const transfer = transferRes.data;
    console.log("✅ Transfer ID:", transfer.id);

    // 5️⃣ Mock payment link (sandbox)
    const mockLink = `https://sandbox.wise.com/transfer/${transfer.id}/review`;

    return NextResponse.json({ url: mockLink }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Wise test error:", {
      message: err.message,
      response: err.response?.data,
    });
    return NextResponse.json(
      { error: err.response?.data || err.message },
      { status: 500 }
    );
  }
}

