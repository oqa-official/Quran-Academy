import mongoose from "mongoose";

const TeacherInquirySchema = new mongoose.Schema(
  {
    // 🟢 Step 1 - Intro & Ratings
    intro: { type: String, required: true, minlength: 100 }, // Self intro
    taughtBefore: { type: String, required: true, minlength: 100 }, // Teaching experience

    englishRating: { type: Number, required: true, min: 1, max: 5 }, // Numeric 1–5
    englishExplain: { type: String, required: true, minlength: 100 },

    quranRating: { type: Number, required: true, min: 1, max: 5 },
    quranExplain: { type: String, required: true, minlength: 100 },

    // 🟢 Step 2 - Personal Info
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },

    // 🟢 Step 3 - Verification Files
    cnicFrontUrl: { type: String, required: true },
    cnicFrontCloudinaryId: { type: String, required: true },

    cnicBackUrl: { type: String, required: true },
    cnicBackCloudinaryId: { type: String, required: true },

    qualificationUrl: { type: String, required: true },
    qualificationCloudinaryId: { type: String, required: true },

    experienceUrl: { type: String, required: false },
    experienceCloudinaryId: { type: String, required: false },

  },
  { timestamps: true }
);

export default mongoose.models.TeacherInquiry ||
  mongoose.model("TeacherInquiry", TeacherInquirySchema);
