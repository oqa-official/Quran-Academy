"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, RefreshCcw, Trash2, Pencil } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import EditStudentDialog from "@/components/pages/Admin-Dashboard/student/EditStudentDialog";
import { toast } from "sonner";
import { DataTable } from "@/components/global/data-table"; // Import the DataTable
import { ColumnDef } from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

interface Student {
  _id: string;
  parentInquiry: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date,
  gender: string,
  timezone: string;
  preferredStartTime: string;
  classDays: string[];
  course: { _id: string; title: string } | null;
  price: number;
  status: "trial" | "regular";
  feeStatus: { paid: boolean };
  createdAt: string;
}

function StudentsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inquireId = searchParams.get("inquire");

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Student | null>(null);

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
      } catch (err: any) {
        setError(err.message || "Error loading students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [inquireId]);

  const handleResetFilter = () => {
    router.push("/admin-dashboard/students");
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/db/students/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete student");
      setStudents((prev) => prev.filter((s) => s._id !== id));
      toast.success("Student deleted successfully");
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  };

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      accessorKey: "dateOfBirth",
      header: "Date of Birth",
      cell: ({ row }) =>
        row.original.dateOfBirth
          ? new Date(row.original.dateOfBirth).toLocaleDateString()
          : "N/A",
    },

    {
      accessorKey: "phone",
      header: "Phone",
    },

    {
      accessorKey: "timezone",
      header: "Timezone",
    },
    {
      accessorKey: "preferredStartTime",
      header: "Preferred Time",
    },
    {
      accessorKey: "classDays",
      header: "Class Days",
      cell: ({ row }) => row.original.classDays.join(" / "),
    },
    {
      accessorKey: "course.title",
      header: "Course",
      cell: ({ row }) => row.original.course?.title || "N/A",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => `$${row.original.price}`,
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "feeStatus.paid",
      header: "Fee Paid",
      cell: ({ row }) => (row.original.feeStatus.paid ? "Yes" : "No"),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setEditing(row.original)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the student and remove it from our records.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(row.original._id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md md:p-4 max-w-[90vw] max-md:min-h-[90vh] min-h-[80vh] md:max-w-[80vw]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Students</h1>
        <div className="flex gap-2">
          {inquireId && (
            <Button variant="outline" onClick={handleResetFilter}>
              <RefreshCcw className="w-4 h-4 mr-2" /> Reset Filter
            </Button>
          )}
        </div>
      </div>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full bg-primary h-10 rounded-md" />
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={students} searchPlaceholder="Search" />
      )}

      {editing && (
        <EditStudentDialog
          open={!!editing}
          student={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated: any) => {
            setStudents((prev) =>
              prev.map((s) => (s._id === updated._id ? updated : s))
            );
            setEditing(null);
          }}
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