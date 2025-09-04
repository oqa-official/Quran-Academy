

// app/courses/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import FeaturedSectionCarousel from "@/components/pages/home/FeaturedSectionCarousel";
import CoursePageLayout from "@/components/pages/SingleCourse/CoursePageLayout";
import CourseSidebar from "@/components/pages/SingleCourse/CourseSidebar";
import Hero from "@/components/pages/SingleCourse/Hero";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoursePage() {
  const { slug } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/db/courses/${slug}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`Error ${res.status}: Failed to fetch`);

        const data = await res.json();
        setCourse(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchCourse();
  }, [slug]);

  if (loading) return (
    <div className="container m-10">
      <Skeleton className="h-96 bg-primary"/>
      <Skeleton className="h-10 my-2 bg-primary"/>
      <Skeleton className="h-4 my-1 bg-primary"/>
    </div>
  );
  if (error) return (
    <div className="container m-10 text-center min-h-[40vh] flex justify-center items-center">
      <h4 className="text-3xl text-red-600">Error Failed to Fetch Course</h4>
    </div>
  );
  if (!course) return (
    <div className="container m-10 text-center min-h-[40vh] flex justify-center items-center">
      <h4 className="text-3xl text-red-600">Course Not Found</h4>
    </div>
  );
  return (
    <>
      {/* Hero Section */}
      <Hero course={course} />

      <div className="container flex flex-col md:flex-row justify-between items-start mt-20 gap-10 space-y-5">
        {/* Left Content */}
        <div className="md:w-2/3 w-full">
          <CoursePageLayout course={course} />
          {/* <p>Hello</p> */}
        </div>

        {/* Right Sidebar */}
        <div className="md:w-1/3 w-full">
          <CourseSidebar course={course} />
        </div>
      </div>

      {/* Similar Courses */}
      <FeaturedSectionCarousel heading="Similar Courses" lamp={false} />
    </>
  );
}
