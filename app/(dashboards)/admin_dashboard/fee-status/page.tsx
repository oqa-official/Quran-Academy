"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { DataTable } from "@/components/global/data-table";
import LoadingSkeleton from "@/components/pages/(dashboards)/Admin-Dashboard/loading/loadingSkeleton";
import { fee_columns, Student, Teacher } from "./fee_columns";
import { useDirtyForm } from "@/context/DirtyFormContext";

function StudentsPageContent() {
  const { setDirty } = useDirtyForm();
  const searchParams = useSearchParams();
  const inquireId = searchParams.get("inquire");

  const [students, setStudents] = useState<Student[]>([]);
  const [originalStudents, setOriginalStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/db/students", {
          headers: {
            "x-internal-key": process.env.NEXT_PUBLIC_INTERNAL_API_KEY!,
          },
        });;
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        const filtered = data.filter((s: Student) => s.status !== "quit");
        setStudents(filtered);
        setOriginalStudents(filtered); // keep original snapshot to compare changes
      } catch (err: any) {
        setError(err.message || "Error loading students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [inquireId]);

  // ✅ Fetch teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch("/api/db/instructors", {
          headers: {
            "x-internal-key": process.env.NEXT_PUBLIC_INTERNAL_API_KEY!,
          }
        });
        if (!res.ok) throw new Error("Failed to fetch teachers");
        const data = await res.json();
        setTeachers(data);
      } catch (err) {
        console.error("Error fetching teachers:", err);
      }
    };
    fetchTeachers();
  }, []);

  // 🧠 Helper to check if data actually changed
  const isStudentDirty = (student: Student) => {
    const original = originalStudents.find((s) => s._id === student._id);
    if (!original) return true;
    return (
      original.teacherAssigned !== student.teacherAssigned ||
      original.parentInquiry.extendedDueDate !==
      student.parentInquiry.extendedDueDate
    );
  };

  const handleSave = async (student: Student) => {
    if (!isStudentDirty(student)) {
      toast.info("No changes to save");
      return;
    }

    try {
      // 1. ✅ Update student
      const studentRes = await fetch(`/api/db/students/${student._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherAssigned: student.teacherAssigned,
        }),
      });

      if (!studentRes.ok) throw new Error("Failed to update student");

      // 2. ✅ Update inquiry (if needed)
      if (student.parentInquiry.extendedDueDate) {
        const inquiryId = student.parentInquiry._id;
        const inquiryRes = await fetch(`/api/db/inquire/${inquiryId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            extendedDueDate: student.parentInquiry.extendedDueDate,
          }),
        });

        if (!inquiryRes.ok) throw new Error("Failed to update inquiry");
      }

      // 🟡 Update state + original snapshot
      setStudents((prev) =>
        prev.map((s) => (s._id === student._id ? student : s))
      );
      setOriginalStudents((prev) =>
        prev.map((s) => (s._id === student._id ? student : s))
      );

      setDirty(false);
      toast.success(` Saved: ${student.name}`);
    } catch (error: any) {
      console.error(error);
      toast.error(" Failed to save student/inquiry");
    }
  };

  return (
    <div className="bg-white dark:bg-[#122031] rounded-xl shadow-md md:p-4 max-w-[90vw] md:max-w-[80vw]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Students Fee Details</h1>
      </div>
      {error && <p className="text-red-500 mb-3">{error}</p>}

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <DataTable
          columns={fee_columns({
            teachers,
            onSave: handleSave,
            onUpdate: (updated) =>
              setStudents((prev) =>
                prev.map((s) => (s._id === updated._id ? updated : s))
              ),
            // 🧠 pass helper to disable save button
            isRowChanged: isStudentDirty,
          })}
          data={students}
          searchPlaceholder="Search"
        />
      )}
    </div>
  );
}

export default function StudentsPage() {
  return (
    <Suspense fallback={<div>Loading Students...</div>}>
      <StudentsPageContent />
    </Suspense>
  );
}
