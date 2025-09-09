









// app/api/db/students/route.ts
import { connectToDB } from "@/lib/db/db";
import Student from "@/models/student.model";
import { NextResponse } from "next/server";

// ✅ GET all students
export async function GET() {
  try {
    await connectToDB();
    const students = await Student.find()
      // .populate("parentInquiry")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    return NextResponse.json(students, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



// DELETE all students
export async function DELETE() {
  try {
    await connectToDB();
    const students = await Student.deleteMany({});
    return NextResponse.json({ success: true, message: "All students deleted" });
  } catch (error) {
    console.error("Error deleting students:", error);
    return NextResponse.json({ success: false, error: "Failed to delete students" }, { status: 500 });
  }
}



// ✅ POST (single or bulk students with logs)
export async function POST(req: Request) {
  try {
    
    // console.log("➡️ Incoming POST /api/db/students");

    await connectToDB();
    // console.log("✅ DB Connected");

    const body = await req.json();
    // console.log("📩 Raw request body:", body);

    // 🟢 Case 1: Bulk (parentInquiry + students[])
    if (body.students && Array.isArray(body.students)) {
      // console.log("🔄 Bulk insert mode triggered");

      const { parentInquiry, students } = body;
      // console.log("🧾 parentInquiry:", parentInquiry);
      // console.log("👩‍🎓 students array:", students);

      if (!parentInquiry || students.length === 0) {
        console.warn("⚠️ Missing parentInquiry or students[]");
        return NextResponse.json(
          { error: "parentInquiry and students[] are required" },
          { status: 400 }
        );
      }

      const docs = students.map((s: any, idx: number) => {
  return {
    parentInquiry,
    name: s.name,
    email: s.email,
    phone: s.phone,
    age: Number(s.age), // convert string → number
    timezone: s.timezone,
    preferredStartTime: s.preferredStartTime, // ✅ correct key
    classDays: s.classDays,                   // ✅ correct key
    course: s.course || null,
    price: Number(s.price),
    status: "trial",
    trialClasses: { assigned: 3, completed: 0 },
    feeStatus: { paid: false },
  };
});


      // console.log("📝 Prepared docs for insert:", docs);

      const created = await Student.insertMany(docs);
      // console.log("✅ Students inserted successfully:", created);

      return NextResponse.json(created, { status: 201 });
    }

    // 🟢 Case 2: Single student
    // console.log("🔄 Single student mode triggered");

    const {
      name,
      email,
      phone,
      age,
      timezone,
      preferredStartTime,
      classDays,
      course,
      price,
      parentInquiry,
    } = body;

    // console.log("🧾 Single student payload:", {
    //   name,
    //   email,
    //   phone,
    //   age,
    //   timezone,
    //   preferredStartTime,
    //   classDays,
    //   course,
    //   price,
    //   parentInquiry,
    // });

    if (!name || !email || !phone || !age || !timezone || !price) {
      console.warn("⚠️ Missing required fields");
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    const student = new Student({
      parentInquiry,
      name,
      email,
      phone,
      age,
      timezone,
      preferredStartTime,
      classDays,
      course,
      price,
      status: "trial",
      trialClasses: { assigned: 3, completed: 0 },
      feeStatus: { paid: false },
    });

    // console.log("📝 Student doc before save:", student);

    await student.save();
    // console.log("✅ Single student saved successfully");

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error in POST /api/db/students:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}










