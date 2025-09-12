"use client";

import { useEffect, useState } from "react";
import { Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/global/data-table";

interface Inquire {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  studentCount?: number;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/db/inquire/with-students");
      if (!res.ok) throw new Error("Failed to fetch inquiries");
      const data: Inquire[] = await res.json();

      // ✅ filter inquiries where studentCount >= 1
      const filtered = data.filter((inq) => (inq.studentCount ?? 0) == 0);

      setInquiries(filtered);
    } catch (err: any) {
      setError(err.message || "Error loading inquiries");
    } finally {
      setLoading(false);
    }
  };
  fetchInquiries();
}, []);


  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/db/inquire/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete inquiry");
      setInquiries((prev) => prev.filter((inq) => inq._id !== id));
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  };

  const columns: ColumnDef<Inquire>[] = [
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
      enableSorting: false, // You can disable sorting on specific columns
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return date.toLocaleDateString();
      },
    },
    
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
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
                This action cannot be undone.
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
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
  <div className="bg-white md:p-4 border-1 rounded-md">
      <div className=" rounded-xl  max-md:h-[100vh] overflow-hidden max-md:max-w-[85vw]">
      <h1 className="text-2xl font-semibold mb-4">Inquiries</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      {loading ? (
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="w-full h-10 rounded-md bg-primary"/>
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={inquiries} searchPlaceholder="Search" />
      )}
    </div>
  </div>
  );
}