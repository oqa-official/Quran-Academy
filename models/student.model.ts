import mongoose from "mongoose";
import "@/models/inquire.model";
import "@/models/course.model"; 

const StudentSchema = new mongoose.Schema(
  {
    parentInquiry: { type: mongoose.Schema.Types.ObjectId, ref: "Inquire" },

    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true},
    phone: { type: String, required: true },

    // ✅ New field - will replace age
    dateOfBirth: { type: Date, required: false },
    gender : { type: String, required: true,
      enum: ["male", "female"],
     },


    timezone: { type: String, required: true },
    preferredStartTime: { type: String }, // e.g. "18:00"

    // Days they take classes: ["Mon", "Wed", "Fri"]
    classDays: {
      type: [String],
      enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      required: true,
    },

    // Link directly to Course (Level 1, Level 2, etc.)
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: false,
    },

    // Lock fee for this student
    price: { type: Number, required: true },

    status: {
      type: String,
      enum: ["trial", "regular"],
      default: "trial",
    },

    trialClasses: {
      assigned: { type: Number, default: 3 },
      completed: { type: Number, default: 0 },
    },

    feeStatus: {
      paid: { type: Boolean, default: false },
      lastPaymentDate: { type: Date },
    },

    // ✅ New auth fields
    educationMail: { type: String, required: true, lowercase: true, unique: true },
    userId: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true }, // store HASH, don’t make it unique
  },
  { timestamps: true }
);

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);
