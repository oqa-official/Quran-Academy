import { Course } from "@/lib/types/courses";
import Link from "next/link";

export default function CoursesGrid({ courses }: { courses: Course[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-4 mt-8">
      {courses.map((course) => (
        <div
          key={course._id}
          className="border rounded-md shadow p-4 flex flex-col justify-between"
        >
          <img
            src={course.image}
            alt={course.title}
            className="w-full max-h-48 object-cover rounded"
          />
          <h3 className="text-lg font-bold mt-2">{course.title}</h3>
          <p className="text-sm">{course.duration}</p>
          <h2 className="font-medium text-2xl">${course.price}</h2>
          <p className="text-xs mt-1"> {course.overview.summary
            ? course.overview.summary.split(" ").slice(0, 15).join(" ") +
            (course.overview.summary.split(" ").length > 15 ? "..." : "")
            : "No description available"}</p>

          <Link
            href={`/admin-dashboard/courses/edit-course/${course._id}`}
            className="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 text-center"
          >
            Edit Course
          </Link>
        </div>
      ))}
    </div>
  );
}
