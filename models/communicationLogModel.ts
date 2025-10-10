// models/communicationLogModel.ts
import mongoose, { Schema, Document, model, models } from "mongoose";

export interface ICommunicationLog extends Document {
  receiverName?: string;
  receiverEmail?: string;
  receiverNumber?: string;
  receiverType: "student" | "parent" | "teacher";
  channel: "whatsapp" | "email";
  messageType: "fee-reminder" | "class-reminder" | "onboarding-reminder" | "inquiry-fill" | "student-created" | "teacher-created" | "forgot-password" | "career-request";
  sentAt: Date;
}

const communicationLogSchema = new Schema<ICommunicationLog>(
  {
    receiverName: { type: String },
    receiverEmail: { type: String },
    receiverNumber: { type: String },
    receiverType: {
      type: String,
      enum: ["student", "parent", "teacher"],
      required: true,
    },
    channel: {
      type: String,
      enum: ["whatsapp", "email"],
      required: true,
    },
    messageType: {
      type: String,
       enum: [
        "fee-reminder",
        "class-reminder",
        "onboarding-reminder",
        "inquiry-fill",
        "student-created",
        "teacher-created",
        "forgot-password",
        "career-request",
      ], // ✅ added all valid typ,
      required: true,
    },
    sentAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const CommunicationLog =
  models.CommunicationLog ||
  model<ICommunicationLog>("CommunicationLog", communicationLogSchema);

export default CommunicationLog;
