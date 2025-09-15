"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const dashboardCards = [
  {
    name: "Courses Management",
    button: "Manage",
    link: "/admin-dashboard/courses",
    illustration: "/assets/admin/icon2.png",
  },
  {
    name: "Teachers Management",
    button: "Manage",
    link: "/admin-dashboard/teachers",
    illustration: "/assets/admin/icon4.png",
  },
  {
    name: "Library Management",
    button: "Manage",
    link: "/admin-dashboard/library",
    illustration: "/assets/admin/icon1.png",
  },
  {
    name: "Check Inquiries",
    button: "Manage",
    link: "/admin-dashboard/inquire",
    illustration: "/assets/admin/icon6.png",
  },
  {
    name: "View Onboardings",
    button: "Manage",
    link: "/admin-dashboard/onboardings",
    illustration: "/assets/admin/icon7.png",
  },
  {
    name: "Trial Students",
    button: "Manage",
    link: "/admin-dashboard/students",
    illustration: "/assets/admin/icon9.png",
  },
  {
    name: "Registered Students",
    button: "Manage",
    link: "/admin-dashboard/students",
    illustration: "/assets/admin/icon8.png",
  },
];

export default function Page() {
  return (
    <div className="p-6">

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-2">
        {dashboardCards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-primary rounded-2xl shadow-md shadow-gray-400 p-6 flex flex-col  justify-between text-center cursor-pointer"
          >
            <img
              src={card.illustration}
              alt={card.name}
              className="w-full max-w-32 object-contain mb-4 mx-auto"
            />
            <h2 className="text-lg font-semibold text-white mb-3">
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
