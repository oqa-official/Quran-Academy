import { connectToDB } from "@/lib/db/db";
import { NextResponse } from "next/server";
import Email from "@/models/email.model";



// ✅ GET by ID
export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await context.params;
    const emailTemplate = await Email.findById(id);

    if (!emailTemplate) {
      return NextResponse.json({ error: "Email template not found" }, { status: 404 });
    }

    return NextResponse.json(emailTemplate, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



export async function PUT(req: Request) {
  try {
    await connectToDB();
    const body = await req.json();
    const { event, subject, bodyHtml } = body;

    if (!event) {
      return NextResponse.json(
        { error: "Event is required" },
        { status: 400 }
      );
    }

    const updated = await Email.findOneAndUpdate(
      { event },
      { subject, bodyHtml },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Email template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}






// ✅ DELETE (remove by ID)
export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await context.params;

    const emailTemplate = await Email.findByIdAndDelete(id);
    if (!emailTemplate) {
      return NextResponse.json({ error: "Email template not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Email template deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
