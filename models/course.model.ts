import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // Cloudinary URL
    cloudinaryImageId: {type : String, required : true}, // ✅ for cleanup
    title: { type: String, required: true },
    rating: { type: Number, default: 0 }, // avg rating e.g. 4.5
    reviewsCount: { type: Number, default: 0 },
    duration: { type: String, required: true }, // e.g. "6 weeks"
    price: { type: Number, required: true },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor", // FK relation
    },

    overview: {
      summary: String,
      whatYouLearn: String,
      whoFor: String,
      requirements: String,
      certification: String,
    },

    curriculum: [
      {
        lessonNumber: Number,
        lessonName: String,
        lessonDuration: String,
        lessonDescription: String,
      },
    ],

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review", // FK relation
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
