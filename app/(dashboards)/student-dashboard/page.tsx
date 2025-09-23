"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import Analytics from "../admin_dashboard/componnets/Analytics";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Student {
  _id: string;
  name: string;
  email: string;
  educationMail: string;
  userId: string;
  status: string;
  price: number;
  feeStatus: {
    paid: boolean;
    lastPaymentDate?: string;
  };
}

const dashboardCards = [
  {
    name: "Profile Management",
    button: "Manage",
    link: "/student-dashboard/profile",
    illustration: "/assets/admin/icon3.png",
  },
  {
    name: "Zoom Class Links",
    button: "Manage",
    link: "#",
    illustration: "/assets/admin/icon3.png",
  },
  {
    name: "Books",
    button: "Manage",
    link: "/library",
    illustration: "/assets/admin/icon1.png",
  },
  {
    name: "Payments",
    button: "Manage",
    link: "/student-dashboard/payments",
    illustration: "/assets/admin/icon5.png",
  },
];

export default function Page() {
  const { userId, loading: userLoading } = useUser();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  // fetch student
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

  // check fee status for toast alerts
  useEffect(() => {
    if (!student) return;

    let expired = false;
    if (student.feeStatus.paid && student.feeStatus.lastPaymentDate) {
      const last = new Date(student.feeStatus.lastPaymentDate);
      const now = new Date();
      const diffDays = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
      expired = diffDays > 30;
    }

    if (!student.feeStatus.paid) {
      toast.warning("⚠ Kindly pay your monthly fee.");
    } else if (expired) {
      toast.warning("⚠ Your last payment has expired. Please pay again.");
    }
  }, [student]);

  return (
    <div className="p-6">
      <Analytics />

      <p className="mt-20 my-2 text-2xl">Profile Management</p>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {dashboardCards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white dark:bg-[#122031] rounded-2xl shadow-md p-6 flex flex-col justify-between text-center cursor-pointer"
          >
            <img
              src={card.illustration}
              alt={card.name}
              className="w-full max-w-32 object-contain mb-4 mx-auto"
            />
            <h2 className="text-lg font-semibold text-black dark:text-white mb-3">
              {card.name}
            </h2>
            <Link href={card.link}>
              <Button className="bg-accent w-full hover:bg-accent/80">
                {card.button}
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
