import { Types } from "mongoose";

export interface Student {
  _id: Types.ObjectId;
  parentInquiry?: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  age: number;
  timezone: string;
  preferredStartTime?: string;
  classDays: string[]; // e.g. ["Mon", "Wed"]
  course: Types.ObjectId | null; // ref to Course
  price: number;
  status: "trial" | "regular";
  trialClasses: {
    assigned: number;
    completed: number;
  };
  feeStatus: {
    paid: boolean;
    lastPaymentDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ------------------
// Class Type
// ------------------
export interface IClass {
  _id: Types.ObjectId;
  course: Types.ObjectId;
  student: Types.ObjectId;
  instructor: Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  status: "scheduled" | "completed" | "cancelled" | "missed";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}