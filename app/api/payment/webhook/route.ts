// import { buffer } from "micro";
// import Stripe from "stripe";
// import { connectToDB } from "@/lib/db/db";
// import Student from "@/models/student.model";

// export const config = {
//   api: { bodyParser: false }, // Stripe requires raw body
// };

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-08-27.basil",
// });

// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// export default async function handler(req: any, res: any) {
//   if (req.method !== "POST") return res.status(405).end();

//   const buf = await buffer(req);
//   const sig = req.headers["stripe-signature"]!;

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(buf.toString(), sig, endpointSecret);
//   } catch (err: any) {
//     console.error("Webhook signature verification failed:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object as Stripe.Checkout.Session;
//     const studentId = session.metadata?.studentId;

//     if (!studentId) {
//       console.warn("No studentId in metadata");
//     } else {
//       await connectToDB();
//       await Student.findByIdAndUpdate(studentId, {
//         "feeStatus.paid": true,
//         "feeStatus.lastPaymentDate": new Date(),
//       });
//       console.log(`Student ${studentId} payment marked as paid`);
//     }
//   }

//   res.status(200).json({ received: true });
// }










import { NextResponse } from "next/server";
import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false, // important for webhook verification
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
  try {
    // 1️⃣ Get raw body as ArrayBuffer
    const buf = await req.arrayBuffer();
    const rawBody = Buffer.from(buf);

    // 2️⃣ Retrieve Stripe signature from headers
    const signature = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    // 3️⃣ Handle the event type
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const studentId = session.metadata?.studentId;
      if (!studentId) throw new Error("Student ID missing in session metadata");

      // ✅ Update the student feeStatus in DB
      const { default: Student } = await import("@/models/student.model");
      await import("@/lib/db/db").then((m) => m.connectToDB());

      await Student.findByIdAndUpdate(studentId, {
        "feeStatus.paid": true,
        "status": "ongoing",
        "feeStatus.lastPaymentDate": new Date(),
      });

      console.log(`✅ Student ${studentId} payment marked as paid`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
