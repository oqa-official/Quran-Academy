import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    author: { type: String, required: true },

    coverImage: {
      type: String,
      required: true, // ✅ Cloudinary URL or hosted URL
    },
    cloudinaryImageId: {
      type: String,
      required: true, // ✅ needed for deletion
    },

    pdfUrl: {
      type: String,
      required: true, // ✅ Cloudinary URL for PDF
    },
    cloudinaryPdfId: {
      type: String,
      required: true, // ✅ needed for deletion
    },

    description: {
      type: String,
      default: "No description available.",
    },
    category: {
      type: String,
      default: "General", // ✅ optional categorization
    },
  },
  { timestamps: true }
);

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
