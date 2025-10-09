import mongoose from "mongoose";
import "@/models/inquire.model";



const WisePaymentSchema = new mongoose.Schema({
  inquiry: { type: mongoose.Schema.Types.ObjectId, ref: "Inquire", required: true },
  amount: { type: Number, required: true },
  screenshotUrl: { type: String, required: true },
  cloudinaryPublicId: { type: String, required: true },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  submittedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },

}, { timestamps: true });

export default mongoose.models.WisePayment ||
  mongoose.model("WisePayment", WisePaymentSchema);
