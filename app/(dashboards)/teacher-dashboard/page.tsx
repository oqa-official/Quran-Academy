"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";

const dashboardCards = [
  {
    name: "Profile Management",
    button: "Manage",
    link: "/student-dashboard/profile",
    illustration: "/assets/admin/illustration3.png",
  },
  {
    name: "Zoom Class Links",
    button: "Manage",
    link: "#",
    illustration: "/assets/admin/illustration2.png",
  },
  {
    name: "Books",
    button: "Manage",
    link: "/library",
    illustration: "/assets/admin/illustration1.png",
  },
   {
    name: "Assigned Students",
    button: "View All",
    link: "#",
    illustration: "/assets/admin/illustration1.png",
  },
];

export default function Page() {
    const { userId, loading: userLoading } = useUser();

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dashboardCards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white rounded-2xl shadow-md shadow-gray-400 p-6 flex flex-col  justify-between text-center cursor-pointer"
          >
            <img
              src={card.illustration}
              alt={card.name}
              className="w-full max-w-60 object-contain mb-4 mx-auto"
            />
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
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
