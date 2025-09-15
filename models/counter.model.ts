// models/counter.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICounter extends Document {
  _id: string;   // "studentId" or "instructorId"
  seq: number;   // the current number
}

const CounterSchema = new Schema<ICounter>({
  _id: { type: String, required: true }, // entity key
  seq: { type: Number, default: 0 },     // sequence value
});

const Counter =
  mongoose.models.Counter || mongoose.model<ICounter>("Counter", CounterSchema);

export default Counter;
