// "use client";

// import { motion } from "framer-motion";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { useUser } from "@/context/UserContext";
// import Analytics from "../admin_dashboard/componnets/Analytics";

// const dashboardCards = [
//   {
//     name: "Profile Management",
//     button: "Manage",
//     link: "/student-dashboard/profile",
//     illustration: "/assets/admin/icon3.png",
//   },
//   {
//     name: "Zoom Class Links",
//     button: "Manage",
//     link: "#",
//     illustration: "/assets/admin/icon2.png",
//   },
//   {
//     name: "Books",
//     button: "Manage",
//     link: "/library",
//     illustration: "/assets/admin/icon1.png",
//   },
//    {
//     name: "Assigned Students",
//     button: "View All",
//     link: "#",
//     illustration: "/assets/admin/icon4.png",
//   },
// ];

// export default function Page() {

//   return (
//     <div className="p-6">
//       <p className="my-2 text-2xl">Profile Management</p>
//       <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
//         {dashboardCards.map((card, i) => (
//           <motion.div
//             key={i}
//             whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
//             transition={{ type: "spring", stiffness: 300, damping: 20 }}
//             className="bg-white rounded-2xl shadow-md dark:bg-[#122031] p-6 flex flex-col  justify-between text-center cursor-pointer"
//           >
//             <img
//               src={card.illustration}
//               alt={card.name}
//               className="w-full max-w-32 object-contain mb-4 mx-auto"
//             />
//             <h2 className="text-lg font-semibold text-black dark:text-white mb-3">
//               {card.name}
//             </h2>
//             <Link href={card.link}>
//               <Button className="bg-accent w-full hover:bg-accent/80">
//                 {card.button}
//               </Button>
//             </Link>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }



















"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

interface Teacher {
  _id: string;
  name: string;
  email: string;
  userId: string;
  subject?: string;
  status: string;
}

export default function TeacherDashboard() {
  const { userId } = useUser();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  // fetch teacher
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchTeacher = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/db/instructors/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch teacher");
        const data = await res.json();
        setTeacher(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load teacher data");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [userId]);

  return (
    <div className="p-6">
      <p className="my-2 text-2xl">Teacher Dashboard</p>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Profile Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[#FFC107] relative min-h-[160px] flex flex-col p-5 rounded-md cursor-pointer shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl text-black">
            {loading
              ? "Teacher"
              : teacher?.name
              ? teacher.name.split(" ").slice(0, 2).join(" ")
              : ""}
          </h2>
          <p className="text-gray-900">
            {loading ? "" : teacher?.userId}
          </p>
          <img
            src={"/assets/dashboard/icon1.png"}
            alt="teacher"
            className="self-end w-11 h-11 opacity-100"
          />

          <Link href="/teacher-dashboard/profile" className="absolute bottom-0 w-full left-0">
            <motion.div whileHover={{ scale: 1.001 }} className="bg-[#E5AD06] px-10">
              <p className="flex justify-center items-center gap-1 py-2 text-gray-900 text-sm">
                Click Here for Profile
                <ArrowRight className="bg-black rounded-full text-yellow-50" size={14} />
              </p>
            </motion.div>
          </Link>
        </motion.div>

        {/* Zoom Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[#17A2B8] relative min-h-[160px] flex flex-col p-5 rounded-md cursor-pointer shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl text-white">Zoom</h2>
          <p className="text-white">Class Links</p>
          <img
            src={"/assets/dashboard/icon2.png"}
            alt="zoom"
            className="self-end w-11 h-11 opacity-100"
          />
          <Link href="#" className="absolute bottom-0 w-full left-0">
            <motion.div whileHover={{ scale: 1.001 }} className="bg-[#1591A5] px-10">
              <p className="flex justify-center items-center gap-1 py-2 text-white text-sm">
                Click Here for Zoom Links
                <ArrowRight className="bg-white rounded-full text-black" size={14} />
              </p>
            </motion.div>
          </Link>
        </motion.div>

        {/* Resources Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[#28A745] relative min-h-[160px] flex flex-col p-5 rounded-md cursor-pointer shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl text-white">Resources</h2>
          <p className="text-white">Teaching Materials</p>
          <img
            src={"/assets/dashboard/icon3.png"}
            alt="resources"
            className="self-end w-11 h-11 opacity-100"
          />
          <Link href="#" className="absolute bottom-0 w-full left-0">
            <motion.div whileHover={{ scale: 1.001 }} className="bg-[#24963E] px-10">
              <p className="flex justify-center items-center gap-1 py-2 text-white text-sm">
                Click Here for Resources
                <ArrowRight className="bg-white rounded-full text-black" size={14} />
              </p>
            </motion.div>
          </Link>
        </motion.div>

        {/* Students Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-[#DC3545] relative min-h-[160px] flex flex-col p-5 rounded-md cursor-pointer shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl text-white">Students</h2>
          <p className="text-white">Assigned Students</p>
          <img
            src={"/assets/dashboard/icon5.png"}
            alt="students"
            className="self-end w-11 h-11 opacity-100"
          />
          <Link href="#" className="absolute bottom-0 w-full left-0">
            <motion.div whileHover={{ scale: 1.001 }} className="bg-[#BB2D3B] px-10">
              <p className="flex justify-center items-center gap-1 py-2 text-white text-sm">
                View Assigned Students
                <ArrowRight className="bg-white rounded-full text-black" size={14} />
              </p>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
