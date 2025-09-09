import { NextResponse } from "next/server";
import Inquire from "@/models/inquire.model";
import Student from "@/models/student.model";
import { connectToDB } from "@/lib/db/db";

export async function GET() {
  try {
    await connectToDB();

    const data = await Inquire.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "parentInquiry",
          as: "students",
        },
      },
      {
        $addFields: {
          studentCount: { $size: "$students" },
        },
      },
      {
        $project: {
          students: 0, // don’t return full list
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
