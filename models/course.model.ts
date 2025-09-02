import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
     image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cXVyYW58ZW58MHx8MHx8fDA%3D",
    },
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
