
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, RefreshCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import StudentsTable from "./StudentsTable";
import EditStudentDialog from "@/components/pages/Admin-Dashboard/student/EditStudentDialog";
import { toast } from "sonner";

interface Student {
  _id: string;
  parentInquiry: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  timezone: string;
  preferredStartTime: string;
  classDays: string[];
  course: { _id: string; title: string } | null;
  price: number;
  status: "trial" | "regular";
  feeStatus: { paid: boolean };
  createdAt: string;
}

interface Course {
  _id: string;
  name: string;
}

export default function StudentsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inquireId = searchParams.get("inquire");

  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        let url = "/api/db/students";
        if (inquireId) url += `?inquire=${inquireId}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        setStudents(data);
        setFiltered(data);
      } catch (err: any) {
        setError(err.message || "Error loading students");
      } finally {
        setLoading(false);
      }
    };

  

    fetchStudents();
  }, [inquireId]);

  const handleSearch = (val: string) => {
    setSearch(val);
    const lower = val.toLowerCase();
    const results = students.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.email.toLowerCase().includes(lower) ||
        s.phone.toLowerCase().includes(lower)
    );
    setFiltered(results);
    setPage(1);
  };

  const handleResetFilter = () => {
    router.push("/admin-dashboard/students");
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/db/students/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete student");

      setStudents((prev) => prev.filter((s) => s._id !== id));
      setFiltered((prev) => prev.filter((s) => s._id !== id));
      toast.success("Student deleted successfully");
    } catch (err: any) {
      setError(err.message || "Delete failed");
      toast
    }
  };

  const exportCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Age",
      "Timezone",
      "Preferred Time",
      "Class Days",
      "Course",
      "Price",
      "Status",
      "Fee Paid",
      "Created",
    ];

    const rows = filtered.map((s) => [
      s.name,
      s.email,
      s.phone,
      s.age,
      s.timezone,
      s.preferredStartTime,
      s.classDays.join(" / "),
      s.course?.title || "N/A",
      s.price,
      s.status,
      s.feeStatus.paid ? "Yes" : "No",
      new Date(s.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
  };

  const startIndex = (page - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const totalCount = filtered.length;

  return (
    <div className="">
        <div className="bg-white rounded-xl shadow-md md:p-4 max-w-[90vw] max-md:min-h-[90vh] min-h-[80vh]  md:max-w-[80vw] overflow-scroll">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Students</h1>
        <div className="flex gap-2">
          {inquireId && (
            <Button variant="outline" onClick={handleResetFilter}>
              <RefreshCcw className="w-4 h-4 mr-2" /> Reset Filter
            </Button>
          )}
          <Button onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-2">
        Total Students: <span className="font-semibold">{totalCount}</span>
      </p>

      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-72"
        />
        <Search className="text-gray-400" />
      </div>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full bg-primary h-10 rounded-md" />
          ))}
        </div>
      ) : (
        <>
          <StudentsTable
            students={paginated}
            onDelete={handleDelete}
            onEdit={(student) => setEditing(student)}
          />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-2">
            <div className="text-sm text-gray-600">
              Showing {totalCount === 0 ? 0 : startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, totalCount)} of {totalCount}
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <p>
                Page {page} of {totalPages || 1}
              </p>
              <Button
                variant="outline"
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {editing &&(
        <EditStudentDialog
        open={!!editing} 
          student={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated:any) => {
            setStudents((prev) =>
              prev.map((s) => (s._id === updated._id ? updated : s))
            );
            setFiltered((prev) =>
              prev.map((s) => (s._id === updated._id ? updated : s))
            );
            setEditing(null);
          }}
        />
      )}
    </div>
    </div>
  );
}
