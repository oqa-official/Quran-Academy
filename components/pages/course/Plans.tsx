
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CourseCard from "../home/CourseCard";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ------------------ TYPES ------------------
interface Course {
  _id: string;
  title: string;
  price: number;
  overview?: { summary?: string };
  reviews?: number;
  rating?: number;
  reviewsCount?: number;
  instructor?: { image?: string; name?: string };
  students?: number;
  avatar?: string;
  image?: string;
}

// ------------------ STATIC IMAGES ------------------
const tabImages = [
  "/assets/home/pricing1.png",
  "/assets/home/pricing2.png",
  "/assets/home/pricing3.png",
];

// ------------------ FALLBACK COURSES ------------------
const fallbackCourses: Course[] = [
  {
    _id: "fallback1",
    title: "Quran Basics",
    price: 25,
    overview: { summary: "Learn the essentials of Quran reading and tajweed." },
    instructor: { name: "Ustadh Ahmad", image: "/assets/home/teacher1.png" },
    image: "/assets/home/course1.png",
  },
  {
    _id: "fallback2",
    title: "Intermediate Tajweed",
    price: 40,
    overview: { summary: "Enhance your tajweed and fluency in recitation." },
    instructor: { name: "Ustadhah Fatima", image: "/assets/home/teacher2.png" },
    image: "/assets/home/course2.png",
  },
  {
    _id: "fallback3",
    title: "Advanced Quran Studies",
    price: 55,
    overview: { summary: "Deep dive into tafseer and advanced tajweed rules." },
    instructor: { name: "Sheikh Musa", image: "/assets/home/teacher3.png" },
    image: "/assets/home/course3.png",
  },
];

const PlanTab = ({ id, title, image, isActive, onClick }: any) => (
  <div
    className={`
      relative z-[2] flex flex-col items-center justify-center space-y-1 md:px-6 p-2 md:p-4 rounded-md shadow-lg
      transform cursor-pointer
      ${isActive ? "bg-white" : "bg-gray-800 hover:bg-gray-700"}
    `}
    onClick={() => onClick(id)}
  >
    <img
      src={image}
      alt={title}
      className={`
        md:w-16 md:h-16 w-12 h-12 object-cover
        ${isActive ? "filter-none" : "filter grayscale"}
        transition-filter duration-500
      `}
    />
    <p
      className={`text-sm md:text-lg font-medium md:font-semibold ${isActive ? "text-primary" : "text-gray-300"
        }`}
    >
      {title}
    </p>
    <div
      className={`absolute ${!isActive && "hidden"
        } -bottom-3 md:-bottom-5 -z-[1] left-1/2 transform -translate-x-1/2  md:w-10 md:h-10 w-6 h-6 border-b-1 border-gray-200 rotate-45 bg-white border-r-2`}
    ></div>
  </div>
);

const PlanContent = ({ course, image }: any) => (
  <div className="flex flex-col md:flex-row justify-center  items-center gap-10  mx-auto">
    {/* Left side */}
    <div className=" 2xl:max-w-[47%] flex-1  flex flex-col items-start gap-0 text-center md:text-left">
      <img src={image} alt="plan icon" className="w-32" />
      <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-2 max-w-[500px] leading-relaxed">
        {course.title}
      </h2>
      <img
        src="/assets/home/arrow.png"
        alt="Quran verse"
        className="w-[120px] -ms-2 mb-4"
      />
      <p className="text-gray-600 max-w-[700px] mb-6">
        {course.overview?.summary
          ? course.overview.summary.length > 400
            ? `${course.overview.summary.substring(0, 400)}...`
            : course.overview.summary
          : "No description available."}      </p>
      <div className="flex flex-row gap-2 mt-10">
        <Link href={`/courses/${course._id}`}>
          <button className="bg-primary hover:bg-primary-hover text-white py-3 px-6 rounded-md transition-colors duration-300">
            Get Started
          </button>
        </Link>
        <a
          href={`/courses/${course._id}`}
          className="bg-accent hover:bg-accent-hover text-black font-medium py-3 px-6 rounded-md transition-colors duration-300"
        >
          More Details →
        </a>
      </div>
    </div>

    {/* Right side */}
    <div className="flex-1 md:max-w-[30%] hidden md:flex">
      <CourseCard
        title={course.title}
        price={course.price}
        list={true}
        reviews={course.reviewsCount}
        avatar={
          course?.instructor?.image || "/assets/home/teacher1.png"
        }
        teacher={course.instructor?.name || "The Instructor"}
        rating={course.rating || 5}
        students={course.students || 53}
        img={course.image || "/assets/home/course1.png"}
      />
    </div>
  </div>
);

const OurPlans: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(fallbackCourses); // ✅ start with fallback
  const [activeId, setActiveId] = useState<string>(fallbackCourses[0]._id);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/db/courses");
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data: Course[] = await res.json();

        setCourses(data);
        if (data.length > 0) setActiveId(data[0]._id);
      } catch (err) {
        console.error("Error fetching courses:", err);
        // do nothing → fallback stays
      }
    }
    fetchCourses();
  }, []);

  const visibleCourses = courses.slice(startIndex, startIndex + 3);
  const activeCourse = courses.find((c) => c._id === activeId);

  const handlePrev = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };
  const handleNext = () => {
    if (startIndex + 3 < courses.length) setStartIndex(startIndex + 1);
  };

  const activeIndex = courses.findIndex((c) => c._id === activeId);
  const activeImage =
    activeIndex !== -1 ? tabImages[activeIndex % tabImages.length] : "";

  return (
    <section className="pb-20">
      <div className="bg-primary relative z-[10]">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage: "url('/assets/home/missionbg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Header */}
        <div className="pt-6 w-full container text-center">
          <div className="max-w-3xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <img
                src="/assets/home/verse2.png"
                alt="Quran verse"
                className="mx-auto w-[80%] mb-6"
              />
            </motion.div>
            <h2 className="text-3xl font-bold mb-2 text-white">
              Our Plan for Individual Courses
            </h2>
            <p className="text-gray-300">
              We undergo the versatile modules of the Quran's tajweed learning
              to make you perfect anyhow. Our professional programs divide the
              learning into three stages to make you comfortable while learning.
            </p>
          </div>

          {/* Tabs with carousel */}
          <div className="flex justify-center items-center gap-4 mb-12">
            {startIndex > 0 && (
              <button
                onClick={handlePrev}
                className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5 text-primary" />
              </button>
            )}

            <div className="flex flex-row justify-center gap-6">
              {visibleCourses.map((course, idx) => (
                <PlanTab
                  key={course._id}
                  id={course._id}
                  title={course.title.split(" ").slice(0, 2).join(" ")}
                  image={tabImages[(startIndex + idx) % tabImages.length]}
                  isActive={course._id === activeId}
                  onClick={setActiveId}
                />
              ))}
            </div>

            {startIndex + 3 < courses.length && (
              <button
                onClick={handleNext}
                className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
              >
                <ChevronRight className="w-5 h-5 text-primary" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-md:pt-10">
        {activeCourse && (
          <PlanContent course={activeCourse} image={activeImage} />
        )}
      </div>
    </section>
  );
};

export default OurPlans;
