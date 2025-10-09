import mongoose from "mongoose";

const InquireSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique:true },
    phone: { type: String, required: true, trim: true, unique : true },

    dueDate : { type : Date},
    extendedDueDate: {type : Date },


    // NEW: Stripe payment link for this inquiry
    paymentLink: { type: String, default: null },

    // NEW: Payment status
    paymentStatus: {
      paid: { type: Boolean, default: false },
      lastPaymentDate: { type: Date },
    },


  },
  { timestamps: true }
);

export default mongoose.models.Inquire ||
  mongoose.model("Inquire", InquireSchema);
