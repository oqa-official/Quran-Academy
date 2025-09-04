import { connectToDB } from "@/lib/db/db";
import { NextResponse } from "next/server";
import Inquire from "@/models/inquire.model";


export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const inquire = await Inquire.findById(params.id);
    if (!inquire)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(inquire);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch inquire" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const body = await req.json();
    const { name, email, phone } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const inquire = await Inquire.findByIdAndUpdate(
      params.id,
      { name, email, phone },
      { new: true, runValidators: true }
    );

    if (!inquire)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(inquire);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update inquire" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const inquire = await Inquire.findByIdAndDelete(params.id);
    if (!inquire)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Inquire deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete inquire" },
      { status: 500 }
    );
  }
}
