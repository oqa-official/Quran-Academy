import mongoose from "mongoose";

const InquireSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique:true },
    phone: { type: String, required: true, trim: true, unique : true },
  },
  { timestamps: true }
);

export default mongoose.models.Inquire ||
  mongoose.model("Inquire", InquireSchema);
