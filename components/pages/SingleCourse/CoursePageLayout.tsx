"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import Overview from "./Overview";
import CurriculumTab from "./CurriculumTab";
import ReviewComponent from "./Reviews";
import InstructorInfo from "./InstructorInfo";

export default function CoursePageLayout() {
  const [rating] = useState(4.5);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 w-full">
      <div className="lg:col-span-3 space-y-6 w-full">
        {/* Course Info */}
        <div className="w-full">
          <h1 className="text-4xl font-bold mb-2">
            Learn Quranic Studies for Beginner
          </h1>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < Math.round(rating) ? "fill-yellow-500" : ""}
                />
              ))}
              <span className="text-gray-600 ml-2">{rating} (32 Reviews)</span>
            </div>
            <div>
              <p className="font-medium">
                Category :{" "}
                <span className="font-semibold text-primary">Level 1</span>
              </p>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="rounded-lg overflow-hidden shadow-md">
          <img
            src="/assets/courses/course_img.png"
            alt="Course Image"
            className="w-full object-cover"
          />
        </div>

        {/* Custom Tabs */}
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
                className={`border-[1px] rounded-sm px-6 py-4 text-lg font-thin font-semibold transition-all duration-200 
                  ${
                    activeTab === tab.key
                      ? "bg-primary text-white border-primary "
                      : "text-primary border-primary hover:bg-primary/10"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === "overview" && <Overview />}
            {activeTab === "curriculum" && <CurriculumTab />}
            {activeTab === "instructor" && <InstructorInfo />}
            {activeTab === "reviews" && <ReviewComponent />}
          </div>
        </div>
      </div>
    </div>
  );
}
