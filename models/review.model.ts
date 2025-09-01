import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    image: String, // Cloudinary URL
    cloudinaryImageId: {type : String, required : true}, // ✅ for cleanup
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
