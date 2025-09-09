import mongoose from "mongoose";
import "@/models/inquire.model";
import "@/models/course.model";


const StudentSchema = new mongoose.Schema(
  {
    parentInquiry: { type: mongoose.Schema.Types.ObjectId, ref: "Inquire" }, // link back
    
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true }, // ✅ new

    timezone: { type: String, required: true },
    preferredStartTime: { type: String }, // e.g. "18:00"

    // Days they take classes: ["Mon", "Wed", "Fri"]
    classDays: {
      type: [String],
      enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], // ✅ safer & more structured
      required: true,
    },

    // ✅ Link directly to Course (Level 1, Level 2, etc.)
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: false,
    },

    // ✅ Keep price explicitly on Student
    // so even if course price changes later, old students keep their locked fee.
    price: { type: Number, required: true },

    status: { 
      type: String, 
      enum: ["trial", "regular"], 
      default: "trial" 
    },

    trialClasses: {
      assigned: { type: Number, default: 3 },
      completed: { type: Number, default: 0 }
    },

    feeStatus: {
      paid: { type: Boolean, default: false },
      lastPaymentDate: { type: Date }
    }
  },
  { timestamps: true }
);

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);
