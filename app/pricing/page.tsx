
"use client";
import Hero from "@/components/pages/About-us/Hero";
import Pricing_Section_Dynamic from "@/components/pages/pricing/Pricing_Dynamic";
import React, { useEffect, useState } from "react";

function Page() {
  const [courses, setCourses] = useState<any[]>([]);

  // ✅ fallback static values (show these first always)
  const fallbackCourses = [
    {
      id: "default",
      title: "Learn Quran for beginners",
      summary: "Introductory Quran learning program.",
      plans: [
        { label: "2 Days/Week", price: 25, src: "/assets/home/pricing1.png" },
        { label: "3 Days/Week", price: 35, src: "/assets/home/pricing2.png" },
        { label: "4 Days/Week", price: 45, src: "/assets/home/pricing3.png" },
        { label: "5 Days/Week", price: 50, src: "/assets/home/pricing4.png" },
      ],
    },
  ];

  useEffect(() => {
    // show fallback first
    setCourses(fallbackCourses);

    async function fetchCourses() {
      try {
        const res = await fetch("/api/db/courses");
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();

        const staticImages = [
          "/assets/home/pricing1.png",
          "/assets/home/pricing2.png",
          "/assets/home/pricing3.png",
          "/assets/home/pricing4.png",
          "/assets/home/pricing5.png",
        ];

        const mapped = data.slice(0, 5).map((course: any, index: number) => {
          const basePrice = course.price || 20;

          return {
            id: course._id,
            title: course.title,
            summary: course.overview?.summary || "No summary available",
            plans: [
              { label: "2 Days/Week", price: basePrice, src: staticImages[0] },
              { label: "3 Days/Week", price: basePrice + 10, src: staticImages[1] },
              { label: "4 Days/Week", price: basePrice + 20, src: staticImages[2] },
              { label: "5 Days/Week", price: basePrice + 25, src: staticImages[3] },
            ],
          };
        });

        // ✅ replace fallback with API data
        setCourses(mapped);
      } catch (err) {
        console.error("Error loading courses:", err);
        // do nothing → fallback remains
      }
    }

    fetchCourses();
  }, []);

  return (
    <div>
      <Hero
        heading="Our Economical Pricing"
        paragraph="We believe quality Quranic education should be accessible to everyone. Our pricing plans are designed to be affordable, flexible, and transparent—ensuring you receive the best learning experience without financial burden."
        backgroundImage="/assets/home/hero4.png"
      />

      {/* ✅ Always show something (fallback first, then API if available) */}
      <Pricing_Section_Dynamic courses={courses} />
    </div>
  );
}

export default Page;
