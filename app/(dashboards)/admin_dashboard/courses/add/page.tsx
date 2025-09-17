"use client";
import { useEffect, useState } from "react";
import { Course } from "@/lib/types/courses";
import { toast } from "sonner";
import AddCourseForm from "@/components/pages/Admin-Dashboard/courses/AddCourseForm";

export default function CoursesAdd() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/db/courses");

      if (!res.ok) {
        throw new Error("Failed to fetch courses.");
      }

      const data: Course[] = await res.json();

      if (!data || data.length === 0) {
        setCourses([]);
        setError("No courses found.");
        return;
      }

      setCourses(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while fetching courses.");
      toast.error(err.message || "Unable to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="container w-full">
      <h1 className="text-2xl font-bold mb-6">Manage Courses</h1>

      {/* Add New Course */}
      <AddCourseForm onSuccess={fetchCourses} />

    
    </div>
  );
}
