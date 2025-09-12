import { connectToDB } from "@/lib/db/db";
import Admin from "@/models/admin.model";
import { NextResponse } from "next/server";

// ✅ GET one admin by ID
export async function GET(
    req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await context.params;
    const admin = await Admin.findById(id);

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(admin, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ PUT update admin
export async function PUT(
   req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectToDB();
    const body = await req.json();

    const updatedAdmin = await Admin.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedAdmin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAdmin, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE admin
export async function DELETE(
   req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await connectToDB();
    const deletedAdmin = await Admin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Admin deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
