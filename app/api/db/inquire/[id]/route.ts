import { connectToDB } from "@/lib/db/db";
import { NextResponse } from "next/server";
import Inquire from "@/models/inquire.model";



// ✅ GET by ID
export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await context.params;
    const inquire = await Inquire.findById(id);

    if (!inquire) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json(inquire, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ PUT (update by ID)
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await context.params;
    const body = await req.json();

    // // ✅ Required field check
    // if (!body.name || !body.email || !body.phone) {
    //   return NextResponse.json(
    //     { error: "Name, Email, and Phone are required" },
    //     { status: 400 }
    //   );
    // }

    // ✅ Update with all incoming fields
    const inquire = await Inquire.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!inquire) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json(inquire, { status: 200 });
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

    const inquire = await Inquire.findByIdAndDelete(id);
    if (!inquire) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Inquiry deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
