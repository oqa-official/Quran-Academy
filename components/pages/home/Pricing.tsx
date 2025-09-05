"use client";
import React, { useEffect, useState } from "react";
import PricingTabs from "./PricingTabs";

function Page() {
  const [courses, setCourses] = useState<any[]>([]);

  // fallback static courses (also shown while loading or on error)
  const fallbackCourses = [
    {
      id: "1",
      title: "Learn Quran",
      summary: "This Quran Academy presents this course exclusively designed for beginners. It covers the fundamentals of reading and reciting the Holy Quran with proper pronunciation.",
      basePrice: 25,
    },
  ];

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/db/courses");
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();

        const mapped = data.slice(0, 3).map((course: any, i: number) => ({
          id: course._id,
          title: course.title,
          summary: course.overview?.summary || "No summary available",
          basePrice: course.price || (25 + i * 10),
        }));

        setCourses(mapped);
      } catch (err) {
        console.error("Error loading courses:", err);
        setCourses(fallbackCourses);
      }
    }

    fetchCourses();
  }, []);

  return (
    <div className="container">
      <PricingTabs courses={courses.length ? courses : fallbackCourses} />
    </div>
  );
}

export default Page;
