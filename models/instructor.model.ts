import mongoose from "mongoose";

const InstructorSchema = new mongoose.Schema(
  {
    // 🔹 Core Info
    name: { type: String, required: true },
    image: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
    },
    cloudinaryImageId: {
      type: String,
    },
    designation: {
      type: String,
      default: "Instructor",
    },
    about: {
      type: String,
      default: "This instructor has not added a bio yet.",
    },
    qualifications: {
      type: [String],
      default: ["Qualification not specified"],
    },

    // 🔹 Authentication fields
    educationMail: { type: String, required: true, lowercase: true, unique: true },
    userId: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true },

    // 🔹 Contact fields
    number: { type: String, required: true },
    emergencyNumber: { type: String },
    email: { type: String, required: true, lowercase: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.models.Instructor ||
  mongoose.model("Instructor", InstructorSchema);
