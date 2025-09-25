"use client";

import { useState } from "react";
import { Loader2, Trash, Eye, TriangleAlert } from "lucide-react";
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
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/global/data-table";
import Link from "next/link";


export interface TeacherInquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  cnicFrontUrl: string; // ✅ Assuming you save teacher image
}

export default function TeacherInquiriesTable({
  inquiries,
  onUpdate,
}: {
  inquiries: TeacherInquiry[];
  onUpdate: () => void;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const res = await fetch(`/api/db/teacher-inquiries/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete inquiry");
      }

      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const columns: ColumnDef<TeacherInquiry>[] = [
    
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "Cnic Front",
      header: "Cnic",
      cell: ({ row }) => (
        <img
          src={row.original.cnicFrontUrl}
          alt={row.original.name}
          className="h-12 w-12 object-cover rounded-sm"
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const teacher = row.original;
        return (
          <div className="flex gap-2 items-center">
            <Link
              href={`/admin_dashboard/teachers/teacher-inquiries/${teacher._id}`}
              className="flex items-center bg-primary dark:bg-accent dark:text-black text-white px-2 py-1 rounded-sm text-sm hover:bg-accent transition"
            >
              <Eye size={16} className="mr-1" /> View
            </Link>

            <AlertDialog >
              <AlertDialogTrigger asChild>
                <button
                  className="disabled:opacity-50 flex items-center bg-red-600 text-white px-2 py-1 rounded-sm text-sm hover:bg-red-600 transition"
                  disabled={deletingId === teacher._id}
                >
                  {deletingId === teacher._id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1" /> Deleting...
                    </>
                  ) : (
                    <>
                      <Trash size={16} className="mr-1" /> Delete
                    </>
                  )}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="dark:bg-[#122031]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex gap-3 items-center text-primary">
                    <TriangleAlert /> Confirm Delete?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This teacher inquiry will be permanently removed. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deletingId === teacher._id}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(teacher._id)}
                    disabled={deletingId === teacher._id}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Confirm Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  return (
    <div className="mt-4">
      <DataTable
        columns={columns}
        data={inquiries}
        searchPlaceholder="Search teacher inquiries..."
      />
    </div>
  );
}
