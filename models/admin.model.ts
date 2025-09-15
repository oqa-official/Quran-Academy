import mongoose, { Schema, model, models } from "mongoose";

const AdminSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
        email: { type: String, required: true, lowercase: true , unique : true},
    name: {
      type: String,
      required: true,
      trim: true,
    },
    educationMail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

const Admin = models.Admin || model("Admin", AdminSchema);
export default Admin;
