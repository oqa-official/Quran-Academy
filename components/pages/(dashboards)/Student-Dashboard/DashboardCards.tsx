


"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import MeetingCardWrapper from "./MeetingCardWrapper";


interface ParentInquiry {
  _id: string;
}


interface Student {
  _id: string;
  name: string;
  email: string;
  educationMail: string;
  userId: string;
  status: string;
  price: number;
  parentInquiry?: ParentInquiry; // 🔑 link to parent inquiry
}

interface StudentDashboardCardsProps {
  meetingLinkActive: boolean;
}

export default function StudentDashboardCards({ meetingLinkActive }: StudentDashboardCardsProps) {
  const { userId, loading: userLoading } = useUser();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ fetch student with parent inquiry
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/db/students/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch student");
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [userId]);

  // ✅ check payment status via parentInquiry
  useEffect(() => {
    if (!student?.parentInquiry) return;

  }, [student]);

  return (
    <div className="p-3">

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Profile Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[#FFC107] relative min-h-[160px] flex flex-col p-5 rounded-md cursor-pointer shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl text-black">
            {loading
              ? "Student"
              : student?.name
                ? student.name.split(" ").slice(0, 2).join(" ")
                : ""}
          </h2>
          <p className="text-gray-900">{loading ? "" : student?.userId}</p>
          <img
            src={"/assets/dashboard/icon1.png"}
            alt="student"
            className="self-end w-14 h-14 opacity-100 mb-5"
          />

          <Link
            href="/student-dashboard/profile"
            className="absolute bottom-0 w-full left-0"
          >
            <motion.div
              whileHover={{ scale: 1.001 }}
              className="bg-[#E5AD06] px-10"
            >
              <p className="flex justify-center items-center gap-1 py-2 text-gray-900 text-sm">
                Click Here for Profile
                <ArrowRight
                  className="bg-black rounded-full text-yellow-50"
                  size={14}
                />
              </p>
            </motion.div>
          </Link>
        </motion.div>

        {/* Zoom Card */}
        <MeetingCardWrapper>
          <div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`bg-[#17A2B8] ${!meetingLinkActive && "opacity-50 cursor-not-allowed"} relative min-h-[160px] flex flex-col p-5 rounded-md shadow-md hover:shadow-lg transition-shadow`}
          >
            <h2 className="text-2xl text-white">Zoom</h2>
            <p className="text-white">Class Link</p>
            <img
              src={"/assets/dashboard/icon2.png"}
              alt="zoom"
              className="self-end w-14 h-14 opacity-100 mb-5"
            />

            <Link
              href="#"
              className={`absolute bottom-0 w-full ${meetingLinkActive ? "cursor-pointer" : "cursor-not-allowed"} left-0`}
            >
              <motion.div whileHover={{ scale: 1.001 }} className="bg-[#1591A5] px-10">
                <p className="flex justify-center items-center gap-1 py-2 text-white text-sm">
                  Click Here for the link
                  <ArrowRight className="bg-white rounded-full text-black" size={14} />
                </p>
              </motion.div>
            </Link>
          </motion.div>
          </div>
        </MeetingCardWrapper>


        {/* Books Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[#28A745] relative min-h-[160px] flex flex-col p-5 rounded-md cursor-pointer shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl text-white">Books</h2>
          <p className="text-white">Library</p>
          <img
            src={"/assets/dashboard/icon3.png"}
            alt="books"
            className="self-end w-14 h-14 opacity-100 mb-5"
          />

          <Link href="/library" className="absolute bottom-0 w-full left-0">
            <motion.div
              whileHover={{ scale: 1.001 }}
              className="bg-[#24963E] px-10"
            >
              <p className="flex justify-center items-center gap-1 py-2 text-white text-sm">
                Click Here for Library
                <ArrowRight
                  className="bg-white rounded-full text-black"
                  size={14}
                />
              </p>
            </motion.div>
          </Link>
        </motion.div>

        {/* Payments Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[#DC3545] relative min-h-[160px] flex flex-col p-5 rounded-md cursor-pointer shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl text-white">Payments</h2>
          <p className="text-white">Payment Status</p>
          <img
            src={"/assets/dashboard/icon4.png"}
            alt="payments"
            className="self-end w-14 h-14 opacity-100 mb-5"
          />

          <Link
            href="/student-dashboard/payments"
            className="absolute bottom-0 w-full left-0"
          >
            <motion.div
              whileHover={{ scale: 1.001 }}
              className="bg-[#BB2D3B] px-10"
            >
              <p className="flex justify-center items-center gap-1 py-2 text-white text-sm">
                Click Here for Payment
                <ArrowRight
                  className="bg-white rounded-full text-black"
                  size={14}
                />
              </p>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}