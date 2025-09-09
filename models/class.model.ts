import mongoose from "mongoose";
import "@/models/course.model";
import "@/models/student.model";
import "@/models/instructor.model";


const ClassSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },

    date: { type: Date, required: true }, // e.g. "2025-09-08T18:00Z"
    startTime: { type: String, required: true }, // "18:00"
    endTime: { type: String, required: true },   // "19:00"

    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "missed"],
      default: "scheduled",
    },

    notes: { type: String }, // e.g. progress, homework, remarks
  },
  { timestamps: true }
);

export default mongoose.models.Class || mongoose.model("Class", ClassSchema);
