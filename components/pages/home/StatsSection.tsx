"use client";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  Clock,
  Globe,
  Video,
  BookOpen,
} from "lucide-react";

export default function StatsSection() {
  const stats = [
    { icon: Users, value: "1,000+", label: "Students" },
    { icon: Clock, value: "Flexible", label: "Timing" },
    { icon: Globe, value: "Available", label: "Worldwide" },
    { icon: Video, value: "Interactive", label: "Online Classes" },
    { icon: GraduationCap, value: "Certified", label: "Teachers" },
    { icon: BookOpen, value: "Comprehensive", label: "Curriculum" },
  ];

  return (
    <section className="py-16 mt-10">
      <div className="container">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 text-center">
          {stats.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={index}
                className={`flex flex-col items-center p-6 rounded-2xl shadow-md cursor-pointer ${
                  isEven
                    ? "bg-primary text-white"
                    : "bg-white text-navy"
                }`}
                whileHover={{
                  rotateX: 6,
                  rotateY: -6,
                  boxShadow: "0 15px 25px rgba(0,0,0,0.15)",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <item.icon
                  className={`w-10 h-10 mb-4 ${
                    isEven ? "text-white" : "text-primary"
                  }`}
                />
                <h3
                  className={`text-2xl font-extrabold ${
                    isEven ? "text-white" : "text-navy"
                  }`}
                >
                  {item.value}
                </h3>
                <p
                  className={`text-lg ${
                    isEven ? "text-white/90" : "text-gray-600"
                  }`}
                >
                  {item.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
