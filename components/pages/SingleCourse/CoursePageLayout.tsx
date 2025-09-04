
"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import Overview from "./Overview";
import CurriculumTab from "./CurriculumTab";
import ReviewComponent from "./Reviews";
import InstructorInfo from "./InstructorInfo";

export default function CoursePageLayout({ course }: { course: any }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 w-full">
      <div className="lg:col-span-3 space-y-6 w-full">
        {/* Course Info */}
        <div className="w-full">
          <h1 className="text-4xl font-bold mb-2">{course.title ? course.title : "Quran Learning For Beginners"}</h1>

          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex items-center gap-2 text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  // className={i < Math.round(course.rating) ? "fill-yellow-500" : ""}
                  className={i < Math.round(5) ? "fill-yellow-500" : ""}
                />
              ))}
              <span className="text-gray-600 ml-2">
                {/* {course.rating} ({course.reviewsCount} Reviews) */}
                 {27} Reviews
              </span>
            </div>
            <div>
              <p className="font-medium">
                Duration:{" "}
                <span className="font-semibold text-primary">{course.duration ? course.duration : "1 Year"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="rounded-lg overflow-hidden shadow-md">
          <img
            src={course.image}
            alt={course.title}
            className="w-full object-cover max-h-[350px] object-center"
          />
        </div>

        {/* Tabs */}
        <div className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { key: "overview", label: "Overview" },
              { key: "curriculum", label: "Curriculum" },
              { key: "instructor", label: "Instructor" },
              { key: "reviews", label: "Reviews" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`border-[1px] rounded-sm px-4 py-1 text-lg font-thin transition-all duration-200 
                  ${
                    activeTab === tab.key
                      ? "bg-primary text-white border-primary"
                      : "text-primary border-primary hover:bg-primary/10"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === "overview" && <Overview overview={course.overview} />}
            {activeTab === "curriculum" && <CurriculumTab curriculum={course.curriculum} />}
            {activeTab === "instructor" && <InstructorInfo instructor={course.instructor} />}
            {activeTab === "reviews" && <ReviewComponent />}
          </div>
        </div>
      </div>
    </div>
  );
}
