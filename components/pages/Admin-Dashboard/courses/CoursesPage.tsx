"use client";
import { useEffect, useState } from "react";
import CoursesGrid from "./CoursesGrid";
import { Course } from "@/lib/types/courses";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function CoursesPage() {
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
    <div className=" w-full">
      <h1 className="text-2xl font-bold mb-6">Manage Courses</h1>

      {/* Loading State */}
      {loading && (
       <div className="rounded-md border border-border bg-background mt-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <th key={i} className="px-4 py-3 text-left">
                        <Skeleton className="h-4 w-[70%] bg-muted" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-border">
                      {Array.from({ length: 6 }).map((_, colIndex) => (
                        <td key={colIndex} className="px-4 py-3">
                          <Skeleton className="h-4 w-[70%] bg-muted" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      )}

      {/* Error / Empty State */}
      {!loading && error && (
        <p className="text-red-500 text-center mt-4">{error}</p>
      )}

      {/* Courses */}
      {!loading && !error && courses.length > 0 && (
        <CoursesGrid courses={courses} />
      )}
    </div>
  );
}
