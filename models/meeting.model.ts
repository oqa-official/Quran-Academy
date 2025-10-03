import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
  zoomId: { type: String, required: true }, // Zoom meeting id
  topic: String,
  startTime: Date,
  duration: Number,
  hostId: String,
  startUrl: String,   // only for teacher (secure!)
  joinUrl: String,    // for students
  password: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);
