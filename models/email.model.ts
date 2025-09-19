import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema(
  {
    event: {
      type: String,
      required: true,
      trim: true,
      unique: true, // each event has one template
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    bodyHtml: {
      type: String,
      required: true, // main HTML content with placeholders like {{name}}, {{userId}}
    },
    bodyText: {
      type: String, // optional plain text fallback
    },
    // (Optional) For future multilingual support
    locale: {
      type: String,
      default: "en", // e.g., "en", "ur", "ar"
    },
    // Who last updated the template
    updatedBy: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Email ||
  mongoose.model("Email", EmailSchema);
