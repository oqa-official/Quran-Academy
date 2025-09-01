import mongoose from "mongoose";

const InstructorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: {
      type: String,
      default:
        "https://plus.unsplash.com/premium_photo-1677618443917-d220774c86db?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fG11c2xpbSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D", // ✅ default profile image
    },
    cloudinaryImageId: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      default: "Instructor", // ✅ fallback role
    },
    about: {
      type: String,
      default: "This instructor has not added a bio yet.", 
    },
    qualifications: {
      type: [String],
      default: ["Qualification not specified"], 
    },
  },
  { timestamps: true }
);

export default mongoose.models.Instructor ||
  mongoose.model("Instructor", InstructorSchema);
