"use client";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
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
        <div className="flex flex-wrap justify-center items-center gap-6 min-h-[40vh]">
          {stats.map((item, index) => {
            const isEven = index % 2 === 0;
            const ref = useRef(null);
            const inView = useInView(ref, { once: true, margin: "-50px" });

            return (
              <motion.div
                ref={ref}
                key={index}
                className={`flex flex-col items-center p-6 rounded-2xl shadow-md cursor-pointer w-[220px] sm:w-[200px] ${
                  isEven ? "bg-primary text-white" : "bg-white text-navy"
                }`}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={
                  inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40 }
                }
                transition={{
                  duration: 0.5,
                  delay: index * 0.1, // staggered effect
                  ease: "easeOut",
                }}
                whileHover={{
                  rotateX: 6,
                  rotateY: -6,
                  boxShadow: "0 15px 25px rgba(0,0,0,0.15)",
                }}
              >
                <item.icon
                  className={`w-8 h-8 mb-3 ${
                    isEven ? "text-white" : "text-primary"
                  }`}
                />
                <h3
                  className={`text-xl font-extrabold ${
                    isEven ? "text-white" : "text-navy"
                  }`}
                >
                  {item.value}
                </h3>
                <p
                  className={`text-sm ${
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
