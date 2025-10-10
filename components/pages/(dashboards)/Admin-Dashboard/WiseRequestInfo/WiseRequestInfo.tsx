"use client";

import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/global/data-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Check, X, Trash2, Loader2 } from "lucide-react"; // 🔹 NEW
import { toast } from "sonner";

type Student = {
  _id: string;
  name: string;
  status: string;
};

type Inquiry = {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
};

type Payment = {
  _id: string;
  inquiry: Inquiry | null;
  amount: number;
  screenshotUrl: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  approvedAt?: string | null;
  createdAt?: string;
};

export default function WiseRequestInfo({
  payments,
  onRefresh,
  filter,
}: {
  payments: Payment[];
  onRefresh: () => void;
  filter: "pending" | "approved" | "rejected";
}) {
  const [confirming, setConfirming] = useState<{
    id: string | null;
    action: "approve" | "reject" | null;
  } | null>(null);

  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [performing, setPerforming] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null); // 🔹 NEW
  const [studentMap, setStudentMap] = useState<Record<string, Student[]>>({});

  // 🔹 Fetch students
  useEffect(() => {
    async function fetchStudents() {
      try {
        const inquiryIds = payments.map((p) => p.inquiry?._id).filter(Boolean);
        const promises = inquiryIds.map(async (inqId) => {
          const res = await fetch(`/api/db/students?inquire=${inqId}`, {
            headers: {
              "x-internal-key": process.env.NEXT_PUBLIC_INTERNAL_API_KEY!,
            },
          });
          if (!res.ok) throw new Error("Failed to load students for " + inqId);
          const data = await res.json();
          const activeStudents = data.filter(
            (st: Student) => st.status !== "quit"
          );
          return { inqId, students: activeStudents };
        });

        const results = await Promise.all(promises);
        const map: Record<string, Student[]> = {};
        results.forEach(({ inqId, students }) => {
          if (inqId) map[inqId] = students;
        });
        setStudentMap(map);
      } catch (err) {
        toast.error("Failed to fetch student details");
      }
    }

    if (payments.length > 0) fetchStudents();
  }, [payments]);

  // 🔹 Columns
  const columns: ColumnDef<Payment>[] = [
    {
      id: "inquiry",
      header: "Parent Inquiry",
      cell: ({ row }) => {
        const inq = row.original.inquiry;
        const students = studentMap[inq?._id || ""] || [];
        return (
          <div>
            <div className="text-sm font-medium">{inq?.name || "—"}</div>
            <div className="text-xs text-muted-foreground">
              {inq?.email || "—"}
            </div>
            {students.length > 0 && (
              <div className="mt-1">
                <span className="text-xs font-semibold text-gray-500">
                  Students:
                </span>{" "}
                {students.map((st) => (
                  <span
                    key={st._id}
                    className="inline-block text-xs bg-blue-100 dark:bg-blue-900 dark:text-blue-100 text-blue-800 px-2 py-[1px] rounded mr-1"
                  >
                    {st.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="text-sm font-medium">${row.original.amount}</div>
      ),
    },
    {
      accessorKey: "submittedAt",
      header: "Submitted At",
      cell: ({ row }) =>
        new Date(row.original.submittedAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      id: "screenshot",
      header: "Screenshot",
      cell: ({ row }) => {
        const src = row.original.screenshotUrl;
        return (
          <button
            onClick={() => setPreviewSrc(src)}
            className="rounded-md overflow-hidden border p-0"
            title="Open full preview"
          >
            <img
              src={src}
              alt="screenshot"
              className="h-12 w-20 object-cover"
              style={{ maxWidth: 120 }}
            />
          </button>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        const bg =
          s === "pending"
            ? "bg-yellow-200 text-black"
            : s === "approved"
            ? "bg-green-200 dark:text-white dark:bg-green-600 text-green-900"
            : "bg-red-200 text-red-900 dark:bg-red-600 dark:text-white";
        return (
          <span className={`px-2 py-1 text-xs rounded capitalize ${bg}`}>
            {s}
          </span>
        );
      },
    },
  ];

  // 🔹 Actions column for pending only
  if (filter === "pending") {
    columns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-md border bg-white dark:bg-[#0b1620]">
                <MoreHorizontal size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  setConfirming({ id: payment._id, action: "approve" })
                }
              >
                <Check className="mr-2 bg-green-600 rounded-full text-white p-[1px]" />{" "}
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setConfirming({ id: payment._id, action: "reject" })
                }
              >
                <X className="mr-2 bg-red-600 p-[1px] rounded-full text-white" />{" "}
                Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });
  }

  // 🔹 NEW: Delete column for approved/rejected
  if (filter !== "pending") {
    columns.push({
      id: "delete",
      header: "Delete",
      cell: ({ row }) => {
        const payment = row.original;
        const isDeleting = deletingId === payment._id;

        return (
          <button
            onClick={() => handleDelete(payment._id)}
            disabled={isDeleting}
            className="p-2 rounded-md border bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400 transition"
            title="Delete record"
          >
            {isDeleting ? (
              <Loader2 className="animate-spin size-4" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        );
      },
    });
  }

  // 🔹 Handle approve/reject
  const executeAction = async (id: string, action: "approve" | "reject") => {
    setPerforming(true);
    try {
      const res = await fetch(`/api/payment/wise/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action === "approve" ? "approved" : "rejected",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Action failed");
      toast.success(`Request ${action === "approve" ? "approved" : "rejected"}.`);
      setConfirming(null);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setPerforming(false);
    }
  };

  // 🔹 NEW: Delete function
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/payment/wise/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Delete failed");
      toast.success("Payment record deleted.");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete record.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <DataTable
        columns={columns}
        data={payments as any[]}
        searchPlaceholder="Search wise requests..."
      />

      {/* Image preview modal */}
      {previewSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/50">
          <div className="relative max-w-[95%] max-h-[95%] overflow-auto p-4 bg-white dark:bg-[#122031] rounded-lg shadow-md">
            <X
              className="absolute top-3 right-3 cursor-pointer bg-gray-600 text-white border-[1px] border-white rounded-full"
              onClick={() => setPreviewSrc(null)}
            />
            <img
              src={previewSrc}
              alt="preview"
              className="max-w-full max-h-[80vh] rounded-md"
            />
          </div>
        </div>
      )}

      {/* Confirm dialog */}
      {confirming?.id && (
        <AlertDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) setConfirming(null);
          }}
        >
          <AlertDialogContent className="dark:bg-[#122031]">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Confirm{" "}
                {confirming.action === "approve" ? "Approval" : "Rejection"}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will mark the payment as{" "}
                {confirming.action === "approve" ? "approved" : "rejected"} and
                update the student fee status. Are you sure?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setConfirming(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (!confirming?.id || !confirming.action) return;
                  executeAction(confirming.id, confirming.action);
                }}
                className={
                  confirming.action === "approve"
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                }
                disabled={performing}
              >
                {performing
                  ? "Working..."
                  : confirming.action === "approve"
                  ? "Approve"
                  : "Reject"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
