import { connectToDB } from "@/lib/db/db";
import { NextResponse } from "next/server";
import Inquire from "@/models/inquire.model";
import studentModel from "@/models/student.model";



// ✅ GET by ID with trial/non-trial filter
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB();
    const { id } = await context.params;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // "trial" | "non-trial" | null

    // 🟢 Build filter condition
    const matchStage =
      status === "trial"
        ? { status: "trial" }
        : status === "non-trial"
        ? { status: { $ne: "trial" } }
        : {}; // default: all students

    // ✅ Fetch inquiry
    const inquire = await Inquire.findById(id);
    if (!inquire) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // ✅ Count related students (with filter)
    const studentCount = await studentModel.countDocuments({
      parentInquiry: id,
      ...matchStage,
    });

    // ✅ Return normalized object
    return NextResponse.json(
      { ...inquire.toObject(), studentCount },
      { status: 200 }
    );
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

    // 1️⃣ Check if any students belong to this inquiry
    const { default: Student } = await import("@/models/student.model");
    const studentCount = await Student.countDocuments({ parentInquiry: id });

    if (studentCount > 0) {
      return NextResponse.json(
        { error: "Inquiry Cannot delete inquiry: it still has students assigned." },
        { status: 400 }
      );
    }

    // 2️⃣ Safe to delete
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
