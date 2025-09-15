import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    reviewUserId: { type: String, required: true },
    image: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png", // ✅ default profile image
    },
    cloudinaryImageId: {type : String}, // ✅ for cleanup
    rating: { type: Number, required: true },
    reviewText: String,
    date: { type: Date, default: Date.now },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
