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
    { icon: Video, value: "Interactive", label: "Online Classes" }, // index 3
    { icon: GraduationCap, value: "Certified", label: "Teachers" },
    { icon: BookOpen, value: "Comprehensive", label: "Curriculum" },
  ];

  return (
    <section className="py-16 mt-10">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-3 justify-center gap-6">
          {stats.map((item, index) => {
            const ref = useRef(null);
            const inView = useInView(ref, { once: true, margin: "-50px" });

            // --- mobile (2 cols, 3 rows) pattern ---
            const mobileBlue = [0, 3, 4].includes(index);

            // --- desktop (3 cols, 2 rows) pattern ---
            const desktopBlue = [0, 2, 4].includes(index);

            const baseClass =
              "flex flex-col items-center p-6 rounded-2xl shadow-md cursor-pointer";

            const bgClass = `
              ${mobileBlue ? "bg-primary text-white" : "bg-white text-navy"}
              ${desktopBlue ? "md:bg-primary md:text-white" : "md:bg-white md:text-navy"}
            `;

            // ✅ Special fix for 4th item (index 3): keep bg, but dark text/icons on desktop
            const overrideTextColor =
              index === 3 ? "md:text-primary md:[&_*]:text-navy" : "";

            return (
              <motion.div
                ref={ref}
                key={index}
                className={`${baseClass} ${bgClass} ${overrideTextColor}`}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={
                  inView
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 40 }
                }
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{
                  rotateX: 6,
                  rotateY: -6,
                  boxShadow: "0 15px 25px rgba(0,0,0,0.15)",
                }}
              >
                <item.icon
                  className={`w-8 h-8 mb-3 ${index === 3
                      ? "text-white md:text-primary" // special case for 4th item
                      : index === 4
                        ? "text-white md:text-white"   // special case for 5th item → always white on desktop
                        : mobileBlue
                          ? "text-white md:text-white"
                          : "text-primary"
                    }`}
                />

                <h3 className="md:text-xl text-lg font-extrabold">
                  {item.value}
                </h3>
                <p className="text-sm opacity-90">{item.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
